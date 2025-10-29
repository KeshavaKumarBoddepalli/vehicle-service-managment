import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { VehicleMaintenance } from 'src/app/models/vehicle-maintenance.model';
import { VehicleService } from 'src/app/services/vehicle.service';

@Component({
  selector: 'app-adminaddservice',
  templateUrl: './adminaddservice.component.html',
  styleUrls: ['./adminaddservice.component.css']
})
  export class AdminaddserviceComponent {
      // This will be bound to the form
      // We initialize it with default values
      public service: any = {
        serviceName: '',
        servicePrice: null,
        vehicleType: '' // Default value for the select
      };
     
      // List of options for the dropdown
      public vehicleTypes: string[] = ['Two-Wheeler', 'Three-Wheeler', 'Four-Wheeler', 'Other'];
     
      public showSuccessPopup = false;
     
      // Get a reference to the form in the template
      @ViewChild('serviceForm') public serviceForm!: NgForm;
     
      constructor(private vehicleService: VehicleService) { }
     
      /**
       * Called when the form is submitted.
       */
      public onSubmit(): void {
        // The form is valid, proceed to call the service
        if (this.serviceForm.valid) {
          // Create the payload from the form model
          const newService: VehicleMaintenance = {
            ...this.service,
            // Assuming the backend auto-generates the ID, so we don't send one
          };
     
          this.vehicleService.addService(newService).subscribe({
            next: (response) => {
              // On success, show the popup
              this.showSuccessPopup = true;
              console.log('Service added successfully', response);
            },
            error: (err) => {
              // Handle any errors from the API
              console.error('Error adding service:', err);
              // You could show an error popup here as well
            }
          });
        }
      }
     
      /**
       * Called when the "OK" button on the popup is clicked.
       */
      public closePopup(): void {
        this.showSuccessPopup = false;
        
        // Reset the form to its initial state, clearing all fields
        // and validation messages, allowing the admin to add another service.
        this.serviceForm.resetForm({
            serviceName: '',
            servicePrice: null,
            vehicleType: ''
        });
      }
    }
    
