package com.smokingcessation.service;

import com.smokingcessation.dto.res.LoginDTO;
import com.smokingcessation.model.Payment;
import com.smokingcessation.model.Subscription;
import com.smokingcessation.model.User;
import com.smokingcessation.repository.PaymentRepository;
import com.smokingcessation.repository.SubscriptionRepository;
import com.smokingcessation.repository.UserRepository;
import com.smokingcessation.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.TreeMap;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SubscriptionService {

    private final UserRepository userRepo;
    private final SubscriptionRepository subscriptionRepo;
    private final PaymentRepository paymentRepo;
    private final JwtUtil jwtUtil;
    
    @Value("${vnpay.tmnCode}")
    private String vnp_TmnCode;

    @Value("${vnpay.hashSecret}")
    private String vnp_HashSecret;

    @Value("${vnpay.payUrl}")
    private String vnp_PayUrl;

    @Value("${vnpay.returnUrl}")
    private String vnp_ReturnUrl;

    public String createSubscriptionAndPayment(String username, String clientIp) {
        User user = userRepo.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Tạo subscription mới
        Subscription sub = new Subscription();
        sub.setUser(user);
        sub.setStartDate(LocalDate.now());
        sub.setEndDate(LocalDate.now().plusMonths(1));
        sub.setPaymentStatus(Subscription.PaymentStatus.pending);
        subscriptionRepo.save(sub);

        // Tạo payment mới
        String txnId = UUID.randomUUID().toString().replace("-", "").substring(0, 10);
        Payment payment = new Payment();
        payment.setSubscription(sub);
        payment.setAmount(100_000.0);
        payment.setPaymentMethod("vnpay");
        payment.setTransactionId(txnId);
        payment.setStatus(Payment.PaymentStatus.pending);
        paymentRepo.save(payment);

        return buildVNPayUrl(payment, clientIp);
    }

    public void confirmPayment(String transactionId, String statusString) {
        Payment payment = paymentRepo.findByTransactionId(transactionId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy giao dịch"));

        Subscription sub = payment.getSubscription();

        // Convert String -> Enum safely
        Payment.PaymentStatus status;
        try {
            status = Payment.PaymentStatus.valueOf(statusString.toLowerCase());
        } catch (IllegalArgumentException e) {
            status = Payment.PaymentStatus.failed;
        }

        payment.setStatus(status);
        sub.setPaymentStatus(
                status == Payment.PaymentStatus.completed
                        ? Subscription.PaymentStatus.paid
                        : Subscription.PaymentStatus.failed
        );

        if (status == Payment.PaymentStatus.completed) {
            User user = sub.getUser();
            user.setHasActive(true);
            userRepo.save(user);
        }

        paymentRepo.save(payment);
        subscriptionRepo.save(sub);
    }

    public void confirmPaymentWithToken(String transactionId, String statusString, String token) {
        String email = jwtUtil.extractUsername(token);

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found from token"));

        Payment payment = paymentRepo.findByTransactionId(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        Subscription sub = payment.getSubscription();
        Payment.PaymentStatus status;

        try {
            status = Payment.PaymentStatus.valueOf(statusString.toLowerCase());
        } catch (IllegalArgumentException e) {
            status = Payment.PaymentStatus.failed;
        }

        payment.setStatus(status);
        sub.setPaymentStatus(status == Payment.PaymentStatus.completed
                ? Subscription.PaymentStatus.paid
                : Subscription.PaymentStatus.failed);

        if (status == Payment.PaymentStatus.completed) {
            user.setHasActive(true);
            userRepo.save(user);
        }

        paymentRepo.save(payment);
        subscriptionRepo.save(sub);
    }

    public LoginDTO confirmPaymentAndReturnUser(String transactionId, String statusString, String token) {
        String email = jwtUtil.extractUsername(token);

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found from token"));

        Payment payment = paymentRepo.findByTransactionId(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        Subscription sub = payment.getSubscription();

        Payment.PaymentStatus status;
        try {
            status = Payment.PaymentStatus.valueOf(statusString.toLowerCase());
        } catch (IllegalArgumentException e) {
            status = Payment.PaymentStatus.failed;
        }

        payment.setStatus(status);
        sub.setPaymentStatus(status == Payment.PaymentStatus.completed
                ? Subscription.PaymentStatus.paid
                : Subscription.PaymentStatus.failed);

        if (status == Payment.PaymentStatus.completed) {
            user.setHasActive(true);
            userRepo.save(user);
        }

        paymentRepo.save(payment);
        subscriptionRepo.save(sub);

        return new LoginDTO(
                null,
                user.getUserId(),
                user.getEmail(),
                user.getRole().name(),
                user.getIsVerified(),
                user.getProfileName(),
                user.getHasActive(),
                user.getAvatarUrl()
        );
    }

    private String buildVNPayUrl(Payment payment, String clientIp) {
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
            String createDate = formatter.format(java.time.LocalDateTime.now());

            TreeMap<String, String> vnpParams = new TreeMap<>();
            vnpParams.put("vnp_Version", "2.1.0");
            vnpParams.put("vnp_Command", "pay");
            vnpParams.put("vnp_TmnCode", vnp_TmnCode);
            vnpParams.put("vnp_Amount", "10000000"); // 100,000 * 100
            vnpParams.put("vnp_CurrCode", "VND");
            vnpParams.put("vnp_TxnRef", payment.getTransactionId());
            vnpParams.put("vnp_OrderInfo", "Thanh toán gói Premium");
            vnpParams.put("vnp_OrderType", "other");
            vnpParams.put("vnp_Locale", "vn");
            vnpParams.put("vnp_ReturnUrl", vnp_ReturnUrl + "?transaction_id=" + payment.getTransactionId());
            vnpParams.put("vnp_IpAddr", clientIp);
            vnpParams.put("vnp_CreateDate", createDate);

            StringBuilder hashData = new StringBuilder();
            for (var entry : vnpParams.entrySet()) {
                hashData.append(URLEncoder.encode(entry.getKey(), StandardCharsets.UTF_8)).append("=")
                        .append(URLEncoder.encode(entry.getValue(), StandardCharsets.UTF_8)).append("&");
            }
            hashData.deleteCharAt(hashData.length() - 1);

            String hmac = hmacSHA512(vnp_HashSecret, hashData.toString());
            return vnp_PayUrl + "?" + hashData + "&vnp_SecureHash=" + hmac;

        } catch (Exception e) {
            throw new RuntimeException("Không thể tạo VNPay URL", e);
        }
    }

    private String hmacSHA512(String key, String data) throws NoSuchAlgorithmException, InvalidKeyException {
        Mac hmac = Mac.getInstance("HmacSHA512");
        SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
        hmac.init(secretKey);
        byte[] bytes = hmac.doFinal(data.getBytes(StandardCharsets.UTF_8));
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) sb.append(String.format("%02x", b));
        return sb.toString();
    }
}
