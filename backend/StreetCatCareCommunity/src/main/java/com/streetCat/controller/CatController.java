package com.streetCat.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.streetCat.dao.AdminMapper;
import com.streetCat.pojo.Cat;
import com.streetCat.service.CatService;
import com.streetCat.utils.BusinessException;
import com.streetCat.utils.JwtUtil;
import com.streetCat.vo.request.CatSaveRequest;
import com.streetCat.vo.response.CatResponse;
import com.streetCat.vo.response.PageResponse;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/cats")
@RequiredArgsConstructor
public class CatController {
    private final CatService catService;
    private final AdminMapper adminMapper;
    @PostMapping
    @Operation(summary = "新增猫咪")
    public ResponseEntity<Object> createCat(
            @RequestHeader("Authorization") String token,
            @RequestBody Map<String, Object> body) {
        String userId = JwtUtil.parse(token.replace("Bearer ", ""));
        if (!adminMapper.existsById(userId)){
            throw new BusinessException("你不是管理员权限，你不配创建哈吉咪");
        }
        try {
            CatSaveRequest req = new CatSaveRequest();
            req.setName((String) body.get("name"));
            req.setBreed((String) body.get("breed"));
            req.setGender((String) body.get("gender"));
            req.setAgeMonths((Integer) body.get("age_months"));
            req.setHealthStatus((String) body.get("health_status"));
            req.setDescription((String) body.get("description"));

            // ① 前端传 List<String>，这里手动转 JSON 字符串
            Object photosObj = body.get("photos");
            if (photosObj != null) {
                ObjectMapper mapper = new ObjectMapper();
                req.setPhotos(mapper.writeValueAsString(photosObj));
            } else {
                req.setPhotos("[]");
            }
            req.setIsNeutered((Boolean) body.get("is_neutered"));
            req.setVaccinationStatus((String) body.get("vaccination_status"));
            req.setStatus((String) body.get("status"));
            req.setShelterId((String) body.get("shelter_id"));
            req.setCreatedBy((String) body.get("created_by"));

            Cat response = catService.createCat(req);
            CatResponse res = new CatResponse(response);
            return ResponseEntity.status(HttpStatus.CREATED).body(res);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("创建猫咪失败: " + e.getMessage());
        }
    }


    @GetMapping
    public ResponseEntity<PageResponse<CatResponse>> listCats(@RequestParam(required = false) String shelterId) {
        return ResponseEntity.ok(catService.listCats(shelterId));
    }


    @GetMapping("/{id}")
    public CatResponse getCat(@PathVariable String id) {
        return catService.getCat(id);
    }


    @PutMapping("/{id}")
    public ResponseEntity<Object> updateCat(@PathVariable String id,
                                            @RequestHeader("Authorization") String token,
                                            @RequestBody Map<String, Object> body) {
        try {
            String userId = JwtUtil.parse(token.replace("Bearer ", ""));
            if (!adminMapper.existsById(userId)){
                throw new BusinessException("你不是管理员权限，你无权修改哈吉咪的属性");
            }
            CatSaveRequest req = new CatSaveRequest();
            req.setName((String) body.get("name"));
            req.setBreed((String) body.get("breed"));
            req.setGender((String) body.get("gender"));
            req.setAgeMonths((Integer) body.get("age_months"));
            req.setHealthStatus((String) body.get("health_status"));
            req.setDescription((String) body.get("description"));

            // ① 同 createCat：把前端传来的 List<String> 手动转 JSON 字符串
            Object photosObj = body.get("photos");
            if (photosObj != null) {
                ObjectMapper mapper = new ObjectMapper();
                req.setPhotos(mapper.writeValueAsString(photosObj));
            } else {
                req.setPhotos("[]");
            }

            req.setIsNeutered((Boolean) body.get("is_neutered"));
            req.setVaccinationStatus((String) body.get("vaccination_status"));
            req.setStatus((String) body.get("status"));
            req.setShelterId((String) body.get("shelter_id"));

            // ② 执行更新
            CatResponse res = catService.updateCat(id, req);
            return ResponseEntity.ok(res);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("更新猫咪失败: " + e.getMessage());
        }
    }


    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)   // 明确返回 204
    public ResponseEntity<?> deleteCat(@PathVariable String id,@RequestHeader("Authorization") String token) {
        String userId = JwtUtil.parse(token.replace("Bearer ", ""));
        if (!adminMapper.existsById(userId)){
            return ResponseEntity.badRequest().body("你这个权限的哈吉人还不配删本猫");
        }
        catService.deleteCat(id);
        return null;
    }


    @PatchMapping("/{id}/status")
    public ResponseEntity<?> changeCatStatus(@PathVariable String id,
                                @RequestHeader("Authorization") String token,
                                @RequestBody Map<String, String> body) {
        String userId = JwtUtil.parse(token.replace("Bearer ", ""));
        if (!adminMapper.existsById(userId)){
            return ResponseEntity.badRequest().body("你不是管理员权限，你无权修改哈吉咪的属性");
        }
        String status = body.get("status");   // 取出值
        if (status == null) {
            return ResponseEntity.badRequest().body("缺少 status 字段");
        }
        catService.changeCatStatus(id, status.trim());
        return null;
    }
}