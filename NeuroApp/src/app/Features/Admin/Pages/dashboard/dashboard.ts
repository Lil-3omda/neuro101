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
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    activeUsers: 0,
    pendingOrders: 0,
    lowStockProducts: 0
  };

  recentUsers: any[] = [];
  recentOrders: any[] = [];
  loading = true;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.loading = true;
    
    // Load dashboard stats
    this.adminService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard stats:', error);
        // Set mock data for demonstration
        this.setMockData();
        this.loading = false;
      }
    });

    // Load analytics for recent data
    this.adminService.getAnalytics().subscribe({
      next: (data) => {
        this.recentUsers = data.recentUsers || [];
        this.recentOrders = data.recentOrders || [];
      },
      error: (error) => {
        console.error('Error loading analytics:', error);
      }
    });
  }

  setMockData() {
    this.stats = {
      totalUsers: 1547,
      totalProducts: 342,
      totalOrders: 856,
      totalRevenue: 124500,
      activeUsers: 1203,
      pendingOrders: 45,
      lowStockProducts: 12
    };

    this.recentUsers = [
      { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Student', createdAt: new Date() },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'Instructor', createdAt: new Date() },
      { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'Student', createdAt: new Date() }
    ];

    this.recentOrders = [
      { id: '1', orderNumber: 'ORD-001', userName: 'John Doe', totalAmount: 299, status: 'Pending', createdAt: new Date() },
      { id: '2', orderNumber: 'ORD-002', userName: 'Jane Smith', totalAmount: 599, status: 'Processing', createdAt: new Date() },
      { id: '3', orderNumber: 'ORD-003', userName: 'Bob Johnson', totalAmount: 199, status: 'Delivered', createdAt: new Date() }
    ];
  }

  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'Pending': 'warning',
      'Processing': 'info',
      'Shipped': 'primary',
      'Delivered': 'success',
      'Cancelled': 'danger'
    };
    return statusMap[status] || 'secondary';
  }
}
