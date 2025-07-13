package com.smokingcessation.controller;

import com.smokingcessation.service.SubscriptionService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
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
}
