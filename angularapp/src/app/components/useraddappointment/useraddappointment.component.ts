import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Appointment } from 'src/app/models/appointment.model';
import { User } from 'src/app/models/user.model';
import { VehicleMaintenance } from 'src/app/models/vehicle-maintenance.model';
import { AppointmentService } from 'src/app/services/appointment.service';
import { VehicleService } from 'src/app/services/vehicle.service';
import { AuthService } from 'src/app/services/auth.service';

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

  currentPage: number = 1;
  itemsPerPage: number = 5;

  public allBookingForms: ServiceBookingForm[] = [];
  public paginatedBookingForms: ServiceBookingForm[] = [];

  currentUser: User | null = null;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private appointmentService: AppointmentService,
    private vehicleService: VehicleService,
    private authService: AuthService
  ) {}

  today: string = '';
  ngOnInit(): void {
    this.today = new Date().toISOString().split('T')[0];
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
          this.allBookingForms = services.map((s: any) => ({
            service: {
              serviceId: s.id, // map 'id' from backend to 'serviceId'
              serviceName: s.serviceName,
              servicePrice: s.servicePrice,
              typeOfVehicle: s.typeOfVehicle
            },
            appointmentDate: '',
            location: ''
          }));
          this.updatePaginatedItems();
        } else {
          this.errorMessage = 'No services found.';
        }
      },
      (error) => {
        this.errorMessage = 'Failed to load services. Please try again later.';
      }
    );
  }

  onSubmit(item: ServiceBookingForm, form: NgForm): void {
    if (form.invalid || !this.currentUser) {
      this.errorMessage = 'Please fill all fields or log in.';
      return;
    }

    const formattedDate = new Date(item.appointmentDate).toISOString().split('T')[0];

    const newAppointment: Appointment = {
      service: { serviceId: item.service.serviceId } as VehicleMaintenance,
      appointmentDate: formattedDate,
      location: item.location,
      user: { userId: this.currentUser!.userId, username: this.currentUser!.username } as User,
      status: 'Pending'
    };

    console.log('Selected service:', item.service);
    console.log('Payload being sent:', newAppointment);

    this.appointmentService.addAppointment(newAppointment).subscribe(
      (savedAppointment) => {
        this.successMessage = 'Appointment added successfully!';
        item.appointmentDate = '';
        item.location = '';
        form.resetForm();
        setTimeout(() => this.successMessage = '', 3000);
      },
      (error) => {
        console.error('Error response:', error);
        this.errorMessage = 'Failed to book this appointment. Please try again.';
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