package com.smokingcessation.controller;

import com.smokingcessation.service.SubscriptionService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.result.view.RedirectView;

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
    public ResponseEntity<Void> handlePaymentReturn(
            @RequestParam("transaction_id") String transactionId,
            @RequestParam("vnp_ResponseCode") String responseCode,
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        String token = authHeader != null && authHeader.startsWith("Bearer ")
                ? authHeader.substring(7)
                : null;

        String status = "00".equals(responseCode) ? "completed" : "failed";

        if (token != null) {
            subscriptionService.confirmPaymentWithToken(transactionId, status, token);
        } else {
            subscriptionService.confirmPayment(transactionId, status);
        }

        return ResponseEntity.ok().build(); // FE tự xử lý hiển thị UI
    }

}
