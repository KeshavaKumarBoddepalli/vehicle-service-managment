import { Component, OnInit } from '@angular/core';
import { Feedback } from 'src/app/models/feedback.model';
import { FeedbackService } from 'src/app/services/feedback.service';
@Component({
  selector: 'app-adminviewfeedback',
  templateUrl: './adminviewfeedback.component.html',
  styleUrls: ['./adminviewfeedback.component.css']
})
export class AdminviewfeedbackComponent implements OnInit {

  constructor(private feedbackService: FeedbackService) { }
  allFeedbacks: Feedback[]=[];
  ngOnInit(): void {
    this.loadFeedbacks();
  }
  loadFeedbacks(){
    this.feedbackService.getAllFeedback().subscribe({
      next: (data)=>{
        this.allFeedbacks=data;
      },
      error: (error)=>{
        console.error('Error fetching all feedback:', error);
      }
    });
  }
  deleteFeedback(feedbackId: number){
    this.feedbackService.deleteFeedback(feedbackId).subscribe({
      next: ()=>{
        this.loadFeedbacks();
      },
      error: (error)=>{
        console.error('Error deleting feedback:', error);
      }
    });
  }
  updateFeedback(feedbackId: number, feedback: Feedback){
    this.feedbackService.updateFeedback(feedbackId, feedback).subscribe({
      next: ()=>{
        alert('Feedback updated successfully!');
      },
      error: (error)=>{
        console.error('Error updating feedback:', error);
      }
    });
  }
}
