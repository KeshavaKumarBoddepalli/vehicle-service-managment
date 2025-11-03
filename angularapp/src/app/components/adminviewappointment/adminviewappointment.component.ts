import { Component, OnInit } from '@angular/core';
import { Appointment } from 'src/app/models/appointment.model';
import { AppointmentService } from 'src/app/services/appointment.service';
 
@Component({
  selector: 'app-adminviewappointment',
  templateUrl: './adminviewappointment.component.html',
  styleUrls: ['./adminviewappointment.component.css']
})
export class AdminviewappointmentComponent implements OnInit {
 
  appointments: Appointment[] = []; // Master list
  filteredAndSortedAppointments: Appointment[] = []; // List for display logic
  paginatedAppointments: Appointment[] = []; // List for current page
 
  // --- *** NEW: Added isLoading flag *** ---
  isLoading: boolean = true;
  
  errorMessage: string = '';
  private errorPopupTimer: any;
  
  statuses: string[] = ['Pending', 'Approved', 'Rejected'];
 
  // --- Properties for Filtering ---
  filterStatus: string = 'All';
  statusFilterOptions: string[] = ['All', 'Pending', 'Approved', 'Rejected', 'Cancelled'];
 
  // --- Pagination ---
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;
 
  // --- Search & Sort ---
  searchTerm: string = '';
  sortField: string = ''; 
  sortOrder: 'asc' | 'desc' = 'asc'; 
  sortOptions: { value: string, label: string }[] = [
    { value: '', label: 'Default Order' }, 
    { value: 'appointmentId', label: 'Booking ID' }, 
    { value: 'appointmentDate', label: 'Date' },
    { value: 'service.serviceName', label: 'Service Name' },
    { value: 'service.servicePrice', label: 'Price' },
    { value: 'location', label: 'Location' },
    { value: 'user.username', label: 'Username' },
    { value: 'status', label: 'Status' }
  ];
 
