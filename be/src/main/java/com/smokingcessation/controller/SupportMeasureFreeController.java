package com.smokingcessation.controller;

import com.smokingcessation.model.SupportMeasure;
import com.smokingcessation.service.SupportMeasureService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/support-measures")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Support Measures", description = "CRUD biện pháp hỗ trợ cai thuốc (dành cho Admin)")
public class SupportMeasureFreeController {

    private final SupportMeasureService service;

    @Operation(summary = "Lấy tất cả biện pháp hỗ trợ")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lấy danh sách thành công")
    })
    @GetMapping
    public List<SupportMeasure> getAll() {
        return service.getAll();
    }

    @Operation(summary = "Lấy thông tin một biện pháp theo ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Tìm thấy biện pháp"),
            @ApiResponse(responseCode = "404", description = "Không tìm thấy")
    })
    @GetMapping("/{id}")
    public SupportMeasure getById(
            @Parameter(description = "ID biện pháp hỗ trợ") @PathVariable Integer id) {
        return service.getById(id);
    }

    @Operation(summary = "Tạo biện pháp hỗ trợ mới")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Tạo thành công"),
            @ApiResponse(responseCode = "400", description = "Dữ liệu không hợp lệ")
    })
    @PostMapping
    public SupportMeasure create(
            @Parameter(description = "Dữ liệu biện pháp mới") @RequestBody SupportMeasure supportMeasure) {
        return service.create(supportMeasure);
    }

    @Operation(summary = "Cập nhật biện pháp hỗ trợ")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Cập nhật thành công"),
            @ApiResponse(responseCode = "404", description = "Không tìm thấy")
    })
    @PutMapping("/{id}")
    public SupportMeasure update(
            @Parameter(description = "ID biện pháp hỗ trợ") @PathVariable Integer id,
            @Parameter(description = "Dữ liệu cập nhật") @RequestBody SupportMeasure updateData) {
        return service.update(id, updateData);
    }

    @Operation(summary = "Xóa biện pháp hỗ trợ")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Xóa thành công"),
            @ApiResponse(responseCode = "404", description = "Không tìm thấy")
    })
    @DeleteMapping("/{id}")
    public void delete(
            @Parameter(description = "ID biện pháp hỗ trợ") @PathVariable Integer id) {
        service.delete(id);
    }
}
