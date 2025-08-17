package fooTalent.flowik.payments.Repository;

import fooTalent.flowik.payments.entity.Payment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByCreatedBy(String createdBy);

    @Query("SELECT p FROM Payment p " +
            "WHERE p.debt.client.id_client = :idClient " +
            "ORDER BY p.datePayment DESC")
    List<Payment> findAllByClientId(@Param("idClient") Long idClient);
}