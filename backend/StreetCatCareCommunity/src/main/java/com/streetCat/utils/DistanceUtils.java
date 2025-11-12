package com.streetCat.utils;

import com.streetCat.vo.response.ShelterResponse;

import java.util.*;
import static java.lang.Math.*;

public class DistanceUtils {

    /** 地球半径（米） */
    private static final double EARTH_RADIUS = 6_371_000;

    /**
     * 按与参考点的距离升序排序
     * @param list      原始列表
     * @param refLon    参考点经度
     * @param refLat    参考点纬度
     */
    public static void sortAndFillDistance(List<ShelterResponse> list,
                                           double refLat,
                                           double refLon) {
        double radRefLat = toRad(refLat);
        double radRefLon = toRad(refLon);

        for (ShelterResponse s : list) {
            double radLat = toRad(s.getLocation().getLat());
            double radLon = toRad(s.getLocation().getLng());

            double dLat = radLat - radRefLat;
            double dLon = radLon - radRefLon;

            double a = pow(sin(dLat / 2), 2) +
                    cos(radRefLat) * cos(radLat) * pow(sin(dLon / 2), 2);
            double c = 2 * atan2(sqrt(a), sqrt(1 - a));
            double distance = EARTH_RADIUS * c;

            s.setDistance(distance);
        }

        list.sort(Comparator.comparingDouble(ShelterResponse::getDistance));
    }

    private static double toRad(double degree) {
        return degree * PI / 180;
    }
}
