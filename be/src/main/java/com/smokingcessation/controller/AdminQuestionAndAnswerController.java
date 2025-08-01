package com.smokingcessation.controller;

import com.smokingcessation.dto.res.DependencyAnswerDTO;
import com.smokingcessation.dto.res.DependencyQuestionDTO;
import com.smokingcessation.model.DependencyAnswer;
import com.smokingcessation.model.DependencyQuestion;
import com.smokingcessation.service.DependencyAnswerService;
import com.smokingcessation.service.DependencyQuestionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "AdminQuestionAndAnswerController", description = "Quản lý câu hỏi và đáp án đánh giá mức độ phụ thuộc")
public class AdminQuestionAndAnswerController {

    private final DependencyQuestionService questionService;
    private final DependencyAnswerService answerService;

    // === QUESTION ENDPOINTS ===

    @Operation(summary = "Lấy tất cả câu hỏi", description = "Trả về danh sách toàn bộ câu hỏi đánh giá mức độ phụ thuộc.")
    @GetMapping("/questions")
    @PreAuthorize("permitAll()")
    public ResponseEntity<List<DependencyQuestionDTO>> getAllQuestions() {
        return ResponseEntity.ok(questionService.getAllQuestionDTOs());
    }

    @Operation(summary = "Lấy câu hỏi theo ID", description = "Trả về chi tiết nội dung 1 câu hỏi.")
    @GetMapping("/questions/{id}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<DependencyQuestionDTO> getQuestionById(@PathVariable Integer id) {
        return ResponseEntity.ok(questionService.getQuestionDTOById(id));
    }

    @Operation(summary = "Tạo câu hỏi mới", description = "Chỉ admin có quyền tạo câu hỏi mới.")
    @PostMapping("/questions")
    public ResponseEntity<DependencyQuestionDTO> createQuestion(@RequestBody DependencyQuestion question) {
        return ResponseEntity.ok(questionService.createQuestion(question));
    }

    @Operation(summary = "Cập nhật câu hỏi", description = "Cập nhật nội dung câu hỏi bằng questionId.")
    @PutMapping("/questions/{id}")
    public ResponseEntity<DependencyQuestionDTO> updateQuestion(
            @PathVariable Integer id,
            @RequestParam String newText) {
        return ResponseEntity.ok(questionService.updateQuestion(id, newText));
    }

    @Operation(summary = "Xóa câu hỏi", description = "Xóa câu hỏi theo ID. Lưu ý: sẽ xóa cả đáp án liên quan.")
    @DeleteMapping("/questions/{id}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Integer id) {
        questionService.deleteQuestion(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Lấy danh sách đáp án theo câu hỏi", description = "Trả về danh sách đáp án theo ID câu hỏi.")
    @GetMapping("/questions/{questionId}/answers")
    public ResponseEntity<List<DependencyAnswerDTO>> getAnswersByQuestionId(@PathVariable Integer questionId) {
        return ResponseEntity.ok(answerService.getAnswersByQuestionId(questionId));
    }

    @Operation(summary = "Lấy đáp án theo ID", description = "Trả về chi tiết đáp án theo ID.")
    @GetMapping("/answers/{answerId}")
    public ResponseEntity<DependencyAnswerDTO> getAnswerById(@PathVariable Integer answerId) {
        return ResponseEntity.ok(answerService.getAnswerDTOById(answerId));
    }

    // === ANSWER ENDPOINTS ===

    @Operation(summary = "Tạo đáp án cho câu hỏi", description = "Thêm 1 đáp án cho câu hỏi cụ thể (bằng questionId).")
    @PostMapping("/questions/{questionId}/answers")
    public ResponseEntity<DependencyAnswerDTO> createAnswer(
            @PathVariable Integer questionId,
            @RequestBody DependencyAnswer answer) {
        return ResponseEntity.ok(answerService.createAnswer(questionId, answer));
    }

    @Operation(summary = "Cập nhật đáp án", description = "Cập nhật nội dung & điểm của đáp án.")
    @PutMapping("/answers/{answerId}")
    public ResponseEntity<DependencyAnswerDTO> updateAnswer(
            @PathVariable Integer answerId,
            @RequestParam String newText,
            @RequestParam int newPoints) {
        return ResponseEntity.ok(answerService.updateAnswer(answerId, newText, newPoints));
    }

    @Operation(summary = "Xóa đáp án", description = "Xóa 1 đáp án bằng ID.")
    @DeleteMapping("/answers/{answerId}")
    public ResponseEntity<Void> deleteAnswer(@PathVariable Integer answerId) {
        answerService.deleteAnswer(answerId);
        return ResponseEntity.noContent().build();
    }
}
