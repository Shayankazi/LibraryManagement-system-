import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useCart();
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [orderId, setOrderId] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [downloadError, setDownloadError] = useState('');

  const total = cart.reduce((sum, item) => sum + (item.totalRent || 0), 0);

  const handleCheckout = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    setOrderId(null);
    setOrderDetails(null);
    try {
      const res = await fetch('http://localhost:5001/api/rent/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rentals: cart, paymentMethod }),
      });
      if (!res.ok) throw new Error('Checkout failed');
      const data = await res.json();
      const newOrderId = data.orderId || data._id || data.id;
      if (!newOrderId) {
        setError('Order failed: No order ID returned. Your cart has not been cleared.');
        return;
      }
      setOrderId(newOrderId);
      setOrderDetails(data);
      setSuccess('Order confirmed! Thank you for your purchase.');
      clearCart();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReceipt = async () => {
    setDownloadError('');
    try {
      if (!orderId) {
        setDownloadError('No order found to generate receipt.');
        return;
      }
      // User name
      const userName = (orderDetails && orderDetails.user && (orderDetails.user.name || orderDetails.user.username)) || (user && (user.name || user.username)) || 'N/A';
      // Current date
      const currentDate = new Date().toLocaleString();
      // Payment method
      const payment = paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1);
      // Books: fetch details if only bookId is present
      let books = [];
      if (orderDetails && Array.isArray(orderDetails.results) && orderDetails.results.length > 0) {
        const apiModule = await import('../api');
        books = await Promise.all(orderDetails.results.map(async (r) => {
          if (r.bookId) {
            try {
              const book = await apiModule.fetchBookById(r.bookId);
              return { ...book, ...r };
            } catch (e) {
              return { title: `Book ID ${r.bookId}`, ...r };
            }
          }
          return r;
        }));
      } else if (orderDetails && Array.isArray(orderDetails.books) && orderDetails.books.length > 0) {
        books = orderDetails.books;
      } else if (Array.isArray(cart) && cart.length > 0) {
        books = cart;
      }
      if (!books || books.length === 0) {
        setDownloadError('No books found in your order.');
        return;
      }
      // Compose book list rows with name and due date
      const bookList = books.map((r, idx) => {
        const bookTitle = r.title || r.bookTitle || r.bookName || r.bookId || 'N/A';
        const dueDate = r.dueDate ? new Date(r.dueDate).toLocaleDateString() : (r.endDate || 'N/A');
        return `<tr><td>${idx + 1}</td><td>${bookTitle}</td><td>${dueDate}</td><td>${r.status || 'N/A'}</td></tr>`;
      }).join('');
      // Total amount: sum totalRent from books/orderDetails.results/orderDetails
      let totalAmount = 'N/A';
      if (orderDetails && orderDetails.results && Array.isArray(orderDetails.results)) {
        totalAmount = orderDetails.results.reduce((sum, r) => sum + (parseFloat(r.totalRent) || 0), 0).toFixed(2);
      } else if (books && books.length > 0) {
        totalAmount = books.reduce((sum, b) => sum + (parseFloat(b.totalRent) || 0), 0).toFixed(2);
      } else if (orderDetails && typeof orderDetails.totalRent === 'number') {
        totalAmount = orderDetails.totalRent.toFixed(2);
      }
      // HTML receipt
      const receiptHtml = `
        <html>
        <head><title>Order Receipt</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 30px; }
            h2 { color: #256029; }
            table { border-collapse: collapse; width: 100%; margin-top: 20px; }
            th, td { border: 1px solid #d3d3d3; padding: 8px; text-align: left; }
            th { background: #e3fceb; }
            .total { font-weight: bold; font-size: 1.1em; }
          </style>
        </head>
        <body>
          <h2>Order Receipt</h2>
          <p><strong>Order ID:</strong> ${orderId}</p>
          <p><strong>User:</strong> ${userName}</p>
          <p><strong>Date:</strong> ${currentDate}</p>
          <p><strong>Payment Method:</strong> ${payment}</p>
          <table>
            <thead>
              <tr><th>#</th><th>Book Name</th><th>Due Date</th><th>Status</th></tr>
            </thead>
            <tbody>
              ${bookList}
            </tbody>
          </table>
          <p class="total">Total Amount: $${totalAmount}</p>
        </body>
        </html>
      `;
      const blob = new Blob([receiptHtml], { type: 'text/html' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `OrderReceipt_${orderId}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      setDownloadError('Failed to generate or download receipt.');
      console.error('Download Receipt Error:', err);
    }
  };


  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      {orderId ? (
        <div className="flex flex-col items-center justify-center min-h-[300px]">
          <h2 className="text-2xl font-bold text-green-700 mb-4">Order Confirmed!</h2>
          <p className="text-lg mb-2">Thank you for your purchase.</p>
          <p className="mb-4">Your Order ID: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{orderId}</span></p>
          <button onClick={handleDownloadReceipt} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Download Receipt</button>
          {downloadError && <div className="mt-4 text-red-600">{downloadError}</div>}
        </div>
      ) : cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center border rounded p-4">
                <img src={item.coverImage} alt={item.title} className="w-20 h-28 object-cover rounded mr-4" />
                <div className="flex-1">
                  <h2 className="font-semibold text-lg">{item.title}</h2>
                  <p className="text-sm text-gray-600">{item.author}</p>
                  <p className="text-sm text-gray-500">{item.genre}</p>
                  <p className="text-sm">From: {item.startDate} To: {item.endDate}</p>
                  <p className="text-sm">Days: {item.days} | Rent/Day: ${item.rentPerDay}</p>
                  {item.extraDays > 0 && (
                    <p className="text-xs text-red-600">Extra charge for {item.extraDays} day(s): ${item.extraCharge}</p>
                  )}
                  <p className="font-medium mt-1">Total: ${item.totalRent}</p>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="ml-4 text-red-500 hover:text-red-700">
                  <TrashIcon className="h-6 w-6" />
                </button>
              </div>
            ))}
          </div>
          <div className="mt-8 border-t pt-4">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            {error && <div className="text-red-500 mt-2">{error}</div>}
            {success && <div className="text-green-600 mt-2">{success}</div>}
            <div className="mb-4">
              <label className="block font-medium mb-2">Payment Method</label>
              <div className="flex gap-4">
                <label><input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} /> Card</label>
                <label><input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} /> UPI</label>
                <label><input type="radio" name="payment" value="netbanking" checked={paymentMethod === 'netbanking'} onChange={() => setPaymentMethod('netbanking')} /> Netbanking</label>
                <label><input type="radio" name="payment" value="cash" checked={paymentMethod === 'cash'} onChange={() => setPaymentMethod('cash')} /> Cash</label>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              disabled={loading || cart.length === 0}
              className="w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Proceed to Checkout'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;