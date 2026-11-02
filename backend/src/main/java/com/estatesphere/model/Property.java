package com.estatesphere.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;

@Entity
@Table(name = "properties", indexes = {@Index(name = "idx_property_city_status", columnList = "city,status")})
public class Property {
    public enum Status { AVAILABLE, RESERVED, SOLD }

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank @Size(max = 120) private String title;
    @NotBlank @Size(max = 80) private String city;
    @NotBlank @Size(max = 180) private String address;
    @NotNull @DecimalMin("0.0") @Column(precision = 14, scale = 2) private BigDecimal price;
    @Min(1) private int bedrooms;
    @Min(1) private int bathrooms;
    @Positive private int areaSqft;
    @Size(max = 4000) @Column(length = 4000) private String description;
    @Size(max = 500) private String imageUrl;
    @Size(max = 500) private String modelUrl;
    @Enumerated(EnumType.STRING) @Column(nullable = false) private Status status = Status.AVAILABLE;
    private boolean featured;

    @Size(max = 20) private String apartmentNumber;
    @Size(max = 40) private String block;
    @Size(max = 40) private String floor;
    private int terraceArea;
    @Size(max = 80) private String typology;
    @Size(max = 40) private String completion;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public int getBedrooms() { return bedrooms; }
    public void setBedrooms(int bedrooms) { this.bedrooms = bedrooms; }
    public int getBathrooms() { return bathrooms; }
    public void setBathrooms(int bathrooms) { this.bathrooms = bathrooms; }
    public int getAreaSqft() { return areaSqft; }
    public void setAreaSqft(int areaSqft) { this.areaSqft = areaSqft; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public String getModelUrl() { return modelUrl; }
    public void setModelUrl(String modelUrl) { this.modelUrl = modelUrl; }
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
    public boolean isFeatured() { return featured; }
    public void setFeatured(boolean featured) { this.featured = featured; }

    public String getApartmentNumber() { return apartmentNumber; }
    public void setApartmentNumber(String apartmentNumber) { this.apartmentNumber = apartmentNumber; }
    public String getBlock() { return block; }
    public void setBlock(String block) { this.block = block; }
    public String getFloor() { return floor; }
    public void setFloor(String floor) { this.floor = floor; }
    public int getTerraceArea() { return terraceArea; }
    public void setTerraceArea(int terraceArea) { this.terraceArea = terraceArea; }
    public String getTypology() { return typology; }
    public void setTypology(String typology) { this.typology = typology; }
    public String getCompletion() { return completion; }
    public void setCompletion(String completion) { this.completion = completion; }
}
