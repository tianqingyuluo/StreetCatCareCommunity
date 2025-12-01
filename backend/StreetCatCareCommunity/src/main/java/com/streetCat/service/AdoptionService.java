package com.streetCat.service;

import com.streetCat.pojo.Adoption;
import com.streetCat.vo.request.AdoptionRequest;
import com.streetCat.vo.request.AdoptionStatusRequest;
import com.streetCat.vo.response.AdoptionResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface AdoptionService {
    AdoptionResponse createAdoption(AdoptionRequest content, Long userId);

    List<AdoptionResponse> listAdoptions(Long catId, Long shelterId, String status);

    AdoptionResponse getAdoption(Long id);

    String updateAdoptionStatus(Long id, AdoptionStatusRequest updateReq ,Long userId);

    String uploadContract(Long id, MultipartFile file);
}