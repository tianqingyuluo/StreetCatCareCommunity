package com.streetCat.controller;

import com.streetCat.service.AdoptionService;
import com.streetCat.utils.JwtUtil;
import com.streetCat.vo.request.AdoptionRequest;
import com.streetCat.vo.request.AdoptionStatusRequest;
import com.streetCat.vo.response.AdoptionResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/adoptions")
public class AdoptionController {

    @Autowired
    private AdoptionService adoptionService;

    @PostMapping
    public ResponseEntity<?> createAdoption(@RequestHeader("Authorization") String token, @RequestBody AdoptionRequest content) {
        String userId = JwtUtil.parse(token.replace("Bearer ", ""));
        AdoptionResponse adoptionResponse=new AdoptionResponse();
        try {
            adoptionResponse = adoptionService.createAdoption(content, Long.valueOf(userId));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
        return ResponseEntity.ok(adoptionResponse);
    }

    @GetMapping
    public ResponseEntity<List<AdoptionResponse>> listAdoptions(
            @RequestHeader("Authorization") String token,
            @RequestParam(value = "catId", required = false) String catId,
            @RequestParam(value = "shelterId", required = false) String shelterId,
            @RequestParam(value = "status", required = false) String status) {
        String userId = JwtUtil.parse(token.replace("Bearer ", ""));
        List<AdoptionResponse> adoptionResponses=new ArrayList<>();
        adoptionResponses =  adoptionService.listAdoptions(Long.valueOf(catId), Long.valueOf(shelterId), status, Long.valueOf(userId));
        return ResponseEntity.ok(adoptionResponses);
    }

    @GetMapping("/{id}")
    public AdoptionResponse getAdoption(@PathVariable Long id) {
        return adoptionService.getAdoption(id);
    }

    @PatchMapping("/{id}/status")
    public String updateAdoptionStatus(@RequestHeader("Authorization") String token,@PathVariable Long id, @RequestBody AdoptionStatusRequest updateReq) {

        String userId = JwtUtil.parse(token.replace("Bearer ", ""));
        return adoptionService.updateAdoptionStatus(id, updateReq, Long.valueOf(userId));
    }

    @PostMapping("/{id}/contract")
    public String uploadContract(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        return adoptionService.uploadContract(id, file);
    }
}