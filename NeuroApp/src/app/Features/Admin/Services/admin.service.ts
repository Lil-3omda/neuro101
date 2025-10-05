import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environments.development';
import {
  IUser,
  IUserCreate,
  IUserUpdate,
  IProduct,
  IProductCreate,
  IProductUpdate,
  IOrder,
  IOrderUpdate,
  ICategory,
  ICategoryCreate,
  ICategoryUpdate,
  IAnalytics,
  IPaginationParams,
  IPaginatedResponse
} from '../Interfaces/admin.interface';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ==================== USER MANAGEMENT ====================

  getUsers(params: IPaginationParams): Observable<IPaginatedResponse<IUser>> {
    let httpParams = new HttpParams()
      .set('page', params.page.toString())
      .set('pageSize', params.pageSize.toString());

    if (params.search) {
      httpParams = httpParams.set('search', params.search);
    }
    if (params.sortBy) {
      httpParams = httpParams.set('sortBy', params.sortBy);
    }
    if (params.sortOrder) {
      httpParams = httpParams.set('sortOrder', params.sortOrder);
    }

    return this.http.get<IPaginatedResponse<IUser>>(`${this.apiUrl}/admin/users`, { params: httpParams });
  }

  getUserById(id: string): Observable<IUser> {
    return this.http.get<IUser>(`${this.apiUrl}/admin/users/${id}`);
  }

  createUser(user: IUserCreate): Observable<IUser> {
    return this.http.post<IUser>(`${this.apiUrl}/admin/users`, user);
  }

  updateUser(id: string, user: IUserUpdate): Observable<IUser> {
    return this.http.put<IUser>(`${this.apiUrl}/admin/users/${id}`, user);
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/users/${id}`);
  }

  activateUser(id: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/admin/users/${id}/activate`, {});
  }

  deactivateUser(id: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/admin/users/${id}/deactivate`, {});
  }

  // ==================== PRODUCT MANAGEMENT ====================

  getProducts(params: IPaginationParams): Observable<IPaginatedResponse<IProduct>> {
    let httpParams = new HttpParams()
      .set('page', params.page.toString())
      .set('pageSize', params.pageSize.toString());

    if (params.search) {
      httpParams = httpParams.set('search', params.search);
    }

    return this.http.get<IPaginatedResponse<IProduct>>(`${this.apiUrl}/admin/products`, { params: httpParams });
  }

  getProductById(id: string): Observable<IProduct> {
    return this.http.get<IProduct>(`${this.apiUrl}/admin/products/${id}`);
  }

  createProduct(product: IProductCreate): Observable<IProduct> {
    return this.http.post<IProduct>(`${this.apiUrl}/admin/products`, product);
  }

  updateProduct(id: string, product: IProductUpdate): Observable<IProduct> {
    return this.http.put<IProduct>(`${this.apiUrl}/admin/products/${id}`, product);
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/products/${id}`);
  }

  approveProduct(id: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/admin/products/${id}/approve`, {});
  }

  // ==================== ORDER MANAGEMENT ====================

  getOrders(params: IPaginationParams): Observable<IPaginatedResponse<IOrder>> {
    let httpParams = new HttpParams()
      .set('page', params.page.toString())
      .set('pageSize', params.pageSize.toString());

    if (params.search) {
      httpParams = httpParams.set('search', params.search);
    }

    return this.http.get<IPaginatedResponse<IOrder>>(`${this.apiUrl}/admin/orders`, { params: httpParams });
  }

  getOrderById(id: string): Observable<IOrder> {
    return this.http.get<IOrder>(`${this.apiUrl}/admin/orders/${id}`);
  }

  updateOrder(id: string, order: IOrderUpdate): Observable<IOrder> {
    return this.http.put<IOrder>(`${this.apiUrl}/admin/orders/${id}`, order);
  }

  deleteOrder(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/orders/${id}`);
  }

  // ==================== CATEGORY MANAGEMENT ====================

  getCategories(params?: IPaginationParams): Observable<IPaginatedResponse<ICategory>> {
    let httpParams = new HttpParams();

    if (params) {
      httpParams = httpParams
        .set('page', params.page.toString())
        .set('pageSize', params.pageSize.toString());

      if (params.search) {
        httpParams = httpParams.set('search', params.search);
      }
    }

    return this.http.get<IPaginatedResponse<ICategory>>(`${this.apiUrl}/admin/categories`, { params: httpParams });
  }

  getCategoryById(id: string): Observable<ICategory> {
    return this.http.get<ICategory>(`${this.apiUrl}/admin/categories/${id}`);
  }

  createCategory(category: ICategoryCreate): Observable<ICategory> {
    return this.http.post<ICategory>(`${this.apiUrl}/admin/categories`, category);
  }

  updateCategory(id: string, category: ICategoryUpdate): Observable<ICategory> {
    return this.http.put<ICategory>(`${this.apiUrl}/admin/categories/${id}`, category);
  }

  deleteCategory(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/categories/${id}`);
  }

  // ==================== ANALYTICS ====================

  getAnalytics(): Observable<IAnalytics> {
    return this.http.get<IAnalytics>(`${this.apiUrl}/admin/analytics`);
  }

  getDashboardStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin/dashboard/stats`);
  }
}
