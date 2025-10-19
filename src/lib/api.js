// Use full server URL for production, relative path for development
export const API_BASE = import.meta.env.DEV ? '/api/v1' : 'https://bookstore-server-tg0m.onrender.com/api/v1';

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

// User API functions
export async function getCurrentUser() {
  return apiGet('/users/current-user');
}


