import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Appointment } from 'src/app/models/appointment.model';
import { User } from 'src/app/models/user.model';
import { VehicleMaintenance } from 'src/app/models/vehicle-maintenance.model';
import { AppointmentService } from 'src/app/services/appointment.service';
import { VehicleService } from 'src/app/services/vehicle.service';
import { AuthService } from 'src/app/services/auth.service'; // Uncomment if using AuthService

// Helper interface to manage the form data for each row
export interface ServiceBookingForm {
  service: VehicleMaintenance;
  appointmentDate: string;
  location: string;
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

  // --- Data Arrays ---
  public allBookingForms: ServiceBookingForm[] = [];
  public paginatedBookingForms: ServiceBookingForm[] = [];

  // --- State Properties ---
  currentUser: User | null = null;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private appointmentService: AppointmentService,
    private vehicleService: VehicleService,
    private authService: AuthService // Use this if authentication is implemented
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
        username: username
      };
    } else {
      this.errorMessage = 'User not logged in.';
    }
  }

  loadServices(): void {
    this.vehicleService.getAllServices().subscribe(
      (services) => {
        if (services && Array.isArray(services)) {
          this.allBookingForms = services.map(s => ({
            service: s,
            appointmentDate: '',
            location: ''
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

  onSubmit(item: ServiceBookingForm, form: NgForm): void {
    if (form.invalid || !this.currentUser) {
      this.errorMessage = 'Please fill all fields or log in.';
      return;
    }

    const formattedDate = new Date(item.appointmentDate).toISOString().split('T')[0]; // "yyyy-MM-dd"

const newAppointment: Appointment = {
  service: { serviceId: item.service.serviceId } as VehicleMaintenance,
  appointmentDate: formattedDate,
  location: item.location,
  user: { userId: this.currentUser!.userId } as User
};


    this.appointmentService.addAppointment(newAppointment).subscribe(
      (savedAppointment) => {
        this.successMessage = 'Appointment added successfully!';
        item.appointmentDate = '';
        item.location = '';
        form.resetForm();
        setTimeout(() => this.successMessage = '', 3000);
      },
      (error) => {
        this.errorMessage = 'Failed to book this appointment. Please try again.';
        //console.error('Error booking appointment:', error);
      }
    );
  }

  updatePaginatedItems(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedBookingForms = this.allBookingForms.slice(startIndex, endIndex);
  }

  getTotalPages(): number {
    return Math.ceil(this.allBookingForms.length / this.itemsPerPage);
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