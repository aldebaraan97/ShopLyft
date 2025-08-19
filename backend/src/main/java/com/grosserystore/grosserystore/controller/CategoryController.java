package com.grosserystore.grosserystore.controller;

import com.grosserystore.grosserystore.entity.Product;
import com.grosserystore.grosserystore.service.ProductService;

import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "http://localhost:3000")
@Tag(name = "Categories", description = "Category management APIs")
public class CategoryController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public List<String> getAllCategories() {
        return productService.getAllCategories();
    }

    @GetMapping("/{category}/products")
    public List<Product> getProductsByCategory(@PathVariable String category) {
        return productService.getProductsByCategory(category);
    }
}
