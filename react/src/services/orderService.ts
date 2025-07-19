const API_BASE_URL = 'http://localhost:8080/api';

export interface Order {
  id: number;
  pack_id: number;
  template_id: number;
  client_name: string;
  client_email: string;
  phone: string;
  city: string;
  neighborhood?: string;
  orientation: 'vertical' | 'horizontal';
  color: 'white' | 'black' | 'gold';
  quantity: number;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  channel: 'whatsapp' | 'form';
  logo_path?: string;
  brief_path?: string;
  payment_proof_path?: string;
  created_at: string;
  updated_at: string;
  pack?: {
    id: number;
    name: string;
    price: number;
    image_url?: string;
    delivery_time_days: number;
  };
  template?: {
    id: number;
    name: string;
    preview_url?: string;
  };
}

export interface OrdersResponse {
  success: boolean;
  data: Order[];
  message?: string;
}

export interface OrderResponse {
  success: boolean;
  data: Order;
  message?: string;
}

class OrderService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  async getUserOrders(status?: string): Promise<OrdersResponse> {
    try {
      const queryParams = status ? `?status=${status}` : '';
      const response = await fetch(`${API_BASE_URL}/orders${queryParams}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching orders:', error);
      return {
        success: false,
        data: [],
        message: 'Error fetching orders'
      };
    }
  }

  async getOrder(id: number): Promise<OrderResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching order:', error);
      return {
        success: false,
        data: {} as Order,
        message: 'Error fetching order'
      };
    }
  }

  async uploadPaymentProof(orderId: number, file: File): Promise<OrderResponse> {
    try {
      const formData = new FormData();
      formData.append('payment_proof', file);

      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/payment-proof`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: formData,
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error uploading payment proof:', error);
      return {
        success: false,
        data: {} as Order,
        message: 'Error uploading payment proof'
      };
    }
  }

  getStatusLabel(status: string): string {
    const statusLabels: Record<string, string> = {
      pending: 'Pending Payment',
      in_progress: 'In Progress',
      completed: 'Completed',
      cancelled: 'Cancelled'
    };
    return statusLabels[status] || status;
  }

  getStatusColor(status: string): string {
    const statusColors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  }
}

export const orderService = new OrderService();
