package hu.webshop.engine.webshopbe.infrastructure.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import hu.webshop.engine.webshopbe.infrastructure.adapter.PaymentAdapter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
@Tag(
        name = "Payment service",
        description = "REST endpoints for payment service"
)
public class PaymentController {

    private final PaymentAdapter paymentAdapter;

}
