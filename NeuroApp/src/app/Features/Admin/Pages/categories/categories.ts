import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../Services/admin.service';
import { ICategory } from '../../Interfaces/admin.interface';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categories.html',
  styleUrl: './categories.css'
})
export class AdminCategories implements OnInit {
  categories: ICategory[] = [];
  loading = false;
  
  showAddModal = false;
  showEditModal = false;
  showDeleteModal = false;
  selectedCategory: ICategory | null = null;
  
  newCategory: any = {
    name: '',
    description: '',
    isActive: true
  };

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.loading = true;
    this.adminService.getCategories().subscribe({
      next: (response) => {
        this.categories = response.data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.setMockCategories();
        this.loading = false;
      }
    });
  }

  setMockCategories() {
    this.categories = [
      {
        id: '1',
        name: 'Programming',
        description: 'Programming courses and resources',
        isActive: true,
        productsCount: 45,
        createdAt: new Date()
      },
      {
        id: '2',
        name: 'Design',
        description: 'Design and creative courses',
        isActive: true,
        productsCount: 32,
        createdAt: new Date()
      },
      {
        id: '3',
        name: 'Business',
        description: 'Business and management courses',
        isActive: true,
        productsCount: 28,
        createdAt: new Date()
      }
    ];
  }

  showAddCategoryModal() {
    this.newCategory = {
      name: '',
      description: '',
      isActive: true
    };
    this.showAddModal = true;
  }

  addCategory() {
    this.adminService.createCategory(this.newCategory).subscribe({
      next: (category) => {
        this.categories.push(category);
        this.showAddModal = false;
        alert('Category created successfully');
      },
      error: (error) => {
        console.error('Error creating category:', error);
        alert('Failed to create category');
      }
    });
  }

  editCategory(category: ICategory) {
    this.selectedCategory = { ...category };
    this.showEditModal = true;
  }

  updateCategory() {
    if (this.selectedCategory) {
      this.adminService.updateCategory(this.selectedCategory.id, this.selectedCategory).subscribe({
        next: (updated) => {
          const index = this.categories.findIndex(c => c.id === updated.id);
          if (index !== -1) {
            this.categories[index] = updated;
          }
          this.showEditModal = false;
          alert('Category updated successfully');
        },
        error: (error) => {
          console.error('Error updating category:', error);
          alert('Failed to update category');
        }
      });
    }
  }

  confirmDelete(category: ICategory) {
    this.selectedCategory = category;
    this.showDeleteModal = true;
  }

  deleteCategory() {
    if (this.selectedCategory) {
      this.adminService.deleteCategory(this.selectedCategory.id).subscribe({
        next: () => {
          this.categories = this.categories.filter(c => c.id !== this.selectedCategory?.id);
          this.showDeleteModal = false;
          alert('Category deleted successfully');
        },
        error: (error) => {
          console.error('Error deleting category:', error);
          alert('Failed to delete category');
        }
      });
    }
  }

  closeModals() {
    this.showAddModal = false;
    this.showEditModal = false;
    this.showDeleteModal = false;
    this.selectedCategory = null;
  }
}
