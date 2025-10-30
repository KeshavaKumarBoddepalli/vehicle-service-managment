import { Component, OnInit } from '@angular/core';
// <-- Import Reactive Forms classes
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Appointment } from 'src/app/models/appointment.model';
import { User } from 'src/app/models/user.model';
import { VehicleMaintenance } from 'src/app/models/vehicle-maintenance.model';
import { AppointmentService } from 'src/app/services/appointment.service';
import { VehicleService } from 'src/app/services/vehicle.service';
import { AuthService } from 'src/app/services/auth.service';
 
// <-- Helper interface to hold the service and its form
export interface ServiceBookingRow {
  service: VehicleMaintenance;
  form: FormGroup;
}
 
@Component({
  selector: 'app-useraddappointment',
  templateUrl: './useraddappointment.component.html',
  styleUrls: ['./useraddappointment.component.css']
})
export class UseraddappointmentComponent implements OnInit {
 
  // --- Pagination Properties ---
  currentPage: number = 1;
  itemsPerPage: number = 5;
 
  // --- Data Arrays (updated) ---
  // <-- This list holds the original data and a form for each row
  public allBookingRows: ServiceBookingRow[] = [];
  // <-- This list holds the paginated view
  public paginatedBookingRows: ServiceBookingRow[] = [];
 
  // --- State Properties ---
  currentUser: User | null = null;
  errorMessage: string = '';
  successMessage: string = '';
 
  constructor(
    private appointmentService: AppointmentService,
    private vehicleService: VehicleService,
    private authService: AuthService,
    private fb: FormBuilder // <-- Inject FormBuilder
  ) {}
 
  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadServices();
  }
 
  loadCurrentUser(): void {
    const userId = this.authService.getAuthenticatedUserId();
    const username = this.authService.getAuthenticatedUser();
 
    if (userId && username) {
      this.currentUser = {
        userId: userId,
        username: username,
        // Ensure other required User properties are filled if necessary
      } as User;
    } else {
      this.errorMessage = 'User not logged in.';
    }
  }
 
  loadServices(): void {
    this.vehicleService.getAllServices().subscribe(
      (services) => {
        if (services && Array.isArray(services)) {
          // <-- Map services to the new row model, creating a form for each
          this.allBookingRows = services.map(s => ({
            service: s,
            form: this.fb.group({
              // Add validation rules here
              appointmentDate: ['', [Validators.required]],
              location: ['', [Validators.required, Validators.minLength(3)]]
            })
          }));
          this.updatePaginatedItems();
        } else {
          this.errorMessage = 'No services found.';
          console.warn('Unexpected response:', services);
        }
      },
      (error) => {
        this.errorMessage = 'Failed to load services. Please try again later.';
        console.error('Error fetching services:', error);
      }
    );
  }
 
  // <-- Updated onSubmit to use the ServiceBookingRow
  onSubmit(row: ServiceBookingRow): void {
    // Mark controls as touched to show validation errors
    row.form.markAllAsTouched();
 
    if (row.form.invalid || !this.currentUser) {
      this.errorMessage = 'Please fill all fields correctly or log in.';
      return;
    }
    this.errorMessage = ''; // Clear error if form is valid
 
    // <-- Get values from the reactive form
    const formValue = row.form.value;
    const formattedDate = new Date(formValue.appointmentDate).toISOString().split('T')[0];
 
    const newAppointment: Appointment = {
      service: row.service,
      appointmentDate: formattedDate,
      location: formValue.location, // <-- Get location from form
      user: { userId: this.currentUser!.userId } as User
    };
 
    this.appointmentService.addAppointment(newAppointment).subscribe(
      (savedAppointment) => {
        this.successMessage = 'Appointment added successfully!';
        row.form.reset(); // <-- Reset the reactive form
        setTimeout(() => this.successMessage = '', 3000);
      },
      (error) => {
        // Log the full error for debugging
        console.error('Error booking appointment:', error);
        
        // Provide a more specific error if possible
        if (error.status === 401) {
            this.errorMessage = 'Authentication error. Please log in again.';
        } else if (error.error && typeof error.error.message === 'string') {
            this.errorMessage = `Failed to book: ${error.error.message}`;
        } else {
            this.errorMessage = 'Failed to book this appointment. Please try again.';
        }
      }
    );
  }
 
  // --- Pagination (Updated property names) ---
 
  updatePaginatedItems(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    // <-- Use allBookingRows and paginatedBookingRows
    this.paginatedBookingRows = this.allBookingRows.slice(startIndex, endIndex);
  }
 
  getTotalPages(): number {
    // <-- Use allBookingRows
    return Math.ceil(this.allBookingRows.length / this.itemsPerPage);
  }
 
  getPageNumbers(): number[] {
    const totalPages = this.getTotalPages();
    return Array(totalPages).fill(0).map((_, i) => i + 1);
  }
 
  goToPage(page: number): void {
    if (page >= 1 && page <= this.getTotalPages()) {
      this.currentPage = page;
      this.updatePaginatedItems();
    }
  }
}