package com.streetCat.service;

import com.streetCat.utils.R;
import com.streetCat.vo.request.ShelterSaveRequest;
import com.streetCat.vo.response.ShelterResponse;

import java.util.List;

public interface ShelterService {
    R<ShelterResponse> saveShelter(ShelterSaveRequest request);
    R<List<ShelterResponse>> getShelters(String keyword, String status, Double lat, Double lng);
    R<List<ShelterResponse>> getShelters(String keyword, String status);
    R<ShelterResponse> getShelter(String id);
    R<ShelterResponse> updateShelter(String id,ShelterSaveRequest request);
    R<Void> deleteShelter(String id);
}
