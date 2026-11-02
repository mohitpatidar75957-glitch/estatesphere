package com.estatesphere.controller;

import com.estatesphere.model.Property;
import com.estatesphere.service.PropertyService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/properties")
public class PropertyController {
    private final PropertyService service;
    public PropertyController(PropertyService service) { this.service = service; }
    @GetMapping public List<Property> search(@RequestParam(required = false) String city) { return service.search(city); }
    @GetMapping("/{id}") public Property get(@PathVariable Long id) { return service.get(id); }
}
