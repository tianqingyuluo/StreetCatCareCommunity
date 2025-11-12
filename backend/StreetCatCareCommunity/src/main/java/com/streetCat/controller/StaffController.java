package com.streetCat.controller;

import com.streetCat.service.StaffService;
import com.streetCat.vo.request.StaffSaveRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class StaffController {
    private final StaffService staffService;

    @PostMapping("/staffs")
    public ResponseEntity<Object> CreateEmployeeFile(@RequestBody StaffSaveRequest request) {
        return ResponseEntity.ok(null);
    }

    @GetMapping("/staffs")
    public ResponseEntity<Object> SearchEmployeesFile(
            @RequestParam long shelterId,
            @RequestParam int page,
            @RequestParam int pageSize,
            @RequestParam int size) {
        return ResponseEntity.ok(null);
    }

    @GetMapping("/staffs/me")
    public ResponseEntity<Object> SearchEmployeeFile() {
        return ResponseEntity.ok(null);
    }
}
