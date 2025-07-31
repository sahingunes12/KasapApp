import { supabase } from './supabase';
import { Database } from './supabase';

type Order = Database['public']['Tables']['orders']['Row'];
type OrderInsert = Database['public']['Tables']['orders']['Insert'];
type OrderUpdate = Database['public']['Tables']['orders']['Update'];

export interface CreateOrderData {
  serviceType: 'kurban' | 'adak' | 'sukur';
  deliveryType: 'personal' | 'charity' | 'restaurant' | 'africa';
  totalAmount: number;
  currency?: string;
  specialNotes?: string;
  charityOrganizationId?: string;
  appointmentDate?: string;
  paymentMethod?: 'paypal' | 'iban' | 'local';
}

export interface OrderStatusUpdate {
  status: 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'delivered' | 'donated';
  notes?: string;
}

export interface OrderFilters {
  status?: string;
  serviceType?: string;
  deliveryType?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface OrderWithRelations extends Order {
  user_profile?: {
    first_name: string;
    last_name: string;
    phone: string | null;
  };
  charity_organization?: {
    name: string;
    description: string | null;
  };
  media_files?: Array<{
    id: string;
    file_name: string;
    file_url: string;
    file_type: string;
  }>;
  reviews?: Array<{
    id: string;
    rating: number;
    comment: string | null;
    is_anonymous: boolean;
  }>;
}

export class OrderService {
  /**
   * Create a new order
   */
  static async createOrder(userId: string, orderData: CreateOrderData): Promise<Order> {
    try {
      // Validate order data
      const validationError = this.validateOrderData(orderData);
      if (validationError) {
        throw new Error(validationError);
      }

      const orderInsert: OrderInsert = {
        user_id: userId,
        service_type: orderData.serviceType,
        delivery_type: orderData.deliveryType,
        total_amount: orderData.totalAmount,
        currency: orderData.currency || 'TRY',
        special_notes: orderData.specialNotes,
        charity_organization_id: orderData.charityOrganizationId,
        appointment_date: orderData.appointmentDate,
        payment_method: orderData.paymentMethod,
        status: 'pending',
        payment_status: 'pending',
      };

      const { data, error } = await supabase
        .from('orders')
        .insert(orderInsert)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Order creation failed');
    }
  }

