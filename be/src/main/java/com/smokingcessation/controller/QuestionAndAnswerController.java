package com.smokingcessation.controller;

import com.smokingcessation.dto.res.DependencyQuestionDTO;
import com.smokingcessation.dto.res.UserDependencyResponseDTO;
import com.smokingcessation.dto.res.UserDependencyScoreDTO;
import com.smokingcessation.service.DependencyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
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

    @Operation(summary = "Lấy danh sách câu hỏi và câu trả lời của người dùng isSelected = true là đáp án user chọn, isSelected = false là đáp án user không chọn")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lấy danh sách thành công"),
            @ApiResponse(responseCode = "400", description = "Tham số không hợp lệ")
    })
    @GetMapping("/questions")
    public ResponseEntity<List<DependencyQuestionDTO>> getQuestionsWithAnswers(
            @Parameter(description = "ID người dùng") @RequestParam Integer userId) {
        List<DependencyQuestionDTO> questions = dependencyService.getQuestionsWithUserAnswers(userId);
        return ResponseEntity.ok(questions);
    }

    @Operation(summary = "user trả lời câu hỏi bằng cách chọn đáp án và lưu bằng cách id đáp án + id của người dùng")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lưu thành công"),
            @ApiResponse(responseCode = "400", description = "Dữ liệu không hợp lệ")
    })
    @PostMapping("/answer")
    public ResponseEntity<UserDependencyResponseDTO> saveResponse(
            @Parameter(hidden = true) Principal principal,
            @Parameter(description = "ID câu hỏi") @RequestParam int questionId,
            @Parameter(description = "ID câu trả lời") @RequestParam int answerId) {
        UserDependencyResponseDTO response = dependencyService.saveResponse(principal.getName(), questionId, answerId);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Cập nhật câu trả lời của người dùng")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Cập nhật thành công"),
            @ApiResponse(responseCode = "404", description = "Không tìm thấy câu trả lời")
    })
    @PutMapping("/update")
    public ResponseEntity<UserDependencyResponseDTO> updateResponse(
            @Parameter(description = "ID câu trả lời người dùng") @RequestParam Integer responseId,
            @Parameter(description = "ID câu trả lời mới") @RequestParam Integer answerId) {
        UserDependencyResponseDTO response = dependencyService.updateResponse(responseId, answerId);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Xóa câu trả lời của người dùng")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Xóa thành công"),
            @ApiResponse(responseCode = "404", description = "Không tìm thấy câu trả lời")
    })
    @DeleteMapping("/responses")
    public void deleteResponse(
            @Parameter(description = "ID câu trả lời người dùng") @RequestParam Integer responseId) {
        dependencyService.deleteResponse(responseId);
    }

    @Operation(summary = "Lấy điểm và đánh giá mức độ nghiện")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lấy điểm thành công"),
            @ApiResponse(responseCode = "404", description = "Không tìm thấy người dùng")
    })
    @GetMapping("/scores/{userId}")
    public ResponseEntity<UserDependencyScoreDTO> getUserScore(
            @Parameter(description = "ID người dùng") @PathVariable Integer userId) {
        UserDependencyScoreDTO score = dependencyService.getUserScore(userId);
        return ResponseEntity.ok(score);
    }

    @Operation(summary = "Lấy danh sách câu hỏi công khai (chưa đăng nhập)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lấy danh sách thành công")
    })
    @GetMapping("/public")
    public ResponseEntity<List<DependencyQuestionDTO>> getPublicQuestions() {
        List<DependencyQuestionDTO> questions = dependencyService.getPublicQuestions();
        return ResponseEntity.ok(questions);
    }

    @DeleteMapping("/responses/all")
    @Operation(summary = "Xóa toàn bộ câu trả lời của một user")
    public ResponseEntity<?> deleteAllResponsesByUserId(@RequestParam Integer userId, Principal principal) {
        dependencyService.deleteAllByUserId(userId, principal.getName());
        return ResponseEntity.ok("Deleted all responses for userId = " + userId);
    }


}
