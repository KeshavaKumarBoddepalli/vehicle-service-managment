package com.examly.springapp.service;

import java.util.List;
import java.util.Optional;

import com.examly.springapp.model.User;

public interface UserService {
    User createUser(User user);
    User loadUserByUsername(String username);
    List<User>findAllUsers();
    User getByUserId(int userId);
    void deleteUser(int userId);
    User updateUser(User user);
    Optional<User> getUserByName(String name);
    
}
