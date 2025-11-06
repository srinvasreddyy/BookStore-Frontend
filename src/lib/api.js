// Use full server URL for production, relative path for development
export const API_BASE = "https://connect.indianbookshouse.in/api/v1"; 

export async function apiGet(path) {
  const response = await fetch(`${API_BASE}${path}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`Request failed (${response.status}): ${text}`);
  }

  return response.json();
}

export async function apiPost(path, data) {
  const response = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let errorMessage = `Request failed (${response.status})`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
      // If response is not JSON, use the text
      const text = await response.text().catch(() => '');
      if (text) errorMessage = text;
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

export async function apiDelete(path) {
  const response = await fetch(`${API_BASE}${path}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    let errorMessage = `Request failed (${response.status})`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
      // If response is not JSON, use the text
      const text = await response.text().catch(() => '');
      if (text) errorMessage = text;
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

// Category API functions
export async function getAllCategories() {
  return apiGet('/categories/all');
}

export async function getGlobalCategories() {
  return apiGet('/categories');
}

// Book API functions
export async function getBooksByCategory(categoryId, params = {}) {
  const queryParams = new URLSearchParams({
    category: categoryId,
    limit: '50', // Get more books per page
    ...params
  });
  return apiGet(`/books?${queryParams}`);
}

export async function getBookById(bookId) {
  return apiGet(`/books/${bookId}`);
}

// Cart API functions
export async function getCart() {
  return apiGet('/cart');
}

export async function addItemToCart(bookId, quantity) {
  return apiPost('/cart/add-item', { bookId, quantity });
}

export async function removeItemFromCart(bookId) {
  return apiDelete(`/cart/remove-item/${bookId}`);
}

export async function clearCart() {
  return apiPost('/cart/clear');
}

// Order API functions
export async function initiateOrder(orderData) {
  return apiPost('/orders/initiate', orderData);
}

// Fetch orders for current authenticated user
export async function getUserOrders(params = {}) {
  const query = new URLSearchParams(params).toString();
  return apiGet(`/orders${query ? `?${query}` : ''}`);
}

// Get single order by ID
export async function getOrderById(orderId) {
  return apiGet(`/orders/${orderId}`);
}

// Payment API functions
export async function getRazorpayKey() {
  return apiGet('/payments/key');
}

export async function reportPaymentFailure(razorpayOrderId, reason) {
  return apiPost('/payments/failure', { razorpayOrderId, reason });
}

// User API functions
export async function getCurrentUser() {
  return apiGet('/users/current-user');
}

// Password reset API functions
export async function forgotPassword(email) {
  return apiPost('/users/forgot-password', { email });
}

export async function verifyPasswordOTP(email, otp) {
  return apiPost('/users/verify-otp', { email, otp });
}

export async function resetPassword(email, otp, newPassword) {
  return apiPost('/users/reset-password', { email, otp, newPassword });
}

// Discount API functions
export async function validateCoupon(couponCode, cartSubtotal) {
  return apiPost('/discounts/validate', { couponCode, cartSubtotal });
}

// Contact API functions
export async function getContactDetails() {
  return apiGet('/contacts');
}


