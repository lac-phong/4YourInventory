package com._yourbusiness._yourinventory.service.impl;

import com._yourbusiness._yourinventory.dto.EquipmentDto;
import com._yourbusiness._yourinventory.entity.Equipment;
import com._yourbusiness._yourinventory.exception.ResourceNotFoundException;
import com._yourbusiness._yourinventory.mapper.EquipmentMapper;
import com._yourbusiness._yourinventory.repository.EquipmentRepository;
import com._yourbusiness._yourinventory.service.EquipmentService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class EquipmentServiceImpl implements EquipmentService {

    @Autowired
    private EquipmentRepository equipmentRepository;

    @Override
    public EquipmentDto findByPartNumber(String partNumber) {
        Equipment equipment = equipmentRepository.findByPartNumber(partNumber);
        if (equipment == null) {
            // Handle case where equipment is not found
            // For example, return a specific response or throw a different exception
            throw new ResourceNotFoundException("Equipment with part number " + partNumber + " not found");
        }

        return EquipmentMapper.mapToEquipmentDto(equipment);
    }

    @Override
    public EquipmentDto updateEquipment(Long partNumberId, EquipmentDto updatedEquipment) {
        Equipment equipment = equipmentRepository.findById(partNumberId).orElseThrow(
                () -> new ResourceNotFoundException("Equipment does not exist with given part number: " + partNumberId)
        );
        equipment.setQuantity(updatedEquipment.getQuantity());
        equipment.setQuantitySold(updatedEquipment.getQuantitySold());
        equipment.setLocations(updatedEquipment.getLocations());

        Equipment updatedEquipmentObj = equipmentRepository.save(equipment);

        return EquipmentMapper.mapToEquipmentDto(updatedEquipmentObj);
    }

}
