import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Feedback } from '../models/feedback.model';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
<<<<<<< HEAD
  private apiUrl = "https://8080-facafcdbdfacfffceebfaeeaaeddacfffbcfdda.premiumproject.examly.io/api/feedback";
=======
  private apiUrl = "https://8080-cddcccedbacfffceebfaeeaaeddacfffbcfdda.premiumproject.examly.io/api/feedback";
>>>>>>> origin/main

  constructor(private http: HttpClient) {}

  createFeedback(feedback: Feedback): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, feedback);
  }

  getAllFeedback(): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(this.apiUrl);
  }

  updateFeedback(feedbackId: number, feedback: Feedback): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${feedbackId}`, feedback);
  }

  deleteFeedback(feedbackId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${feedbackId}`);
  }

  getFeedbackByUserId(userId: number): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(`${this.apiUrl}/user/${userId}`);
  }
}