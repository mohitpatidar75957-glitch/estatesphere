package com.estatesphere.config;

import com.estatesphere.model.User;
import com.estatesphere.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedUserIfNotExists("Super Admin", "superadmin@estatesphere.com", "admin123", User.Role.SUPER_ADMIN);
        seedUserIfNotExists("Property Manager", "manager@estatesphere.com", "manager123", User.Role.ADMIN);
        seedUserIfNotExists("Sales Executive", "agent@estatesphere.com", "agent123", User.Role.SALES_AGENT);
    }

    private void seedUserIfNotExists(String name, String email, String rawPassword, User.Role role) {
        if (!userRepository.existsByEmailIgnoreCase(email)) {
            User user = new User(name, email, passwordEncoder.encode(rawPassword), role);
            userRepository.save(user);
            System.out.println("✅ Seeded default user: " + email + " (" + role + ")");
        }
    }
}
