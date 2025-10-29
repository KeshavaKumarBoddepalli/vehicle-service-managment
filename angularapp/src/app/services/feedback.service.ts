import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Feedback } from '../models/feedback.model';
@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  apiUrl="https://8080-facafcdbdfacfffceebfaeeaaeddacfffbcfdda.premiumproject.examly.io/api/feedback";
  constructor(private http : HttpClient) { }
  createFeedback(feedback: Feedback): Observable<any>{
    return this.http.post<any>(`${this.apiUrl}`, feedback);
  }
  getAllFeedback(): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}`);
  }
  updateFeedback(feedbackId: number, feedback: Feedback): Observable<any>{
    return this.http.put<any>(`${this.apiUrl}/${feedbackId}`, feedback);
  }
  deleteFeedback(feedbackId: number): Observable<any>{
    return this.http.delete<any>(`${this.apiUrl}/${feedbackId}`);
  }
  getFeedbackByUserId(userId: number): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/${userId}`);
  }
}
