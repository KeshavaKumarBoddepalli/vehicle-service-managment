import { Component, OnInit } from '@angular/core';
import { Appointment } from 'src/app/models/appointment.model';
import { AppointmentService } from 'src/app/services/appointment.service';

// import { AuthService } from '../../services/auth.service'; // Uncomment when ready
 
@Component({
  selector: 'app-userviewappointment',
  templateUrl: './userviewappointment.component.html',
  styleUrls: ['./userviewappointment.component.css']
})
export class UserviewappointmentComponent implements OnInit {
 
  // This holds the complete list of appointments from the server
  allMyAppointments: Appointment[] = [];
  
  // This holds the list to be displayed in the table (after filtering)
  filteredAppointments: Appointment[] = [];
  
  errorMessage: string = '';
  currentUserId: number = 1; // Placeholder: Replace with real user ID from AuthService
 
  // Properties for the filter
  selectedStatus: string = 'All';
  statuses: string[] = ['All', 'Pending', 'Approved', 'Rejected'];
 
  constructor(
    private appointmentService: AppointmentService
    // private authService: AuthService // Uncomment when AuthService is ready
  ) { }
 
  ngOnInit(): void {
    // In a real app, you'd get the user ID from the authService first
    // this.authService.getLoggedInUser().subscribe(user => {
    //   if(user && user.userId) {
    //     this.currentUserId = user.userId;
    //     this.loadAppointmentsForUser(this.currentUserId);
    //   }
    // });
 
    // Using placeholder ID for now
    if (this.currentUserId) {
      this.loadAppointmentsForUser(this.currentUserId);
    }
  }
 
  loadAppointmentsForUser(userId: number): void {
    this.appointmentService.getAppointmentsByUser(userId).subscribe(
      (data) => {
        this.allMyAppointments = data;
        this.filteredAppointments = data; // Initially, show all
        
        if (data.length === 0) {
          // This message is now handled by the 'noAppointments' template
        }
      },
      (error) => {
        this.errorMessage = 'Failed to load your appointments. Please try again.';
        console.error('Error fetching appointments:', error);
      }
    );
  }
 
  /**
   * Called when the user changes the value in the "Filter by Status" dropdown.
   */
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