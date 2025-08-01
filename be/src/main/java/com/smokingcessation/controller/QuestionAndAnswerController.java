package com.smokingcessation.controller;

import com.smokingcessation.dto.res.DependencyQuestionDTO;
import com.smokingcessation.dto.res.UserDependencyResponseDTO;
import com.smokingcessation.dto.res.UserDependencyScoreDTO;
import com.smokingcessation.service.DependencyService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/question-answer")
public class QuestionAndAnswerController {

    @Autowired
    private DependencyService dependencyService;

    // Lấy danh sách câu hỏi và đáp án
    @GetMapping("/questions")
    public ResponseEntity<List<DependencyQuestionDTO>> getQuestionsWithAnswers(@RequestParam Integer userId) {
        List<DependencyQuestionDTO> questions = dependencyService.getQuestionsWithUserAnswers(userId);
        return ResponseEntity.ok(questions);
    }

    // Lưu câu trả lời
    @PostMapping("/answer")
    public ResponseEntity<UserDependencyResponseDTO> saveResponse(Principal principal, @RequestParam int questionId, @RequestParam int answerId) {
        UserDependencyResponseDTO response = dependencyService.saveResponse(principal.getName(), questionId, answerId);
        return ResponseEntity.ok(response);
    }

    // Cập nhật câu trả lời
    @PutMapping("/update/{userQuestionAndAnswer_Id}")
    public ResponseEntity<UserDependencyResponseDTO> updateResponse(
            @PathVariable Integer userQuestionAndAnswer_Id,
            @RequestParam Integer answerId) {
        UserDependencyResponseDTO response = dependencyService.updateResponse(userQuestionAndAnswer_Id, answerId);
        return ResponseEntity.ok(response);
    }


    // Xóa câu trả lời
    @DeleteMapping("/responses/{userQuestionAndAnswer_Id}")
    public void deleteResponse(@PathVariable Integer responseId) {
        dependencyService.deleteResponse(responseId);
    }

    // Lấy điểm số và mức độ phụ thuộc
    @GetMapping("/scores/{userId}")
    public ResponseEntity<UserDependencyScoreDTO> getUserScore(@PathVariable Integer userId) {
        UserDependencyScoreDTO score = dependencyService.getUserScore(userId);
        return ResponseEntity.ok(score);
    }
}
