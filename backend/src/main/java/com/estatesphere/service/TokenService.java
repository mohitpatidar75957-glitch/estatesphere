package com.estatesphere.service;

import com.estatesphere.model.User;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;

@Service
public class TokenService {

    private static final String SECRET = "EstateSphere_Luxury_Admin_Secret_Key_2026_@!";
    private static final long EXPIRY_DEFAULT = 24 * 60 * 60 * 1000L; // 24 hours
    private static final long EXPIRY_REMEMBER = 30L * 24 * 60 * 60 * 1000L; // 30 days

    public String generateToken(User user, boolean rememberMe) {
        long duration = rememberMe ? EXPIRY_REMEMBER : EXPIRY_DEFAULT;
        long expiry = System.currentTimeMillis() + duration;
        String payload = user.getId() + ":" + user.getEmail() + ":" + user.getRole().name() + ":" + expiry;
        String encodedPayload = Base64.getUrlEncoder().withoutPadding().encodeToString(payload.getBytes(StandardCharsets.UTF_8));
        String signature = sign(encodedPayload);
        return encodedPayload + "." + signature;
    }

    public TokenPayload validateAndExtract(String token) {
        if (token == null || !token.contains(".")) {
            return null;
        }
        try {
            String[] parts = token.split("\\.");
            if (parts.length != 2) return null;
            String encodedPayload = parts[0];
            String expectedSig = parts[1];

            if (!MessageDigest.isEqual(sign(encodedPayload).getBytes(StandardCharsets.UTF_8), expectedSig.getBytes(StandardCharsets.UTF_8))) {
                return null;
            }

            String decoded = new String(Base64.getUrlDecoder().decode(encodedPayload), StandardCharsets.UTF_8);
            String[] fields = decoded.split(":");
            if (fields.length < 4) return null;

            Long userId = Long.parseLong(fields[0]);
            String email = fields[1];
            String role = fields[2];
            long expiry = Long.parseLong(fields[3]);

            if (System.currentTimeMillis() > expiry) {
                return null; // Expired
            }

            return new TokenPayload(userId, email, role);
        } catch (Exception e) {
            return null;
        }
    }

    private String sign(String data) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(SECRET.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            byte[] rawHmac = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(rawHmac);
        } catch (Exception e) {
            throw new RuntimeException("HMAC signing failed", e);
        }
    }

    public static class TokenPayload {
        private final Long userId;
        private final String email;
        private final String role;

        public TokenPayload(Long userId, String email, String role) {
            this.userId = userId;
            this.email = email;
            this.role = role;
        }

        public Long getUserId() { return userId; }
        public String getEmail() { return email; }
        public String getRole() { return role; }
    }
}
