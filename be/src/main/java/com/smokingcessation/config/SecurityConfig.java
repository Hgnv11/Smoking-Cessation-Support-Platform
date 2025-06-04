// config/SecurityConfig.java
package com.smokingcessation.config;


import com.smokingcessation.util.JwtUtil;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;


@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    public SecurityConfig(JwtUtil jwtUtil, UserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;

    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        JwtAuthenticationFilter jwtAuthenticationFilter = new JwtAuthenticationFilter(jwtUtil, userDetailsService);
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(  "/api/auth/**",
                                "/swagger-ui/**",
                                "/v3/api-docs/**",
                                "/v3/api-docs/swagger-config",
                                "/swagger-resources/**",
                                "/webjars/**",
                                "/swagger-ui.html").permitAll()
                        .requestMatchers("/api/profile").hasRole("ADMIN")
                        .requestMatchers("/api/profile/**").hasAnyRole("USER", "MENTOR", "ADMIN")
                        .requestMatchers("/api/user-smoking-profile/**").hasAnyRole("USER", "MENTOR")

                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:5174","http://localhost:8080")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowCredentials(true);
            }
        };
    }

}