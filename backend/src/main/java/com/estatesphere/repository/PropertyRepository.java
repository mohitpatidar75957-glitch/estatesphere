package com.estatesphere.repository;

import com.estatesphere.model.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PropertyRepository extends JpaRepository<Property, Long> {
    List<Property> findByCityContainingIgnoreCaseAndStatus(String city, Property.Status status);
    List<Property> findByStatus(Property.Status status);
}
