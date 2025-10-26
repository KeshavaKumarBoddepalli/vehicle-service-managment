package com.examly.springapp.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.examly.springapp.model.Feedback;
import com.examly.springapp.service.FeedbackServiceImpl;

@RestController
@RequestMapping("/api/feedbacks")
public class FeedbackController {
    @Autowired
    private FeedbackServiceImpl feedbackService;
    
    @PostMapping
    public ResponseEntity<Feedback> createFeedback(@RequestBody Feedback feedback){
        Feedback created = feedbackService.createFeedback(feedback);
        return ResponseEntity.ok(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Feedback> getFeedbackById(@PathVariable Long id){
        Feedback feedback =feedbackService.getFeedbackById(id);
        if(feedback == null){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(feedback);
    }

    @GetMapping
    public  ResponseEntity<List<Feedback>> getAllFeedback(){
        List<Feedback> feedbackList =feedbackService.getAllFeedback();
        return ResponseEntity.ok(feedbackList);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteFeedback(@PathVariable Long id){
        Feedback deleted = feedbackService.deleteFeedback(id);
        if(deleted == null){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok("Feedback deleted successfully with ID: "+id);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Feedback>> getFeedbackByUserId(@PathVariable Long userId){
        List<Feedback> feedbackList = feedbackService.getFeedbackByUserId(userId);
        if(feedbackList.isEmpty()){
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(feedbackList);
    }
}
