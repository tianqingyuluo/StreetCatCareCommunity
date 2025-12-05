package com.streetCat.service.impl;

import com.streetCat.dao.AdminMapper;
import com.streetCat.dao.ShelterMapper;
import com.streetCat.dao.StaffMapper;
import com.streetCat.exception.BizCode;
import com.streetCat.pojo.Staff;
import com.streetCat.service.StaffService;
import com.streetCat.utils.R;
import com.streetCat.utils.RandomUtil;
import com.streetCat.vo.request.StaffSaveRequest;
import com.streetCat.vo.response.StaffResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class StaffServiceImpl implements StaffService {
    private final StaffMapper staffMapper;
    private final AdminMapper adminMapper;
    private final ShelterMapper shelterMapper;

    @Override
    public R<StaffResponse> staffSaveRequest(String userId,StaffSaveRequest staffSaveRequest) {
        if((!adminMapper.getRoleById(userId).equals("SHELTER_MANAGER")&&shelterMapper.isMyShelter(userId,staffSaveRequest.getShelterId()))||!adminMapper.getRoleById(userId).equals("SYSTEM_ADMIN")){
            return R.fail(BizCode.FORBIDDEN);
        }
        if(!adminMapper.existsById(staffSaveRequest.getUserId()))
            return R.fail(BizCode.UNFOUND);
        if(staffMapper.existsByUserId(staffSaveRequest.getUserId())){
            return R.fail(BizCode.DUPLICATE_RESOURCE);
        }
        Staff staff = new Staff();
        BeanUtils.copyProperties(staffSaveRequest, staff);
        staff.setId(String.valueOf(RandomUtil.nextId()));
        staffMapper.insert(staff);
        staff = staffMapper.selectStaffByUserId(staffSaveRequest.getUserId());
        StaffResponse staffResponse = new StaffResponse();
        BeanUtils.copyProperties(staff, staffResponse);
        return R.creat_ok(staffResponse);
    }

    @Override
    public R<StaffResponse> getStaff(String userId,String id) {
        if(!staffMapper.existsById(userId)){
            return R.fail(BizCode.FORBIDDEN);
        }
        Staff staff = staffMapper.selectStaffByStaffId(id);
        StaffResponse staffResponse = new StaffResponse();
        BeanUtils.copyProperties(staff, staffResponse);
        return R.ok(staffResponse);
    }

    @Override
    public R<Map<String, Object>> getStaffs(String userId,String shelterId, int page, int size) {
        if((!adminMapper.getRoleById(userId).equals("SHELTER_MANAGER")&&shelterMapper.isMyShelter(userId,shelterId))||!adminMapper.getRoleById(userId).equals("SYSTEM_ADMIN")){
            return R.fail(BizCode.FORBIDDEN);
        }
        if(!shelterMapper.existsById(shelterId)){
            return R.fail(BizCode.UNFOUND);
        }
        int offset = size * (page - 1);
        Map<String,Object> map = new HashMap<>();
        int total = staffMapper.getCurrentStaffNumber(shelterId);
        List<Staff> staffs = staffMapper.selectStaffsByShelterId(shelterId,size,offset);
        map.put("total",total);
        map.put("records",staffs);
        return R.ok(map);
    }

    @Override
    public R<Map<String, Object>> getStaffs(String userId,int page, int size) {
        if(!adminMapper.getRoleById(userId).equals("SYSTEM_ADMIN")){
            return R.fail(BizCode.FORBIDDEN);
        }
        int offset = size * (page - 1);
        Map<String,Object> map = new HashMap<>();
        int total = staffMapper.getAllCurrentStaffNumber();
        List<Staff> staffs = staffMapper.selectStaffsByShelterId(null,size,offset);
        map.put("total",total);
        map.put("records",staffs);
        return R.ok(map);
    }

    @Override
    public R<Void> patchStaff(String userId,String id, Map<String,String> map) {
        String shelterId = staffMapper.selectShelterIdByStaffId(id);
        if((!adminMapper.getRoleById(userId).equals("SHELTER_MANAGER")&&shelterMapper.isMyShelter(userId,shelterId))||!adminMapper.getRoleById(userId).equals("SYSTEM_ADMIN")){
            return R.fail(BizCode.FORBIDDEN);
        }
        if(staffMapper.existsById(id)){
            staffMapper.patchStaff(id, map);
            return R.ok(null);
        }
        return R.fail(BizCode.UNFOUND);
    }

    @Override
    public R<Void> deleteStaff(String userId,String id) {
        String shelterId = staffMapper.selectShelterIdByStaffId(id);
        if((!adminMapper.getRoleById(userId).equals("SHELTER_MANAGER")&&shelterMapper.isMyShelter(userId,shelterId))||!adminMapper.getRoleById(userId).equals("SYSTEM_ADMIN")){
            return R.fail(BizCode.FORBIDDEN);
        }
        if(staffMapper.existsById(id)){
            staffMapper.deleteStaff(id);
            return R.delete_ok();
        }
        return R.fail(BizCode.UNFOUND);
    }
}
