package com._yourbusiness._yourinventory.controller;

import com._yourbusiness._yourinventory.dto.EquipmentDto;
import com._yourbusiness._yourinventory.service.EquipmentService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@AllArgsConstructor
@RestController
@RequestMapping("/api/equipment")
public class EquipmentController {

    private EquipmentService equipmentService;

    //Build get equipment REST API
    @GetMapping("{id}")
    public ResponseEntity<EquipmentDto> getEquipment(@PathVariable("id") String partNumber) {
        EquipmentDto equipmentDto = equipmentService.findByPartNumber(partNumber);
        return ResponseEntity.ok(equipmentDto);
    }
}
