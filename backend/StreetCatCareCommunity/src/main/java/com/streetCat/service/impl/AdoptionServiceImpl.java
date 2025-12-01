package com.streetCat.service.impl;

import com.streetCat.dao.AdoptionMapper;
import com.streetCat.dao.MainCatMapper;
import com.streetCat.pojo.Cat;
import com.streetCat.service.AdoptionService;
import com.streetCat.utils.BusinessException;
import com.streetCat.utils.RandomUtil;
import com.streetCat.vo.request.AdoptionRequest;
import com.streetCat.vo.request.AdoptionStatusRequest;
import com.streetCat.vo.response.AdoptionResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.util.ArrayList;
import java.util.List;

@Service
public class AdoptionServiceImpl implements AdoptionService {

    @Autowired
    private AdoptionMapper adoptionMapper;
    @Autowired
    private MainCatMapper mainCatMapper;
    @Override
    public AdoptionResponse createAdoption(AdoptionRequest content, Long userId) {
        long catId;
        try {
            catId = Long.parseLong(content.getCatId());
        } catch (NumberFormatException e) {
            throw new BusinessException("catId格式不正确，无法转换为数字");
        }
        List<AdoptionResponse> adoptionResponse =new ArrayList<>();
        adoptionResponse = adoptionMapper.listAdoptions(catId,null,null);
        if (adoptionResponse!=null && !adoptionResponse.isEmpty()) {
            throw new BusinessException("这个猫正在被别人申请领养中");
        }
        Cat cat = mainCatMapper.selectCatById(catId);
        if (cat == null) {
            throw new BusinessException("没有这个猫");
        }
        Long id = RandomUtil.nextId();
        Long shelterId = mainCatMapper.selectCatById(Long.valueOf(content.getCatId())).getShelterId();
        adoptionMapper.createAdoption(content, userId, id,shelterId,"PENDING");
        return getAdoption(id);
    }

    @Override
    public List<AdoptionResponse> listAdoptions(Long catId, Long shelterId, String status) {
        // 实现逻辑：查询领养申请列表
        return adoptionMapper.listAdoptions(catId, shelterId, status);
    }

    @Override
    public AdoptionResponse getAdoption(Long id) {
        // 实现逻辑：查询单个领养申请详情
        return adoptionMapper.getAdoption(id);
    }

    @Override
    public String updateAdoptionStatus(Long id, AdoptionStatusRequest updateReq, Long userId) {
        // 实现逻辑：更新领养申请状态
        adoptionMapper.updateAdoptionStatus(id, updateReq,userId);
        return "状态已更新";
    }

    @Override
    public String uploadContract(Long id, MultipartFile file) {
        // 实现逻辑：上传合同文件
        return adoptionMapper.uploadContract(id, file);
    }
}