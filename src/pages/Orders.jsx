import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const getStatusColor = (status) => {
  switch (status) {
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'processing':
      return 'bg-yellow-100 text-yellow-800';
    case 'pending':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const Orders = () => {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    console.log("fetchOrders CALLED");
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5001/api/rentals', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch orders');
      const data = await res.json();
      console.log("API RESPONSE:", data); // Debug log
      // Show only the logged-in user's orders if not admin
      let filtered = data;
      if (user && user.role !== 'admin') {
        filtered = data.filter(o => {
          if (!o.user) return false;
          let backendId = typeof o.user === 'object' ? (o.user._id || o.user.id) : o.user;
          let frontendId = user._id || user.id || user;
          console.log('Comparing:', String(backendId), String(frontendId), String(backendId) === String(frontendId));
          return String(backendId) === String(frontendId);
        });
      }
      console.log("ORDERS SET:", filtered); // Debug log
      setOrders(filtered);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Download Receipt Function
  const handleDownloadReceipt = async (order) => {
    // Try to load jsPDF dynamically
    let jsPDF;
    try {
      if (!window.jspdf) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });
      }
      jsPDF = window.jspdf.jsPDF;
    } catch (e) {
      jsPDF = null;
    }

    // PDF receipt
    if (jsPDF) {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text('Library Rental Receipt', 10, 15);
      doc.setFontSize(12);
      let y = 30;
      doc.text(`Order ID: ${order._id || order.id}`, 10, y); y += 10;
      doc.text(`Member Name: ${order.user?.name || 'N/A'}`, 10, y); y += 10;
      doc.text(`Email: ${order.user?.email || 'N/A'}`, 10, y); y += 10;
      doc.text(`Book Name: ${order.book?.title || 'N/A'}`, 10, y); y += 10;
      doc.text(`Author: ${order.book?.author || 'N/A'}`, 10, y); y += 10;
      doc.text(`Rent Period: ${order.startDate ? new Date(order.startDate).toLocaleDateString() : 'N/A'} - ${order.endDate ? new Date(order.endDate).toLocaleDateString() : 'N/A'}`, 10, y); y += 10;
      doc.text(`Due Date: ${order.endDate ? new Date(order.endDate).toLocaleDateString() : 'N/A'}`, 10, y); y += 10;
      doc.text(`Current Date: ${new Date().toLocaleDateString()}`, 10, y); y += 10;
      doc.text(`Total Rent: $${order.totalRent?.toFixed(2) || 'N/A'}`, 10, y); y += 15;
      doc.text('Thank you for using our library!', 10, y);
      doc.save(`receipt_${order._id || order.id}.pdf`);
      return;
    }
    // Fallback: plain text
    const receiptData = `\nLibrary Rental Receipt\n\nOrder ID: ${order._id || order.id}\nMember Name: ${order.user?.name || 'N/A'}\nEmail: ${order.user?.email || 'N/A'}\nBook Name: ${order.book?.title || 'N/A'}\nAuthor: ${order.book?.author || 'N/A'}\nRent Period: ${order.startDate ? new Date(order.startDate).toLocaleDateString() : 'N/A'} - ${order.endDate ? new Date(order.endDate).toLocaleDateString() : 'N/A'}\nDue Date: ${order.endDate ? new Date(order.endDate).toLocaleDateString() : 'N/A'}\nCurrent Date: ${new Date().toLocaleDateString()}\nTotal Rent: $${order.totalRent?.toFixed(2) || 'N/A'}\n\nThank you for using our library!\n`;
    const blob = new Blob([receiptData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt_${order._id || order.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all orders including their status and details.
          </p>
        </div>
      </div>
      <div className="mt-8 flex flex-col">
        <div className="flex justify-end mb-2">
          <button onClick={fetchOrders} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Refresh Orders</button>
        </div>
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Order ID</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Book</th>
<th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">User</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Author</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Rent Period</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {loading ? (
                    <tr><td colSpan={6} className="text-center py-8">Loading orders...</td></tr>
                  ) : error ? (
                    <tr><td colSpan={6} className="text-center text-red-500 py-8">{error}</td></tr>
                  ) : orders.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-8">No orders found.</td></tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order._id || order.id} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          #{order._id || order.id}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {order.book && order.book.title ? order.book.title : (order.bookName || 'N/A')}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {order.user && (order.user.name || order.user.username || order.user.email) ? (order.user.name || order.user.username || order.user.email) : 'N/A'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {order.book && order.book.author ? order.book.author : 'N/A'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {order.startDate && order.endDate ? `${new Date(order.startDate).toLocaleDateString()} - ${new Date(order.endDate).toLocaleDateString()}` : 'N/A'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(order.status || 'pending')}`}>
                            {(order.status || 'pending').charAt(0).toUpperCase() + (order.status || 'pending').slice(1)}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          ${order.totalRent ? order.totalRent.toFixed(2) : 'N/A'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <button
                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                            onClick={() => handleDownloadReceipt(order)}
                          >
                            Download Receipt
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Orders;