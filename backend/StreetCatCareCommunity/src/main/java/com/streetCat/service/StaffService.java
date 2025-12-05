package com.streetCat.service;

import com.streetCat.utils.R;
import com.streetCat.vo.request.StaffSaveRequest;
import com.streetCat.vo.response.StaffResponse;

import java.util.Map;

public interface StaffService {
    R<StaffResponse> staffSaveRequest(String userId,StaffSaveRequest staffSaveRequest);
    R<StaffResponse> getStaff(String userId,String id);
    R<Map<String, Object>> getStaffs(String userId,String shelterId, int page, int size);
    R<Map<String, Object>> getStaffs(String userId,int page, int size);
    R<Void> patchStaff(String userId,String id, Map<String,String> map);
    R<Void> deleteStaff(String userId,String id);
}
