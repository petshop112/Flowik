package fooTalent.flowik.debt.dto;

import fooTalent.flowik.debt.entity.Debt;
import fooTalent.flowik.debt.enums.StatusDebt;

import java.math.BigDecimal;

public record DebtResponse(
        BigDecimal mount,
        StatusDebt status
)
{
}