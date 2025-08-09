package com.planaway.backend.models;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@AllArgsConstructor
@Entity
@Table(name = "flight_reservations")
public class FlightReservation extends Reservation {

    private String airline;
    private String flightNumber;
    private String fromAirport;
    private String toAirport;

    private LocalDate arrivalDate;
    private LocalTime arrivalTime;

    private BigDecimal price;
    private String seat;
    private String seatCategory;

    public FlightReservation(){
        super();
        this.setType("Flights");
    }
}
