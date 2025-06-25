package com.smokingcessation.service;

import com.smokingcessation.dto.res.LoginDTO;
import com.smokingcessation.model.OtpToken;
import com.smokingcessation.model.User;
import com.smokingcessation.repository.OtpTokenRepository;
import com.smokingcessation.repository.UserRepository;
import com.smokingcessation.util.JwtUtil;
import jakarta.mail.MessagingException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;
import java.util.UUID;

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

    public void register(String email, String password, String fullName, String nameProfile) throws Exception {
        if (userRepository.existsByEmail(email)) {
            throw new Exception("Email already exists");
        }

        User user = new User();
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setFullName(fullName);
        user.setProfileName(nameProfile);
        user.setRole(User.Role.user);
        user.setHasActive(false);
        user.setTypeLogin("LOCAL");
        user.setIsVerified(false);
        userRepository.save(user);

        String otpCode = generateOtp();
        saveOtp(user, otpCode, OtpToken.Purpose.register);
        emailService.sendOtpEmail(email, otpCode, "Registration Verification");
    }

    public LoginDTO login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Incorrect username or password"));
        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new RuntimeException("Incorrect username or password");
        }
        if (user.getIsBlock()) {
            throw new RuntimeException("Your account has been locked");
        }
        if (user.getIsDelete()) {
            throw new RuntimeException("Your account has been delete");
        }

        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);
        String token = jwtUtil.generateToken(email, user.getRole().name());
        return new LoginDTO(
                token,
                user.getUserId(),
                user.getEmail(),
                user.getRole().name(),
                user.getIsVerified(),
                user.getProfileName(),
                user.getAvatarUrl()
        );
    }

    public void forgotPassword(String email) throws MessagingException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        String otpCode = generateOtp();
        saveOtp(user, otpCode, OtpToken.Purpose.reset_password);
        emailService.sendOtpEmail(email, otpCode, "Password Reset");
    }

    public void resetPassword(String email) throws MessagingException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        String otpCode = generateOtp();
        saveOtp(user, otpCode, OtpToken.Purpose.change_password);
        emailService.sendOtpEmail(email, otpCode, "Password Reset");
    }

    public void changePassword(String token, String newPassword) {
        String email = jwtUtil.getEmailFromToken(token);
        if (!jwtUtil.validateToken(token, email)) {
            throw new RuntimeException("Invalid or expired token");
        }
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    public String verifyOtp(String otpCode, OtpToken.Purpose purpose) {
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

        // Generate temporary token
        return jwtUtil.generateTemporaryToken(user.getEmail(), 10); // 10 minutes expiry
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
        emailService.sendOtpEmail(email, otpCode, purpose == OtpToken.Purpose.register ? "Registration Verification" : "Password Reset");
    }

    public LoginDTO handleGoogleLogin(OAuth2User principal) {
        String email = principal.getAttribute("email");
        String fullName = principal.getAttribute("name");
        String avatarUrl = principal.getAttribute("picture");

        if (email == null || fullName == null) {
            throw new IllegalArgumentException("Email or full name is missing from Google response");
        }

        User existingUser = userRepository.findByEmail(email).orElse(null);
        User user;

        if (existingUser == null) {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setFullName(fullName);
            newUser.setAvatarUrl(avatarUrl);
            newUser.setProfileName("user" + UUID.randomUUID().toString().substring(0, 6));
            newUser.setPasswordHash(UUID.randomUUID().toString());
            newUser.setRole(User.Role.user);
            newUser.setIsVerified(true);
            newUser.setHasActive(false);
            newUser.setTypeLogin("GOOGLE");
            newUser.setCreatedAt(LocalDateTime.now());
            newUser.setUpdatedAt(LocalDateTime.now());
            user = userRepository.save(newUser);
        } else {
            user = existingUser;
            user.setUpdatedAt(LocalDateTime.now());
            user.setLastLogin(LocalDateTime.now());
            userRepository.save(user);
        }

        String token = jwtUtil.generateToken(email, user.getRole().name());

        return new LoginDTO(
                token,
                user.getUserId(),
                user.getEmail(),
                user.getRole().name(),
                user.getIsVerified(),
                user.getProfileName(),
                user.getAvatarUrl()
        );
    }
}