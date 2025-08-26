package fooTalent.flowik.products.repositories;

import fooTalent.flowik.products.entities.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    @Modifying
    @Query("UPDATE Product p SET p.isActive = NOT p.isActive WHERE p.id IN :ids")
    void toggleProductsActiveState(@Param("ids") List<Long> Ids);

    @Query("SELECT p.amount FROM Product p WHERE p.id = :id")
    Integer findAmountById(Long id);
}