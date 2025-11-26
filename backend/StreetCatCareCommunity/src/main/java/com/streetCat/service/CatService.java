package com.streetCat.service;

import com.streetCat.pojo.Cat;
import com.streetCat.vo.request.CatSaveRequest;
import com.streetCat.vo.response.CatResponse;
import com.streetCat.vo.response.PageResponse;

public interface CatService {
    Cat createCat(CatSaveRequest req);
    PageResponse<CatResponse> listCats(String shelterId);
    CatResponse getCat(String id);
    CatResponse updateCat(String id, CatSaveRequest req);
    void deleteCat(String id);
    void changeCatStatus(String id, String status);
}