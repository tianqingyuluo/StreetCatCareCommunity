package com.streetCat.controller;

import com.streetCat.service.ShelterService;
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
    public ResponseEntity<Object> register(@Valid @RequestBody ShelterSaveRequest request) {
        R<ShelterResponse> r = shelterService.saveShelter(request);
        if(r.getData()==null){
            return ResponseEntity.status(r.getCode()).body(r.getMsg());
        }
        return ResponseEntity.status(r.getCode()).body(r.getData());
    }

    @GetMapping("/shelters")
    public ResponseEntity<Object> getShelters(@RequestParam(required = false) String keyword, @RequestParam(required = false) String status,
                                              @RequestParam(required = false) Double lat, @RequestParam(required = false) Double lng) {
        R<List<ShelterResponse>> r;
        if(lat==null || lng==null){
            r = shelterService.getShelters(keyword, status);
        }
        else{
            r = shelterService.getShelters(keyword, status, lat, lng);
        }
        if(r.getData()==null){
            return ResponseEntity.status(r.getCode()).body(r.getMsg());
        }
        return ResponseEntity.status(r.getCode()).body(r.getData());
    }

    @GetMapping("/shelters/{id}")
    public ResponseEntity<Object> getShelter(@PathVariable String id){
        R<ShelterResponse> r = shelterService.getShelter(id);
        if(r.getData()==null){
            return ResponseEntity.status(r.getCode()).body(r.getMsg());
        }
        return ResponseEntity.status(r.getCode()).body(r.getData());
    }

    @PutMapping("/shelters/{id}")
    public ResponseEntity<Object> updateShelter(@PathVariable String id, @Valid @RequestBody ShelterSaveRequest request) {
        R<ShelterResponse> r = shelterService.updateShelter(id,request);
        if(r.getData()==null){
            return ResponseEntity.status(r.getCode()).body(r.getMsg());
        }
        return ResponseEntity.status(r.getCode()).body(r.getData());
    }

    @DeleteMapping("/shelters/{id}")
    public ResponseEntity<Object> deleteShelter(@PathVariable String id) {
        R<Void> r = shelterService.deleteShelter(id);
               return ResponseEntity.status(r.getCode()).body(r.getMsg());
    }
}
