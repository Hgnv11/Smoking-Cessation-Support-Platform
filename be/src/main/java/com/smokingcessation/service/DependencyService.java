package com.smokingcessation.service;

import com.smokingcessation.dto.res.DependencyAnswerDTO;
import com.smokingcessation.dto.res.DependencyQuestionDTO;
import com.smokingcessation.dto.res.UserDependencyResponseDTO;
import com.smokingcessation.dto.res.UserDependencyScoreDTO;
import com.smokingcessation.mapper.DependencyAnswerMapper;
import com.smokingcessation.mapper.DependencyQuestionMapper;
import com.smokingcessation.model.*;
import com.smokingcessation.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DependencyService {

    private final DependencyQuestionRepository questionRepository;
    private final UserRepository userRepository;
    private final DependencyAnswerRepository answerRepository;
    private final UserDependencyResponseRepository responseRepository;
    private final UserDependencyScoreRepository scoreRepository;
    private final UserSmokingProfileRepository smokingProfileRepository;
    private final DependencyQuestionMapper questionMapper;
    private final DependencyAnswerMapper answerMapper;


    public List<DependencyQuestionDTO> getQuestionsWithUserAnswers(Integer userId) {
        List<DependencyQuestion> questions = questionRepository.findAll();
        List<UserDependencyResponse> userResponses = responseRepository.findByUserUserId(userId);

        return questions.stream().map(question -> {
            DependencyQuestionDTO dto = questionMapper.toDto(question);
            List<DependencyAnswerDTO> answerDTOs = dto.getAnswers();

            // Đánh dấu câu trả lời đã chọn
            userResponses.stream()
                    .filter(response -> response.getQuestion().getQuestionId().equals(question.getQuestionId()))
                    .findFirst()
                    .ifPresent(response -> {
                        answerDTOs.forEach(answer -> {
                            if (answer.getAnswerId().equals(response.getAnswer().getAnswerId())) {
                                answer.setIsSelected(true);
                            }
                        });
                    });

            // Xử lý câu hỏi số 3 (số điếu thuốc mỗi ngày)
            if (question.getQuestionOrder() == 3) {
                smokingProfileRepository.findByUser_UserId(userId).ifPresent(profile -> {
                    int cigarettesPerDay = profile.getCigarettesPerDay();
                    int points = calculateCigarettesPerDayPoints(cigarettesPerDay);
                    answerDTOs.forEach(answer -> {
                        if (answer.getPoints() == points) {
                            answer.setIsSelected(true);
                        }
                    });
                });
            }

            return dto;
        }).collect(Collectors.toList());
    }

    @Transactional
    public UserDependencyResponseDTO saveResponse(String email, int questionId, int answerId) {
        // Lấy user từ DB
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Can't find user"));

        DependencyQuestion question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));
        DependencyAnswer answer = answerRepository.findById(answerId)
                .orElseThrow(() -> new RuntimeException("Answer not found"));
        if (!answer.getQuestion().getQuestionId().equals(question.getQuestionId())) {
            throw new RuntimeException("Answer does not belong to the given question");
        }

        // Kiểm tra xem đã có câu trả lời chưa
        UserDependencyResponse response = responseRepository
                .findByUserUserIdAndQuestionQuestionId(user.getUserId(), questionId)
                .orElse(new UserDependencyResponse());

        response.setUser(user); // Đặt user đúng từ DB
        response.setQuestion(question);
        response.setAnswer(answer);
        response = responseRepository.save(response);

        // Cập nhật điểm số
        updateUserScore(user.getUserId());

        return new UserDependencyResponseDTO(
                response.getResponseId(),
                response.getUser().getUserId(),
                response.getQuestion().getQuestionId(),
                response.getAnswer().getAnswerId(),
                response.getAnswer().getAnswerText(),
                response.getAnswer().getPoints()
        );
    }

    @Transactional
    public UserDependencyResponseDTO updateResponse(Integer responseId, Integer newAnswerId) {
        UserDependencyResponse response = responseRepository.findById(responseId)
                .orElseThrow(() -> new RuntimeException("Response not found"));

        DependencyAnswer newAnswer = answerRepository.findById(newAnswerId)
                .orElseThrow(() -> new RuntimeException("Answer not found"));

        response.setAnswer(newAnswer);
        response.setResponseDate(LocalDateTime.now());
        response = responseRepository.save(response);

        // ✅ Cập nhật điểm số
        updateUserScore(response.getUser().getUserId());

        return new UserDependencyResponseDTO(
                response.getResponseId(),
                response.getUser().getUserId(),
                response.getQuestion().getQuestionId(),
                response.getAnswer().getAnswerId(),
                response.getAnswer().getAnswerText(),
                response.getAnswer().getPoints()
        );
    }


    @Transactional
    public void deleteResponse(Integer responseId) {
        UserDependencyResponse response = responseRepository.findById(responseId)
                .orElseThrow(() -> new RuntimeException("Response not found"));
        Integer userId = response.getUser().getUserId();
        responseRepository.delete(response);

        // Cập nhật điểm số
        updateUserScore(userId);
    }

    public UserDependencyScoreDTO getUserScore(Integer userId) {
        UserDependencyScore score = scoreRepository.findByUserUserId(userId)
                .orElse(new UserDependencyScore());
        return new UserDependencyScoreDTO(
                score.getScoreId(),
                userId,
                score.getTotalScore(),
                score.getDependencyLevel() != null ? score.getDependencyLevel().name() : null
        );
    }

    private void updateUserScore(Integer userId) {
        List<UserDependencyResponse> responses = responseRepository.findByUserUserId(userId);
        int totalScore = responses.stream()
                .mapToInt(response -> response.getAnswer().getPoints())
                .sum();

        // Thêm điểm từ số điếu thuốc mỗi ngày
        Optional<UserSmokingProfile> profileOpt = smokingProfileRepository.findByUser_UserId(userId);
        if (profileOpt.isPresent()) {
            totalScore += calculateCigarettesPerDayPoints(profileOpt.get().getCigarettesPerDay());
        }

        // Xác định mức độ phụ thuộc
        UserDependencyScore.DependencyLevel level = determineDependencyLevel(totalScore);

        // Lưu hoặc cập nhật điểm số
        UserDependencyScore score = scoreRepository.findByUserUserId(userId)
                .orElse(new UserDependencyScore());
        score.setUser(User.builder().userId(userId).build());
        score.setTotalScore(totalScore);
        score.setDependencyLevel(level);
        scoreRepository.save(score);
    }

    private int calculateCigarettesPerDayPoints(int cigarettesPerDay) {
        if (cigarettesPerDay <= 10) return 0;
        if (cigarettesPerDay <= 20) return 1;
        if (cigarettesPerDay <= 30) return 2;
        return 3;
    }

    private UserDependencyScore.DependencyLevel determineDependencyLevel(int totalScore) {
        if (totalScore <= 2) return UserDependencyScore.DependencyLevel.very_low;
        if (totalScore <= 4) return UserDependencyScore.DependencyLevel.low;
        if (totalScore == 5) return UserDependencyScore.DependencyLevel.medium;
        if (totalScore <= 7) return UserDependencyScore.DependencyLevel.high;
        return UserDependencyScore.DependencyLevel.very_high;
    }
}