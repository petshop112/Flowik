package fooTalent.flowik.debt.dto;

import fooTalent.flowik.debt.entity.Debt;

import java.math.BigDecimal;
import java.util.Date;

public record DebtList(
        BigDecimal mount
)
{
  }
