package com._yourbusiness._yourinventory.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "serials")
public class Products {

    @Column(name = "part_number")
    private Long partNumber;

    @Column(name = "serial_number")
    private Long serialNumber;

    @Column(name = "loc")
    private String loc;

    @Column(name = "sold")
    private Boolean sold;
}
