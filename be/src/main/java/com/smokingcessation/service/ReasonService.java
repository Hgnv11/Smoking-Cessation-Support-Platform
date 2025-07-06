package com.smokingcessation.service;

import com.smokingcessation.dto.res.ReasonDTO;
import com.smokingcessation.mapper.ReasonMapper;
import com.smokingcessation.model.ReasonsQuit;
import com.smokingcessation.model.User;
import com.smokingcessation.model.UserReasons;
import com.smokingcessation.repository.ReasonsQuitRepository;
import com.smokingcessation.repository.UserReasonsRepository;
import com.smokingcessation.repository.UserRepository;
import jakarta.transaction.Transactional;
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
        List<ReasonsQuit> reasons = reasonsQuitRepository.findAllByIsActiveTrue();
        return reasonMapper.toReasonDTOList(reasons);
    }

    public void addMultipleReasonsForUser(String email, List<Integer> reasonIds) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        for (Integer reasonId : reasonIds) {
            ReasonsQuit reason = reasonsQuitRepository.findById(reasonId)
                    .orElseThrow(() -> new RuntimeException("Reason not found with ID: " + reasonId));

            if (!reason.getIsActive()) {
                continue; // Bỏ qua nếu lý do không active
            }

            boolean alreadyExists = userReasonsRepository.existsByUserUserIdAndReasonReasonId(user.getUserId(), reasonId);
            if (alreadyExists) {
                continue; // Bỏ qua nếu lý do đã tồn tại cho người dùng
            }

            UserReasons userReason = new UserReasons();
            UserReasons.UserReasonsId id = new UserReasons.UserReasonsId();
            id.setUserId(user.getUserId());
            id.setReasonId(reasonId);

            userReason.setId(id);
            userReason.setUser(user);
            userReason.setReason(reason);

            userReasonsRepository.save(userReason);
        }
    }

    public List<ReasonDTO> getMyReasons(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        List<UserReasons> userReasons = userReasonsRepository.findByUser(user);
        return reasonMapper.toUserReasonDTOList(userReasons);
    }

    public List<ReasonDTO> getMyReasonsbyUserId(Integer UserId) {
        User user = userRepository.findByUserId(UserId)
                .orElseThrow(() -> new RuntimeException("User not found with userId: " +UserId ));

        List<UserReasons> userReasons = userReasonsRepository.findByUser(user);
        return reasonMapper.toUserReasonDTOList(userReasons);
    }

    public ReasonDTO createReason(ReasonDTO reasonDTO) {
        if (reasonDTO.getReasonText() == null || reasonDTO.getReasonText().trim().isEmpty()) {
            throw new RuntimeException("Reason text cannot be empty");
        }

        ReasonsQuit existingReason = reasonsQuitRepository.findByReasonText(reasonDTO.getReasonText());
        if (existingReason != null) {
            throw new RuntimeException("Reason with text '" + reasonDTO.getReasonText() + "' already exists");
        }

        ReasonsQuit reason = reasonMapper.toReasonsQuit(reasonDTO);
        reason.setIsActive(reasonDTO.getIsActive() != null ? reasonDTO.getIsActive() : true);
        ReasonsQuit savedReason = reasonsQuitRepository.save(reason);

        return reasonMapper.toReasonDTO(savedReason);
    }

    public ReasonDTO updateReason(Integer reasonId, ReasonDTO reasonDTO) {
        ReasonsQuit reason = reasonsQuitRepository.findById(reasonId)
                .orElseThrow(() -> new RuntimeException("Reason not found with ID: " + reasonId));

        if (reasonDTO.getReasonText() == null || reasonDTO.getReasonText().trim().isEmpty()) {
            throw new RuntimeException("Reason text cannot be empty");
        }

        ReasonsQuit existingReason = reasonsQuitRepository.findByReasonText(reasonDTO.getReasonText());
        if (existingReason != null && !existingReason.getReasonId().equals(reasonId)) {
            throw new RuntimeException("Reason with text '" + reasonDTO.getReasonText() + "' already exists");
        }

        reason.setReasonText(reasonDTO.getReasonText());
        reason.setIsActive(reasonDTO.getIsActive() != null ? reasonDTO.getIsActive() : reason.getIsActive());
        ReasonsQuit updatedReason = reasonsQuitRepository.save(reason);

        return reasonMapper.toReasonDTO(updatedReason);
    }

    public void deleteReason(Integer reasonId) {
        ReasonsQuit reason = reasonsQuitRepository.findById(reasonId)
                .orElseThrow(() -> new RuntimeException("Reason not found with ID: " + reasonId));

        if (!reason.getIsActive()) {
            throw new RuntimeException("Reason with ID " + reasonId + " is already inactive");
        }

        reason.setIsActive(false);
        reasonsQuitRepository.save(reason);
    }

    @Transactional
    public void deleteAllReasonsByUserId(Integer userId) {
        if (!userRepository.existsByUserId(userId)) {
            throw new RuntimeException("User không tồn tại với ID: " + userId);
        }
        userReasonsRepository.deleteAllByUser_UserId(userId);
    }
}
