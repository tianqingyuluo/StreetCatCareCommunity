package com.streetCat.dao;

import com.streetCat.pojo.Staff;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;
import java.util.Map;

public interface StaffMapper {
    @Insert("INSERT INTO shelter_staff (id, user_id, shelter_id, real_name, phone, email, hired_at) "+
            "Values(#{id},#{userId},#{shelterId},#{realName},#{phone},#{email},#{hiredAt})")
    void insert(Staff staff);

    @Delete("DELETE FROM shelter_staff WHERE id = #{id}")
    void deleteStaff(String id);

    void patchStaff(String id,@Param("updates") Map<String, String> updates);

    @Select("SELECT EXISTS(SELECT 1 FROM shelter_staff WHERE id = #{id})")
    boolean existsById (String id);

    @Select("SELECT EXISTS(SELECT 1 FROM shelter_staff WHERE user_id = #{userId})")
    boolean existsByUserId (String userId);

    @Select("SELECT * FROM shelter_staff WHERE user_id = #{id}")
    Staff selectStaffByUserId (String id);

    @Select("SELECT * FROM shelter_staff WHERE id = #{id}")
    Staff selectStaffByStaffId (String id);

    List<Staff> selectStaffsByShelterId (String shelterId,int limit,int offset);

    @Select("SELECT shelter_id FROM shelter_staff WHERE id = #{id}")
    String selectShelterIdByStaffId (String id);

    @Select("SELECT COUNT(*) FROM shelter_staff WHERE shelter_id = #{shelterId}")
    int getCurrentStaffNumber(String shelterId);

    @Select("SELECT COUNT(*) FROM shelter_staff")
    int getAllCurrentStaffNumber();
}
