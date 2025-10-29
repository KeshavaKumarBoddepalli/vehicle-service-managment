import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string;
  password: string;
 
  constructor(private authService: AuthService, private router: Router) { }
 
  ngOnInit(): void {}
 
  isSubmitting = false;
 
login() {
  if (this.username && this.password) {
    this.isSubmitting = true;
    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        alert('Login successful!');
        this.router.navigate(['/adminaddservice']);
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Login failed', error);
        alert('Login failed: Invalid username or password.');
      }
    });
  }
}

}
