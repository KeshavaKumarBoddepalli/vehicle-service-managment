import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { VehicleMaintenance } from '../models/vehicle-maintenance.model';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  private apiUrl = "https://8080-dcaafddcbffffceebfaeeaaeddacfffbcfdda.premiumproject.examly.io/api/services";

  constructor(private http: HttpClient) { }

  // Helper method to get headers with JWT token
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getAllServices(): Observable<any> {
    return this.http.get<any>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  addService(service: VehicleMaintenance): Observable<any> {
    return this.http.post<any>(this.apiUrl, service, { headers: this.getAuthHeaders() });
  }

  updateService(serviceId: number, updatedService: VehicleMaintenance): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${serviceId}`, updatedService, { headers: this.getAuthHeaders() });
  }

  deleteService(serviceId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${serviceId}`, { headers: this.getAuthHeaders() });
  }

  getServiceByName(serviceName: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${serviceName}`, { headers: this.getAuthHeaders() });
  }
}