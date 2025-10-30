import { Component, OnInit } from '@angular/core';
import { VehicleMaintenance } from 'src/app/models/vehicle-maintenance.model';
import { VehicleService } from 'src/app/services/vehicle.service';

@Component({
  selector: 'app-adminviewservice',
  templateUrl: './adminviewservice.component.html',
  styleUrls: ['./adminviewservice.component.css']
})
export class AdminviewserviceComponent implements OnInit {

  // --- Data Arrays ---
  public allServices: VehicleMaintenance[] = []; // Stores the master list
  public displayedServices: VehicleMaintenance[] = []; // For search results
  public paginatedServices: VehicleMaintenance[] = []; // For the current page
 
  // --- Search & State ---
  public searchQuery: string = '';
  public isLoading: boolean = true;
  public showSearchClear: boolean = false; // To show "Show All" button
  public vehicleTypes: string[] = ['Two-Wheeler', 'Three-Wheeler', 'Four-Wheeler', 'Other']; // For edit dropdown
 
  // --- Pagination ---
  public currentPage: number = 1;
  public pageSize: number = 5; // Rows per page
  public totalPages: number = 0;
  public totalPagesArray: number[] = [];
 
  // --- Modals & Popups ---
  public showEditModal: boolean = false;
  public showDeleteConfirm: boolean = false;
  public showSuccessPopup: boolean = false;
  public successMessage: string = '';
  public serviceToEdit: VehicleMaintenance | null = null;
  public serviceToDelete: VehicleMaintenance | null = null;
 
  constructor(private vehicleService: VehicleService) { }
 
  ngOnInit(): void {
    this.loadAllServices();
  }
 
  /**
   * Fetches all services from the API.
   */
  public loadAllServices(): void {
    this.isLoading = true;
    this.showSearchClear = false;
    this.searchQuery = '';
    this.vehicleService.getAllServices().subscribe({
      next: (data) => {
        this.allServices = data;
        this.displayedServices = [...this.allServices]; // Copy all to displayed
        this.setupPagination();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching services:', err);
        this.allServices = [];
        this.displayedServices = [];
        this.paginatedServices = [];
        this.isLoading = false;
      }
    });
  }
 
  /**
   * Searches for services by name.
   */
  public searchServices(): void {
    if (!this.searchQuery.trim()) {
      return; // Don't search if query is empty
    }
    this.isLoading = true;
    this.showSearchClear = true;
    // Assuming getServiceByName expects a string and might return one or many
    // If it only returns one, this logic needs adjustment.
    // I'll assume it returns an array of services matching the name.
    
    // Simulating search on the frontend as the API (getServiceByName)
    // in your service file looks like it searches by a full name path.
    // If your API supports partial search (e.g., /search?name=Car),
    // you would call this.vehicleService.getServiceByName(this.searchQuery).
    
    // --- START: Frontend Search Simulation ---
    // (Replace this block if your API supports searching)
    this.displayedServices = this.allServices.filter(service =>
      service.serviceName.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
    this.setupPagination();
    this.isLoading = false;
    // --- END: Frontend Search Simulation ---
 
    /* // --- START: API-based Search (if API supports it) ---
    this.vehicleService.getServiceByName(this.searchQuery).subscribe({
      next: (data) => {
        this.displayedServices = Array.isArray(data) ? data : [data]; // Ensure it's an array
        this.setupPagination();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error searching services:', err);
        this.displayedServices = [];
        this.paginatedServices = [];
        this.isLoading = false;
      }
    });
    // --- END: API-based Search ---
    */
  }
 
  /**
   * Resets the view to show all services.
   */
  public showAll(): void {
    this.loadAllServices();
  }
 
  // --- Pagination Methods ---
 
  /**
   * Calculates pagination details based on displayedServices.
   */
  public setupPagination(): void {
    if (this.displayedServices.length === 0) {
      this.paginatedServices = [];
      this.totalPages = 0;
      this.totalPagesArray = [];
      this.currentPage = 1;
      return;
    }
 
    this.totalPages = Math.ceil(this.displayedServices.length / this.pageSize);
    this.totalPagesArray = Array(this.totalPages).fill(0).map((x, i) => i + 1);
 
    // Reset to page 1 if current page is out of bounds (e.g., after a search)
    if(this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }
    
    this.paginate();
  }
 
  /**
   * Slices the array for the current page.
   */
  public paginate(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedServices = this.displayedServices.slice(startIndex, endIndex);
  }
 
  /**
   * Navigates to a specific page.
   * @param page The page number to go to.
   */
  public changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.paginate();
    }
  }
 
  // --- Edit Modal Methods ---
 
  /**
   * Opens the edit modal with the selected service's data.
   */
  public openEditModal(service: VehicleMaintenance): void {
    // Create a deep copy to prevent changes from affecting the table directly
    this.serviceToEdit = { ...service };
    this.showEditModal = true;
  }
 
  public closeEditModal(): void {
    this.showEditModal = false;
    this.serviceToEdit = null;
  }
 
  /**
   * Handles the submission of the update form.
   */
  public onUpdateService(): void {
    if (this.serviceToEdit && this.serviceToEdit.serviceId) {
      this.vehicleService.updateService(this.serviceToEdit.serviceId, this.serviceToEdit).subscribe({
        next: () => {
          this.closeEditModal();
          this.showSuccessPopup = true;
          this.successMessage = 'Data updated successfully!';
          this.loadAllServices(); // Refresh data
        },
        error: (err) => {
          console.error('Error updating service:', err);
          // Optionally show an error popup
        }
      });
    }
  }
 
  // --- Delete Confirm Methods ---
 
  public openDeleteConfirm(service: VehicleMaintenance): void {
    this.serviceToDelete = service;
    this.showDeleteConfirm = true;
  }
 
  public closeDeleteConfirm(): void {
    this.serviceToDelete = null;
    this.showDeleteConfirm = false;
  }
 
  public confirmDelete(): void {
    if (this.serviceToDelete && this.serviceToDelete.serviceId) {
      this.vehicleService.deleteService(this.serviceToDelete.serviceId).subscribe({
        next: () => {
          this.closeDeleteConfirm();
          this.showSuccessPopup = true;
          this.successMessage = 'Service Deleted Successfully!';
          this.loadAllServices(); // Refresh data
        },
        error: (err) => {
          console.error('Error deleting service:', err);
          this.closeDeleteConfirm();
          // Optionally show an error popup
        }
      });
    }
  }
 
  // --- Success Popup Method ---
  
  public closeSuccessPopup(): void {
    this.showSuccessPopup = false;
    this.successMessage = '';
  }
}