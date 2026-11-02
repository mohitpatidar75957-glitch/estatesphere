package com.estatesphere.service;

import com.estatesphere.model.Property;
import com.estatesphere.repository.PropertyRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PropertyService {
    private final PropertyRepository properties;
    public PropertyService(PropertyRepository properties) { this.properties = properties; }
    public List<Property> search(String city) {
        return city == null || city.isBlank()
                ? properties.findByStatus(Property.Status.AVAILABLE)
                : properties.findByCityContainingIgnoreCaseAndStatus(city.trim(), Property.Status.AVAILABLE);
    }
    public Property get(Long id) {
        return properties.findById(id).orElseThrow(() -> new IllegalArgumentException("Property not found"));
    }
}
