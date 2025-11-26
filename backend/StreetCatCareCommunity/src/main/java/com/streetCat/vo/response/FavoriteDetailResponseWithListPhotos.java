//package com.streetCat.vo.response;
//
//import lombok.Data;
//
//import java.time.LocalDateTime;
//
//@Data
//public class FavoriteDetailResponseWithListPhotos {
//    private String targetType;
//    private Long targetId;
//    private LocalDateTime createdAt;
//    private PostWithUserResponse postResponse; // 使用 PostWithUserResponse
//    private CatResponse catResponse; // 使用 CatResponse
//
//    // 转换方法
//    public static FavoriteDetailResponseWithListPhotos fromFavoriteDetailResponse(FavoriteDetailResponse original) {
//        FavoriteDetailResponseWithListPhotos responseWithLists = new FavoriteDetailResponseWithListPhotos();
//        responseWithLists.setTargetType(original.getTargetType());
//        responseWithLists.setTargetId(original.getTargetId());
//        responseWithLists.setCreatedAt(original.getCreatedAt());
//
//        // 转换 PostWithUser 为 PostWithUserResponse
//        if (original.getPost() != null) {
//            responseWithLists.setPostResponse(new PostWithUserResponse(original.getPost()));
//        }
//
//        // 转换 Cat 为 CatResponse
//        if (original.getCat() != null) {
//            responseWithLists.setCatResponse(new CatResponse(original.getCat()));
//        }
//
//        return responseWithLists;
//    }
//}