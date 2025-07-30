package com.planaway.backend.models;

import jakarta.persistence.*;
import java.util.*;
import java.time.*;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="trips")
public class Trip {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;    
    
    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;

    private String name;
    private String destination;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer travelers;
    private String notes;

    private String tripPic;
}
