package com.streetCat.vo.request;

import lombok.Data;

@Data
public class AdoptionStatusRequest {
    private String status;
    private String reviewNote;
    private String reviewDate;
}