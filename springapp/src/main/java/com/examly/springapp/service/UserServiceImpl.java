package com.examly.springapp.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;

import com.examly.springapp.model.User;

import com.examly.springapp.repository.UserRepo;

public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepo urepo;

    @Override
    public User createUser(User user) {
        return urepo.save(user);
    }

    @Override
    public void deleteUser(int userId) {
          User found= urepo.findById(userId).orElse(null);
            if (found != null){
            urepo.delete(found);
        }
        
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
    public Optional<User> getUserByName(String name) {
        return urepo.findByUserName(name);
    }

    @Override
    public User loadUserByUsername(String username) {
        
        return null;
    }

    @Override
    public User updateUser(User user) {
        User found=urepo.findById(user.getUserId()).orElse(null);
        if(found==null){
            return null;
        }
        return urepo.save(user);
    }
}
