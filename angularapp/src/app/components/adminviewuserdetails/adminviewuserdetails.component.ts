import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-adminviewuserdetails',
  templateUrl: './adminviewuserdetails.component.html',
  styleUrls: ['./adminviewuserdetails.component.css']
})
export class AdminviewuserdetailsComponent implements OnInit {
  users: any[] = [];
  searchTerm: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.http.get<any[]>('http://localhost:8080/api/user').subscribe(data => {
      this.users = data;
    });
  }

  searchUser(): void {
    if (this.searchTerm.trim()) {
      this.http.get<any>(`http://localhost:8080/api/name/${this.searchTerm}`).subscribe(user => {
        this.users = user ? [user] : [];
      });
    } else {
      this.loadUsers();
    }
  }

  deleteUser(id: number): void {
    this.http.delete(`http://localhost:8080/api/user/${id}`).subscribe(() => {
      alert('User deleted successfully');
      this.loadUsers();
    });
  }
}
