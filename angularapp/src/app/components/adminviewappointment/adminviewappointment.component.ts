import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Appointment } from 'src/app/models/appointment.model';
import { AppointmentService } from 'src/app/services/appointment.service';

@Component({
  selector: 'app-adminviewappointment',
  templateUrl: './adminviewappointment.component.html',
  styleUrls: ['./adminviewappointment.component.css']
})
export class AdminviewappointmentComponent implements OnInit {

  appointment:Appointment;

  constructor(private service:AppointmentService, private router:Router){ }

  ngOnInit(): void {
  }

  getAppointments(){
   
  }

  getAppointmentsByUser(userId:number){
   
  }

  addAppointment(appointment:Appointment){
   
  }

  updateAppointment(appointmentld:number, appointment:Appointment){
   
  }

  deleteAppointment(appointmentld:number){
    
  }

}
