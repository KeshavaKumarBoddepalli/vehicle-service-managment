import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Appointment } from 'src/app/models/appointment.model';
import { User } from 'src/app/models/user.model';
import { VehicleMaintenance } from 'src/app/models/vehicle-maintenance.model';
import { AppointmentService } from 'src/app/services/appointment.service';
import { VehicleService } from 'src/app/services/vehicle.service';

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
    itemsPerPage: number = 5; // Number of items per page
   
    // --- Data Arrays ---
    public allBookingForms: ServiceBookingForm[] = []; // Holds all services
    public paginatedBookingForms: ServiceBookingForm[] = []; // Holds services for the current page
    
    // --- State Properties ---
    currentUser: User | null = null;
    errorMessage: string = '';
    successMessage: string = '';
   
    constructor(
      private appointmentService: AppointmentService,
      private vehicleService: VehicleService
      // private authService: AuthService // Uncomment when AuthService is ready
    ) { }
   
    ngOnInit(): void {
      this.loadCurrentUser();
      this.loadServices();
    }
   
    loadCurrentUser(): void {
      // --- Placeholder data (Remove when auth service is ready) ---
      this.currentUser = { userId: 1, username: 'User1' };
      
      /* // Uncomment this when your auth service is ready
      this.authService.getLoggedInUser().subscribe(user => {
        this.currentUser = user;
      });
      */
    }
   
    loadServices(): void {
      this.vehicleService.getAllServices().subscribe(
        (services) => {
          // Map all services to our form model
          this.allBookingForms = services.map(s => ({
            service: s,
            appointmentDate: '',
            location: ''
          }));
          
          // Update the view with the first page
          this.updatePaginatedItems();
        },
        (error) => {
          this.errorMessage = 'Failed to load services. Please try again later.';
          console.error('Error fetching services:', error);
        }
      );
    }
   
    /**
     * Called when the "Add Appointment" button is clicked for a specific row.
     */
    onSubmit(item: ServiceBookingForm, form: NgForm): void {
      
      if (form.invalid || !this.currentUser) {
        this.errorMessage = 'Please fill all fields or log in.';
        return;
      }
   
      const newAppointment: Appointment = {
        service: item.service,
        appointmentDate: item.appointmentDate,
        location: item.location,
        user: this.currentUser
      };
   
      this.appointmentService.addAppointment(newAppointment).subscribe(
        (savedAppointment) => {
          this.successMessage = 'Appointment added successfully!';
          
          // Reset the form fields for that row
          item.appointmentDate = '';
          item.location = '';
          form.resetForm();
   
          setTimeout(() => this.successMessage = '', 3000);
        },
        (error) => {
          this.errorMessage = 'Failed to book this appointment. Please try again.';
          console.error('Error booking appointment:', error);
        }
      );
    }
   
    // --- Pagination Methods ---
   
    /**
     * Slices the full data array to get items for the current page.
     */
    updatePaginatedItems(): void {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      this.paginatedBookingForms = this.allBookingForms.slice(startIndex, endIndex);
    }
   
    /**
     * Calculates the total number of pages.
     */
    getTotalPages(): number {
      return Math.ceil(this.allBookingForms.length / this.itemsPerPage);
    }
   
    /**
     * Generates an array of page numbers to display in the view.
     */
    getPageNumbers(): number[] {
      const totalPages = this.getTotalPages();
      return Array(totalPages).fill(0).map((x, i) => i + 1);
    }
   
    /**
     * Navigates to a specific page and updates the view.
     */
    goToPage(page: number): void {
      if (page >= 1 && page <= this.getTotalPages()) {
        this.currentPage = page;
        this.updatePaginatedItems();
      }
    }
  }
   
