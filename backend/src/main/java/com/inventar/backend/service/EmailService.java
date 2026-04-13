package com.inventar.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Autowired
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    private static final String FRONTEND_DEV_URL = "http://localhost:5173";

    public void sendResetEmail(String toEmail, String token) {
        String resetLink = FRONTEND_DEV_URL + "/reset-password?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Password Reset Request");
        message.setText("Click the link to reset your password:\n" + resetLink +
                "\n\nThis link expires in 15 minutes.");

        mailSender.send(message);
    }
}
