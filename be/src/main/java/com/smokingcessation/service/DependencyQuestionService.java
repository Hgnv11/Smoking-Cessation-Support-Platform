package com.smokingcessation.service;

import com.smokingcessation.dto.res.DependencyAnswerDTO;
import com.smokingcessation.dto.res.DependencyQuestionDTO;
import com.smokingcessation.model.DependencyAnswer;
import com.smokingcessation.model.DependencyQuestion;
import com.smokingcessation.repository.DependencyAnswerRepository;
import com.smokingcessation.repository.DependencyQuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DependencyQuestionService {

    private final DependencyQuestionRepository questionRepo;
    private final DependencyAnswerRepository answerRepo;

    public List<DependencyQuestionDTO> getAllQuestionDTOs() {
        List<DependencyQuestion> entities = questionRepo.findAll();
        return entities.stream().map(this::toDTO).toList();
    }

    public DependencyQuestionDTO getQuestionDTOById(Integer id) {
        DependencyQuestion question = getQuestionById(id);
        return toDTO(question);
    }

    public DependencyQuestionDTO createQuestion(DependencyQuestion question) {
        DependencyQuestion saved = questionRepo.save(question);
        return toDTO(saved);
    }

    public DependencyQuestionDTO updateQuestion(Integer id, String newText) {
        DependencyQuestion q = getQuestionById(id);
        q.setQuestionText(newText);
        DependencyQuestion updated = questionRepo.save(q);
        return toDTO(updated);
    }

    public void deleteQuestion(Integer id) {
        DependencyQuestion q = getQuestionById(id);
        questionRepo.delete(q);
    }

    private DependencyQuestion getQuestionById(Integer id) {
        return questionRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found"));
    }

    private DependencyQuestionDTO toDTO(DependencyQuestion question) {
        List<DependencyAnswerDTO> answerDTOs = Optional.ofNullable(question.getAnswers())
                .orElse(List.of())
                .stream()
                .map(ans -> DependencyAnswerDTO.builder()
                        .answerId(ans.getAnswerId())
                        .answerText(ans.getAnswerText())
                        .points(ans.getPoints())
                        .isSelected(false)
                        .build())
                .toList();

        return new DependencyQuestionDTO(
                question.getQuestionId(),
                question.getQuestionText(),
                answerDTOs
        );
    }
}
