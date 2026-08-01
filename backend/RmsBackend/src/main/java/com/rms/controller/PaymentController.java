package com.rms.controller;

import com.rms.dto.payment.request.AddPaymentRequest;
import com.rms.dto.payment.request.PayDueRequest;
import com.rms.service.PaymentService;
import com.rms.util.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment/v1")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/process-payment")
    public ResponseEntity<ApiResponse<Object>> processPayment(
            @Valid @RequestBody AddPaymentRequest request
    ) {

        return paymentService.processPayment(request);

    }

    @PostMapping("/pay-due")
    public ResponseEntity<ApiResponse<Object>> payDue(
            @Valid @RequestBody PayDueRequest request
    ) {

        return paymentService.payDue(request);
    }

    @GetMapping("/pending-dues")
    public ResponseEntity<ApiResponse<Object>> getPendingDues() {

        return paymentService.getPendingDues();
    }

}