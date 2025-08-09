package com.planaway.backend.models;

import jakarta.persistence.*;
import java.util.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

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
    @JoinColumn(name = "owner_firebase_uid", referencedColumnName = "firebase_uid")
    private User owner;


    private String name;
    private String destination;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer travelers;
    private String notes;

    private String tripPic;

    @ManyToMany
    @JoinTable(
        name = "trip_shared_users",
        joinColumns = @JoinColumn(name = "trip_id"),
        inverseJoinColumns = @JoinColumn(name = "user_firebase_uid", referencedColumnName = "firebase_uid")
    )
    @JsonIgnore
    private Set<User> sharedWith = new HashSet<>();

    @OneToMany(mappedBy = "trip", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<ItineraryItem> itinerary = new ArrayList<>();


}
