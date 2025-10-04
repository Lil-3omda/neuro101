// User Interfaces
export interface IUser {
  id: string;
  name: string;
  email: string;
  role: 'Student' | 'Instructor' | 'Admin' | 'Seller' | 'Customer';
  status: 'Active' | 'Inactive' | 'Suspended';
  createdAt: Date;
  lastLogin?: Date;
  phone?: string;
  avatar?: string;
}

export interface IUserCreate {
  name: string;
  email: string;
  password: string;
  role: string;
  phone?: string;
}

export interface IUserUpdate {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  status?: string;
  phone?: string;
}

// Product Interfaces
export interface IProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  categoryName: string;
  status: 'Draft' | 'Published' | 'Archived';
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IProductCreate {
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  status: string;
}

export interface IProductUpdate {
  id: string;
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  categoryId?: string;
  status?: string;
}

// Order Interfaces
export interface IOrder {
  id: string;
  orderNumber: string;
  userId: string;
  userName: string;
  userEmail: string;
  totalAmount: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentStatus: 'Pending' | 'Paid' | 'Failed' | 'Refunded';
  items: IOrderItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface IOrderUpdate {
  id: string;
  status?: string;
  paymentStatus?: string;
}

// Category Interfaces
export interface ICategory {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  isActive: boolean;
  productsCount?: number;
  createdAt: Date;
}

export interface ICategoryCreate {
  name: string;
  description?: string;
  parentId?: string;
  isActive: boolean;
}

export interface ICategoryUpdate {
  id: string;
  name?: string;
  description?: string;
  isActive?: boolean;
}

// Analytics Interfaces
export interface IAnalytics {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  activeUsers: number;
  pendingOrders: number;
  lowStockProducts: number;
  recentUsers: IUser[];
  recentOrders: IOrder[];
  salesByMonth: ISalesData[];
  usersByRole: IUserRoleData[];
}

export interface ISalesData {
  month: string;
  sales: number;
  orders: number;
}

export interface IUserRoleData {
  role: string;
  count: number;
}

// Pagination
export interface IPaginationParams {
  page: number;
  pageSize: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface IPaginatedResponse<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
