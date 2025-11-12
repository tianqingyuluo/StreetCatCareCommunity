package com.streetCat.dao;
import com.streetCat.vo.request.PutUserRequest;
import org.apache.ibatis.annotations.Mapper;
import com.streetCat.pojo.User;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface UserMapper {
    /** 查询：返回嵌套 User */
    User selectByOpenid(@Param("openid") String openid);
    void insertUser(@Param("uid") Long uid, @Param("openid") String openid,
                    @Param("unionid") String unionid, @Param("nickname") String nickname);
    User selectById(@Param("userid") String userid);

    int putUserById(@Param("userId") String userId,
                    @Param("putUserRequest") PutUserRequest putUserRequest);

    void putUserLocationById(@Param("userId") String userId,
                             @Param("lon") Double lon,
                             @Param("lat") Double lat,
                             @Param("address") String address);}