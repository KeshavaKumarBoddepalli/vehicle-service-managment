import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  
  username = '';
  email = '';
  mobile = '';
  profileImage = 'assets/profilelogo.webp';

  isEditing = false;
  showSuccess = false;
  usernameError=false;
  emailError = false;
  mobileError = false;

 constructor(private http:HttpClient ){}

 
  enableEdit(): void {
    this.isEditing = true;
  }

  // Cancel edit mode
  cancelEdit(): void {
    this.isEditing = false;
    this.usernameError=false;
    this.emailError = false;
    this.mobileError = false;
  }

  // Update profile with validation
  updateProfile(): void {
    this.usernameError= !/^[a-zA-Z]{3,}$/.test(this.username);
    // Validate email
    this.emailError = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
    // Validate mobile (10 digits)
    this.mobileError = !/^\d{10}$/.test(this.mobile);

    if (this.emailError || this.mobileError || this.usernameError) {
      return; // Stop if validation fails
    }

    this.isEditing = false;
    this.showSuccess = true;

  
    setTimeout(() => this.showSuccess = false, 3000);
  }
  ngOnInit(): void {
   this.fetchUserProfile();
    
  }
  fetchUserProfile():void{
    this.http.get<any>('https://8080-abcfbddbcfffceebfaeeaaeddacfffbcfdda.premiumproject.examly.io/api').subscribe({
      next:(data)=>{
        this.username = data.username;
        this.email = data.email;
        this.mobile = data.mobile;
      },
      error:(err)=>console.error('Error fetching profile:',err)
    });
  }
  

}


