package com.smokingcessation;


import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class SmokingcessationApplication {

	public static void main(String[] args) {
		Dotenv dotenv = Dotenv.configure()
				.directory("./be") // Đường dẫn đến thư mục chứa .env (thư mục gốc)
				.ignoreIfMissing() // Bỏ qua nếu không tìm thấy .env
				.load();

		// Chuyển các biến từ .env vào System properties
		dotenv.entries().forEach(entry -> System.setProperty(entry.getKey(), entry.getValue()));

		// In các biến để kiểm tra (tùy chọn)
		System.out.println("SPRING_MAIL_HOST: " + System.getProperty("SPRING_MAIL_HOST"));
		System.out.println("SPRING_MAIL_USERNAME: " + System.getProperty("SPRING_MAIL_USERNAME"));
		SpringApplication.run(SmokingcessationApplication.class, args);
	}
}