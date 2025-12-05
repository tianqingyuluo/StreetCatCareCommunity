package com.streetCat.controller;

import com.streetCat.service.StaffService;
import com.streetCat.utils.JwtUtil;
import com.streetCat.utils.R;
import com.streetCat.vo.request.StaffSaveRequest;
import com.streetCat.vo.response.StaffResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class StaffController {
    private final StaffService staffService;

    @PostMapping("/staffs")
    public ResponseEntity<Object> CreateEmployeeFile(@RequestHeader("Authorization") String token,@RequestBody StaffSaveRequest request) {
        String userId = JwtUtil.parse(token.replace("Bearer ", ""));
        R<StaffResponse> r = staffService.staffSaveRequest(userId,request);
        if(r.getData()==null){
            return ResponseEntity.status(r.getCode()).body(r.getMsg());
        }
        return ResponseEntity.status(r.getCode()).body(r.getData());
    }

    @GetMapping("/staffs")
    public ResponseEntity<Object> SearchEmployeesFiles(
            @RequestHeader("Authorization") String token,
            @RequestParam(required = false) String shelterId,
            @RequestParam int page,
            @RequestParam int size) {
        String userId = JwtUtil.parse(token.replace("Bearer ", ""));
        R<Map<String, Object>> r;
        if(shelterId==null){
            r = staffService.getStaffs(userId,page, size);
        }
        else{
            r = staffService.getStaffs(userId,shelterId, page, size);
        }
        if(r.getData()==null){
            return ResponseEntity.status(r.getCode()).body(r.getMsg());
        }
        return ResponseEntity.status(r.getCode()).body(r.getData());
    }

    @GetMapping("/staffs/{id}")
    public ResponseEntity<Object> SearchEmployeeFile(@RequestHeader("Authorization") String token,@PathVariable String id) {
        String userId = JwtUtil.parse(token.replace("Bearer ", ""));
        R<StaffResponse> r = staffService.getStaff(userId,id);
        if(r.getData()==null){
            return ResponseEntity.status(r.getCode()).body(r.getMsg());
        }
        return ResponseEntity.status(r.getCode()).body(r.getData());
    }

    @PatchMapping("/staffs/{staffId}/status")
    public ResponseEntity<Object> updateStaffStatus(@RequestHeader("Authorization") String token,@PathVariable String staffId, @RequestBody Map<String,String> status) {
        String userId = JwtUtil.parse(token.replace("Bearer ", ""));
        R<Void> r = staffService.patchStaff(userId,staffId,status);
        return ResponseEntity.status(r.getCode()).body(r.getMsg());
    }

    @DeleteMapping("/staffs/{staffId}")
    public ResponseEntity<Object> deleteStaff(@RequestHeader("Authorization") String token,@PathVariable String staffId) {
        String userId = JwtUtil.parse(token.replace("Bearer ", ""));
        R<Void> r = staffService.deleteStaff(userId,staffId);
        return ResponseEntity.status(r.getCode()).body(r.getMsg());
    }
}
