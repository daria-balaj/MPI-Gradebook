package api.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class EmailSenderService {
    @Autowired
    private JavaMailSender mailSender;

    public String sendResetCode(String toEmail) {
        String resetCode = generateRandomCode();

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("mail@gmail.com");
        message.setTo(toEmail);
        message.setSubject("Password Reset Code");
        message.setText("Your password reset code is: " + resetCode);

        mailSender.send(message);

        return resetCode;
    }

    private String generateRandomCode() {
        Random random = new Random();
        int code = 100000 + random.nextInt(900000);
        return String.valueOf(code);
    }
}
