import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
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
 
  // *** MODIFIED: Added 'Cancelled'
  selectedStatus: string = 'All';
  statuses: string[] = ['All', 'Pending', 'Approved', 'Rejected', 'Cancelled'];
 
  isLoading: boolean = true;
 
  // Pagination
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 0;
  totalPagesArray: number[] = [];
 
  // Popups
  showSuccessPopup: boolean = false;
  showErrorPopup: boolean = false;
  
  // Edit Modal
  showEditModal: boolean = false;
  currentEditingAppointment: Appointment | null = null;
  // This holds a copy of the data for the form
  editFormData: { appointmentDate: string, location: string } = { appointmentDate: '', location: '' };
  today: string = ''; // For date validation
  private readonly LOCATION_REGEX = /^[A-Za-z ]+$/; // For location validation
 
  // Cancel Confirmation
  showCancelConfirm: boolean = false;
  appointmentToCancel: Appointment | null = null;
  isProcessing: boolean = false; // Prevents double-clicks
 
  constructor(
    private appointmentService: AppointmentService,
    private authService: AuthService
  ) {}
 
  ngOnInit(): void {
    this.today = new Date().toISOString().split('T')[0];
    
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
        this.allMyAppointments = data.sort((a, b) =>
          new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime()
        );
        this.onFilterChange();
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
    this.currentPage = 1;
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
 
  // --- EDIT METHODS ---
 
  openEditModal(appointment: Appointment): void {
    if (appointment.status !== 'Pending') return;
    
    this.currentEditingAppointment = appointment;
    // Create a copy for the form
    this.editFormData = {
      appointmentDate: appointment.appointmentDate,
      location: appointment.location
    };
    this.showEditModal = true;
    this.closeErrorPopup();
  }
 
  closeEditModal(): void {
    this.showEditModal = false;
    this.currentEditingAppointment = null;
    this.editFormData = { appointmentDate: '', location: '' };
    this.errorMessage = '';
  }
 
  /** *** UPDATED: Calls updateAppointment with a PARTIAL object *** */
  onUpdateAppointment(form: NgForm): void {
    if (form.invalid || !this.currentEditingAppointment) {
      this.errorMessage = 'Please fill all fields correctly.';
      return;
    }
    if (this.isPastDate(this.editFormData.appointmentDate)) {
      this.errorMessage = 'Please select today or a future date.';
      return;
    }
    if (!this.isValidLocation(this.editFormData.location)) {
      this.errorMessage = 'Location can contain only letters and spaces.';
      return;
    }
    
    this.isProcessing = true;
    
    // Create a partial update object.
    // Your new backend service logic will safely handle this.
    const partialUpdate = {
      appointmentDate: this.editFormData.appointmentDate,
      location: this.editFormData.location.trim()
    };
 
    // Calls PUT /api/appointment/{id}
    this.appointmentService.updateAppointment(this.currentEditingAppointment!.appointmentId!, partialUpdate as Appointment).subscribe({
      next: (response) => {
        // 'response' is the updated appointment
        const index = this.allMyAppointments.findIndex(
          app => app.appointmentId === this.currentEditingAppointment!.appointmentId
        );
        if (index !== -1) {
          this.allMyAppointments[index] = response; // Update list with new object
        }
        
        this.onFilterChange();
        this.showSuccess('Appointment updated successfully!');
        this.closeEditModal();
        this.isProcessing = false;
      },
      error: (error) => {
        console.error('Error updating appointment:', error);
        // This will show the error from the backend (e.g., "Only 'Pending'...")
        this.errorMessage = error.error?.message || 'Failed to update appointment.';
        this.isProcessing = false;
      }
    });
  }
 
  // --- CANCEL METHODS ---
 
  openCancelConfirm(appointment: Appointment): void {
    // Allow cancelling 'Pending' OR 'Approved'
    if (appointment.status === 'Rejected' || appointment.status === 'Cancelled') return;
    this.appointmentToCancel = appointment;
    this.showCancelConfirm = true;
  }
 
  closeCancelConfirm(): void {
    this.showCancelConfirm = false;
    this.appointmentToCancel = null;
  }
 
  /** *** UPDATED: Calls the NEW updateAppointmentStatus *** */
  confirmCancel(): void {
    if (!this.appointmentToCancel) return;
 
    this.isProcessing = true;
    
    // Calls PATCH /api/appointment/{id}/status
    this.appointmentService.updateAppointmentStatus(this.appointmentToCancel.appointmentId!, 'Cancelled').subscribe({
      next: (response) => {
        // 'response' is the updated appointment
        const index = this.allMyAppointments.findIndex(
          app => app.appointmentId === this.appointmentToCancel!.appointmentId
        );
        if (index !== -1) {
          this.allMyAppointments[index] = response; // Update list
        }
        
        this.onFilterChange();
        this.showSuccess('Appointment cancelled successfully!');
        this.closeCancelConfirm();
        this.isProcessing = false;
      },
      error: (error) => {
        console.error('Error cancelling appointment:', error);
        // This will show the error from the backend (e.g., "Only 'Pending' or 'Approved'...")
        this.showError(error.error?.message || 'Failed to cancel appointment. Please try again.');
        this.closeCancelConfirm();
        this.isProcessing = false;
      }
    });
  }
 
 
  // --- VALIDATION HELPERS (Unchanged) ---
  private isPastDate(dateStr: string | undefined | null): boolean {
    if (!dateStr) return true;
    return dateStr < this.today;
  }
  private isValidLocation(loc: string | undefined | null): boolean {
    if (!loc) return false;
    const trimmed = loc.trim();
    return trimmed.length > 0 && this.LOCATION_REGEX.test(trimmed);
  }
 
  // --- POPUP HANDLERS (Unchanged) ---
  showSuccess(message: string): void {
    this.successMessage = message;
    this.showSuccessPopup = true;
    setTimeout(() => this.closeSuccessPopup(), 3000);
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