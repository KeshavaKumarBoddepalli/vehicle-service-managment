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
 
  
   // Called when the admin changes the status dropdown for an appointment.
   
  onStatusChange(appointment: Appointment): void {
    if (!appointment.appointmentId) {
      console.error('Appointment ID is missing');
      return;
    }
 
    // The 'appointment' object is already updated by [(ngModel)]
    this.appointmentService.updateAppointment(appointment.appointmentId, appointment).subscribe(
      (updatedFromServer) => {
        // Optionally refresh the local item with the server's response
        const index = this.appointments.findIndex(a => a.appointmentId === updatedFromServer.appointmentId);
        if (index !== -1) {
          this.appointments[index] = updatedFromServer;
        }
        console.log('Status updated successfully');
      },
      (error) => {
        this.errorMessage = 'Failed to update status. Please try again.';
        console.error('Error updating status:', error);
        // On error, reload all data to revert any UI changes
        this.loadAllAppointments();
      }
    );
  }
 
  
   //Called when the admin clicks the "Delete" button.
   
  deleteAppointment(appointmentId: number | undefined): void {
    if (appointmentId === undefined) {
      console.error('Invalid appointment ID');
      return;
    }
 
    // Display the confirmation pop-up
    if (confirm('Are you sure you want to delete this appointment?')) {
      this.appointmentService.deleteAppointment(appointmentId).subscribe(
        () => {
          // On successful deletion, filter out the deleted appointment from the local list
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