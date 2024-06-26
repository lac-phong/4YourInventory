package com._yourbusiness._yourinventory.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Columns;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "parts")
public class Equipment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "part_number")
    private String partNumber;

    @Column(name = "quantity")
    private int quantity;

    @Column(name = "quantity_sold")
    private int quantitySold;

    @Column(name = "locations", columnDefinition = "TEXT")
    private String locations;
}
