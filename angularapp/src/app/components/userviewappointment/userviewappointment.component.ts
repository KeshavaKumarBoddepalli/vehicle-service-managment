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
  paginatedAppointments: Appointment[] = [];

  errorMessage: string = '';
  successMessage: string = '';
  currentUserId: number = 0;

  selectedStatus: string = 'All';
  statuses: string[] = ['All', 'Pending', 'Approved', 'Rejected'];

  isLoading: boolean = true;

  // Pagination
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 0;
  totalPagesArray: number[] = [];

  // Popups
  showSuccessPopup: boolean = false;
  showErrorPopup: boolean = false;

  constructor(
    private appointmentService: AppointmentService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUserId = this.authService.getAuthenticatedUserId();
    if (this.currentUserId) {
      this.loadAppointmentsForUser(this.currentUserId);
    } else {
      this.showError('User not logged in.');
    }
  }

  loadAppointmentsForUser(userId: number): void {
    this.isLoading = true;
    this.appointmentService.getAppointmentsByUser(userId).subscribe({
      next: (data) => {
        this.allMyAppointments = data;
        this.filteredAppointments = [...data];
        this.setupPagination();
        this.isLoading = false;
      },
      error: (error) => {
        this.showError('Failed to load your appointments. Please try again.');
        console.error('Error fetching appointments:', error);
        this.isLoading = false;
      }
    });
  }

  onFilterChange(): void {
    if (this.selectedStatus === 'All') {
      this.filteredAppointments = [...this.allMyAppointments];
    } else {
      this.filteredAppointments = this.allMyAppointments.filter(
        app => app.status === this.selectedStatus
      );
    }
    this.setupPagination();
  }

  setupPagination(): void {
    this.totalPages = Math.ceil(this.filteredAppointments.length / this.pageSize);
    this.totalPagesArray = Array(this.totalPages).fill(0).map((_, i) => i + 1);
    this.paginate();
  }

  paginate(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedAppointments = this.filteredAppointments.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.paginate();
    }
  }

  showSuccess(message: string): void {
    this.successMessage = message;
    this.showSuccessPopup = true;
  }

  showError(message: string): void {
    this.errorMessage = message;
    this.showErrorPopup = true;
  }

  closeSuccessPopup(): void {
    this.showSuccessPopup = false;
    this.successMessage = '';
  }

  closeErrorPopup(): void {
    this.showErrorPopup = false;
    this.errorMessage = '';
  }
}