package com.streetCat.pojo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.locationtech.jts.geom.Point;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Shelter {
    String id;
    String name;
    String contactPerson;
    String phone;
    String email;
    Point location;
    String stringLocation;
    String address;
    String description;
    String licenseNumber;
    String managerId;
    int capacity;
    String createdAt;
    String updatedAt;
}
