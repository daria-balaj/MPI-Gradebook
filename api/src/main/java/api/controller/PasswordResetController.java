package api.controller;

import api.service.PasswordResetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value="/api/reset-password", produces = MediaType.APPLICATION_JSON_VALUE)
public class PasswordResetController {
    @Autowired
    private PasswordResetService passwordResetService;

    @PostMapping("/request")
    public ResponseEntity<String> requestReset(@RequestParam String email) {
        return ResponseEntity.ok(passwordResetService.sendResetCode(email));
    }

    @PostMapping("/verify")
    public ResponseEntity<String> verifyCode(@RequestParam String email, @RequestParam String code) {
        if (passwordResetService.verifyResetCode(email, code)) {
            return ResponseEntity.ok("Code verified. Proceed to reset password.");
        } else {
            return ResponseEntity.badRequest().body("Invalid or expired reset code.");
        }
    }
    @PostMapping("/reset")
    public ResponseEntity<String> resetPassword(@RequestParam String email, @RequestParam String newPassword) {
        return ResponseEntity.ok(passwordResetService.resetPassword(email, newPassword));
    }

}