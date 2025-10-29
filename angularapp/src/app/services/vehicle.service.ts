import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { VehicleMaintenance } from '../models/vehicle-maintenance.model';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  public apiUrl="https://8080-dcaafddcbffffceebfaeeaaeddacfffbcfdda.premiumproject.examly.io/api/services";
  constructor(private http:HttpClient) { }

  getAllServices(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`);
  }

  addService(service: VehicleMaintenance):Observable<any>{
    return this.http.post<any>(`${this.apiUrl}`,service)
  }

  updateService(serviceId:number, updatedService:VehicleMaintenance):Observable<any>{
    return this.http.put<any>(`${this.apiUrl}/${serviceId}`,updatedService)
  }

  deleteService(serviceid:number):Observable<any>{
    return this.http.delete<any>(`${this.apiUrl}/${serviceid}`)
  }

  getServiceByName(serviveName:string):Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/${serviveName}`)
  }

}