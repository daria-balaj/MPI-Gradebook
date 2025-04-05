package api.service;

import api.model.User;
import api.repository.PasswordResetTokenRepository;
import api.repository.UserRepository;
import api.model.PasswordResetToken;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class PasswordResetService {

    @Autowired
    private EmailSenderService emailSenderService;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;
    @Transactional
    public String sendResetCode(String email) {
        String resetCode = emailSenderService.sendResetCode(email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        PasswordResetToken token = new PasswordResetToken(
                email,
                resetCode,
                LocalDateTime.now().plusMinutes(10),
                user
        );

        tokenRepository.save(token);
        return "Reset code sent to your email.";
    }
    @Transactional
    public boolean verifyResetCode(String email, String resetCode) {
        System.out.println("Verifying code for email: " + email + ", code: " + resetCode);

        Optional<PasswordResetToken> tokenOpt = tokenRepository.findByEmailAndResetCode(email, resetCode);

        if (tokenOpt.isEmpty()) {
            System.out.println("Code not found for email: " + email);
            return false;
        }

        PasswordResetToken token = tokenOpt.get();
        if (token.getExpiryDate().isBefore(LocalDateTime.now())) {
            System.out.println("Code expired for email: " + email);
            return false;
        }

        tokenRepository.deleteByEmail(email);
        return true;
    }
    @Transactional
    public String resetPassword(String email, String newPassword) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
            return "Password successfully reset.";
        }
        return "User not found.";
    }
}
