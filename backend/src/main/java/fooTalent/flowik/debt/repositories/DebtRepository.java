package fooTalent.flowik.debt.repositories;


import fooTalent.flowik.debt.entity.Debt;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DebtRepository extends JpaRepository<Debt, Long> {
}
