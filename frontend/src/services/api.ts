const API_BASE_URL = 'http://localhost:3001/api';

// Utility function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || 'API request failed');
  }
  return response.json();
};

// Generate session ID for guest users
export const getSessionId = (): string => {
  let sessionId = localStorage.getItem('eliteshop_session');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('eliteshop_session', sessionId);
  }
  return sessionId;
};

// Products API
export const productsAPI = {
  getAll: async (filters: Record<string, any> = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, String(value));
      }
    });
    
    const response = await fetch(`${API_BASE_URL}/products?${params}`);
    return handleResponse(response);
  },

  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    return handleResponse(response);
  },

  getFeatured: async () => {
    const response = await fetch(`${API_BASE_URL}/products/featured/list`);
    return handleResponse(response);
  }
};

// Categories API
export const categoriesAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/categories`);
    return handleResponse(response);
  },

  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`);
    return handleResponse(response);
  }
};

// Cart API
export const cartAPI = {
  getItems: async (opts?: { userId?: string, token?: string }) => {
    const params = new URLSearchParams();
    let headers: Record<string, string> = {};
    if (opts?.userId) {
      params.append('user_id', opts.userId);
      if (opts.token) headers['Authorization'] = `Bearer ${opts.token}`;
    } else {
      params.append('session_id', getSessionId());
    }
    const response = await fetch(`${API_BASE_URL}/cart?${params}`, { headers });
    return handleResponse(response);
  },

  addItem: async (productId: string, quantity: number = 1, opts?: { userId?: string, token?: string }) => {
    let headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (opts?.token) headers['Authorization'] = `Bearer ${opts.token}`;
    const body = {
      product_id: productId,
      quantity,
      user_id: opts?.userId,
      session_id: opts?.userId ? undefined : getSessionId()
    };
    const response = await fetch(`${API_BASE_URL}/cart/add`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });
    return handleResponse(response);
  },

  updateQuantity: async (productId: string, quantity: number, opts?: { userId?: string, token?: string }) => {
    let headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (opts?.token) headers['Authorization'] = `Bearer ${opts.token}`;
    const body = {
      product_id: productId,
      quantity,
      user_id: opts?.userId,
      session_id: opts?.userId ? undefined : getSessionId()
    };
    const response = await fetch(`${API_BASE_URL}/cart/update`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body)
    });
    return handleResponse(response);
  },

  removeItem: async (productId: string, opts?: { userId?: string, token?: string }) => {
    let headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (opts?.token) headers['Authorization'] = `Bearer ${opts.token}`;
    const body = {
      product_id: productId,
      user_id: opts?.userId,
      session_id: opts?.userId ? undefined : getSessionId()
    };
    const response = await fetch(`${API_BASE_URL}/cart/remove`, {
      method: 'DELETE',
      headers,
      body: JSON.stringify(body)
    });
    return handleResponse(response);
  },

  clearCart: async (opts?: { userId?: string, token?: string }) => {
    let headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (opts?.token) headers['Authorization'] = `Bearer ${opts.token}`;
    const body = {
      user_id: opts?.userId,
      session_id: opts?.userId ? undefined : getSessionId()
    };
    const response = await fetch(`${API_BASE_URL}/cart/clear`, {
      method: 'DELETE',
      headers,
      body: JSON.stringify(body)
    });
    return handleResponse(response);
  }
};

// Orders API
export const ordersAPI = {
  create: async (orderData: any, userId?: string) => {
    const response = await fetch(`${API_BASE_URL}/orders/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...orderData,
        user_id: userId,
        session_id: userId ? undefined : getSessionId()
      })
    });
    return handleResponse(response);
  },

  getUserOrders: async (userId: string) => {
    const response = await fetch(`${API_BASE_URL}/orders/user/${userId}`);
    return handleResponse(response);
  },

  getById: async (orderId: string) => {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`);
    return handleResponse(response);
  }
};

// Auth API
export const authAPI = {
  register: async (userData: any) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return handleResponse(response);
  },

  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return handleResponse(response);
  },

  getProfile: async (userId: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/profile/${userId}`);
    return handleResponse(response);
  }
};