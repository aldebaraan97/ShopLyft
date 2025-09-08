package com.grosserystore.grosserystore.controller;

import com.grosserystore.grosserystore.service.FulfillmentService;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/webhooks/stripe")
@RequiredArgsConstructor
public class StripeWebhookController {

    private final FulfillmentService fulfillmentService = null;

    @Value("${stripe.webhookSecret}")
    private String endpointSecret;

    @PostMapping
    public ResponseEntity<String> handle(HttpServletRequest request, @RequestBody String payload) {
        String sig = request.getHeader("Stripe-Signature");

        final Event event;
        try {
            event = Webhook.constructEvent(payload, sig, endpointSecret);
        } catch (SignatureVerificationException e) {
            return ResponseEntity.status(400).body("Invalid signature");
        }

        if ("checkout.session.completed".equals(event.getType())) {
            Session session = (Session) event.getDataObjectDeserializer()
                    .getObject().orElse(null);

            if (session != null && session.getMetadata() != null) {
                Long orderId = Long.valueOf(session.getMetadata().get("orderId"));
                Long userId = Long.valueOf(session.getMetadata().get("userId"));

                // idempotent & transactional
                fulfillmentService.markPaidDecrementStockAndClearCart(orderId, userId);
            }
        }

        return ResponseEntity.ok("ok");
    }
}
