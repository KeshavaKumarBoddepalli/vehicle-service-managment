import { Component, OnInit } from '@angular/core';
import { Feedback } from 'src/app/models/feedback.model';
import { FeedbackService } from 'src/app/services/feedback.service';
@Component({
  selector: 'app-useraddfeedback',
  templateUrl: './useraddfeedback.component.html',
  styleUrls: ['./useraddfeedback.component.css']
})
export class UseraddfeedbackComponent implements OnInit {
  newFeedback: Feedback ={
    user: {} as any,
    message: '',
    rating: 0
  };
  constructor(private feedbackService: FeedbackService) { }
 
  ngOnInit(): void {
  }
  submitFeedback(){
    this.feedbackService.createFeedback(this.newFeedback).subscribe({
      next: ()=>{
        alert('Feedback is submitted successfully!');
        this.newFeedback.message='';
        this.newFeedback.rating=0;
      },
      error: (error)=>{
        console.error('Error in adding feedback:', error);
      }
    })
  }
 
}
 