  // --- Modals & Popups ---
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
    this.errorMessage = ''; 
    this.isLoading = true; // <-- 1. Set loading to true
    this.appointmentService.getAppointments().subscribe(
      (data) => {
        this.appointments = data; 
        this.applyFiltersAndSort(); 
        this.isLoading = false; // <-- 2. Set loading to false on success
      },
      (error) => {
        this.triggerErrorPopup('Failed to load appointments. Please try again later.');
        console.error('Error fetching appointments:', error);
        this.isLoading = false; // <-- 3. Set loading to false on error
      }
    );
  }
 
  applyFiltersAndSort(): void {
    this.errorMessage = ''; 
    let tempAppointments = [...this.appointments];
 
    // 1. Apply Status Filter
    if (this.filterStatus !== 'All') {
      tempAppointments = tempAppointments.filter(app => app.status === this.filterStatus);
    }
 
    // 2. Apply Search Filter
    if (this.searchTerm.trim() !== '') {
      const lowerTerm = this.searchTerm.toLowerCase();
      tempAppointments = tempAppointments.filter(app =>
        (app.service?.serviceName && app.service.serviceName.toLowerCase().includes(lowerTerm)) ||
        (app.location && app.location.toLowerCase().includes(lowerTerm)) ||
        (app.user?.username && app.user.username.toLowerCase().includes(lowerTerm)) ||
        (app.status && app.status.toLowerCase().includes(lowerTerm))
      );
    }
 
    // 3. Apply Sort
    if (this.sortField) {
      tempAppointments.sort((a, b) => {
        const valA = this.getNestedPropertyValue(a, this.sortField);
        const valB = this.getNestedPropertyValue(b, this.sortField);
 
        let comparison = 0;
 
        if (valA === null || valA === undefined) return 1;
        if (valB === null || valB === undefined) return -1;
 
        if (this.sortField === 'appointmentDate') {
          comparison = new Date(valA).getTime() - new Date(valB).getTime();
        } else if (typeof valA === 'number' && typeof valB === 'number') {
          comparison = valA - valB;
        } else if (typeof valA === 'string' && typeof valB === 'string') {
          comparison = valA.toLowerCase().localeCompare(valB.toLowerCase());
        } else {
          comparison = String(valA).localeCompare(String(valB));
        }
 
        return this.sortOrder === 'asc' ? comparison : -comparison;
      });
    }
 
    this.filteredAndSortedAppointments = tempAppointments;
    this.currentPage = 1;
    this.updatePaginatedAppointments(); 
  }
 
  private getNestedPropertyValue(obj: any, path: string): any {
    if (!obj || !path) return null;
    return path.split('.').reduce((acc, part) => (acc && acc[part] !== undefined) ? acc[part] : null, obj);
  }
 
 
  updatePaginatedAppointments(): void {
    const totalItems = this.filteredAndSortedAppointments.length;
 
    if (totalItems === 0) {
      this.paginatedAppointments = [];
      this.totalPages = 0;
      return;
    }
 
    this.totalPages = Math.ceil(totalItems / this.itemsPerPage);
 
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
 
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedAppointments = this.filteredAndSortedAppointments.slice(startIndex, endIndex);
 
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
 
 
  private triggerSuccessPopup(message: string): void {
    this.errorMessage = ''; 
    if (this.errorPopupTimer) {
      clearTimeout(this.errorPopupTimer);
    }
 
    this.successMessage = message;
    this.showSuccessPopup = true;
 
    if (this.successPopupTimer) {
      clearTimeout(this.successPopupTimer);
    }
 
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
 
  private triggerErrorPopup(message: string): void {
    this.showSuccessPopup = false; 
    if (this.successPopupTimer) {
      clearTimeout(this.successPopupTimer);
    }
 
    this.errorMessage = message;
 
    if (this.errorPopupTimer) {
      clearTimeout(this.errorPopupTimer);
    }
 
    this.errorPopupTimer = setTimeout(() => {
      this.errorMessage = ''; 
      this.errorPopupTimer = null;
    }, 4000);
  }
 
 
  requestDeleteAppointment(appointmentId: number | undefined): void {
    if (appointmentId === undefined) {
      return;
    }
    this.appointmentToDeleteId = appointmentId;
    this.showDeleteModal = true;
  }
 
 
  cancelDelete(): void {
    this.showDeleteModal = false;
    this.appointmentToDeleteId = undefined;
  }
 
  confirmDelete(): void {
    if (this.appointmentToDeleteId === undefined) {
      return;
    }
 
    this.appointmentService.deleteAppointment(this.appointmentToDeleteId).subscribe(
      () => {
        this.appointments = this.appointments.filter(app => app.appointmentId !== this.appointmentToDeleteId);
        this.applyFiltersAndSort();
        this.triggerSuccessPopup('Appointment deleted successfully!');
      },
      (error) => {
        this.triggerErrorPopup('Failed to delete appointment.');
        console.error('Error deleting appointment:', error);
      },
      () => {
        this.showDeleteModal = false;
        this.appointmentToDeleteId = undefined;
      }
    );
  }
 
 
  onStatusChange(appointment: Appointment): void {
    if (!appointment.appointmentId) {
      console.error('Appointment ID is missing');
      return;
    }
 
    const originalAppointment = this.appointments.find(a => a.appointmentId === appointment.appointmentId);
    
    if (originalAppointment && originalAppointment.status == 'Cancelled') {
      
      this.triggerErrorPopup(`Error: 'Cancelled' appointments cannot be changed.`);
 
      appointment.status = originalAppointment.status; 
      
      const paginatedIndex = this.paginatedAppointments.findIndex(a => a.appointmentId === appointment.appointmentId);
      if (paginatedIndex !== -1) {
          this.paginatedAppointments[paginatedIndex].status = originalAppointment.status;
      }
      
      return; 
    }
 
    // Call the dedicated status update method
    this.appointmentService.updateAppointmentStatus(appointment.appointmentId, appointment.status).subscribe(
      (updatedFromServer) => {
        const index = this.appointments.findIndex(a => a.appointmentId === updatedFromServer.appointmentId);
        if (index !== -1) {
          this.appointments[index] = updatedFromServer; 
        }
        this.applyFiltersAndSort();
        this.triggerSuccessPopup('Status updated successfully!');
      },
      (error) => {
        this.triggerErrorPopup('Failed to update status. Please try again.');
        console.error('Error updating status:', error);
        this.loadAllAppointments();
      }
    );
  }
 
  onFilterChange(): void {
    this.applyFiltersAndSort();
  }
}
 