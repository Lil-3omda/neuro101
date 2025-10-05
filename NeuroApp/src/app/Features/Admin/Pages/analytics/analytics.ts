import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../Services/admin.service';
import { IAnalytics } from '../../Interfaces/admin.interface';

@Component({
  selector: 'app-admin-analytics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analytics.html',
  styleUrl: './analytics.css'
})
export class AdminAnalytics implements OnInit {
  analytics: IAnalytics | null = null;
  loading = false;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadAnalytics();
  }

  loadAnalytics() {
    this.loading = true;
    this.adminService.getAnalytics().subscribe({
      next: (data) => {
        this.analytics = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading analytics:', error);
        this.setMockAnalytics();
        this.loading = false;
      }
    });
  }

  setMockAnalytics() {
    this.analytics = {
      totalUsers: 1547,
      totalProducts: 342,
      totalOrders: 856,
      totalRevenue: 124500,
      activeUsers: 1203,
      pendingOrders: 45,
      lowStockProducts: 12,
      recentUsers: [],
      recentOrders: [],
      salesByMonth: [
        { month: 'Jan', sales: 450, orders: 85 },
        { month: 'Feb', sales: 620, orders: 102 },
        { month: 'Mar', sales: 780, orders: 125 },
        { month: 'Apr', sales: 950, orders: 148 },
        { month: 'May', sales: 1100, orders: 167 },
        { month: 'Jun', sales: 1280, orders: 189 }
      ],
      usersByRole: [
        { role: 'Student', count: 1350 },
        { role: 'Instructor', count: 142 },
        { role: 'Admin', count: 15 }
      ]
    };
  }

  getMaxSales(): number {
    if (!this.analytics?.salesByMonth) return 0;
    return Math.max(...this.analytics.salesByMonth.map(s => s.sales));
  }

  getSalesPercentage(sales: number): number {
    const max = this.getMaxSales();
    return max > 0 ? (sales / max) * 100 : 0;
  }

  getTotalUsersCount(): number {
    if (!this.analytics?.usersByRole) return 0;
    return this.analytics.usersByRole.reduce((sum, role) => sum + role.count, 0);
  }

  getUserRolePercentage(count: number): number {
    const total = this.getTotalUsersCount();
    return total > 0 ? (count / total) * 100 : 0;
  }

  getRoleColor(role: string): string {
    const colors: { [key: string]: string } = {
      'Student': '#4361ee',
      'Instructor': '#10b981',
      'Admin': '#f72585'
    };
    return colors[role] || '#6c757d';
  }
}
