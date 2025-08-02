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
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

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
        List<UserDependencyResponse> userResponses = responseRepository.findByUser_UserId(userId);

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
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        DependencyQuestion question = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Question not found"));

        DependencyAnswer answer = answerRepository.findById(answerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Answer not found"));

        if (!answer.getQuestion().getQuestionId().equals(question.getQuestionId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Answer does not belong to the given question");
        }

        UserDependencyResponse response = responseRepository
                .findByUser_UserIdAndQuestion_QuestionId(user.getUserId(), questionId)
                .orElse(new UserDependencyResponse());

        response.setUser(user);
        response.setQuestion(question);
        response.setAnswer(answer);
        response.setResponseDate(LocalDateTime.now());
        response = responseRepository.save(response);

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
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Response not found"));

        DependencyAnswer newAnswer = answerRepository.findById(newAnswerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Answer not found"));

        if (!newAnswer.getQuestion().getQuestionId().equals(response.getQuestion().getQuestionId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "New answer does not belong to the same question");
        }

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
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Response not found"));
        Integer userId = response.getUser().getUserId();
        responseRepository.delete(response);

        updateUserScore(userId);
    }

    public UserDependencyScoreDTO getUserScore(Integer userId) {
        updateUserScore(userId);

        UserDependencyScore score = scoreRepository.findTopByUserUserIdOrderByAssessmentDateDesc(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No score found for user"));

        return new UserDependencyScoreDTO(
                score.getScoreId(),
                userId,
                score.getTotalScore(),
                score.getDependencyLevel() != null ? score.getDependencyLevel().name() : "very_low"
        );
    }


    @Transactional
    private void updateUserScore(Integer userId) {
        List<UserDependencyResponse> responses = responseRepository.findByUser_UserId(userId);

        if (responses.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "User has not answered any question yet");
        }

        int totalScore = responses.stream()
                .mapToInt(response -> {
                    Integer points = response.getAnswer().getPoints();
                    if (points == null) {
                        throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                                "Invalid answer points");
                    }
                    return points;
                })
                .sum();

        int smokingPoints = smokingProfileRepository.findByUser_UserId(userId)
                .filter(profile -> profile.getStatus().equals("active"))
                .map(profile -> {
                    Integer cigarettesPerDay = profile.getCigarettesPerDay();
                    if (cigarettesPerDay == null || cigarettesPerDay < 0) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid cigarettes per day value");
                    }
                    return calculateCigarettesPerDayPoints(cigarettesPerDay);
                })
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Active smoking profile is required to calculate score"));

        totalScore += smokingPoints;

        int maxPossibleScore = calculateMaxPossibleScore();
        if (totalScore < 0 || totalScore > maxPossibleScore) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Calculated score is out of valid range");
        }

        UserDependencyScore.DependencyLevel level = determineDependencyLevel(totalScore);

        UserDependencyScore score = scoreRepository.findTopByUserUserIdOrderByAssessmentDateDesc(userId)
                .orElse(new UserDependencyScore());

        score.setUser(User.builder().userId(userId).build());
        score.setTotalScore(totalScore);
        score.setDependencyLevel(level);
        score.setAssessmentDate(LocalDateTime.now());
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

    private int calculateMaxPossibleScore() {
        List<DependencyQuestion> questions = questionRepository.findAll();
        int maxScore = questions.stream()
                .mapToInt(question -> question.getAnswers().stream()
                        .mapToInt(DependencyAnswer::getPoints)
                        .max()
                        .orElse(0))
                .sum();
        maxScore += 3;
        return maxScore;
    }

    public List<DependencyQuestionDTO> getPublicQuestions() {
        List<DependencyQuestion> questions = questionRepository.findAll();

        return questions.stream()
                .map(question -> {
                    DependencyQuestionDTO dto = questionMapper.toDto(question);
                    dto.getAnswers().forEach(answer -> {
                        answer.setIsSelected(false);
                        answer.setResponseId(null);
                    });
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteAllByUserId(Integer userId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        if (!user.getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only delete your own responses");
        }

        responseRepository.deleteByUser_UserId(userId);
        scoreRepository.findTopByUserUserIdOrderByAssessmentDateDesc(userId)
                .ifPresent(scoreRepository::delete);
    }
}