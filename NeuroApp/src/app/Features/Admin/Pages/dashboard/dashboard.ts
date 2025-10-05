import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../Services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class AdminDashboard implements OnInit {
  stats = {
    totalUsers: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    totalInstructors: 0,
    activeStudents: 0,
    pendingInstructors: 0,
    totalCategories: 0
  };

  recentUsers: any[] = [];
  recentEnrollments: any[] = [];
  loading = true;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.loading = true;

    this.adminService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard stats:', error);
        this.setMockData();
        this.loading = false;
      }
    });

    this.adminService.getAnalytics().subscribe({
      next: (data) => {
        this.recentUsers = data.recentUsers || [];
        this.recentEnrollments = data.recentEnrollments || [];
      },
      error: (error) => {
        console.error('Error loading analytics:', error);
      }
    });
  }

  setMockData() {
    this.stats = {
      totalUsers: 1547,
      totalCourses: 342,
      totalEnrollments: 856,
      totalInstructors: 89,
      activeStudents: 1203,
      pendingInstructors: 12,
      totalCategories: 15
    };

    this.recentUsers = [
      { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Student', createdAt: new Date() },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'Instructor', createdAt: new Date() },
      { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'Student', createdAt: new Date() }
    ];

    this.recentEnrollments = [
      { id: '1', studentName: 'John Doe', courseName: 'Machine Learning Basics', enrollmentDate: new Date(), status: 'Active' },
      { id: '2', studentName: 'Jane Smith', courseName: 'Deep Learning Advanced', enrollmentDate: new Date(), status: 'Active' },
      { id: '3', studentName: 'Bob Johnson', courseName: 'Natural Language Processing', enrollmentDate: new Date(), status: 'Completed' }
    ];
  }

  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'Active': 'success',
      'Completed': 'primary',
      'In Progress': 'info',
      'Cancelled': 'danger'
    };
    return statusMap[status] || 'secondary';
  }
}
