import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { UserdetailsService } from 'src/app/services/userdetails.service';
 
@Component({
  selector: 'app-adminviewuserdetails',
  templateUrl: './adminviewuserdetails.component.html',
  styleUrls: ['./adminviewuserdetails.component.css']
})
export class AdminviewuserdetailsComponent implements OnInit {
 
  allCustomers: User[] = [];
  filteredCustomers: User[] = [];
  searchForm: FormGroup;
  userNotFound: boolean = false;
 
  // Inject FormBuilder and your UserService
  constructor(private fb: FormBuilder, private userService: UserdetailsService) { }
 
  ngOnInit(): void {
    // Initialize the search form
    this.searchForm = this.fb.group({
      username: ['']
    });
    // Load customers on component load
    this.loadCustomers();
  }
 
  /**
   * Fetches all users and filters for 'USER' role
   */
  loadCustomers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users: User[]) => {
        // Ensure filtering is case-insensitive (USER vs user)
        this.allCustomers = users.filter(user => user.userRole?.toUpperCase() === 'USER');
        this.filteredCustomers = [...this.allCustomers]; // Set the display list
      },
      error: (err) => {
        console.error('Error fetching users:', err);
        // You could show an error message to the admin here
      }
    });
  }
 
  /**
   * Filters the customer list based on the search form value
   */
  onSearch(): void {
    const searchTerm = this.searchForm.get('username')?.value.toLowerCase().trim();
 
    if (!searchTerm) {
      this.filteredCustomers = [...this.allCustomers];
      this.userNotFound = false;
      return;
    }
 
    this.filteredCustomers = this.allCustomers.filter(user =>
      user.username?.toLowerCase().includes(searchTerm)
    );
 
    this.userNotFound = this.filteredCustomers.length === 0;
  }
 
  /**
   * **[NEW]** Deletes a user by their ID
   * Assumes your UserdetailsService has a `deleteUser(id: number)` method.
   */
  onDeleteUser(userId: number | undefined): void {
    // 1. Guard against undefined userId
    if (!userId) {
      console.error('Cannot delete: User ID is undefined.');
      return;
    }
 
   
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }
 
    
    this.userService.deleteUser(userId).subscribe({
      next: () => {
        this.allCustomers = this.allCustomers.filter(user => user.userId !== userId);
        this.filteredCustomers = this.filteredCustomers.filter(user => user.userId !== userId);
       
     
        console.log(`User ${userId} deleted successfully.`);
      },
      error: (err) => {
 
        console.error(`Error deleting user ${userId}:`, err);
        alert('Failed to delete user. Please try again.');
      }
    });
  }
}
