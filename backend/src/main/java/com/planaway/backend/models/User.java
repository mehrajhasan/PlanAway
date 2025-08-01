package com.planaway.backend.models;

import jakarta.persistence.*;
import java.util.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="users")
public class User {
    @Id
    @Column(name = "firebase_uid")
    private String firebaseUid;

    private String name;

    @Column(unique = true)
    private String email;

    private String profilePicUrl;

    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Trip> trips = new ArrayList<>();

}
