package com.streetCat.dao;

import com.streetCat.vo.request.AdoptionRequest;
import com.streetCat.vo.request.AdoptionStatusRequest;
import com.streetCat.vo.response.AdoptionResponse;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Mapper
public interface AdoptionMapper {
    void createAdoption(
            @Param("request") AdoptionRequest request,
            @Param("applicantId") Long applicantId,
            @Param("id") Long id,
            @Param("shelterId") Long shelterId,
            @Param("status") String status
    );

    List<AdoptionResponse> listAdoptions(@Param("catId") Long catId, @Param("shelterId") Long shelterId, @Param("status") String status,@Param("userid")Long userid);

    AdoptionResponse getAdoption(Long id);

    void updateAdoptionStatus(
            @Param("id") Long id,
            @Param("updateReq") AdoptionStatusRequest updateReq,
            @Param("reviewerId") Long reviewerId
    );

    String uploadContract(@Param("id") Long id, @Param("file") MultipartFile file);
}