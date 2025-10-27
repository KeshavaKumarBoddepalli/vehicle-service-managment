package com.examly.springapp.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.examly.springapp.model.User;
import com.examly.springapp.service.UserServiceImpl;

@RestController
@RequestMapping("/api")
public class UserController {
    @Autowired
    private UserServiceImpl userService;

    @PostMapping("/register")
    public ResponseEntity<?>registerUser(@RequestBody User user){
        User created=userService.createUser(user);
        if(created==null){
            return ResponseEntity.status(400).build();
        }
        return ResponseEntity.status(201).body(created);
    }

    @GetMapping("/user")
    public ResponseEntity<List<User>>getAllUser(){
        List<User> foundList=userService.findAllUsers();
        if(foundList==null){
            return ResponseEntity.status(400).build();
        }
        return ResponseEntity.status(200).body(foundList);
    }

    @PutMapping("/user/view/profile")
    public ResponseEntity<User>updateUser(@RequestBody User user){
        User updated=userService.updateUser(user);
        if(updated==null){
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.status(200).body(updated);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<User>getUserById(@PathVariable int userId){
        User got=userService.getByUserId(userId);
        if(got==null){
            return ResponseEntity.status(404).build();
        }
        return ResponseEntity.status(200).body(got);
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<?>getUserByName(@PathVariable String name){
        Optional<User> user=userService.getUserByName(name);
        if(user.isPresent()){
            return ResponseEntity.status(200).body(user);
        }
        return ResponseEntity.status(404).build();
    }
    
}
