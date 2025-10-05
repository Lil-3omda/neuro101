import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../Services/admin.service';
import { IOrder, IPaginationParams } from '../../Interfaces/admin.interface';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders.html',
  styleUrl: './orders.css'
})
export class AdminOrders implements OnInit {
  orders: IOrder[] = [];
  loading = false;
  searchTerm = '';

  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  totalCount = 0;

  showDetailsModal = false;
  selectedOrder: IOrder | null = null;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadOrders();
  }
getPageEnd(): number {
  const end = this.currentPage * this.pageSize;
  return end > this.totalCount ? this.totalCount : end;
}
  loadOrders() {
    this.loading = true;
    const params: IPaginationParams = {
      page: this.currentPage,
      pageSize: this.pageSize,
      search: this.searchTerm
    };

    this.adminService.getOrders(params).subscribe({
      next: (response) => {
        this.orders = response.data;
        this.totalCount = response.totalCount;
        this.totalPages = response.totalPages;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.setMockOrders();
        this.loading = false;
      }
    });
  }

  setMockOrders() {
    this.orders = [
      {
        id: '1',
        orderNumber: 'ORD-2024-001',
        userId: '1',
        userName: 'John Doe',
        userEmail: 'john@example.com',
        totalAmount: 299.99,
        status: 'Pending',
        paymentStatus: 'Paid',
        items: [
          { productId: '1', productName: 'Angular Course', quantity: 1, price: 99.99, subtotal: 99.99 },
          { productId: '2', productName: 'React Course', quantity: 2, price: 100, subtotal: 200 }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    this.totalCount = 1;
    this.totalPages = 1;
  }

  onSearch() {
    this.currentPage = 1;
    this.loadOrders();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadOrders();
  }

  getPaginationArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  viewDetails(order: IOrder) {
    this.selectedOrder = order;
    this.showDetailsModal = true;
  }

  updateOrderStatus(order: IOrder, status: string) {
    this.adminService.updateOrder(order.id, { id: order.id, status }).subscribe({
      next: () => {
        order.status = status as any;
        alert('Order status updated successfully');
      },
      error: (error) => {
        console.error('Error updating order:', error);
        alert('Failed to update order status');
      }
    });
  }

  closeModal() {
    this.showDetailsModal = false;
    this.selectedOrder = null;
  }

  getStatusBadgeClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'Pending': 'warning',
      'Processing': 'info',
      'Shipped': 'primary',
      'Delivered': 'success',
      'Cancelled': 'danger'
    };
    return statusMap[status] || 'secondary';
  }

  getPaymentStatusBadgeClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'Pending': 'warning',
      'Paid': 'success',
      'Failed': 'danger',
      'Refunded': 'info'
    };
    return statusMap[status] || 'secondary';
  }
}
