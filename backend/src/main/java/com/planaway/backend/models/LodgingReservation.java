package com.planaway.backend.models;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@Entity
@Table(name = "lodging_reservations")
public class LodgingReservation extends Reservation {

    private String name;
    private String address;

    private LocalDate checkIn;
    private LocalDate checkOut;

    private BigDecimal price;

    public LodgingReservation(){
        super();
        this.setType("Lodging");
    }
}
