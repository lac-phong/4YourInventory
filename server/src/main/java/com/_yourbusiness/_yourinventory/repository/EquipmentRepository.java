package com._yourbusiness._yourinventory.repository;

import com._yourbusiness._yourinventory.entity.Equipment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EquipmentRepository extends JpaRepository<Equipment, Long> {

}
