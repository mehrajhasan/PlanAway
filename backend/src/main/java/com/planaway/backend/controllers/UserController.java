package com.planaway.backend.controllers;
import com.planaway.backend.models.User;
import com.planaway.backend.repositories.UserRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;


@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserRepository userRepo;

    public UserController(UserRepository userRepo){
        this.userRepo = userRepo;
    }

    @GetMapping
    public List<User> getAllUsers(){
        return userRepo.findAll();
    }

    @PostMapping
    public User createUser(@RequestBody User user){
        return userRepo.save(user);
    }

    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id){
        return userRepo.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PatchMapping("/updateName/{id}")
    public User updateName(@PathVariable Long id, @RequestBody String updatedName){
        User user = userRepo.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setName(updatedName);

        return userRepo.save(user);
    }

    @PatchMapping("/{id}")
    public User updateProfilePic(@PathVariable Long id, @RequestBody String updatedPfp){
        User user = userRepo.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setProfilePicUrl(updatedPfp);

        return userRepo.save(user);
    }
}
