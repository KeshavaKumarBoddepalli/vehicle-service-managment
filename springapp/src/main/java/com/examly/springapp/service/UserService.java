package com.examly.springapp.service;

import java.util.List;
import java.util.Optional;

import org.springframework.security.core.userdetails.UserDetails;

import com.examly.springapp.model.User;

public interface UserService {
    User createUser(User user);
    UserDetails loadUserByUsername(String username);
    List<User>findAllUsers();
    User getByUserId(int userId);
    boolean deleteUser(int userId);
    User updateUser(User user);
    User getUserByName(String name);
    
}
