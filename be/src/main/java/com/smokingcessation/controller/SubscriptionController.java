package com.smokingcessation.controller;

import com.smokingcessation.service.SubscriptionService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

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

    @Operation(summary = "Callback sau khi thanh toán")
    @GetMapping("/payment/return")
    public String handlePaymentReturn(@RequestParam("transaction_id") String transactionId,
                                      @RequestParam("vnp_ResponseCode") String responseCode) {
        // VNPay trả về "00" là thành công
        String status = "00".equals(responseCode) ? "completed" : "failed";
        subscriptionService.confirmPayment(transactionId, status);
        return "Thanh toán xử lý xong, trạng thái: " + status;
    }
}
