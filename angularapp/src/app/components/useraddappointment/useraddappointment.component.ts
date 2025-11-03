import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Appointment } from 'src/app/models/appointment.model';
import { User } from 'src/app/models/user.model';
import { VehicleMaintenance } from 'src/app/models/vehicle-maintenance.model';
import { AppointmentService } from 'src/app/services/appointment.service';
import { VehicleService } from 'src/app/services/vehicle.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

export interface ServiceBookingForm {
  service: VehicleMaintenance;
  appointmentDate: string; // 'YYYY-MM-DD'
  location: string;
}

@Component({
  selector: 'app-useraddappointment',
  templateUrl: './useraddappointment.component.html',
  styleUrls: ['./useraddappointment.component.css']
})
export class UseraddappointmentComponent implements OnInit, OnDestroy {

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 5;

  // Data for table rows
  public allBookingForms: ServiceBookingForm[] = [];
  public paginatedBookingForms: ServiceBookingForm[] = [];

  // Auth & messages
  currentUser: User | null = null;
  errorMessage: string = '';
  successMessage: string = '';
  showSuccessPopup: boolean = false;

  // Date helpers
  today: string = ''; // 'YYYY-MM-DD'

  // Popup auto-close
  private popupTimer: any = null;

  // Validation regex: only letters and spaces.
  // If you want to allow accented letters, replace with: /^[A-Za-zÀ-ÖØ-öø-ÿ ]+$/
  private readonly LOCATION_REGEX = /^[A-Za-z ]+$/;

  constructor(
    private appointmentService: AppointmentService,
    private vehicleService: VehicleService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Produce 'YYYY-MM-DD' string for native date inputs and lexicographic comparison
    this.today = new Date().toISOString().split('T')[0];

    this.loadCurrentUser();
    this.loadServices();
  }

  ngOnDestroy(): void {
    if (this.popupTimer) {
      clearTimeout(this.popupTimer);
      this.popupTimer = null;
    }
  }

  // ---------- Data loading ----------

  loadCurrentUser(): void {
    const userId = this.authService.getAuthenticatedUserId();
    const username = this.authService.getAuthenticatedUser();

    if (userId && username) {
      this.currentUser = {
        userId,
        username
      };
    } else {
      this.errorMessage = 'User not logged in.';
    }
  }

  loadServices(): void {
    this.vehicleService.getAllServices().subscribe(
      (services) => {
        if (services && Array.isArray(services)) {
          this.allBookingForms = services.map((s: any) => ({
            service: {
              serviceId: s.id,
              serviceName: s.serviceName,
              servicePrice: s.servicePrice,
              typeOfVehicle: s.typeOfVehicle
            } as VehicleMaintenance,
            appointmentDate: '',
            location: ''
          }));
          this.updatePaginatedItems();
          this.errorMessage = ''; // clear any previous error
        } else {
          this.errorMessage = 'No services found.';
        }
      },
      (_) => {
        this.errorMessage = 'Failed to load services. Please try again later.';
      }
    );
  }

  // ---------- Validation helpers ----------

  /** Returns true if dateStr is strictly before today (string format 'YYYY-MM-DD'). */
  private isPastDate(dateStr: string | undefined | null): boolean {
    if (!dateStr) return true; // treat missing as invalid
    // 'YYYY-MM-DD' strings compare correctly lexicographically
    return dateStr < this.today;
  }

  /** Only letters and spaces; trims and disallows empty or all-spaces. */
  private isValidLocation(loc: string | undefined | null): boolean {
    if (!loc) return false;
    const trimmed = loc.trim();
    return trimmed.length > 0 && this.LOCATION_REGEX.test(trimmed);
  }

  // ---------- Form submission ----------

  onSubmit(item: ServiceBookingForm, form: NgForm): void {
    // Template validators will set form.invalid, but we double-check here for safety
    if (form.invalid || !this.currentUser) {
      this.errorMessage = 'Please fill all fields or log in.';
      return;
    }

    if (this.isPastDate(item.appointmentDate)) {
      this.errorMessage = 'Please select today or a future date.';
      return;
    }

    if (!this.isValidLocation(item.location)) {
      this.errorMessage = 'Location can contain only letters and spaces.';
      return;
    }

    // Keep date as 'YYYY-MM-DD' to avoid timezone shifts caused by toISOString()
    const formattedDate = item.appointmentDate;

    const newAppointment: Appointment = {
      service: { serviceId: item.service.serviceId } as VehicleMaintenance,
      appointmentDate: formattedDate,
      location: item.location.trim(),
      user: {
        userId: this.currentUser!.userId,
        username: this.currentUser!.username
      } as User,
      status: 'Pending'
    };

    console.log('Selected service:', item.service);
    console.log('Payload being sent:', newAppointment);

    this.appointmentService.addAppointment(newAppointment).subscribe(
      (_) => {
        this.showSuccessPopupWith('Appointment added successfully!');

        // Reset only the fields for the current item
        item.appointmentDate = '';
        item.location = '';

        // Reset form state for this row
        form.resetForm();

        // Clear any lingering error message
        this.errorMessage = '';
      },
      (error) => {
        console.error('Error response:', error);
        this.errorMessage = 'Failed to book this appointment. Please try again.';
      }
    );
  }

  // ---------- Popup control ----------

  private showSuccessPopupWith(message: string): void {
    this.successMessage = message;
    this.showSuccessPopup = true;

    if (this.popupTimer) {
      clearTimeout(this.popupTimer);
    }

    // Optional: auto-close after a short delay
    this.popupTimer = setTimeout(() => {
      this.closePopup();
    }, 2000);
  }

  public closePopup(): void {
    this.showSuccessPopup = false;
    this.successMessage = '';

    if (this.popupTimer) {
      clearTimeout(this.popupTimer);
      this.popupTimer = null;
    }

    // Navigate after closing popup
    this.router.navigate(['/userviewappointment']);
  }

  // ---------- Pagination ----------

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
    return Array(totalPages)
      .fill(0)
      .map((_, i) => i + 1);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.getTotalPages()) {
      this.currentPage = page;
      this.updatePaginatedItems();
    }
  }
}