import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useCart();
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [orderId, setOrderId] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);

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

  const handleDownloadReceipt = () => {
    // Allow receipt download as long as orderId exists
    if (!orderId) return;
    const userName = (orderDetails && orderDetails.user && (orderDetails.user.name || orderDetails.user.username)) || (user && (user.name || user.username)) || 'N/A';
    const payment = paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1);
    const books = (orderDetails && orderDetails.results) ? orderDetails.results : cart;
    const bookList = books.map((r, idx) => {
      // Try to get book name from cart or orderDetails
      const bookTitle = r.title || r.bookTitle || r.bookName || (cart.find(c => c.id === r.bookId)?.title) || r.bookId || 'N/A';
      const dueDate = r.endDate || (cart.find(c => c.id === r.bookId)?.endDate) || 'N/A';
      return `<li><strong>${bookTitle}</strong> | Due: ${dueDate} | Status: ${r.status || 'N/A'}</li>`;
    }).join('');
    const receiptHtml = `
      <html>
      <head><title>Order Receipt</title></head>
      <body>
        <h2>Order Receipt</h2>
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>User:</strong> ${userName}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Payment Method:</strong> ${payment}</p>
        <h3>Books:</h3>
        <ul>
          ${bookList}
        </ul>
        <p><strong>Total Amount:</strong> $${total.toFixed(2)}</p>
      </body>
      </html>
    `;
    const blob = new Blob([receiptHtml], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `OrderReceipt_${orderId}.html`;
    link.click();
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