package com.estatesphere.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.Instant;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
public class Booking {
    public enum Status { REQUESTED, CONFIRMED, CANCELLED }
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(optional = false, fetch = FetchType.LAZY) private Property property;
    @NotBlank @Size(max = 100) private String customerName;
    @NotBlank @Email @Size(max = 160) private String email;
    @NotBlank @Pattern(regexp = "^[0-9+() -]{8,20}$") private String phone;
    @NotNull private LocalDateTime visitAt;
    @Size(max = 1000) private String message;
    @Enumerated(EnumType.STRING) private Status status = Status.REQUESTED;
    private Instant createdAt = Instant.now();

    public Long getId() { return id; }
    public Property getProperty() { return property; }
    public void setProperty(Property property) { this.property = property; }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public LocalDateTime getVisitAt() { return visitAt; }
    public void setVisitAt(LocalDateTime visitAt) { this.visitAt = visitAt; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public Status getStatus() { return status; }
    public Instant getCreatedAt() { return createdAt; }
}
