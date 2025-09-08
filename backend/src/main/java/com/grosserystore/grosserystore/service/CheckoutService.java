package com.grosserystore.grosserystore.service;

import com.grosserystore.grosserystore.entity.Order;
import com.grosserystore.grosserystore.entity.OrderItem;
import com.grosserystore.grosserystore.entity.Product;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class CheckoutService {

    private final OrderService orderService;

    public CheckoutService(OrderService orderService) {
        this.orderService = orderService;
    }

    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;

    @Value("${app.currency:usd}")
    private String currency;

    /**
     * Creates an Order from the user's cart using your existing OrderService,
     * then creates a Stripe Checkout Session for that order. Returns the
     * session URL for client redirection.
     */
    public String createCheckoutSession(Long userId) throws StripeException {
        Order order = orderService.createOrderFromCart(userId);
        if (order == null || order.getOrderItems() == null || order.getOrderItems().isEmpty()) {
            throw new IllegalStateException("Order could not be created from cart or has no items");
        }

        SessionCreateParams.Builder builder = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                // You can also use {CHECKOUT_SESSION_ID} if you want to fetch it client-side later
                .setSuccessUrl(frontendUrl + "/checkout/success?o=" + order.getId())
                .setCancelUrl(frontendUrl + "/cart?cancelled=1")
                .putMetadata("orderId", String.valueOf(order.getId()))
                .putMetadata("userId", String.valueOf(userId));

        for (OrderItem item : order.getOrderItems()) {
            Product p = item.getProduct();
            BigDecimal price = item.getPrice(); // from your OrderItem
            long unitAmount = price
                    .multiply(BigDecimal.valueOf(100))
                    .setScale(0, RoundingMode.HALF_UP)
                    .longValueExact();

            SessionCreateParams.LineItem line = SessionCreateParams.LineItem.builder()
                    .setQuantity(Long.valueOf(item.getQuantity()))
                    .setPriceData(
                            SessionCreateParams.LineItem.PriceData.builder()
                                    .setCurrency(currency)
                                    .setUnitAmount(unitAmount)
                                    .setProductData(
                                            SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                    .setName(p.getName())
                                                    .build()
                                    )
                                    .build()
                    )
                    .build();

            builder.addLineItem(line);
        }

        Session session = Session.create(builder.build());
        return session.getUrl();
    }
}
