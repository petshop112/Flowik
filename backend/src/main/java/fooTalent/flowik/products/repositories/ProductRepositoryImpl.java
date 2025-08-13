package fooTalent.flowik.products.repositories;

import fooTalent.flowik.products.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepositoryImpl extends JpaRepository<Product, Long> {

}