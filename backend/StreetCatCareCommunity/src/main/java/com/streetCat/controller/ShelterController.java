package com.streetCat.controller;

import com.streetCat.service.ShelterService;
import com.streetCat.utils.JwtUtil;
import com.streetCat.utils.R;
import com.streetCat.vo.request.ShelterSaveRequest;
import com.streetCat.vo.response.ShelterResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ShelterController {
    private final ShelterService shelterService;

    @PostMapping("/shelters")
    public ResponseEntity<Object> register(@RequestHeader("Authorization") String token,@Valid @RequestBody ShelterSaveRequest request) {
        String userId = JwtUtil.parse(token.replace("Bearer ", ""));
        R<ShelterResponse> r = shelterService.saveShelter(userId,request);
        if(r.getData()==null){
            return ResponseEntity.status(r.getCode()).body(r.getMsg());
        }
        return ResponseEntity.status(r.getCode()).body(r.getData());
    }

    @GetMapping("/shelters")
    public ResponseEntity<Object> getShelters(@RequestHeader("Authorization") String token,@RequestParam(required = false) String keyword, @RequestParam(required = false) String status,
                                              @RequestParam(required = false) Double lat, @RequestParam(required = false) Double lng) {
        String userId = JwtUtil.parse(token.replace("Bearer ", ""));
        R<List<ShelterResponse>> r;
        if(lat==null || lng==null){
            r = shelterService.getShelters(userId,keyword, status);
        }
        else{
            r = shelterService.getShelters(userId,keyword, status, lat, lng);
        }
        if(r.getData()==null){
            return ResponseEntity.status(r.getCode()).body(r.getMsg());
        }
        return ResponseEntity.status(r.getCode()).body(r.getData());
    }

    @GetMapping("/shelters/{id}")
    public ResponseEntity<Object> getShelter(@RequestHeader("Authorization") String token,@PathVariable String id){
        String userId = JwtUtil.parse(token.replace("Bearer ", ""));
        R<ShelterResponse> r = shelterService.getShelter(userId,id);
        if(r.getData()==null){
            return ResponseEntity.status(r.getCode()).body(r.getMsg());
        }
        return ResponseEntity.status(r.getCode()).body(r.getData());
    }

    @PutMapping("/shelters/{id}")
    public ResponseEntity<Object> updateShelter(@RequestHeader("Authorization") String token,@PathVariable String id, @Valid @RequestBody ShelterSaveRequest request) {
        String userId = JwtUtil.parse(token.replace("Bearer ", ""));
        R<ShelterResponse> r = shelterService.updateShelter(userId,id,request);
        if(r.getData()==null){
            return ResponseEntity.status(r.getCode()).body(r.getMsg());
        }
        return ResponseEntity.status(r.getCode()).body(r.getData());
    }

    @DeleteMapping("/shelters/{id}")
    public ResponseEntity<Object> deleteShelter(@RequestHeader("Authorization") String token,@PathVariable String id) {
        String userId = JwtUtil.parse(token.replace("Bearer ", ""));
        R<Void> r = shelterService.deleteShelter(userId,id);
        return ResponseEntity.status(r.getCode()).body(r.getMsg());
    }
}
