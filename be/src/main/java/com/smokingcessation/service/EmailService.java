package com.smokingcessation.service;


import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendOtpEmail(String to, String otpCode, String purpose) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setTo(to);
        helper.setSubject("Your OTP for " + purpose);
        helper.setText("Your OTP code of smoking cessation is: <b>" + otpCode + "</b>. It is valid for 10 minutes.", true);
        mailSender.send(message);
    }

    // === thông báo nhắc nhở hằng ngày ===
    public void sendReminderEmail(String to, String username) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject("Remind to quit smoking");
            String content = "<p>Hello <b>" + username + "</b>,</p>"
                    + "<p>Remember to take note of your quitting process today and keep trying!</p>";
            helper.setText(content, true); // true để gửi email dạng HTML
            mailSender.send(message);
        } catch (MessagingException e) {
            // Có thể log lại lỗi hoặc throw lên tuỳ ý bạn
            e.printStackTrace();
        }
    }
}