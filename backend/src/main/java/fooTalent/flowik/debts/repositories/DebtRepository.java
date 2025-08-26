package fooTalent.flowik.debts.repositories;


import fooTalent.flowik.debts.entities.Debt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DebtRepository extends JpaRepository<Debt, Long> {
    @Query("SELECT CASE WHEN COUNT(d) > 0 THEN true ELSE false END " +
            "FROM Debt d WHERE d.client.id_client = :clientId AND d.isActive = true")
    boolean existsActiveDebtByClientId(@Param("clientId") long clientId);
}

