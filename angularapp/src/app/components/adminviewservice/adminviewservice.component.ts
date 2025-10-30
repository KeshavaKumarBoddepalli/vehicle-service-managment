import { Component, OnInit } from '@angular/core';
import { VehicleService } from 'src/app/services/vehicle.service';
import { VehicleMaintenance } from 'src/app/models/vehicle-maintenance.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-adminviewservice',
  templateUrl: './adminviewservice.component.html',
  styleUrls: ['./adminviewservice.component.css']
})
export class AdminviewserviceComponent implements OnInit {
  services: VehicleMaintenance[] = [];
  errorMessage: string = '';

  constructor(private vehicleService: VehicleService,private router:Router) {}

  ngOnInit(): void {
    this.loadServices();
  }
    loadServices(): void {
      this.vehicleService.getAllServices().subscribe(
        (data) => {
          this.services = data.map((s: any) => ({
            serviceId: s.id, // map id to serviceId
            serviceName: s.serviceName,
            servicePrice: s.servicePrice,
            typeOfVehicle: s.typeOfVehicle
          }));
        },
        (error) => {
          this.errorMessage = 'Failed to load services.';
          console.error(error);
        }
      );
    }

  deleteService(serviceId: number): void {
    if (confirm('Are you sure you want to delete this service?')) {
      console.log(serviceId);
      this.vehicleService.deleteService(serviceId).subscribe(
        () => {
          this.services = this.services.filter(s => s.serviceId !== serviceId);
        },
        (error) => {
          console.error('Delete failed:', error);
        }
      );
    }
  }

  
  editService(service: VehicleMaintenance): void {
    this.router.navigate(['/admin/editservice', service.serviceId]);
  }
<<<<<<< HEAD
}
=======
  

}
>>>>>>> origin/main
