package com.smokingcessation.controller;

import com.smokingcessation.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.view.RedirectView;

@Controller
@RequiredArgsConstructor
public class SubscriptionRedirectController {

    private final SubscriptionService subscriptionService;

    @GetMapping("/api/subscription/payment/return")
    public RedirectView handlePaymentReturn(@RequestParam("transaction_id") String transactionId,
                                            @RequestParam("vnp_ResponseCode") String responseCode) {
        String status = "00".equals(responseCode) ? "completed" : "failed";
        subscriptionService.confirmPayment(transactionId, status);

        return new RedirectView("http://localhost:5173/?paymentStatus=" + status);
    }
}
