package com.smokingcessation.controller;

import com.smokingcessation.service.SubscriptionService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.result.view.RedirectView;

import java.net.URI;

@RestController
@RequestMapping("/api/subscription")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    @Operation(summary ="Tạo gói & link thanh toán" )
    @PostMapping("/payment")
    public String createSubscription(@RequestParam("clientIp") String clientIp,
                                     @RequestParam("email") String email) {
        return subscriptionService.createSubscriptionAndPayment(email, clientIp);
    }

    @GetMapping("/payment/return")
    public ResponseEntity<?> handlePaymentReturn(
            @RequestParam("transaction_id") String transactionId,
            @RequestParam("vnp_ResponseCode") String responseCode,
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        String token = authHeader != null && authHeader.startsWith("Bearer ")
                ? authHeader.substring(7)
                : null;

        String status = "00".equals(responseCode) ? "completed" : "failed";

        if (token != null && "completed".equals(status)) {
            return ResponseEntity.ok(
                    subscriptionService.confirmPaymentAndReturnUser(transactionId, status, token)
            );
        }

        if (token != null) {
            subscriptionService.confirmPaymentWithToken(transactionId, status, token);
        } else {
            subscriptionService.confirmPayment(transactionId, status);
        }

        return ResponseEntity.status(302).location(
                URI.create(("https://smoking-cessation-deploy-e2pi.vercel.app/payment-result?transaction_id="
                        + transactionId + "&vnp_ResponseCode=" + responseCode).trim())
        ).build();

    }
}
