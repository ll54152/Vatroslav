package com.inventar.backend;

import com.inventar.backend.domain.User;
import com.inventar.backend.service.UserServiceJPA;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Value("${app.admin.email}")
    private String adminEmail;

    @Value("${app.admin.password}")
    private String adminPassword;

    @Value("${app.admin.firstName}")
    private String adminFirstName;

    @Value("${app.admin.lastName}")
    private String adminLastName;

    private final UserServiceJPA userServiceJPA;

    @Autowired
    public DataInitializer(UserServiceJPA userServiceJPA) {
        this.userServiceJPA = userServiceJPA;
    }

    @Override
    public void run(String... args) {
        User existingAdmin = userServiceJPA.findByEmail(adminEmail);

        if (existingAdmin == null) {
            User adminUser = new User(adminEmail, adminPassword, adminFirstName, adminLastName, "ROLE_ADMIN");
            boolean created = userServiceJPA.register(adminUser);
            if (created) {
                System.out.println("✓ Default admin user created: " + adminEmail);
            }
        } else {
            System.out.println("✓ Admin user already exists");
        }
    }
}