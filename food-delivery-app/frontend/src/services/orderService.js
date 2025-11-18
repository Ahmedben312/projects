import { sampleOrder } from "../mock/data";

const USE_MOCKS = true;

class OrderService {
  async createOrder(orderData) {
    if (USE_MOCKS) {
      const created = {
        ...sampleOrder,
        _id: `o_${Date.now()}`,
        status: "placed",
        items: orderData.items,
      };
      return { success: true, data: created };
    }

    try {
      const response = await apiService.post("/orders", orderData);
      return response;
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async getOrders(filters = {}) {
    if (USE_MOCKS) {
      return { success: true, count: 1, total: 1, data: [sampleOrder] };
    }

    try {
      const queryParams = new URLSearchParams();

      Object.keys(filters).forEach((key) => {
        if (filters[key]) {
          queryParams.append(key, filters[key]);
        }
      });

      const url = `/orders${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;
      const response = await apiService.get(url);
      return response;
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async getOrder(id) {
    if (USE_MOCKS) {
      if (sampleOrder._id === id) return { success: true, data: sampleOrder };
      return { success: false, message: "Order not found" };
    }

    try {
      const response = await apiService.get(`/orders/${id}`);
      return response;
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async getOrderTracking(id) {
    if (USE_MOCKS) {
      const tracking = { ...sampleOrder, _id: id, status: sampleOrder.status };
      return { success: true, data: tracking };
    }

    try {
      const response = await apiService.get(`/orders/${id}/tracking`);
      return response;
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async updateOrderStatus(id, status) {
    if (USE_MOCKS) {
      return { success: true, data: { _id: id, status } };
    }

    try {
      const response = await apiService.put(`/orders/${id}/status`, { status });
      return response;
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async cancelOrder(id) {
    if (USE_MOCKS) {
      return { success: true, data: { _id: id, status: "cancelled" } };
    }

    try {
      const response = await apiService.put(`/orders/${id}/cancel`);
      return response;
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}

export const orderService = new OrderService();
