package com.estatesphere.service;

import com.estatesphere.model.Property;
import com.estatesphere.repository.PropertyRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Component
public class DatabaseSeeder implements ApplicationRunner {

    private final PropertyRepository repository;

    public DatabaseSeeder(PropertyRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (repository.count() == 0) {
            List<Property> seedProperties = new ArrayList<>();

            // Seed 25 apartments with varying blocks, floors, typologies, bedrooms, prices, etc.
            String[] typologies = {
                "GROUND FLOOR + BASEMENT", 
                "GROUND FLOOR", 
                "PENTHOUSE DUPLEX"
            };
            String[] blocks = {"BLOCK B1", "BLOCK B2", "BLOCK B3"};
            String[] floors = {"0 FLOOR", "1 FLOOR", "2 FLOOR", "3 FLOOR"};

            // Define 25 combinations of apartments
            for (int i = 1; i <= 25; i++) {
                Property p = new Property();
                
                // Formulate details
                String block = blocks[(i - 1) % blocks.length];
                int floorNum = (i - 1) % 4; // 0 to 3
                String floor = floors[floorNum];
                
                String typology;
                if (floorNum == 0) {
                    typology = (i - 1) % 8 == 0 ? typologies[0] : typologies[1]; // GROUND FLOOR + BASEMENT or GROUND FLOOR
                } else if (floorNum == 3) {
                    typology = typologies[2]; // PENTHOUSE DUPLEX
                } else {
                    typology = typologies[1]; // GROUND FLOOR
                }

                int bedrooms = (i % 2 == 0) ? 2 : 3;
                int bathrooms = (bedrooms == 3) ? 3 : 2;
                
                // Area in sqft (e.g. 132 m2 is ~1420 sqft)
                int areaSqm = 90 + (i * 6) % 160; // 90 to 250
                int areaSqft = (int)(areaSqm * 10.764);
                int terraceArea = 15 + (i * 5) % 45; // 15 to 60 sqm

                String aptNum = String.format("No-%02d", i);

                p.setTitle(bedrooms + " Bed Residence - Unit " + aptNum);
                p.setCity("Estepona");
                p.setAddress("Costa del Sol, Malaga, Spain");
                
                // Price in Indian Rupees or general large values (e.g., from 2.5 Cr upwards)
                BigDecimal basePrice = new BigDecimal("25000000");
                BigDecimal priceDelta = new BigDecimal(i * 1250000L);
                p.setPrice(basePrice.add(priceDelta)); // Price between 2.625 Cr and 5.625 Cr
                
                p.setBedrooms(bedrooms);
                p.setBathrooms(bathrooms);
                p.setAreaSqft(areaSqft);
                p.setDescription("A luxurious, modern apartment situated in the " + block + " of ERA Residences, offering pristine amenities and landscaped surroundings.");
                p.setImageUrl("/assets/estate-apartment-exterior.png");
                p.setModelUrl("/assets/cayley-interior-8k.jpg");
                p.setStatus(Property.Status.AVAILABLE);
                p.setFeatured(i % 5 == 0);

                // Extended fields
                p.setApartmentNumber(aptNum);
                p.setBlock(block);
                p.setFloor(floor);
                p.setTerraceArea(terraceArea);
                p.setTypology(typology);
                p.setCompletion("4Q 2026");

                seedProperties.add(p);
            }

            repository.saveAll(seedProperties);
            System.out.println(">>> Successfully seeded " + seedProperties.size() + " properties into the database with format 'No-01'.");
        } else {
            // Migrate existing properties to 'No-01' format
            List<Property> existing = repository.findAll();
            boolean changed = false;
            for (Property p : existing) {
                String currentNum = p.getApartmentNumber();
                if (currentNum != null && (currentNum.contains("№") || currentNum.contains("\u2116") || currentNum.startsWith("NO.") || currentNum.startsWith("NO ") || currentNum.startsWith("№"))) {
                    long idVal = p.getId();
                    String newNum = String.format("No-%02d", idVal);
                    p.setApartmentNumber(newNum);
                    if (p.getTitle() != null && (p.getTitle().contains("№") || p.getTitle().contains("\u2116") || p.getTitle().contains("NO.") || p.getTitle().contains("NO "))) {
                        p.setTitle(p.getBedrooms() + " Bed Residence - Unit " + newNum);
                    }
                    changed = true;
                }
            }
            if (changed) {
                repository.saveAll(existing);
                System.out.println(">>> Successfully updated existing properties to 'No-01' format.");
            } else {
                System.out.println(">>> Database properties verified with format 'No-01'. Count: " + repository.count());
            }
        }
    }
}
