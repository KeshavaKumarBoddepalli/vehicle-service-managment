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
    public User getUserByName(String name) {
        return urepo.findByUsername(name);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        
        // return null;
        User user = urepo.findByUsername(username);
        if(user == null) throw new UsernameNotFoundException("Not Found");
        return new UserPrinciple(user);

    }

    @Override
    public User updateUser(User user) {
        User found=urepo.findById(user.getUserId()).orElse(null);
        if(found==null){
            return null;
        }
        return urepo.save(user);
    }
    // @Override
    public User findByUsername(String username) {
      return urepo.findByUsername(username);
    }
}
