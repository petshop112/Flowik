package fooTalent.flowik.payments.util;

import fooTalent.flowik.client.entity.Client;
import fooTalent.flowik.debt.entity.Debt;
import fooTalent.flowik.debt.enums.StatusDebt;
import fooTalent.flowik.debt.repositories.DebtRepository;
import fooTalent.flowik.payments.Repository.PaymentRepository;
import fooTalent.flowik.payments.entity.Payment;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

public class Calcs {

    public static List<Payment> applyPayment(Client client, BigDecimal payment,
                                             PaymentRepository paymentRepository,
                                             DebtRepository debtRepository) {
        BigDecimal totalDebt = client.getDebts().stream()
                .filter(Debt::getIsActive)
                .map(d -> d.getMount().subtract(getTotalPayments(d)))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        if (!debtRepository.existsActiveDebtByClientId(client.getId_client())) {
            throw new IllegalArgumentException("Deuda inexistente");
        }

        if (payment.compareTo(totalDebt) > 0) {
            throw new IllegalArgumentException("El pago no puede ser mayor al total de la deuda pendiente: " + totalDebt);
        }

        BigDecimal remaining = payment;

        List<Debt> debts = client.getDebts().stream()
                .filter(Debt::getIsActive)
                .sorted(Comparator.comparing(Debt::getDebt_date))
                .toList();

        List<Payment> newPayments = new ArrayList<>();

        for (Debt debt : debts) {
            if (remaining.compareTo(BigDecimal.ZERO) <= 0) break;

            BigDecimal debtRemaining = debt.getMount().subtract(getTotalPayments(debt));
            if (debtRemaining.compareTo(BigDecimal.ZERO) <= 0) continue;

            Payment newPayment = new Payment();
            if (remaining.compareTo(debtRemaining) >= 0) {
                newPayment.setPaymentMount(debtRemaining);
                debt.setStatus(StatusDebt.Pagado);
                remaining = remaining.subtract(debtRemaining);
            } else {
                newPayment.setPaymentMount(remaining);
                debt.setStatus(StatusDebt.Parcial);
                remaining = BigDecimal.ZERO;
            }

            newPayment.setDebt(debt);
            paymentRepository.save(newPayment);
            debt.getPayments().add(newPayment);
            newPayments.add(newPayment);
        }

        return newPayments;
    }

    private static BigDecimal getTotalPayments(Debt debt) {
        return debt.getPayments().stream()
                .map(Payment::getPaymentMount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}