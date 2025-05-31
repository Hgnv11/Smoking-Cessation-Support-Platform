package com.smokingcessation.service;

import com.smokingcessation.model.OtpToken;
import com.smokingcessation.model.User;
import com.smokingcessation.model.OtpToken;
import com.smokingcessation.model.User;
import com.smokingcessation.repository.OtpTokenRepository;
import com.smokingcessation.repository.UserRepository;
import com.smokingcessation.util.JwtUtil;
import jakarta.mail.MessagingException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final OtpTokenRepository otpTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, OtpTokenRepository otpTokenRepository,
                       PasswordEncoder passwordEncoder, EmailService emailService, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.otpTokenRepository = otpTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
        this.jwtUtil = jwtUtil;
    }

    public void register(String email, String password, String fullName) throws Exception {
        if (userRepository.existsByEmail(email)) {
            throw new Exception("Email already exists");
        }


        User user = new User();
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setFullName(fullName);
        user.setRole(User.Role.user);
        user.setHasActive(false);
        user.setType_login("LOCAL");
        user.setIsVerified(false);
        userRepository.save(user);

        String otpCode = generateOtp();
        saveOtp(user, otpCode, OtpToken.Purpose.register);
        emailService.sendOtpEmail(email, otpCode, "Registration Verification");
    }

    public String login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new RuntimeException("Invalid password");
        }
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);
        return jwtUtil.generateToken(email, user.getRole().name());
    }

    public void forgotPassword(String email) throws MessagingException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        String otpCode = generateOtp();
        saveOtp(user, otpCode, OtpToken.Purpose.reset_password);
        emailService.sendOtpEmail(email, otpCode, "Password Reset");
    }

    public void resetPassword(String otpCode, String newPassword) {
        OtpToken otpToken = otpTokenRepository.findByOtpCodeAndPurposeAndIsUsedFalse(otpCode, OtpToken.Purpose.reset_password)
                .orElseThrow(() -> new RuntimeException("Invalid or expired OTP"));
        if (otpToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP has expired");
        }
        User user = otpToken.getUser();
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        otpToken.setIsUsed(true);
        otpTokenRepository.save(otpToken);
    }

    public void verifyOtp(String otpCode, OtpToken.Purpose purpose) {
        OtpToken otpToken = otpTokenRepository.findByOtpCodeAndPurposeAndIsUsedFalse(otpCode, purpose)
                .orElseThrow(() -> new RuntimeException("Invalid or expired OTP"));
        if (otpToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP has expired");
        }
        User user = otpToken.getUser();
        if (purpose == OtpToken.Purpose.register) {
            user.setIsVerified(true);
            userRepository.save(user);
        }
        otpToken.setIsUsed(true);
        otpTokenRepository.save(otpToken);
    }

    private String generateOtp() {
        return String.format("%06d", new Random().nextInt(999999));
    }

    private void saveOtp(User user, String otpCode, OtpToken.Purpose purpose) {
        OtpToken otpToken = new OtpToken();
        otpToken.setUser(user);
        otpToken.setOtpCode(otpCode);
        otpToken.setPurpose(purpose);
        otpToken.setExpiresAt(LocalDateTime.now().plusMinutes(10));
        otpTokenRepository.save(otpToken);
    }
    public void resendOtp(String email, OtpToken.Purpose purpose) throws MessagingException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Vô hiệu hóa các OTP cũ cho mục đích này
        otpTokenRepository.findByUserAndPurposeAndIsUsedFalse(user, purpose)
                .forEach(otp -> {
                    otp.setIsUsed(true);
                    otpTokenRepository.save(otp);
                });

        // Tạo và gửi OTP mới
        String otpCode = generateOtp();
        saveOtp(user, otpCode, purpose);

        emailService.sendOtpEmail(email, otpCode, "Registration Verification");
    }
}