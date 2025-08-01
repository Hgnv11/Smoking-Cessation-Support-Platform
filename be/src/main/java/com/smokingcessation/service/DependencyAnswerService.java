package com.smokingcessation.service;

import com.smokingcessation.dto.res.DependencyAnswerDTO;
import com.smokingcessation.model.DependencyAnswer;
import com.smokingcessation.model.DependencyQuestion;
import com.smokingcessation.repository.DependencyAnswerRepository;
import com.smokingcessation.repository.DependencyQuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DependencyAnswerService {

    private final DependencyAnswerRepository answerRepo;
    private final DependencyQuestionRepository questionRepo;

    public List<DependencyAnswerDTO> getAnswersByQuestionId(Integer questionId) {
        DependencyQuestion question = questionRepo.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));
        return question.getAnswers().stream()
                .map(this::toDTO)
                .toList();
    }

    public DependencyAnswerDTO getAnswerDTOById(Integer answerId) {
        DependencyAnswer ans = getAnswerById(answerId);
        return toDTO(ans);
    }

    public DependencyAnswerDTO createAnswer(Integer questionId, DependencyAnswer answer) {
        DependencyQuestion question = questionRepo.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));
        answer.setQuestion(question);
        DependencyAnswer saved = answerRepo.save(answer);
        return toDTO(saved);
    }

    public DependencyAnswerDTO updateAnswer(Integer answerId, String newText, Integer newPoints) {
        DependencyAnswer answer = getAnswerById(answerId);
        answer.setAnswerText(newText);
        answer.setPoints(newPoints);
        DependencyAnswer updated = answerRepo.save(answer);
        return toDTO(updated);
    }

    public void deleteAnswer(Integer answerId) {
        DependencyAnswer answer = getAnswerById(answerId);
        answerRepo.delete(answer);
    }

    private DependencyAnswer getAnswerById(Integer answerId) {
        return answerRepo.findById(answerId)
                .orElseThrow(() -> new RuntimeException("Answer not found"));
    }

    private DependencyAnswerDTO toDTO(DependencyAnswer ans) {
        return DependencyAnswerDTO.builder()
                .answerId(ans.getAnswerId())
                .answerText(ans.getAnswerText())
                .points(ans.getPoints())
                .isSelected(false)
                .build();
    }
}
