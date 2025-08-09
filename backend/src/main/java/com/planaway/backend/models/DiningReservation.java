package com.planaway.backend.models;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@AllArgsConstructor
@Entity
@Table(name = "dining_reservations")
public class DiningReservation extends Reservation {

    private String restaurant;
    private String address;

    private LocalDate reservationDate;
    private LocalTime reservationTime;

    private Integer partySize;

    public DiningReservation(){
        super();
        this.setType("Dining");
    }
}
