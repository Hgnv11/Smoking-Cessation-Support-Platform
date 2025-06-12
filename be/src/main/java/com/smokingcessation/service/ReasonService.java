package com.smokingcessation.service;

import com.smokingcessation.dto.res.ReasonDTO;
import com.smokingcessation.mapper.ReasonMapper;
import com.smokingcessation.model.ReasonsQuit;
import com.smokingcessation.model.User;
import com.smokingcessation.model.UserReasons;
import com.smokingcessation.repository.ReasonsQuitRepository;
import com.smokingcessation.repository.UserReasonsRepository;
import com.smokingcessation.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReasonService {

    private final ReasonsQuitRepository reasonsQuitRepository;
    private final UserReasonsRepository userReasonsRepository;
    private final UserRepository userRepository;
    private final ReasonMapper reasonMapper;

    public List<ReasonDTO> getAllReasons() {
        List<ReasonsQuit> reasons = reasonsQuitRepository.findAll();
        return reasonMapper.toReasonDTOList(reasons);
    }

    public void addReasonForUser(String email, Integer reasonId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        ReasonsQuit reason = reasonsQuitRepository.findById(reasonId)
                .orElseThrow(() -> new RuntimeException("Reason not found with ID: " + reasonId));

        if (userReasonsRepository.existsByUserUserIdAndReasonReasonId(user.getUserId(), reasonId)) {
            throw new RuntimeException("User already has this reason");
        }

        UserReasons userReasons = new UserReasons();
        UserReasons.UserReasonsId id = new UserReasons.UserReasonsId();
        id.setUserId(user.getUserId());
        id.setReasonId(reasonId);
        userReasons.setId(id);
        userReasons.setUser(user);
        userReasons.setReason(reason);

        userReasonsRepository.save(userReasons);
    }

    public List<ReasonDTO> getMyReasons(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        List<UserReasons> userReasons = userReasonsRepository.findByUser(user);
        return reasonMapper.toUserReasonDTOList(userReasons);
    }
}