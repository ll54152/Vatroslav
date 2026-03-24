package com.inventar.backend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.*;
import org.springframework.security.web.DefaultSecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;


@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class Security {

    private JWTFilter jwtFilter;
    private UserDetailsService userDetailsService;
    private CustomCorsConfiguration customCorsConfiguration;

    public Security(JWTFilter jwtFilter, UserDetailsService userDetailsService, CustomCorsConfiguration customCorsConfiguration) {
        this.jwtFilter = jwtFilter;
        this.userDetailsService = userDetailsService;
        this.customCorsConfiguration = customCorsConfiguration;
    }

    private static final String[] WHITE_LIST_URL = {
            "/user/login",
            //"/user/register",
            "/auth/verify",
    };

    @Bean
    public DefaultSecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        return http
                .authorizeHttpRequests(request -> request    // Authorize HTTP requests
                        .requestMatchers(WHITE_LIST_URL).permitAll()    // Allow all requests to the whitelist URLs
                        //.requestMatchers("/experiment/**").hasAuthority("ROLE_ADMIN")  // Restrict all experiment endpoints to admins
                        .anyRequest().authenticated())     // All other requests require authentication
                //.httpBasic(Customizer.withDefaults())   // Enable basic authentication
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))    // Set session management to stateless
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class) // Add JWT filter before the username/password authentication filter
                .csrf(AbstractHttpConfigurer::disable)
                .cors(c -> c.configurationSource(customCorsConfiguration))
                .build();
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12); // Password encoder with strength 12
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();   // Authentication provider
        provider.setPasswordEncoder(new BCryptPasswordEncoder(12));     // Password encoder
        provider.setUserDetailsService(userDetailsService);   // User details service
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();   // Authentication manager
    }

}
