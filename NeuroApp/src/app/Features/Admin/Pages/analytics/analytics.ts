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


  getMaxEnrollments(): number {
    if (!this.analytics?.enrollmentsByMonth) return 0;
    return Math.max(...this.analytics.enrollmentsByMonth.map(e => e.enrollments));
  }

  getEnrollmentPercentage(enrollments: number): number {
    const max = this.getMaxEnrollments();
    return max > 0 ? (enrollments / max) * 100 : 0;
  }

  getTotalCoursesCount(): number {
    if (!this.analytics?.coursesByCategory) return 0;
    return this.analytics.coursesByCategory.reduce((sum, cat) => sum + cat.coursesCount, 0);
  }

  getCategoryPercentage(count: number): number {
    const total = this.getTotalCoursesCount();
    return total > 0 ? (count / total) * 100 : 0;
  }

  getCategoryColor(index: number): string {
    const colors = ['#4361ee', '#10b981', '#f72585', '#f59e0b', '#8b5cf6', '#06b6d4'];
    return colors[index % colors.length];
  }
}
