package com._yourbusiness._yourinventory.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductsDto {
    private Long partNumber;
    private Long serialNumber;
    private String loc;
    private Boolean sold;
}
