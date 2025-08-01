package com.planaway.backend.controllers;

import com.planaway.backend.repositories.TripRepository;
import com.planaway.backend.repositories.UserRepository;
import com.planaway.backend.models.Trip;
import com.planaway.backend.models.User;
import com.planaway.backend.dto.TripRequest;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;



@RestController
@RequestMapping("/api/trip")
public class TripController {
    private final TripRepository tripRepo;
    private final UserRepository userRepo;

    public TripController(TripRepository tripRepo, UserRepository userRepo){
        this.tripRepo = tripRepo;
        this.userRepo = userRepo;
    }


    @PostMapping
    public Trip createTrip(@RequestBody TripRequest tripRequest){
        User owner = userRepo.findByFirebaseUid(tripRequest.getOwnerId()).orElseThrow(() -> new RuntimeException("User not found"));
        
        Trip trip = new Trip();
        trip.setOwner(owner);
        trip.setName(tripRequest.getName());
        trip.setDestination(tripRequest.getDestination());
        trip.setStartDate(tripRequest.getStartDate());
        trip.setEndDate(tripRequest.getEndDate());
        trip.setTravelers(tripRequest.getTravelers());
        trip.setNotes(tripRequest.getNotes());
        trip.setTripPic(tripRequest.getTripPic());

        return tripRepo.save(trip);
    }


    @GetMapping("/{id}")
    public Trip getTripById(@PathVariable Long id){
        Trip trip = tripRepo.findById(id).orElseThrow(()->new RuntimeException("Trip not found"));

        return trip;
    }   
   
    @GetMapping("/user/{userId}")
    public List<Trip> getAllTripsById(@PathVariable Long id){
        User user = userRepo.findById(id).orElseThrow(()->new RuntimeException("User not found"));
        
        return tripRepo.findByOwner(user);
    }

    @DeleteMapping("/{id}")
    public void deleteTrip(@PathVariable Long id){
        tripRepo.findById(id).orElseThrow(()->new RuntimeException("Trip not found"));

        tripRepo.deleteById(id);
    }

    @PatchMapping("/{id}/name")
    public Trip updateTripName(@PathVariable Long id, @RequestBody String updatedName){
        Trip trip = tripRepo.findById(id).orElseThrow(()-> new RuntimeException("Trip not found"));
        
        trip.setName(updatedName);
        return tripRepo.save(trip);
    }

   @PatchMapping("/{id}/startDate")
    public Trip updateStartDate(@PathVariable Long id, @RequestBody LocalDate updatedStartDate){
        Trip trip = tripRepo.findById(id).orElseThrow(()-> new RuntimeException("Trip not found"));
        
        trip.setStartDate(updatedStartDate);
        return tripRepo.save(trip);
    }

    @PatchMapping("/{id}/endDate")
    public Trip updateEndDate(@PathVariable Long id, @RequestBody LocalDate updatedEndDate){
        Trip trip = tripRepo.findById(id).orElseThrow(()-> new RuntimeException("Trip not found"));
        
        trip.setEndDate(updatedEndDate);
        return tripRepo.save(trip);
    }

    @PatchMapping("/{id}/travelers")
    public Trip updateTravelers(@PathVariable Long id, @RequestBody Integer updatedTravelers){
        Trip trip = tripRepo.findById(id).orElseThrow(()-> new RuntimeException("Trip not found"));
        
        trip.setTravelers(updatedTravelers);
        return tripRepo.save(trip);
    }

    @PatchMapping("/{id}/notes")
    public Trip updateNotes(@PathVariable Long id, @RequestBody String updatedNotes){
        Trip trip = tripRepo.findById(id).orElseThrow(()-> new RuntimeException("Trip not found"));
        
        trip.setNotes(updatedNotes);
        return tripRepo.save(trip);
    }

    @GetMapping("/shared/{userId}")
    public List<Trip> getSharedTrips(@PathVariable Long id){
        User user = userRepo.findById(id).orElseThrow(() -> new RuntimeException("User not found"));

        return tripRepo.findBySharedWithContaining(user);
    }

    @PostMapping("/{tripId}/share/{userId}")
    public Trip shareTrip(@PathVariable Long tripId, @PathVariable String userId){
        Trip trip = tripRepo.findById(tripId).orElseThrow(() -> new RuntimeException("User not found"));
        User user = userRepo.findByFirebaseUid(userId).orElseThrow(() -> new RuntimeException("User not found"));

        trip.getSharedWith().add(user);
        return tripRepo.save(trip);
    }

    @PutMapping("/{tripId}/unshare/{userId}")
    public Trip unshareTrip(@PathVariable Long tripId, @PathVariable String userId){
        Trip trip = tripRepo.findById(tripId).orElseThrow(() -> new RuntimeException("User not found"));
        User user = userRepo.findByFirebaseUid(userId).orElseThrow(() -> new RuntimeException("User not found"));

        trip.getSharedWith().remove(user);

        return tripRepo.save(trip);
    }
}
