package com.planaway.backend.models;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ItineraryItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String notes;
    private String time;
    private String date; // key for grouping by day

    @ManyToOne
    @JoinColumn(name = "trip_id")
    private Trip trip;
}