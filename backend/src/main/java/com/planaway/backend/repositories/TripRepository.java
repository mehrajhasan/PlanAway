package com.planaway.backend.repositories;

import com.planaway.backend.models.Trip;
import com.planaway.backend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TripRepository extends JpaRepository<Trip, Long> {
    List<Trip> findByOwner(User owner);
    List<Trip> findBySharedWithContaining(User user);
}
