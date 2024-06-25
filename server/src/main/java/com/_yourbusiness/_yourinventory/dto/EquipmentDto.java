package com._yourbusiness._yourinventory.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EquipmentDto {
    private Long partNumber;
    private String name;
    private int quantity;
    private int quantityOnEbay;
    private int quantitySold;
    private String locations;
    private Date lastSoldDate;
}
