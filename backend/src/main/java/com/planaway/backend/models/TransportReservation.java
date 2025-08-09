package com.planaway.backend.models;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

import com.google.cloud.storage.TransportCompatibility.Transport;

@Getter
@Setter
@AllArgsConstructor
@Entity
@Table(name = "transport_reservations")
public class TransportReservation extends Reservation {

    private String provider;
    private String vehicle;

    private LocalDate pickupDate;
    private LocalDate dropoffDate;

    private BigDecimal price;

    public TransportReservation(){
        super();
        this.setType("Transportation");
    }
}
