package com.streetCat.dao;

import com.streetCat.pojo.Shelter;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface ShelterMapper {
    @Insert("INSERT INTO shelters(id, name, contact_person, phone, email, location, address, description, license_number,manager_id,capacity) " +
            "VALUES(#{id},#{name},#{contactPerson},#{phone},#{email},ST_GeomFromText(#{location}, 4326),#{address},#{description},#{licenseNumber},#{managerId},#{capacity})")
    void insert(Shelter shelter);

    void updateShelter(String id,Shelter shelter);

    @Delete("DELETE FROM shelters WHERE id = #{id}")
    void deleteShelter(String id);

    @Select("SELECT *,ST_AsText(location) As stringLocation FROM shelters WHERE id = #{id}")
    Shelter selectShelterById(String id);

    @Select("SELECT EXISTS(SELECT 1 FROM shelters WHERE license_number = #{licenseNumber})")
    boolean existsByLicenseNumber (String licenseNumber);

    @Select("SELECT EXISTS(SELECT 1 FROM shelters WHERE id = #{id})")
    boolean existsById (String id);

    List<Shelter> getSheltersByKeyword(String keyword,String status);
}
