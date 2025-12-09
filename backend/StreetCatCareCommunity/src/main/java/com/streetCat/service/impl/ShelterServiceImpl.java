package com.streetCat.service.impl;

import com.streetCat.dao.AdminMapper;
import com.streetCat.dao.CatMapper;
import com.streetCat.dao.ShelterMapper;
import com.streetCat.exception.BizCode;
import com.streetCat.pojo.Shelter;
import com.streetCat.service.ShelterService;
import com.streetCat.utils.DistanceUtils;
import com.streetCat.utils.R;
import com.streetCat.utils.RandomUtil;
import com.streetCat.vo.request.ShelterSaveRequest;
import com.streetCat.vo.response.ShelterResponse;
import lombok.RequiredArgsConstructor;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.io.ParseException;
import org.locationtech.jts.io.WKTReader;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ShelterServiceImpl implements ShelterService {
    private final ShelterMapper shelterMapper;
    private final AdminMapper adminMapper;
    private final CatMapper catMapper;
    private final GeometryFactory geometryFactory = new GeometryFactory();

    @Override
    public R<ShelterResponse> saveShelter(String userId,ShelterSaveRequest request) {
        if(!adminMapper.getRoleById(userId).equals("SYSTEM_ADMIN")){
            return R.fail(BizCode.FORBIDDEN);
        }
        if(shelterMapper.existsByLicenseNumber(request.getLicenseNumber())){
            return R.fail(BizCode.DUPLICATE_RESOURCE);
        }
        if(request.getLocation().getLng()<-180 || request.getLocation().getLng()>180 ||
        request.getLocation().getLat()<-90 || request.getLocation().getLat()>90){
            return R.fail(BizCode.INVALID_DATA);
        }
        if(!adminMapper.existsById(request.getManagerId())){
            return R.fail(BizCode.UNFOUND);
        }
        Shelter shelter = new Shelter();
        BeanUtils.copyProperties(request, shelter, "location");
        shelter.setLocation(convert(request.getLocation()));
        shelter.setId(String.valueOf(RandomUtil.nextId()));
        shelterMapper.insert(shelter);
        adminMapper.setShelterManager(request.getManagerId());
        shelter = shelterMapper.selectShelterById(shelter.getId());
        ShelterResponse shelterResponse = new ShelterResponse();
        BeanUtils.copyProperties(shelter, shelterResponse);
        shelterResponse.setLocation(new ShelterResponse.Location(shelter.getLocation().getX(),  shelter.getLocation().getY()));
        shelterResponse.setCurrentCatNumber(catMapper.getCurrentCatNumber());
        return  R.creat_ok(shelterResponse);
    }

    @Override
    public R<List<ShelterResponse>> getShelters(String userId,String keyword, String status, Double lat, Double lng) {
        if(!adminMapper.getRoleById(userId).equals("SYSTEM_ADMIN")){
            return R.fail(BizCode.FORBIDDEN);
        }
        if(lng<-180 || lng>180|| lat < -90 || lat>90){
            return R.fail(BizCode.INVALID_DATA);
        }
        List<Shelter> shelters = shelterMapper.selectSheltersByKeyword(keyword,status);
        List<ShelterResponse> shelterResponseList = new ArrayList<>();
        for (Shelter shelter : shelters) {
            String wkt = shelter.getStringLocation();
            shelter.setLocation(parseWktToPoint(wkt));
            ShelterResponse shelterResponse = new ShelterResponse();
            BeanUtils.copyProperties(shelter, shelterResponse);
            shelterResponse.setLocation(new ShelterResponse.Location(shelter.getLocation().getX(),  shelter.getLocation().getY()));
            shelterResponse.setCurrentCatNumber(catMapper.getCurrentCatNumber());
            shelterResponseList.add(shelterResponse);
        }
        DistanceUtils.sortAndFillDistance(shelterResponseList,lat,lng);
        return R.ok(shelterResponseList);
    }

    @Override
    public R<List<ShelterResponse>> getShelters(String userId,String keyword, String status) {
        if(!adminMapper.getRoleById(userId).equals("SYSTEM_ADMIN")){
            return R.fail(BizCode.FORBIDDEN);
        }
        List<Shelter> shelters = shelterMapper.selectSheltersByKeyword(keyword,status);
        List<ShelterResponse> shelterResponseList = new ArrayList<>();
        for (Shelter shelter : shelters) {
            String wkt = shelter.getStringLocation();
            shelter.setLocation(parseWktToPoint(wkt));
            ShelterResponse shelterResponse = new ShelterResponse();
            BeanUtils.copyProperties(shelter, shelterResponse);
            shelterResponse.setLocation(new ShelterResponse.Location(shelter.getLocation().getX(),  shelter.getLocation().getY()));
            shelterResponse.setCurrentCatNumber(catMapper.getCurrentCatNumber());
            shelterResponseList.add(shelterResponse);
        }
        return R.ok(shelterResponseList);
    }

    @Override
    public R<ShelterResponse> getShelter(String userId,String id) {
        if(!(adminMapper.getRoleById(userId).equals("SHELTER_MANAGER")&&shelterMapper.isMyShelter(userId,id))&&!adminMapper.getRoleById(userId).equals("SYSTEM_ADMIN")){
            return R.fail(BizCode.FORBIDDEN);
        }
        if(!shelterMapper.existsById(id)){
            return R.fail(BizCode.UNFOUND);
        }
        Shelter shelter = shelterMapper.selectShelterById(id);
        String wkt = shelter.getStringLocation();
        shelter.setLocation(parseWktToPoint(wkt));
        ShelterResponse shelterResponse = new ShelterResponse();
        BeanUtils.copyProperties(shelter, shelterResponse);
        shelterResponse.setLocation(new ShelterResponse.Location(shelter.getLocation().getX(),  shelter.getLocation().getY()));
        shelterResponse.setCurrentCatNumber(catMapper.getCurrentCatNumber());
        return R.ok(shelterResponse);
    }

    @Override
    public R<ShelterResponse> updateShelter(String userId,String id,ShelterSaveRequest request) {
        if(!(adminMapper.getRoleById(userId).equals("SHELTER_MANAGER")&&shelterMapper.isMyShelter(userId,id))&&!adminMapper.getRoleById(userId).equals("SYSTEM_ADMIN")){
            return R.fail(BizCode.FORBIDDEN);
        }
        if(!shelterMapper.existsById(id)){
            return R.fail(BizCode.UNFOUND);
        }
        Shelter shelter = new Shelter();
        BeanUtils.copyProperties(request, shelter, "location");
        shelter.setLocation(convert(request.getLocation()));
        shelterMapper.updateShelter(id,shelter);
        shelter = shelterMapper.selectShelterById(id);
        ShelterResponse shelterResponse = new ShelterResponse();
        BeanUtils.copyProperties(shelter, shelterResponse);
        shelterResponse.setLocation(new ShelterResponse.Location(shelter.getLocation().getX(),  shelter.getLocation().getY()));
        shelterResponse.setCurrentCatNumber(catMapper.getCurrentCatNumber());
        return R.ok(shelterResponse);
    }

    @Override
    public R<Void> deleteShelter(String userId,String id) {
        if(!adminMapper.getRoleById(userId).equals("SYSTEM_ADMIN")){
            return R.fail(BizCode.FORBIDDEN);
        }
        if(shelterMapper.existsById(id)){
            shelterMapper.deleteShelter(id);
            return R.delete_ok();
        }
        return R.fail(BizCode.UNFOUND);
    }

    private Point convert(ShelterSaveRequest.Location ll) {
        GeometryFactory gf = new GeometryFactory();
        return gf.createPoint(new Coordinate(ll.getLng(), ll.getLat()));
    }

    private Point parseWktToPoint(String wkt) {
        WKTReader reader = new WKTReader(geometryFactory);
        try {
            return (Point) reader.read(wkt);
        } catch (ParseException e) {
            throw new RuntimeException(e);
        }
    }
}
