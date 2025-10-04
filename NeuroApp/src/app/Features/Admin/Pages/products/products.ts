import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../Services/admin.service';
import { IProduct, IPaginationParams } from '../../Interfaces/admin.interface';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class AdminProducts implements OnInit {
  products: IProduct[] = [];
  loading = false;
  searchTerm = '';
  
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  totalCount = 0;

  showDeleteModal = false;
  showEditModal = false;
  selectedProduct: IProduct | null = null;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    const params: IPaginationParams = {
      page: this.currentPage,
      pageSize: this.pageSize,
      search: this.searchTerm
    };

    this.adminService.getProducts(params).subscribe({
      next: (response) => {
        this.products = response.data;
        this.totalCount = response.totalCount;
        this.totalPages = response.totalPages;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.setMockProducts();
        this.loading = false;
      }
    });
  }

  setMockProducts() {
    this.products = [
      {
        id: '1',
        name: 'Angular Complete Course',
        description: 'Master Angular from basics to advanced',
        price: 99.99,
        stock: 100,
        categoryId: '1',
        categoryName: 'Programming',
        status: 'Published',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        name: 'React Masterclass',
        description: 'Learn React with modern features',
        price: 89.99,
        stock: 50,
        categoryId: '1',
        categoryName: 'Programming',
        status: 'Published',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    this.totalCount = 2;
    this.totalPages = 1;
  }

  onSearch() {
    this.currentPage = 1;
    this.loadProducts();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadProducts();
  }

  getPaginationArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  editProduct(product: IProduct) {
    this.selectedProduct = { ...product };
    this.showEditModal = true;
  }

  confirmDelete(product: IProduct) {
    this.selectedProduct = product;
    this.showDeleteModal = true;
  }

  deleteProduct() {
    if (this.selectedProduct) {
      this.adminService.deleteProduct(this.selectedProduct.id).subscribe({
        next: () => {
          this.products = this.products.filter(p => p.id !== this.selectedProduct?.id);
          this.showDeleteModal = false;
          alert('Product deleted successfully');
        },
        error: (error) => {
          console.error('Error deleting product:', error);
          alert('Failed to delete product');
        }
      });
    }
  }

  approveProduct(product: IProduct) {
    this.adminService.approveProduct(product.id).subscribe({
      next: () => {
        product.status = 'Published';
        alert('Product approved successfully');
      },
      error: (error) => {
        console.error('Error approving product:', error);
        alert('Failed to approve product');
      }
    });
  }

  saveProduct() {
    if (this.selectedProduct) {
      this.adminService.updateProduct(this.selectedProduct.id, this.selectedProduct).subscribe({
        next: (updated) => {
          const index = this.products.findIndex(p => p.id === updated.id);
          if (index !== -1) {
            this.products[index] = updated;
          }
          this.showEditModal = false;
          alert('Product updated successfully');
        },
        error: (error) => {
          console.error('Error updating product:', error);
          alert('Failed to update product');
        }
      });
    }
  }

  closeModals() {
    this.showDeleteModal = false;
    this.showEditModal = false;
    this.selectedProduct = null;
  }

  getStatusBadgeClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'Draft': 'secondary',
      'Published': 'success',
      'Archived': 'warning'
    };
    return statusMap[status] || 'secondary';
  }
}