  /**
   * Get order by ID with relations
   */
  static async getOrderById(orderId: string): Promise<OrderWithRelations | null> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          user_profile:user_profiles(first_name, last_name, phone),
          charity_organization:charity_organizations(name, description),
          media_files(id, file_name, file_url, file_type),
          reviews(id, rating, comment, is_anonymous)
        `)
        .eq('id', orderId)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error('Error fetching order:', error);
      return null;
    }
  }

  /**
   * Get orders for a user with optional filters
   */
  static async getUserOrders(
    userId: string,
    filters?: OrderFilters
  ): Promise<OrderWithRelations[]> {
    try {
      let query = supabase
        .from('orders')
        .select(`
          *,
          user_profile:user_profiles(first_name, last_name, phone),
          charity_organization:charity_organizations(name, description),
          media_files(id, file_name, file_url, file_type),
          reviews(id, rating, comment, is_anonymous)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.serviceType) {
        query = query.eq('service_type', filters.serviceType);
      }
      if (filters?.deliveryType) {
        query = query.eq('delivery_type', filters.deliveryType);
      }
      if (filters?.dateFrom) {
        query = query.gte('created_at', filters.dateFrom);
      }
      if (filters?.dateTo) {
        query = query.lte('created_at', filters.dateTo);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching user orders:', error);
      return [];
    }
  }

  /**
   * Get all orders (for butchers and admins)
   */
  static async getAllOrders(filters?: OrderFilters): Promise<OrderWithRelations[]> {
    try {
      let query = supabase
        .from('orders')
        .select(`
          *,
          user_profile:user_profiles(first_name, last_name, phone),
          charity_organization:charity_organizations(name, description),
          media_files(id, file_name, file_url, file_type),
          reviews(id, rating, comment, is_anonymous)
        `)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.serviceType) {
        query = query.eq('service_type', filters.serviceType);
      }
      if (filters?.deliveryType) {
        query = query.eq('delivery_type', filters.deliveryType);
      }
      if (filters?.dateFrom) {
        query = query.gte('created_at', filters.dateFrom);
      }
      if (filters?.dateTo) {
        query = query.lte('created_at', filters.dateTo);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching all orders:', error);
      return [];
    }
  }

  /**
   * Update order status
   */
  static async updateOrderStatus(
    orderId: string,
    statusUpdate: OrderStatusUpdate
  ): Promise<Order> {
    try {
      // Validate status transition
      const validationError = this.validateStatusTransition(orderId, statusUpdate.status);
      if (validationError) {
        throw new Error(validationError);
      }

      const updateData: OrderUpdate = {
        status: statusUpdate.status,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Status update failed');
    }
  }

  /**
   * Update order payment status
   */
  static async updatePaymentStatus(
    orderId: string,
    paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded',
    paymentReference?: string
  ): Promise<Order> {
    try {
      const updateData: OrderUpdate = {
        payment_status: paymentStatus,
        payment_reference: paymentReference,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Payment status update failed');
    }
  }

  /**
   * Cancel an order
   */
  static async cancelOrder(orderId: string, reason?: string): Promise<Order> {
    try {
      // Check if order can be cancelled
      const order = await this.getOrderById(orderId);
      if (!order) {
        throw new Error('Order not found');
      }

      if (order.status === 'completed' || order.status === 'delivered') {
        throw new Error('Cannot cancel completed or delivered orders');
      }

      const updateData: OrderUpdate = {
        status: 'cancelled',
        special_notes: reason ? `${order.special_notes || ''}\nCancellation reason: ${reason}` : order.special_notes,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Order cancellation failed');
    }
  }

  /**
   * Get order statistics
   */
  static async getOrderStatistics(userId?: string): Promise<{
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    cancelled: number;
  }> {
    try {
      let query = supabase.from('orders').select('status');

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(error.message);
      }

      const orders = data || [];
      return {
        total: orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        inProgress: orders.filter(o => o.status === 'in_progress').length,
        completed: orders.filter(o => o.status === 'completed' || o.status === 'delivered').length,
        cancelled: orders.filter(o => o.status === 'cancelled').length,
      };
    } catch (error) {
      console.error('Error fetching order statistics:', error);
      return {
        total: 0,
        pending: 0,
        inProgress: 0,
        completed: 0,
        cancelled: 0,
      };
    }
  }

  /**
   * Validate order data
   */
  private static validateOrderData(orderData: CreateOrderData): string | null {
    if (!orderData.serviceType) {
      return 'Service type is required';
    }

    if (!orderData.deliveryType) {
      return 'Delivery type is required';
    }

    if (!orderData.totalAmount || orderData.totalAmount <= 0) {
      return 'Total amount must be greater than 0';
    }

    if (orderData.specialNotes && orderData.specialNotes.length > 500) {
      return 'Special notes cannot exceed 500 characters';
    }

    if (orderData.deliveryType === 'charity' && !orderData.charityOrganizationId) {
      return 'Charity organization is required for charity delivery';
    }

    return null;
  }

  /**
   * Validate status transition
   */
  private static async validateStatusTransition(
    orderId: string,
    newStatus: string
  ): Promise<string | null> {
    const order = await this.getOrderById(orderId);
    if (!order) {
      return 'Order not found';
    }

    const validTransitions: Record<string, string[]> = {
      'pending': ['scheduled', 'in_progress', 'cancelled'],
      'scheduled': ['in_progress', 'cancelled'],
      'in_progress': ['completed', 'cancelled'],
      'completed': ['delivered'],
      'delivered': [],
      'donated': [],
      'cancelled': [],
    };

    const currentStatus = order.status;
    const allowedTransitions = validTransitions[currentStatus] || [];

    if (!allowedTransitions.includes(newStatus)) {
      return `Invalid status transition from ${currentStatus} to ${newStatus}`;
    }

    return null;
  }

  /**
   * Get orders by status
   */
  static async getOrdersByStatus(status: string): Promise<OrderWithRelations[]> {
    return this.getAllOrders({ status });
  }

  /**
   * Search orders
   */
  static async searchOrders(searchTerm: string): Promise<OrderWithRelations[]> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          user_profile:user_profiles(first_name, last_name, phone),
          charity_organization:charity_organizations(name, description)
        `)
        .or(`special_notes.ilike.%${searchTerm}%,user_profile.first_name.ilike.%${searchTerm}%,user_profile.last_name.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    } catch (error) {
      console.error('Error searching orders:', error);
      return [];
    }
  }
} 