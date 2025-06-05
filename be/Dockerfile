# Dùng JDK 21 làm base image
FROM eclipse-temurin:21-jdk-jammy

WORKDIR /app

# Copy file jar (bạn cần build jar trước)
COPY target/your-app.jar app.jar

# Copy file .env (nếu cần, hoặc dùng docker-compose để đọc)
COPY .env .env

# Chạy app, load biến môi trường từ .env
CMD ["sh", "-c", "export $(grep -v '^#' .env | xargs) && java -jar app.jar"]
