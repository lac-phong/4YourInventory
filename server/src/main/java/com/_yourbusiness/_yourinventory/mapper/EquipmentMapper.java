package com._yourbusiness._yourinventory.mapper;

import com._yourbusiness._yourinventory.dto.EquipmentDto;
import com._yourbusiness._yourinventory.entity.Equipment;

public class EquipmentMapper {

    public static EquipmentDto mapToEquipmentDto(Equipment equipment) {
        return new EquipmentDto(
                equipment.getId(),
                equipment.getPartNumber(),
                equipment.getQuantity(),
                equipment.getQuantitySold(),
                equipment.getLocations()
        );
    }

    public static Equipment mapToEquipment(EquipmentDto equipmentDto) {
        return new Equipment(
                equipmentDto.getId(),
                equipmentDto.getPartNumber(),
                equipmentDto.getQuantity(),
                equipmentDto.getQuantitySold(),
                equipmentDto.getLocations()
        );
    }
}
