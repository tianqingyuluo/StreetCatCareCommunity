package com.streetCat.service;

import com.streetCat.utils.R;
import com.streetCat.vo.request.ShelterSaveRequest;
import com.streetCat.vo.response.ShelterResponse;

import java.util.List;

public interface ShelterService {
    R<ShelterResponse> saveShelter(String userId,ShelterSaveRequest request);
    R<List<ShelterResponse>> getShelters(String userId,String keyword, String status, Double lat, Double lng);
    R<List<ShelterResponse>> getShelters(String userId,String keyword, String status);
    R<ShelterResponse> getShelter(String userId,String id);
    R<ShelterResponse> updateShelter(String userId,String id,ShelterSaveRequest request);
    R<Void> deleteShelter(String userId,String id);
}
