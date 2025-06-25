# 🚭 Smoking Cessation Support - Backend API

This is the **Spring Boot backend API** for the Smoking Cessation Support platform, helping users quit smoking through consultations, motivation, and support.

It supports:
- Google Login via OAuth2
- JWT authentication
- User & mentor management
- Booking consultations
- Sending feedback
- WebSocket for real-time communication
- Swagger for API documentation

---

## 🧱 Tech Stack

- Java 21
- Spring Boot 3.5.0
- Maven 3.9.9
- MySQL 8
- Spring Security + OAuth2 (Google Login)
- JWT (jjwt)
- WebSocket (STOMP)
- Lombok, MapStruct
- Swagger UI (`springdoc-openapi`)

---

## ⚙️ Environment Setup

### 🔧 Requirements

- Java 21 installed and added to PATH  
- Maven 3.9.9+  
- MySQL 8 running  
- IntelliJ IDEA (recommended)

---

## 📦 Configuration

Create a file: `src/main/resources/application.properties`

```properties
spring.datasource.url=${SPRING_DATASOURCE_URL}
spring.datasource.username=${SPRING_DATASOURCE_USERNAME}
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD}
spring.datasource.driver-class-name=${SPRING_DATASOURCE_DRIVER_CLASS_NAME}

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
spring.jpa.properties.hibernate.format_sql=true

spring.mail.host=${SPRING_MAIL_HOST}
spring.mail.port=${SPRING_MAIL_PORT}
spring.mail.username=${SPRING_MAIL_USERNAME}
spring.mail.password=${SPRING_MAIL_PASSWORD}
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.transport.protocol=smtp

spring.security.oauth2.client.registration.google.client-id=${SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_GOOGLE_CLIENT_ID}
spring.security.oauth2.client.registration.google.client-secret=${SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_GOOGLE_CLIENT_SECRET}
spring.security.oauth2.client.registration.google.redirect-uri=${SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_GOOGLE_REDIRECT_URI}
spring.security.oauth2.client.registration.google.scope=${SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_GOOGLE_SCOPE}
logging.level.org.springframework.security=DEBUG

jwt.secret=${JWT_SECRET}
jwt.expiration=${JWT_EXPIRATION}
app.otp.expiration-minutes=${APP_OTP_EXPIRATION_MINUTES}
app.otp.length=${APP_OTP_LENGTH}

server.port=${PORT:8080}

# ========== SWAGGER ==========
springdoc.api-docs.enabled=true
springdoc.swagger-ui.enabled=true
springdoc.swagger-ui.path=/swagger-ui.html

```

### Connect me via :  Hoangnvse172524@fpt.edu.vn

#### &#169; 2025 Hgnv11


