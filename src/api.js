// src/api.js
const API_BASE = 'http://localhost:5001/api';

async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem('token');
  if (token) {
    options.headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    };
  }
  const response = await fetch(url, options);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API request failed');
  }
  return response.json();
}

export async function fetchBooks({ search = '', genre = '', author = '' } = {}) {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (genre) params.append('genre', genre);
  if (author) params.append('author', author);
  return fetchWithAuth(`${API_BASE}/books?${params.toString()}`);
}

export async function addBook(book) {
  return fetchWithAuth(`${API_BASE}/books`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(book),
  });
}

export async function fetchTransactions() {
  return fetchWithAuth(`${API_BASE}/transactions`);
}

export async function login(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Login failed');
  }
  return res.json();
}

export async function register(data) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Registration failed');
  }
  return res.json();
}

export async function borrowBook(bookId) {
  return fetchWithAuth(`${API_BASE}/transactions/borrow/${bookId}`, {
    method: 'POST'
  });
}

export async function returnBook(bookId) {
  return fetchWithAuth(`${API_BASE}/transactions/return/${bookId}`, {
    method: 'POST'
  });
}
