package com._yourbusiness._yourinventory.repository;

import com._yourbusiness._yourinventory.entity.Products;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductsRepository extends JpaRepository<Products, Long> {
}
