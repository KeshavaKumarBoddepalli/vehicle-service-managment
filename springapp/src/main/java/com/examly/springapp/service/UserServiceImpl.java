package com.examly.springapp.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.examly.springapp.config.UserPrinciple;
import org.springframework.security.core.userdetails.UserDetails;
import com.examly.springapp.model.User;

import com.examly.springapp.repository.UserRepo;
import com.examly.springapp.config.UserPrinciple;

@Service
public class UserServiceImpl implements UserService , UserDetailsService {
    @Autowired
    private UserRepo urepo;

    @Override
    public User createUser(User user) {
        return urepo.save(user);
    }

    @Override
    public boolean deleteUser(int userId) {
          User found= urepo.findById(userId).orElse(null);
            if (found != null){

            urepo.delete(found);
            return true;
        }
        return false;
        
    }

    @Override
    public List<User> findAllUsers() {
        return urepo.findAll();
    }

    @Override
    public User getByUserId(int userId) {
        User found= urepo.findById(userId).orElse(null);
        if(found==null){
            return null;
        }
        return found;
    }

    @Override
    public User findByUsername(String username) {
        return urepo.findByUsername(username);
    }

    
@Override
public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    User user = urepo.findByUsername(username);
    if (user == null) {
        System.out.println("User not found: " + username);
        throw new UsernameNotFoundException("User not found: " + username);
    }
    return new UserPrinciple(user);
}


    @Override
    public User updateUser(User user) {
        Optional<User> optionalUser = urepo.findById(user.getUserId());
        if (optionalUser.isEmpty()) {
            return null;
        }
    
        User existingUser = optionalUser.get();
    
        // Update only the fields that are allowed to change
        existingUser.setUsername(user.getUsername());
        existingUser.setEmail(user.getEmail());
        existingUser.setMobileNumber(user.getMobileNumber());
    
        return urepo.save(existingUser);
    }
   

    @Override
    public boolean existsByUsername(String username) {
        return urepo.existsByUsername(username);
    }
 
    @Override
    public boolean existsByEmail(String email) {
        return urepo.existsByEmail(email);
    }
 
    @Override
    public boolean existsByMobileNumber(String mobileNumber) {
        return urepo.existsByMobileNumber(mobileNumber);
    }
}
