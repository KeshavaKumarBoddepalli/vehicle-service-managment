import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export  class RegistrationComponent implements OnInit {
  registerForm: FormGroup;
   users: User[] = [];
 
   constructor(private fb: FormBuilder, private service: AuthService, private router: Router) {
     this.registerForm = this.fb.group({
       username: ['', [
         Validators.required,
         Validators.minLength(5),
         Validators.maxLength(10),
         Validators.pattern('^[A-Za-z][A-Za-z0-9_]*$')
       ]],
       email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')]],
       password: ['', [
         Validators.required,
         Validators.minLength(8),
         Validators.pattern('^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')
       ]],
       confirmPassword: ['', Validators.required],
       mobileNumber: ['', [
         Validators.required,
         Validators.pattern('^[6-9]\\d{9}$')
       ]],
       userRole: ['', Validators.required]
     },
       {
         validators: this.passwordMatchValidator
       });
   }
 
  ngOnInit(): void { }
 
   passwordMatchValidator(form: AbstractControl) {
     const password = form.get('password')?.value;
     const confirmPassword = form.get('confirmPassword')?.value;
     return password === confirmPassword ? null : { mismatch: true };
   }
 
  onSubmit() {
    if (this.registerForm.valid) {
     this.service.register(this.registerForm.value).subscribe(
         (result) => {
           this.registerForm.reset();
           alert("Registration successful");
           this.router.navigate(['/login']);
         },
         (error) => {
           this.registerForm.reset();
           alert("Registration not done, We're sorry, but an error occurred. Please try again later.");
           this.router.navigate(['/home'], {
             queryParams: { errorMsg: 'Registration not done due to existing emailId' }
           });
         }
       );
 
     } else {
       this.registerForm.markAllAsTouched();
     }
   }
     

}
