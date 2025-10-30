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
     
      public service: any = {
        serviceName: '',
        servicePrice: null,
        vehicleType: '' 
      };
     
      
      public vehicleTypes: string[] = ['Two-Wheeler', 'Three-Wheeler', 'Four-Wheeler', 'Other'];
     
      public showSuccessPopup = false;
     
     
      @ViewChild('serviceForm') public serviceForm!: NgForm;
     
      constructor(private vehicleService: VehicleService) { }
     
    
       
      public onSubmit(): void {
        
        if (this.serviceForm.valid) {
          
          const newService: VehicleMaintenance = {
            ...this.service,
            
          };
     
          this.vehicleService.addService(newService).subscribe({
            next: (response) => {
              
              this.showSuccessPopup = true;
              console.log('Service added successfully', response);
            },
            error: (err) => {
              
              console.error('Error adding service:', err);
              
            }
          });
        }
      }
     
     
      public closePopup(): void {
        this.showSuccessPopup = false;
        
       
        this.serviceForm.resetForm({
            serviceName: '',
            servicePrice: null,
            vehicleType: ''
        });
      }
    }
    
