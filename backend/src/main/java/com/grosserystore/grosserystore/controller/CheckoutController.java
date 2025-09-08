package com.grosserystore.grosserystore.controller;

import com.grosserystore.grosserystore.dto.CheckoutSessionResponse;
import com.grosserystore.grosserystore.service.CheckoutService;
import com.stripe.exception.StripeException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/checkout")
@CrossOrigin(origins = "http://localhost:3000")
public class CheckoutController {

    private final CheckoutService checkoutService;

    public CheckoutController(CheckoutService checkoutService) {
        this.checkoutService = checkoutService;
    }

    @PostMapping("/{userId}/create-session")
    public ResponseEntity<CheckoutSessionResponse> create(@PathVariable Long userId) throws StripeException {
        String url = checkoutService.createCheckoutSession(userId);
        return ResponseEntity.ok(new CheckoutSessionResponse(url));
    }
}
