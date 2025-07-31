import { OrderService, CreateOrderData, OrderStatusUpdate } from '../orderService';

// Mock Supabase client
jest.mock('../supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(),
        })),
      })),
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          order: jest.fn(() => ({
            single: jest.fn(),
          })),
        })),
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(),
          })),
        })),
      })),
    }),
  },
}));

describe('OrderService', () => {
  const mockUserId = 'user-123';
  const mockOrderId = 'order-456';

  const mockOrderData: CreateOrderData = {
    serviceType: 'kurban',
    deliveryType: 'personal',
    totalAmount: 1000,
    currency: 'TRY',
    specialNotes: 'Test order',
  };

  const mockOrder = {
    id: mockOrderId,
    user_id: mockUserId,
    service_type: 'kurban',
    delivery_type: 'personal',
    status: 'pending',
    total_amount: 1000,
    currency: 'TRY',
    special_notes: 'Test order',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createOrder', () => {
    it('should successfully create an order', async () => {
      const mockSupabase = require('../supabase').supabase;
      mockSupabase.from().insert().select().single.mockResolvedValue({
        data: mockOrder,
        error: null,
      });

      const result = await OrderService.createOrder(mockUserId, mockOrderData);

      expect(result).toEqual(mockOrder);
      expect(mockSupabase.from).toHaveBeenCalledWith('orders');
    });

    it('should handle validation error for missing service type', async () => {
      const invalidOrderData = { ...mockOrderData, serviceType: undefined as any };

      await expect(OrderService.createOrder(mockUserId, invalidOrderData)).rejects.toThrow(
        'Service type is required'
      );
    });

    it('should handle validation error for missing delivery type', async () => {
      const invalidOrderData = { ...mockOrderData, deliveryType: undefined as any };

      await expect(OrderService.createOrder(mockUserId, invalidOrderData)).rejects.toThrow(
        'Delivery type is required'
      );
    });

    it('should handle validation error for invalid total amount', async () => {
      const invalidOrderData = { ...mockOrderData, totalAmount: 0 };

      await expect(OrderService.createOrder(mockUserId, invalidOrderData)).rejects.toThrow(
        'Total amount must be greater than 0'
      );
    });

    it('should handle validation error for long special notes', async () => {
      const invalidOrderData = {
        ...mockOrderData,
        specialNotes: 'a'.repeat(501),
      };

      await expect(OrderService.createOrder(mockUserId, invalidOrderData)).rejects.toThrow(
        'Special notes cannot exceed 500 characters'
      );
    });

    it('should handle validation error for charity delivery without organization', async () => {
      const invalidOrderData = {
        ...mockOrderData,
        deliveryType: 'charity',
        charityOrganizationId: undefined,
      };

      await expect(OrderService.createOrder(mockUserId, invalidOrderData)).rejects.toThrow(
        'Charity organization is required for charity delivery'
      );
    });

    it('should handle database error', async () => {
      const mockSupabase = require('../supabase').supabase;
      mockSupabase.from().insert().select().single.mockResolvedValue({
        data: null,
        error: { message: 'Database error' },
      });

      await expect(OrderService.createOrder(mockUserId, mockOrderData)).rejects.toThrow(
        'Database error'
      );
    });
  });

  describe('getOrderById', () => {
    it('should successfully fetch order by ID', async () => {
      const mockOrderWithRelations = {
        ...mockOrder,
        user_profile: {
          first_name: 'John',
          last_name: 'Doe',
          phone: '+905551234567',
        },
        charity_organization: null,
        media_files: [],
        reviews: [],
      };

      const mockSupabase = require('../supabase').supabase;
      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: mockOrderWithRelations,
        error: null,
      });

      const result = await OrderService.getOrderById(mockOrderId);

      expect(result).toEqual(mockOrderWithRelations);
    });

    it('should return null when order not found', async () => {
      const mockSupabase = require('../supabase').supabase;
      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: null,
        error: { message: 'Order not found' },
      });

      const result = await OrderService.getOrderById(mockOrderId);

      expect(result).toBeNull();
    });
  });

  describe('getUserOrders', () => {
    it('should successfully fetch user orders', async () => {
      const mockOrders = [mockOrder];

      const mockSupabase = require('../supabase').supabase;
      mockSupabase.from().select().eq().order.mockResolvedValue({
        data: mockOrders,
        error: null,
      });

      const result = await OrderService.getUserOrders(mockUserId);

      expect(result).toEqual(mockOrders);
    });

    it('should apply filters correctly', async () => {
      const filters = {
        status: 'pending',
        serviceType: 'kurban',
        dateFrom: '2024-01-01',
        dateTo: '2024-12-31',
      };

      const mockSupabase = require('../supabase').supabase;
      const mockQuery = {
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({
          data: [mockOrder],
          error: null,
        }),
      };

      mockSupabase.from().select.mockReturnValue(mockQuery);

      await OrderService.getUserOrders(mockUserId, filters);

      expect(mockQuery.eq).toHaveBeenCalledWith('user_id', mockUserId);
      expect(mockQuery.eq).toHaveBeenCalledWith('status', 'pending');
      expect(mockQuery.eq).toHaveBeenCalledWith('service_type', 'kurban');
    });

    it('should return empty array on error', async () => {
      const mockSupabase = require('../supabase').supabase;
      mockSupabase.from().select().eq().order.mockResolvedValue({
        data: null,
        error: { message: 'Database error' },
      });

      const result = await OrderService.getUserOrders(mockUserId);

      expect(result).toEqual([]);
    });
  });

  describe('updateOrderStatus', () => {
    it('should successfully update order status', async () => {
      const statusUpdate: OrderStatusUpdate = {
        status: 'in_progress',
        notes: 'Order started',
      };

      const updatedOrder = { ...mockOrder, status: 'in_progress' };

      const mockSupabase = require('../supabase').supabase;
      mockSupabase.from().update().eq().select().single.mockResolvedValue({
        data: updatedOrder,
        error: null,
      });

      // Mock getOrderById for validation
      jest.spyOn(OrderService, 'getOrderById').mockResolvedValue(mockOrder as any);

      const result = await OrderService.updateOrderStatus(mockOrderId, statusUpdate);

      expect(result.status).toBe('in_progress');
    });

    it('should handle invalid status transition', async () => {
      const statusUpdate: OrderStatusUpdate = {
        status: 'delivered',
      };

      // Mock getOrderById to return an order with 'pending' status
      jest.spyOn(OrderService, 'getOrderById').mockResolvedValue(mockOrder as any);

      await expect(OrderService.updateOrderStatus(mockOrderId, statusUpdate)).rejects.toThrow(
        'Invalid status transition from pending to delivered'
      );
    });

    it('should handle database error', async () => {
      const statusUpdate: OrderStatusUpdate = {
        status: 'in_progress',
      };

      const mockSupabase = require('../supabase').supabase;
      mockSupabase.from().update().eq().select().single.mockResolvedValue({
        data: null,
        error: { message: 'Update failed' },
      });

      jest.spyOn(OrderService, 'getOrderById').mockResolvedValue(mockOrder as any);

      await expect(OrderService.updateOrderStatus(mockOrderId, statusUpdate)).rejects.toThrow(
        'Update failed'
      );
    });
  });

  describe('updatePaymentStatus', () => {
    it('should successfully update payment status', async () => {
      const updatedOrder = { ...mockOrder, payment_status: 'completed' };

      const mockSupabase = require('../supabase').supabase;
      mockSupabase.from().update().eq().select().single.mockResolvedValue({
        data: updatedOrder,
        error: null,
      });

      const result = await OrderService.updatePaymentStatus(mockOrderId, 'completed', 'ref-123');

      expect(result.payment_status).toBe('completed');
      expect(result.payment_reference).toBe('ref-123');
    });

    it('should handle database error', async () => {
      const mockSupabase = require('../supabase').supabase;
      mockSupabase.from().update().eq().select().single.mockResolvedValue({
        data: null,
        error: { message: 'Payment update failed' },
      });

      await expect(OrderService.updatePaymentStatus(mockOrderId, 'completed')).rejects.toThrow(
        'Payment update failed'
      );
    });
  });

  describe('cancelOrder', () => {
    it('should successfully cancel an order', async () => {
      const cancelledOrder = { ...mockOrder, status: 'cancelled' };

      const mockSupabase = require('../supabase').supabase;
      mockSupabase.from().update().eq().select().single.mockResolvedValue({
        data: cancelledOrder,
        error: null,
      });

      // Mock getOrderById to return an order with 'pending' status
      jest.spyOn(OrderService, 'getOrderById').mockResolvedValue(mockOrder as any);

      const result = await OrderService.cancelOrder(mockOrderId, 'Customer request');

      expect(result.status).toBe('cancelled');
    });

    it('should prevent cancellation of completed orders', async () => {
      const completedOrder = { ...mockOrder, status: 'completed' };

      jest.spyOn(OrderService, 'getOrderById').mockResolvedValue(completedOrder as any);

      await expect(OrderService.cancelOrder(mockOrderId)).rejects.toThrow(
        'Cannot cancel completed or delivered orders'
      );
    });

    it('should handle order not found', async () => {
      jest.spyOn(OrderService, 'getOrderById').mockResolvedValue(null);

      await expect(OrderService.cancelOrder(mockOrderId)).rejects.toThrow('Order not found');
    });
  });

  describe('getOrderStatistics', () => {
    it('should return correct statistics', async () => {
      const mockOrders = [
        { status: 'pending' },
        { status: 'in_progress' },
        { status: 'completed' },
        { status: 'delivered' },
        { status: 'cancelled' },
      ];

      const mockSupabase = require('../supabase').supabase;
      mockSupabase.from().select.mockResolvedValue({
        data: mockOrders,
        error: null,
      });

      const result = await OrderService.getOrderStatistics(mockUserId);

      expect(result).toEqual({
        total: 5,
        pending: 1,
        inProgress: 1,
        completed: 2, // completed + delivered
        cancelled: 1,
      });
    });

    it('should return zero statistics on error', async () => {
      const mockSupabase = require('../supabase').supabase;
      mockSupabase.from().select.mockResolvedValue({
        data: null,
        error: { message: 'Database error' },
      });

      const result = await OrderService.getOrderStatistics(mockUserId);

      expect(result).toEqual({
        total: 0,
        pending: 0,
        inProgress: 0,
        completed: 0,
        cancelled: 0,
      });
    });
  });

  describe('searchOrders', () => {
    it('should successfully search orders', async () => {
      const mockOrders = [mockOrder];

      const mockSupabase = require('../supabase').supabase;
      mockSupabase.from().select().or().order.mockResolvedValue({
        data: mockOrders,
        error: null,
      });

      const result = await OrderService.searchOrders('test');

      expect(result).toEqual(mockOrders);
    });

    it('should return empty array on error', async () => {
      const mockSupabase = require('../supabase').supabase;
      mockSupabase.from().select().or().order.mockResolvedValue({
        data: null,
        error: { message: 'Search failed' },
      });

      const result = await OrderService.searchOrders('test');

      expect(result).toEqual([]);
    });
  });
}); 