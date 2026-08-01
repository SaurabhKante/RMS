package com.rms.service.impl;

import com.rms.dto.payment.request.AddPaymentRequest;
import com.rms.dto.payment.request.DueDetailsRequest;
import com.rms.dto.payment.request.PayDueRequest;
import com.rms.dto.payment.request.PaymentMethodRequest;
import com.rms.dto.payment.response.*;
import com.rms.entity.Order;
import com.rms.entity.RestaurantTable;
import com.rms.entity.enums.DueStatus;
import com.rms.entity.enums.OrderStatus;
import com.rms.entity.enums.PaymentMethod;
import com.rms.exception.BadRequestException;
import com.rms.exception.ResourceNotFoundException;
import com.rms.repository.CustomerDueRepository;
import com.rms.repository.OrderRepository;
import com.rms.repository.PaymentRepository;
import com.rms.repository.RestaurantTableRepository;
import com.rms.service.PaymentService;
import com.rms.util.ApiResponse;
import com.rms.util.ResponseHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

import com.rms.entity.CustomerDue;
import com.rms.entity.Payment;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final OrderRepository orderRepository;
    private final RestaurantTableRepository restaurantTableRepository;
    private final CustomerDueRepository customerDueRepository;
    private final PaymentRepository paymentRepository;

    @Override
    @Transactional
    public ResponseEntity<ApiResponse<Object>> processPayment(AddPaymentRequest request) {


        RestaurantTable table = restaurantTableRepository
                .findById(request.getTableId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Table not found.")
                );

        if (!Boolean.TRUE.equals(table.getIsActive())) {
            throw new BadRequestException("Table is inactive.");
        }

        Order order = orderRepository
                .findByRestaurantTableAndOrderStatus(
                        table,
                        OrderStatus.PENDING
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "No pending order found for this table."
                        )
                );

        BigDecimal totalAmount = order.getTotalAmount();

        BigDecimal discount = request.getDiscount();

        if (discount == null) {
            discount = BigDecimal.ZERO;
        }

        if (discount.compareTo(BigDecimal.ZERO) < 0) {
            throw new BadRequestException(
                    "Discount cannot be negative."
            );
        }

        if (discount.compareTo(totalAmount) > 0) {
            throw new BadRequestException(
                    "Discount cannot exceed total amount."
            );
        }

        BigDecimal finalAmount =
                totalAmount.subtract(discount);

        List<PaymentMethodRequest> paymentMethods =
                request.getPayments();

        Set<PaymentMethod> usedMethods = new HashSet<>();

        long dueCount = 0;

        if (paymentMethods == null ||
                paymentMethods.isEmpty()) {

            throw new BadRequestException(
                    "At least one payment method is required."
            );
        }

        BigDecimal totalPaid = BigDecimal.ZERO;

        boolean duePaymentPresent = false;

        for (PaymentMethodRequest payment : paymentMethods) {

            if (payment.getAmount() == null
                    || payment.getAmount().compareTo(BigDecimal.ZERO) <= 0) {

                throw new BadRequestException(
                        "Payment amount must be greater than zero."
                );
            }

            // Prevent duplicate payment methods
            if (!usedMethods.add(payment.getPaymentMethod())) {

                throw new BadRequestException(
                        "Duplicate payment method: "
                                + payment.getPaymentMethod()
                );
            }

            // Only one DUE payment is allowed
            if (payment.getPaymentMethod() == PaymentMethod.DUE) {

                dueCount++;

                if (dueCount > 1) {
                    throw new BadRequestException(
                            "Only one DUE payment is allowed."
                    );
                }

                duePaymentPresent = true;
            }

            // Calculate total of all payment methods
            // (including DUE, because DUE contributes to the bill settlement)
            totalPaid = totalPaid.add(payment.getAmount());
        }

        if (totalPaid.compareTo(finalAmount) != 0) {

            throw new BadRequestException(
                    "Payment total must be equal to Final Amount."
            );

        }

        if (duePaymentPresent) {

            DueDetailsRequest due = request.getDueDetails();

            if (due == null) {

                throw new BadRequestException(
                        "Due details are required."
                );

            }

            if (due.getCustomerName() == null ||
                    due.getCustomerName().trim().isEmpty()) {

                throw new BadRequestException(
                        "Customer Name is required."
                );
            }
            if (due.getMobileNumber() == null ||
                    !due.getMobileNumber()
                            .matches("^[6-9]\\d{9}$")) {

                throw new BadRequestException(
                        "Invalid Mobile Number."
                );

            }

        }
        List<Payment> savedPayments = new ArrayList<>();

        for (PaymentMethodRequest paymentRequest : paymentMethods) {

            // Skip DUE. It belongs in customer_dues, not payments.
            if (paymentRequest.getPaymentMethod() == PaymentMethod.DUE) {
                continue;
            }

            Payment payment = new Payment();

            payment.setOrder(order);
            payment.setPaymentMethod(paymentRequest.getPaymentMethod());
            payment.setAmountPaid(paymentRequest.getAmount());

            if (paymentRequest.getPaymentMethod() == PaymentMethod.UPI
                    || paymentRequest.getPaymentMethod() == PaymentMethod.CARD) {

                payment.setTransactionId(paymentRequest.getTransactionId());
            }

            order.addPayment(payment);

            savedPayments.add(payment);
        }

        if (duePaymentPresent) {

            BigDecimal dueAmount = paymentMethods.stream()
                    .filter(p -> p.getPaymentMethod() == PaymentMethod.DUE)
                    .map(PaymentMethodRequest::getAmount)
                    .findFirst()
                    .orElse(BigDecimal.ZERO);

            CustomerDue customerDue = new CustomerDue();

            customerDue.setCustomerName(
                    request.getDueDetails().getCustomerName()
            );

            customerDue.setMobileNumber(
                    request.getDueDetails().getMobileNumber()
            );

            customerDue.setTotalAmount(finalAmount);

            customerDue.setPaidAmount(
                    finalAmount.subtract(dueAmount)
            );

            customerDue.setDueAmount(dueAmount);

            customerDue.setDueStatus(
                    dueAmount.compareTo(BigDecimal.ZERO) == 0
                            ? DueStatus.COMPLETED
                            : DueStatus.PENDING
            );

            customerDue.setOrder(order);

            order.setCustomerDue(customerDue);
        }

        order.setDiscount(discount);

        order.setFinalAmount(finalAmount);

        order.setOrderStatus(OrderStatus.COMPLETED);

        Order savedOrder = orderRepository.save(order);

        List<PaymentResponse> paymentResponses =
                savedOrder.getPayments()
                        .stream()
                        .map(payment ->
                                PaymentResponse.builder()
                                        .paymentId(payment.getPaymentId())
                                        .paymentMethod(payment.getPaymentMethod())
                                        .amountPaid(payment.getAmountPaid())
                                        .transactionId(payment.getTransactionId())
                                        .build()
                        )
                        .collect(Collectors.toList());

        CustomerDueResponse dueResponse = null;

        if (savedOrder.getCustomerDue() != null) {

            CustomerDue due = savedOrder.getCustomerDue();

            dueResponse = CustomerDueResponse.builder()
                    .customerName(due.getCustomerName())
                    .mobileNumber(due.getMobileNumber())
                    .totalAmount(due.getTotalAmount())
                    .paidAmount(due.getPaidAmount())
                    .dueAmount(due.getDueAmount())
                    .dueStatus(due.getDueStatus())
                    .build();

        }

        AddPaymentResponse response = AddPaymentResponse.builder()
                .orderId(savedOrder.getOrderId())
                .tableId(savedOrder.getRestaurantTable().getTableId())
                .totalAmount(savedOrder.getTotalAmount())
                .discount(savedOrder.getDiscount())
                .finalAmount(savedOrder.getFinalAmount())
                .orderStatus(savedOrder.getOrderStatus())
                .payments(paymentResponses)
                .dueDetails(dueResponse)
                .build();

        return ResponseHandler.created(
                "Payment processed successfully.",
                response
        );
    }


    @Override
    @Transactional
    public ResponseEntity<ApiResponse<Object>> payDue(
            PayDueRequest request) {

        
        // Validate customer identification
        String customerName = request.getCustomerName();
        String mobileNumber = request.getMobileNumber();

        if ((customerName == null || customerName.trim().isEmpty())
                && (mobileNumber == null || mobileNumber.trim().isEmpty())) {

            throw new BadRequestException(
                    "Customer name or mobile number is required."
            );
        }

        
        // Validate payment method
        if (request.getPaymentMethod() == null) {

            throw new BadRequestException(
                    "Payment method is required."
            );
        }

        if (request.getPaymentMethod() == PaymentMethod.DUE) {

            throw new BadRequestException(
                    "DUE is not a valid payment method for paying dues."
            );
        }

        
        // Validate payment amount
        if (request.getPaymentAmount() == null
                || request.getPaymentAmount()
                .compareTo(BigDecimal.ZERO) <= 0) {

            throw new BadRequestException(
                    "Payment amount must be greater than zero."
            );
        }

        
        // Validate transaction ID
        if (request.getPaymentMethod() == PaymentMethod.UPI
                || request.getPaymentMethod() == PaymentMethod.CARD) {

            if (request.getTransactionId() == null
                    || request.getTransactionId().trim().isEmpty()) {

                throw new BadRequestException(
                        "Transaction Id is required for "
                                + request.getPaymentMethod()
                );
            }
        }

        
        // Find pending customer due
        CustomerDue customerDue =
                customerDueRepository.findPendingDue(
                                customerName,
                                mobileNumber,
                                DueStatus.PENDING
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "No pending dues found for the given customer."
                                )
                        );

        
        // Get current due amount
        BigDecimal currentDueAmount =
                customerDue.getDueAmount();

        if (currentDueAmount == null) {

            throw new BadRequestException(
                    "Due amount is not available."
            );
        }

        
        // Validate payment amount
        if (request.getPaymentAmount()
                .compareTo(currentDueAmount) > 0) {

            throw new BadRequestException(
                    "Payment amount cannot exceed the due amount."
            );
        }

        
        // Calculate new amounts
        BigDecimal paymentAmount =
                request.getPaymentAmount();

        BigDecimal updatedPaidAmount =
                customerDue.getPaidAmount()
                        .add(paymentAmount);

        BigDecimal remainingDue =
                currentDueAmount.subtract(paymentAmount);

        
        // Create actual payment
        Payment payment = new Payment();

        payment.setOrder(customerDue.getOrder());

        payment.setPaymentMethod(
                request.getPaymentMethod()
        );

        payment.setAmountPaid(paymentAmount);

        if (request.getPaymentMethod() == PaymentMethod.UPI
                || request.getPaymentMethod() == PaymentMethod.CARD) {

            payment.setTransactionId(
                    request.getTransactionId()
            );
        }

        Payment savedPayment =
                paymentRepository.save(payment);

        
        // Update CustomerDue
        customerDue.setPaidAmount(updatedPaidAmount);

        customerDue.setDueAmount(remainingDue);

        if (remainingDue.compareTo(BigDecimal.ZERO) == 0) {

            customerDue.setDueStatus(
                    DueStatus.COMPLETED
            );

        } else {

            customerDue.setDueStatus(
                    DueStatus.PENDING
            );
        }

        CustomerDue updatedDue =
                customerDueRepository.save(customerDue);

        
        // Prepare Response
        PayDueResponse response =
                PayDueResponse.builder()
                        .dueId(updatedDue.getDueId())
                        .orderId(
                                updatedDue.getOrder().getOrderId()
                        )
                        .customerName(
                                updatedDue.getCustomerName()
                        )
                        .mobileNumber(
                                updatedDue.getMobileNumber()
                        )
                        .totalAmount(
                                updatedDue.getTotalAmount()
                        )
                        .paidAmount(
                                updatedDue.getPaidAmount()
                        )
                        .dueAmount(
                                updatedDue.getDueAmount()
                        )
                        .dueStatus(
                                updatedDue.getDueStatus()
                        )
                        .paymentMethod(
                                savedPayment.getPaymentMethod()
                        )
                        .paymentAmount(
                                savedPayment.getAmountPaid()
                        )
                        .transactionId(
                                savedPayment.getTransactionId()
                        )
                        .build();

        return ResponseHandler.success(
                "Due payment processed successfully.",
                response
        );
    }

    @Override
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<Object>> getPendingDues() {

        List<CustomerDue> pendingDues =
                customerDueRepository
                        .findByDueStatusOrderByCreatedAtDesc(
                                DueStatus.PENDING
                        );

        if (pendingDues.isEmpty()) {

            return ResponseHandler.success(
                    "No pending dues found.",
                    List.of()
            );
        }

        List<PendingDueResponse> response =
                pendingDues.stream()
                        .map(due -> PendingDueResponse.builder()
                                .dueId(due.getDueId())
                                .orderId(
                                        due.getOrder() != null
                                                ? due.getOrder().getOrderId()
                                                : null
                                )
                                .customerName(due.getCustomerName())
                                .mobileNumber(due.getMobileNumber())
                                .totalAmount(due.getTotalAmount())
                                .paidAmount(due.getPaidAmount())
                                .dueAmount(due.getDueAmount())
                                .createdAt(due.getCreatedAt())
                                .build()
                        )
                        .toList();

        return ResponseHandler.success(
                "Pending dues retrieved successfully.",
                response
        );
    }
}
