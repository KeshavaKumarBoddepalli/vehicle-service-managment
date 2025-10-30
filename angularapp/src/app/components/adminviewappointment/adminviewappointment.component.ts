import { Component, OnInit } from '@angular/core';
import { Appointment } from 'src/app/models/appointment.model';
import { AppointmentService } from 'src/app/services/appointment.service';
 
@Component({
  selector: 'app-adminviewappointment',
  templateUrl: './adminviewappointment.component.html',
  styleUrls: ['./adminviewappointment.component.css']
})
export class AdminviewappointmentComponent implements OnInit {
  // --- Existing Properties ---
  appointments: Appointment[] = []; // This will hold the MASTER list of all appointments
  errorMessage: string = '';
  statuses: string[] = ['Pending', 'Approved', 'Rejected'];
 
  // --- Properties for Pagination ---
  paginatedAppointments: Appointment[] = []; // This will hold the appointments for the current page
  currentPage: number = 1;
  itemsPerPage: number = 10; // Hardcoded default, since dropdown is removed
  totalPages: number = 0;
 
  // --- New Properties for Modals/Popups ---
  showDeleteModal: boolean = false;
  showSuccessPopup: boolean = false;
  successMessage: string = '';
  appointmentToDeleteId: number | undefined = undefined;
  private successPopupTimer: any;
 
  constructor(private appointmentService: AppointmentService) { }
 
  ngOnInit(): void {
    this.loadAllAppointments();
  }
 
  loadAllAppointments(): void {
    this.appointmentService.getAppointments().subscribe(
      (data) => {
        this.appointments = data; // Load all appointments into the master list
        this.totalPages = Math.ceil(this.appointments.length / this.itemsPerPage);
        this.updatePaginatedAppointments(); // Update the view for the first page
      },
      (error) => {
        this.errorMessage = 'Failed to load appointments. Please try again later.';
        console.error('Error fetching appointments:', error);
      }
    );
  }
 
  // --- New Pagination Methods ---
 
  updatePaginatedAppointments(): void {
    if (this.appointments.length === 0) {
      this.paginatedAppointments = [];
      this.totalPages = 0; // Ensure total pages is 0 if no appointments
      this.currentPage = 1; // Reset to page 1
      return;
    }
 
    // Recalculate total pages in case it changed (e.g., deletion)
    this.totalPages = Math.ceil(this.appointments.length / this.itemsPerPage);
 
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedAppointments = this.appointments.slice(startIndex, endIndex);
 
    // Handle edge case where user might be on a page that no longer exists (e.g., after deletion)
    if (this.paginatedAppointments.length === 0 && this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedAppointments();
    }
  }
 
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedAppointments();
    }
  }
 
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedAppointments();
    }
  }
 
  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedAppointments();
    }
  }
 
  // --- New Methods for Modals and Popups ---
 
  /**
   * Shows a success message popup for 3 seconds.
   */
  private triggerSuccessPopup(message: string): void {
    this.successMessage = message;
    this.showSuccessPopup = true;
 
    // Clear any existing timer to avoid conflicts
    if (this.successPopupTimer) {
      clearTimeout(this.successPopupTimer);
    }
 
    // Hide the popup after 3 seconds
    this.successPopupTimer = setTimeout(() => {
      this.closeSuccessPopup();
    }, 3000);
  }
 
  closeSuccessPopup(): void {
    this.showSuccessPopup = false;
    this.successMessage = '';
    if (this.successPopupTimer) {
      clearTimeout(this.successPopupTimer);
      this.successPopupTimer = null;
    }
  }
 
  /**
   * Called by the "Delete" button. Sets up the delete confirmation modal.
   */
  requestDeleteAppointment(appointmentId: number | undefined): void {
    if (appointmentId === undefined) {
      console.error('Invalid appointment ID');
      return;
    }
    this.appointmentToDeleteId = appointmentId;
    this.showDeleteModal = true;
  }
 
  /**
   * Called by the "Cancel" button on the delete modal.
   */
  cancelDelete(): void {
    this.showDeleteModal = false;
    this.appointmentToDeleteId = undefined;
  }
 
  /**
   * Called by the "Confirm Delete" button on the delete modal.
   * Performs the actual deletion.
   */
  confirmDelete(): void {
    if (this.appointmentToDeleteId === undefined) {
      return;
    }
 
    this.appointmentService.deleteAppointment(this.appointmentToDeleteId).subscribe(
      () => {
        // Update the MASTER list
        this.appointments = this.appointments.filter(app => app.appointmentId !== this.appointmentToDeleteId);
        // Refresh the pagination (which also recalculates total pages)
        this.updatePaginatedAppointments();
        // Show success message
        this.triggerSuccessPopup('Appointment deleted successfully!');
      },
      (error) => {
        this.errorMessage = 'Failed to delete appointment.';
        console.error('Error deleting appointment:', error);
      },
      () => {
        // This 'complete' block always runs, good place to clean up
        this.showDeleteModal = false;
        this.appointmentToDeleteId = undefined;
      }
    );
  }
 
  // --- Updated Methods ---
 
  /**
   * This function is now called by the new "Update" button.
   */
  onStatusChange(appointment: Appointment): void {
    if (!appointment.appointmentId) {
      console.error('Appointment ID is missing');
      return;
    }
    this.appointmentService.updateAppointment(appointment.appointmentId, appointment).subscribe(
      (updatedFromServer) => {
        // Find and update the appointment in the MASTER list
        const index = this.appointments.findIndex(a => a.appointmentId === updatedFromServer.appointmentId);
        if (index !== -1) {
          this.appointments[index] = updatedFromServer;
        }
        // Refresh the current page's view
        this.updatePaginatedAppointments();
        console.log('Status updated successfully');
        // Show success message
        this.triggerSuccessPopup('Status updated successfully!');
      },
      (error) => {
        this.errorMessage = 'Failed to update status. Please try again.';
        console.error('Error updating status:', error);
        // Reload all data from server in case of failure to ensure consistency
        this.loadAllAppointments();
      }
    );
  }
 
}