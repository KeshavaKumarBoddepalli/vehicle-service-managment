import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Appointment } from '../models/appointment.model';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private apiUrl = "https://8080-facafcdbdfacfffceebfaeeaaeddacfffbcfdda.premiumproject.examly.io/api/appointment";

  constructor(private http: HttpClient) {}

  getAppointments(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getAppointmentsByUser(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${userId}`);
  }

  addAppointment(appointment: Appointment): Observable<any> {
    return this.http.post<any>(this.apiUrl, appointment);
  }

  updateAppointment(appointmentId: number, appointment: Appointment): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${appointmentId}`, appointment);
  }

  deleteAppointment(appointmentId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${appointmentId}`);
  }
}
