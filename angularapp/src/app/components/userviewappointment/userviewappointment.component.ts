import { Component, OnInit } from '@angular/core';
import { Appointment } from 'src/app/models/appointment.model';
import { AppointmentService } from 'src/app/services/appointment.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-userviewappointment',
  templateUrl: './userviewappointment.component.html',
  styleUrls: ['./userviewappointment.component.css']
})
export class UserviewappointmentComponent implements OnInit {

  allMyAppointments: Appointment[] = [];
  filteredAppointments: Appointment[] = [];
  errorMessage: string = '';
  successMessage: string = '';
  currentUserId: number = 0;

  selectedStatus: string = 'All';
  statuses: string[] = ['All', 'Pending', 'Approved', 'Rejected'];

  constructor(
    private appointmentService: AppointmentService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUserId = this.authService.getAuthenticatedUserId();
    if (this.currentUserId) {
      this.loadAppointmentsForUser(this.currentUserId);
    } else {
      this.errorMessage = 'User not logged in.';
    }
  }

  loadAppointmentsForUser(userId: number): void {
    this.appointmentService.getAppointmentsByUser(userId).subscribe(
      (data) => {
        this.allMyAppointments = data;
        this.filteredAppointments = data;
      },
      (error) => {
        this.errorMessage = 'Failed to load your appointments. Please try again.';
        console.error('Error fetching appointments:', error);
      }
    );
  }

  onFilterChange(): void {
    if (this.selectedStatus === 'All') {
      this.filteredAppointments = this.allMyAppointments;
    } else {
      this.filteredAppointments = this.allMyAppointments.filter(
        app => app.status === this.selectedStatus
      );
    }
  }
}
