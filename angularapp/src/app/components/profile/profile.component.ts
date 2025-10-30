import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
// import { AuthService } from '../services/auth.service'; // Adjust path if needed

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
  usernameError = false;
  emailError = false;
  mobileError = false;

  userId: number = 0;

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    this.userId = this.authService.getAuthenticatedUserId();
    this.fetchUserProfile();
  }

  enableEdit(): void {
    this.isEditing = true;
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.usernameError = false;
    this.emailError = false;
    this.mobileError = false;
  }

  updateProfile(): void {
    this.usernameError = !/^[a-zA-Z]{3,}$/.test(this.username);
    this.emailError = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
    this.mobileError = !/^\d{10}$/.test(this.mobile);

    if (this.usernameError || this.emailError || this.mobileError) {
      return;
    }

    this.isEditing = false;
    this.showSuccess = true;

    const updatedUser = {
      userId: this.userId,
      username: this.username,
      email: this.email,
      mobile: this.mobile
    };

    this.http.put(`https://8080-cddcccedbacfffceebfaeeaaeddacfffbcfdda.premiumproject.examly.io/api/user/view/profile`, updatedUser)
      .subscribe({
        next: () => {
          console.log('Profile updated successfully');
        },
        error: (err) => {
          console.error('Error updating profile:', err);
        }
      });

    setTimeout(() => this.showSuccess = false, 3000);
  }

  fetchUserProfile(): void {
    this.http.get<any>(`https://8080-cddcccedbacfffceebfaeeaaeddacfffbcfdda.premiumproject.examly.io/api/user/${this.userId}`)
      .subscribe({
        next: (data) => {
          this.username = data.username;
          this.email = data.email;
          this.mobile = data.mobileNumber;
        },
        error: (err) => console.error('Error fetching profile:', err)
      });
  }
}
