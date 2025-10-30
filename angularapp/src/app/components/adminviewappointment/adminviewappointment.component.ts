import { Component, OnInit } from '@angular/core';
import { Appointment } from 'src/app/models/appointment.model';
import { AppointmentService } from 'src/app/services/appointment.service';

@Component({
  selector: 'app-adminviewappointment',
  templateUrl: './adminviewappointment.component.html',
  styleUrls: ['./adminviewappointment.component.css']
})
export class AdminviewappointmentComponent implements OnInit {
 
  appointments: Appointment[] = [];
  errorMessage: string = '';

  statuses: string[] = ['Pending', 'Approved', 'Rejected'];
 
  constructor(private appointmentService: AppointmentService) { }
 
  ngOnInit(): void {
    this.loadAllAppointments();
  }
 
  loadAllAppointments(): void {
    this.appointmentService.getAppointments().subscribe(
      (data) => {
        this.appointments = data;
      },
      (error) => {
        this.errorMessage = 'Failed to load appointments. Please try again later.';
        console.error('Error fetching appointments:', error);
      }
    );
  }
 

  onStatusChange(appointment: Appointment): void {
    if (!appointment.appointmentId || !appointment.status) {
      console.error('Missing appointment ID or status');
      return;
    }
  
    this.appointmentService.updateAppointment(appointment.appointmentId, {
      status: appointment.status,
      service: undefined,
      appointmentDate: '',
      location: '',
      user: undefined
    }).subscribe(
      (updatedFromServer) => {
        const index = this.appointments.findIndex(a => a.appointmentId === updatedFromServer.appointmentId);
        if (index !== -1) {
          this.appointments[index] = updatedFromServer;
        }
        console.log('Status updated successfully');
      },
      (error) => {
        this.errorMessage = 'Failed to update status. Please try again.';
        console.error('Error updating status:', error);
        this.loadAllAppointments();
      }
    );
  }
 
  

   
  deleteAppointment(appointmentId: number | undefined): void {
    if (appointmentId === undefined) {
      console.error('Invalid appointment ID');
      return;
    }
 
    if (confirm('Are you sure you want to delete this appointment?')) {
      this.appointmentService.deleteAppointment(appointmentId).subscribe(
        () => {
          //filter out the deleted appointment from list
          this.appointments = this.appointments.filter(app => app.appointmentId !== appointmentId);
        },
        (error) => {
          this.errorMessage = 'Failed to delete appointment.';
          console.error('Error deleting appointment:', error);
        }
      );
    }
  }
}