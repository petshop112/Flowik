package fooTalent.flowik.debt.dto;

import fooTalent.flowik.debt.entity.Debt;
import fooTalent.flowik.debt.enums.StatusDebt;
import fooTalent.flowik.payments.dto.PaymentResponse;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record DebtResponse(
        LocalDate debt_date,
        BigDecimal mount,
        StatusDebt status,
        List<PaymentResponse> payments
)
{
    public DebtResponse(Debt debt) {
        this(
                debt.getDebt_date(),
                debt.getMount(),
                debt.getStatus(),
                debt.getPayments().stream()
                        .map(PaymentResponse::new)
                        .toList()
        );
    }
}