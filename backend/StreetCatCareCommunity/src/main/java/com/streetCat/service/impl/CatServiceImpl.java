package com.streetCat.service.impl;

import com.streetCat.dao.MainCatMapper;
import com.streetCat.dao.PostMapper;
import com.streetCat.dao.ShelterMapper;
import com.streetCat.pojo.Cat;
import com.streetCat.service.CatService;
import com.streetCat.utils.BusinessException;
import com.streetCat.utils.RandomUtil;
import com.streetCat.vo.request.CatSaveRequest;
import com.streetCat.vo.response.CatResponse;
import com.streetCat.vo.response.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CatServiceImpl implements CatService {
    private final MainCatMapper catMapper;
    private final ShelterMapper shelterMapper;
    private final PostMapper postMapper;
    @Override
    public Cat createCat(CatSaveRequest req) {
        String ShelterId=req.getShelterId();
        if (shelterMapper.selectShelterById(ShelterId)==null){
            throw new BusinessException("不存在的救护站");
        };
        if (req.getCreatedBy()!=null&&postMapper.getPostById(Long.valueOf(req.getCreatedBy()))==null){
            throw new BusinessException("不存在的录入帖子");
        }
        Long id = RandomUtil.nextId();
        catMapper.insertCat(id,req);
        return catMapper.selectCatById(id);
    }

    @Override
    public PageResponse<CatResponse> listCats(String shelterId) {
        List<Cat> records = catMapper.listCats(shelterId);
        List<CatResponse> responseList = records.stream()
                .map(CatResponse::new)
                .collect(Collectors.toList());
        Long total = catMapper.countCats(shelterId);

        return new PageResponse<>(total, responseList);
    }

    @Override
    public CatResponse getCat(String id) {
        Cat response = catMapper.selectCatById(Long.valueOf(id));
        return new CatResponse(response);
    }

    @Override
    public CatResponse updateCat(String id, CatSaveRequest req) {
        // 1. 基本存在性校验
        Long catId = Long.valueOf(id);
        Cat cat = catMapper.selectCatById(catId);
        if (cat == null) {
            throw new BusinessException("猫咪不存在");
        }

        // 2. 如果前端把 shelterId 也改了，需要再次校验救助站
        if (req.getShelterId() != null
                && !req.getShelterId().equals(String.valueOf(cat.getShelterId()))) {
            if (shelterMapper.selectShelterById(req.getShelterId()) == null) {
                throw new BusinessException("目标救助站不存在");
            }
        }

        // 3. 真正去数据库更新
        catMapper.updateCatById(catId, req);

        // 4. 把最新数据封装返回
        return new CatResponse(catMapper.selectCatById(catId));
    }

    @Override
    public void deleteCat(String id) {
        long catId = Long.parseLong(id);
        if (catMapper.selectCatById(catId) == null) {
            throw new BusinessException("猫咪不存在");
        }
        // 2. 执行删除
        catMapper.deleteCatById(catId);
    }

    @Override
    public void changeCatStatus(String id, String status) {
        long catId = Long.parseLong(id);

        /* 1. 存在性校验 */
        if (catMapper.selectCatById(catId) == null) {
            throw new BusinessException("猫咪不存在");
        }

        /* 2. 状态值白名单校验（按业务枚举） */
        List<String> allow = Arrays.asList("ACTIVE", "ADOPTED", "DECEASED", "REMOVED");
        if (!allow.contains(status)) {
            throw new BusinessException("非法状态值，可选：" + allow);
        }

        /* 3. 更新 */
        catMapper.updateCatStatus(catId, status);
    }
}