package com._yourbusiness._yourinventory.mapper;

import com._yourbusiness._yourinventory.dto.EquipmentDto;
import com._yourbusiness._yourinventory.entity.Equipment;

public class EquipmentMapper {

    public static EquipmentDto mapToEquipmentDto(Equipment equipment) {
        return new EquipmentDto(
                equipment.getPartNumber(),
                equipment.getName(),
                equipment.getQuantity(),
                equipment.getQuantityOnEbay(),
                equipment.getQuantitySold(),
                equipment.getLocations(),
                equipment.getLastSoldDate()
        );
    }

    public static Equipment mapToEquipment(EquipmentDto equipmentDto) {
        return new Equipment(
                equipmentDto.getName(),
                equipmentDto.getQuantityOnEbay(),
                equipmentDto.getLastSoldDate(),
                equipmentDto.getPartNumber(),
                equipmentDto.getQuantity(),
                equipmentDto.getQuantitySold(),
                equipmentDto.getLocations()
        );
    }
}
