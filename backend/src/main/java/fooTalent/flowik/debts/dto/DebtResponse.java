package fooTalent.flowik.debts.dto;

import fooTalent.flowik.debts.entities.Debt;
import fooTalent.flowik.debts.enums.StatusDebt;
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