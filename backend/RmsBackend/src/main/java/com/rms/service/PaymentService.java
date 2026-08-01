package com.rms.service;

import com.rms.dto.payment.request.AddPaymentRequest;
import com.rms.dto.payment.request.PayDueRequest;
import com.rms.util.ApiResponse;
import org.springframework.http.ResponseEntity;

public interface PaymentService {

    ResponseEntity<ApiResponse<Object>> processPayment(AddPaymentRequest request);

    ResponseEntity<ApiResponse<Object>> payDue(
            PayDueRequest request
    );

    ResponseEntity<ApiResponse<Object>> getPendingDues();

}