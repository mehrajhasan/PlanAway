package com.planaway.backend.dto;


import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
public class TripRequest {
    private String ownerId;  
    private String name;
    private String destination;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer travelers;
    private String notes;
    private String tripPic;
}