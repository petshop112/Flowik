package fooTalent.flowik.payments.dto;

import fooTalent.flowik.payments.entity.Payment;

import java.math.BigDecimal;
import java.time.LocalDate;

public record PaymentResponse(
   Long id,
   BigDecimal paymentMount,
   LocalDate datePayment
) {
    public PaymentResponse(Payment payment) {
        this(
                payment.getId(),
                payment.getPaymentMount(),
                payment.getDatePayment()
        );
    }
}
