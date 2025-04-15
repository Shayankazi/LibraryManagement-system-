// src/api.js
const API_BASE = 'http://localhost:5001/api';

export async function fetchBooks({ search = '', genre = '', author = '' } = {}) {
  const params = new URLSearchParams({});
  if (search) params.append('search', search);
  if (genre) params.append('genre', genre);
  if (author) params.append('author', author);
  const res = await fetch(`${API_BASE}/books?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch books');
  return res.json();
}

export async function addBook(book, token) {
  const res = await fetch(`${API_BASE}/books`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(book),
  });
  if (!res.ok) throw new Error('Failed to add book');
  return res.json();
}

export async function fetchTransactions(token) {
  const res = await fetch(`${API_BASE}/transactions`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch transactions');
  return res.json();
}

export async function login(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error('Invalid credentials');
  return res.json();
}

export async function register(data) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Registration failed');
  return res.json();
}

export async function borrowBook(bookId, token) {
  const res = await fetch(`${API_BASE}/transactions/borrow/${bookId}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to borrow book');
  return res.json();
}

export async function returnBook(bookId, token) {
  const res = await fetch(`${API_BASE}/transactions/return/${bookId}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to return book');
  return res.json();
}
