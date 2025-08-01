package com.planaway.backend.repositories;

import com.planaway.backend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;


public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);
    Optional<User> findByFirebaseUid(String firebaseUid);
}
