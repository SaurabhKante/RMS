package com.rms.config;

import com.rms.entity.Dish;
import com.rms.entity.Role;
import com.rms.entity.User;
import com.rms.entity.enums.DishType;
import com.rms.repository.DishRepository;
import com.rms.repository.RoleRepository;
import com.rms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DatabaseInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final DishRepository dishRepository;
    private final PasswordEncoder passwordEncoder;

    // ADMIN CONFIGURATION

    @Value("${ADMIN_FULL_NAME}")
    private String adminFullName;

    @Value("${ADMIN_MOBILE_NO}")
    private String adminMobileNo;

    @Value("${ADMIN_EMAIL}")
    private String adminEmail;

    @Value("${ADMIN_PASSWORD}")
    private String adminPassword;


    @Override
    public void run(String... args) {

        // 1. CREATE ROLES

        Role adminRole = createRoleIfNotExists("ADMIN");

        createRoleIfNotExists("USER");

        // 2. CREATE ADMIN USER

        createAdminIfNotExists(adminRole);

        // 3. CREATE DISH CATEGORIES

        createDishCategoryIfNotExists("Starter");

        createDishCategoryIfNotExists("Main Course");

        createDishCategoryIfNotExists("Breads");

        createDishCategoryIfNotExists("Rice & Biryani");

        createDishCategoryIfNotExists("Chinese");

        createDishCategoryIfNotExists("Drinks");

        createDishCategoryIfNotExists("Desserts");

        createDishCategoryIfNotExists("Soups");

        createDishCategoryIfNotExists("Salads");

        createDishCategoryIfNotExists("Sides");


        System.out.println(
                "=========================================="
        );

        System.out.println(
                "Database initialization completed."
        );

        System.out.println(
                "=========================================="
        );
    }


    // CREATE ROLE

    private Role createRoleIfNotExists(String roleName) {

        return roleRepository
                .findByRoleName(roleName)
                .orElseGet(() -> {

                    Role role = new Role();

                    role.setRoleName(roleName);

                    Role savedRole =
                            roleRepository.save(role);

                    System.out.println(
                            "Role created successfully: "
                                    + roleName
                    );

                    return savedRole;
                });
    }


    // CREATE ADMIN USER

    private void createAdminIfNotExists(
            Role adminRole
    ) {

        if (
                userRepository
                        .findByEmail(adminEmail)
                        .isPresent()
        ) {

            System.out.println(
                    "Admin user already exists: "
                            + adminEmail
            );

            return;
        }


        User admin = new User();

        admin.setFullName(adminFullName);

        admin.setMobileNo(adminMobileNo);

        admin.setEmail(adminEmail);


        // NEVER store plain password
        admin.setPassword(
                passwordEncoder.encode(adminPassword)
        );


        // Assign ADMIN role
        admin.setRole(adminRole);


        userRepository.save(admin);


        System.out.println(
                "=========================================="
        );

        System.out.println(
                "Initial ADMIN user created successfully."
        );

        System.out.println(
                "Admin Email: " + adminEmail
        );

        System.out.println(
                "=========================================="
        );
    }


    // ==========================================
    // CREATE DISH CATEGORY
    // ==========================================

    private void createDishCategoryIfNotExists(
            String categoryName
    ) {

        if (
                dishRepository
                        .findByDishNameAndDishType(
                                categoryName,
                                DishType.PARENT
                        )
                        .isPresent()
        ) {

            System.out.println(
                    "Dish category already exists: "
                            + categoryName
            );

            return;
        }


        Dish category = new Dish();

        category.setDishName(categoryName);

        category.setDishType(DishType.PARENT);

        category.setDescription(
                categoryName + " category"
        );

        category.setPrice(null);

        category.setParentDish(null);

        category.setImageUrl(null);

        category.setTags(null);


        dishRepository.save(category);


        System.out.println(
                "Dish category created successfully: "
                        + categoryName
        );
    }
}