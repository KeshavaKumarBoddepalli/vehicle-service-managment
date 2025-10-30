import { Component, OnInit } from '@angular/core';
import { UserdetailsService } from '../../services/userdetails.service';

interface UiUser {
  id: number;
  username: string;
  email: string;
  role: string;
  mobile: string;
}

@Component({
  selector: 'app-adminviewuserdetails',
  templateUrl: './adminviewuserdetails.component.html',
  styleUrls: ['./adminviewuserdetails.component.css']
})
export class AdminviewuserdetailsComponent implements OnInit {
  users: UiUser[] = [];
  loading = false;
  lastError: string | null = null;

 
  searchQuery: string = '';

  constructor(private userDetailsService: UserdetailsService) {}

  ngOnInit(): void {
    // this.loadUsers();
  }

  // private loadUsers(): void {
  //   this.loading = true;
  //   this.lastError = null;

  //   this.userDetailsService.getAllUsers().subscribe({
  //     next: (res: any) => {
  //       const list = Array.isArray(res) ? res : (res?.data ?? res?.users ?? []);
  //       this.users = (list ?? []).map(this.mapApiToUi);
  //       this.loading = false;
  //     },
  //     error: (err) => {
  //       this.lastError = this.stringifyHttpError(err);
  //       this.users = [];
  //       this.loading = false;
  //     }
  //   });
  // }

  
  // onSearch(): void {
  //   const query = this.searchQuery.trim();
  //   if (!query) {
  //     alert('Please enter a username to search.');
  //     return;
  //   }

  //   this.loading = true;
  //   this.lastError = null;

  //   this.userDetailsService.getUserByName(query).subscribe({
  //     next: (res: any) => {
  //       const user = this.mapApiToUi(res);
  //       this.users = [user]; // Show only searched user
  //       this.loading = false;
  //     },
  //     error: (err) => {
  //       this.lastError = 'User not found or error occurred.';
  //       this.users = [];
  //       this.loading = false;
  //     }
  //   });
  // }

  // onDelete(user: UiUser): void {
  //   const ok = confirm(`Delete user "${user.username}"?`);
  //   if (!ok) return;

  //   this.userDetailsService.deleteUser(user.id).subscribe({
  //     next: () => {
  //       this.users = this.users.filter(u => u.id !== user.id);
  //     },
  //     error: () => {
  //       alert('Failed to delete user.');
  //     }
  //   });
  // }

  // trackById(_i: number, item: UiUser) {
  //   return item.id;
  // }

  // private mapApiToUi = (api: any): UiUser => {
  //   return {
  //     id: Number(api?.id ?? api?.userId ?? 0),
  //     username: api?.username ?? api?.name ?? api?.fullName ?? '',
  //     email: api?.email ?? '',
  //     role: api?.role ?? api?.userRole ?? 'USER',
  //     mobile: api?.mobile ?? api?.mobileNumber ?? api?.phone ?? ''
  //   };
  // };

  // private stringifyHttpError(err: any): string {
  //   if (!err) return 'Unknown error';
  //   if (err.error && typeof err.error === 'string') return err.error;
  //   if (err.error && err.error.message) return err.error.message;
  //   if (err.message) return err.message;
  //   try { return JSON.stringify(err); } catch { return 'Error occurred'; }
  // }
}