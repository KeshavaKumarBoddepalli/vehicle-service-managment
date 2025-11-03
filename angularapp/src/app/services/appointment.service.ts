import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Appointment } from '../models/appointment.model';
 
@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private apiUrl = "https://8080-cecdfddacafbdafffceebfaeeaaeddacfffbcfdda.premiumproject.examly.io/api/appointment";

  constructor(private http: HttpClient) {}
 
  getAppointments(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
 
  getAppointmentsByUser(userId: number): Observable<any> {
    // This calls your controller's GET /{userId}
    return this.http.get<any>(`${this.apiUrl}/${userId}`);
  }
 
  addAppointment(appointment: Appointment): Observable<any> {
    return this.http.post<any>(this.apiUrl, appointment);
  }
 
  /**
   * This is for the "Edit" feature (Date/Location).
   * Calls PUT /api/appointment/{id}
   */
  updateAppointment(appointmentId: number, appointment: Appointment): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${appointmentId}`, appointment);
  }
 
  /**
   * This is for ADMIN-only hard delete.
   * We do not call this for the user's "Cancel" button.
   */
  deleteAppointment(appointmentId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${appointmentId}`);
  }
 
  // --- *** ADD THIS NEW METHOD FOR "CANCEL" *** ---
  // --- *** THIS IS THE METHOD THAT WAS MISSING *** ---
  /**
   * This is for the ADMIN "Status Change" and USER "Cancel" feature.
   * Calls PUT /api/appointment/{id}/status
   */
  updateAppointmentStatus(appointmentId: number, status: string): Observable<any> {
    const statusUpdate = { status: status };
    // This calls the @PutMapping("/{id}/status") endpoint in your controller
    return this.http.put<any>(`${this.apiUrl}/${appointmentId}/status`, statusUpdate);
  }
}