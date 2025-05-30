// repository/OtpRepository.java
package com.smokingcessation.repository;

import com.smokingcessation.model.OtpToken;
import com.smokingcessation.model.OtpToken;
import com.smokingcessation.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.Optional;
public interface OtpTokenRepository extends JpaRepository<OtpToken, Integer> {
    Optional<OtpToken> findByOtpCodeAndPurposeAndIsUsedFalse(String otpCode, OtpToken.Purpose purpose);
}