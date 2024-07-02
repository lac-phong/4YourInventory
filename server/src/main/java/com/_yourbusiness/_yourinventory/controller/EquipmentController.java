package com._yourbusiness._yourinventory.controller;

import com._yourbusiness._yourinventory.dto.EquipmentDto;
import com._yourbusiness._yourinventory.service.EquipmentService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("*")
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

    //Build update equipment REST API
    @PutMapping("{id}")
    public ResponseEntity<EquipmentDto> updateEquipment(@PathVariable("id") Long partNumberId, @RequestBody EquipmentDto updatedEquipment){
        EquipmentDto equipmentDto = equipmentService.updateEquipment(partNumberId, updatedEquipment);
        return ResponseEntity.ok(equipmentDto);
    }
}
