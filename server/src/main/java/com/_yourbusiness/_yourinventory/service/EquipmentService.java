package com._yourbusiness._yourinventory.service;

import com._yourbusiness._yourinventory.dto.EquipmentDto;

public interface EquipmentService {
    EquipmentDto findByPartNumber(String partNumber);

    EquipmentDto updateEquipment(Long partNumberId, EquipmentDto updatedEquipment);
}
