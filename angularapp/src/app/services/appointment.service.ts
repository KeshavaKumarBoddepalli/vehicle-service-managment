import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Appointment } from '../models/appointment.model';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  public apiUrl="https://8080-cecdfddacafbdafffceebfaeeaaeddacfffbcfdda.premiumproject.examly.io/api/appointment";

  constructor(private http:HttpClient){ }

  getAppointments():Observable<any>{
    return this.http.get<any>(this.apiUrl);
  }

  getAppointmentsByUser(userId:number):Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/${userId}`);
  }

  addAppointment(appointment:Appointment):Observable<any>{
    return this.http.post<any>(this.apiUrl,appointment);
  }

  updateAppointment(appointmentld:number, appointment:Appointment):Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/${appointmentld}`,appointment);
  }

  deleteAppointment(appointmentld:number):Observable<any>{
    return this.http.delete<any>(`${this.apiUrl}/${appointmentld}`);
  }


}
