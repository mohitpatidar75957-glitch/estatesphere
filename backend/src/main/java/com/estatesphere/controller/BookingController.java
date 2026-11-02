package com.estatesphere.controller;

import com.estatesphere.model.Booking;
import com.estatesphere.repository.BookingRepository;
import com.estatesphere.service.PropertyService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {
    public record BookingRequest(@NotNull Long propertyId, @NotBlank String customerName,
        @Email @NotBlank String email, @Pattern(regexp = "^[0-9+() -]{8,20}$") String phone,
        @NotNull @Future LocalDateTime visitAt, @Size(max = 1000) String message) {}
    private final BookingRepository bookings;
    private final PropertyService properties;
    public BookingController(BookingRepository bookings, PropertyService properties) { this.bookings = bookings; this.properties = properties; }
    @PostMapping @ResponseStatus(HttpStatus.CREATED)
    public Booking create(@Valid @RequestBody BookingRequest request) {
        Booking booking = new Booking();
        booking.setProperty(properties.get(request.propertyId()));
        booking.setCustomerName(request.customerName()); booking.setEmail(request.email()); booking.setPhone(request.phone());
        booking.setVisitAt(request.visitAt()); booking.setMessage(request.message());
        return bookings.save(booking);
    }
}
