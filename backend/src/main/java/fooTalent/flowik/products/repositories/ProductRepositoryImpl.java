package fooTalent.flowik.products.repositories;

import fooTalent.flowik.products.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepositoryImpl extends JpaRepository<Product, Long> {

    @Modifying
    @Query("UPDATE Product p SET p.isActive = NOT p.isActive WHERE p.id IN :ids")
    void toggleProductsActiveState(@Param("ids") List<Long> Ids);
}