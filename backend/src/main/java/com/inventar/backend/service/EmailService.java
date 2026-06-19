package com.inventar.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.frontend.url}")
    private String FRONTEND_URL;

    @Autowired
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendResetEmail(String toEmail, String token) {
        String resetLink = FRONTEND_URL + "/reset-password?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Obnova Vatroslav lozinke");
        message.setText("Ukoliko ste zatražili obnovu Vatroslav lozinke, molimo pritisnite na sljedeću poveznicu:\n" + resetLink +
                "\n\n Ako ovaj zahtjev niste zatražili, molimo zanemarite ovu poruku." +
                "\n Fakultet elektrotehnike i računarstva - Sveučilišta u Zagrebu");

        mailSender.send(message);
    }
}
