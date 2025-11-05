package com.examly.springapp.service;

import java.util.List;
import java.util.Optional;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.examly.springapp.config.UserPrinciple;
import com.examly.springapp.model.User;

import com.examly.springapp.repository.UserRepo;

@Service
public class UserServiceImpl implements UserService , UserDetailsService {
    
    public UserServiceImpl(UserRepo userRepo) {
        this.userRepo = userRepo;
    }

    private UserRepo userRepo;

    @Override
    public User createUser(User user) {
        return userRepo.save(user);
    }

    @Override
    public boolean deleteUser(int userId) {
          User found= userRepo.findById(userId).orElse(null);
            if (found != null){

            userRepo.delete(found);
            return true;
        }
        return false;
        
    }

    @Override
    public List<User> findAllUsers() {
        return userRepo.findAll();
    }

    @Override
    public User getByUserId(int userId) {
        User found= userRepo.findById(userId).orElse(null);
        if(found==null){
            return null;
        }
        return found;
    }

    @Override
    public User findByUsername(String username) {
        return userRepo.findByUsername(username);
    }

    
@Override
public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    User user = userRepo.findByUsername(username);
    if (user == null) {
        System.out.println("User not found: " + username);
        throw new UsernameNotFoundException("User not found: " + username);
    }
    return new UserPrinciple(user);
}


@Override
public User updateUser(User user) {
    Optional<User> optionalUser = userRepo.findById(user.getUserId());
    if (optionalUser.isEmpty()) {
        return null;
    }

    User existingUser = optionalUser.get();

    // Update only the fields that are allowed to change
    existingUser.setUsername(user.getUsername());
    existingUser.setEmail(user.getEmail());
    existingUser.setMobileNumber(user.getMobileNumber());

    return userRepo.save(existingUser);
}

   

    @Override
    public boolean existsByUsername(String username) {
        return userRepo.existsByUsername(username);
    }
 
    @Override
    public boolean existsByEmail(String email) {
        return userRepo.existsByEmail(email);
    }
 
    @Override
    public boolean existsByMobileNumber(String mobileNumber) {
        return userRepo.existsByMobileNumber(mobileNumber);
    }
}
