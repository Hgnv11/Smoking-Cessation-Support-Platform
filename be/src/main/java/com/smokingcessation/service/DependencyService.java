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

            Optional<UserDependencyResponse> userResponse = userResponses.stream()
                    .filter(response -> response.getQuestion().getQuestionId().equals(question.getQuestionId()))
                    .findFirst();

            answerDTOs.forEach(answer -> {
                if (userResponse.isPresent() &&
                        answer.getAnswerId().equals(userResponse.get().getAnswer().getAnswerId())) {
                    answer.setIsSelected(true);
                    answer.setResponseId(userResponse.get().getResponseId());
                } else {
                    answer.setIsSelected(false);
                    answer.setResponseId(null);
                }
            });

            return dto;
        }).collect(Collectors.toList());
    }


    @Transactional
    public UserDependencyResponseDTO saveResponse(String email, int questionId, int answerId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Can't find user"));

        DependencyQuestion question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));
        DependencyAnswer answer = answerRepository.findById(answerId)
                .orElseThrow(() -> new RuntimeException("Answer not found"));
        if (!answer.getQuestion().getQuestionId().equals(question.getQuestionId())) {
            throw new RuntimeException("Answer does not belong to the given question");
        }

        UserDependencyResponse response = responseRepository
                .findByUserUserIdAndQuestionQuestionId(user.getUserId(), questionId)
                .orElse(new UserDependencyResponse());

        response.setUser(user);
        response.setQuestion(question);
        response.setAnswer(answer);
        response = responseRepository.save(response);

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

        // Tính thêm điểm từ số điếu thuốc mỗi ngày (không cần tạo câu hỏi riêng)
        int smokingPoints = smokingProfileRepository.findByUser_UserId(userId)
                .map(profile -> calculateCigarettesPerDayPoints(profile.getCigarettesPerDay()))
                .orElse(0);

        totalScore += smokingPoints;

        UserDependencyScore.DependencyLevel level = determineDependencyLevel(totalScore);

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
