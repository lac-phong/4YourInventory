package com._yourbusiness._yourinventory.mapper;

import com._yourbusiness._yourinventory.dto.ProductsDto;
import com._yourbusiness._yourinventory.entity.Products;

public class ProductsMapper {

    public static ProductsDto mapToProducts(Products product) {
        return new ProductsDto(
                product.getPartNumber(),
                product.getSerialNumber(),
                product.getLoc(),
                product.getSold()
        );
    }

    public static Products mapToProductsDto(ProductsDto productsDto) {
        return new Products(
                productsDto.getPartNumber(),
                productsDto.getSerialNumber(),
                productsDto.getLoc(),
                productsDto.getSold()
        );
    }
}
