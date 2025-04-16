import { useState, useEffect } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

function getDefaultEndDate() {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toISOString().slice(0, 10);
}

const BookCard = ({ book: initialBook }) => {
  const [book, setBook] = useState(initialBook);
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [showModal, setShowModal] = useState(false);
  const [endDate, setEndDate] = useState(getDefaultEndDate());
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setBook(initialBook);
  }, [initialBook]);

  const today = new Date().toISOString().slice(0, 10);
  const basePeriod = 7;
  const rentPerDay = book.rent || 0;
  const start = new Date(today);
  const end = new Date(endDate);
  const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) || 1;
  const extraDays = Math.max(0, days - basePeriod);
  const extraCharge = extraDays * rentPerDay;
  const totalRent = days * rentPerDay;

  const handleRent = () => {
    if (!user) {
      setError('Please login to rent books');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      addToCart({
        id: book.id,
        title: book.title,
        author: book.author,
        coverImage: book.coverImage,
        rentPerDay,
        startDate: today,
        endDate,
        days,
        extraDays,
        extraCharge,
        totalRent,
        genre: book.genre,
      });
      setSuccess('Book added to cart!');
      setTimeout(() => {
        setShowModal(false);
        setSuccess('');
      }, 1200);
    } catch (err) {
      setError(err.message || 'Failed to add to cart');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${book.title}"? This cannot be undone.`)) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await import('../api').then(api => api.deleteBook(book.id));
      setSuccess('Book deleted successfully!');
      // Optionally, trigger a refresh or callback to parent to remove this book from the list
      if (typeof window !== 'undefined') {
        window.location.reload(); // Simple approach for now
      }
    } catch (err) {
      setError(err.message || 'Failed to delete book');
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = () => {
    if (!user) {
      setError('Please login to rent books');
      return;
    }
    if (user.role === 'member' && book.available) {
      setShowModal(true);
    }
  };

  return (
    <div className="relative">
      {error && (
        <div className="absolute top-0 left-0 right-0 bg-red-100 text-red-700 px-4 py-2 text-sm rounded-t">
          {error}
        </div>
      )}
      <div 
        className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
        onClick={handleCardClick}
      >
        <img
          src={book.coverImage}
          alt={book.title}
          className="h-48 w-full object-cover"
        />
        <div className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{book.title}</h2>
              <p className="text-gray-600">{book.author}</p>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {book.genre}
            </span>
          </div>
          <p className="mt-2 text-gray-500 text-sm line-clamp-2">{book.description}</p>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-yellow-400">★</span>
              <span className="ml-1 text-sm text-gray-600">{book.rating}</span>
            </div>
            <span className="text-lg font-bold text-blue-600">${book.rent} <span className="text-xs">/day</span></span>
          </div>
          <div className="mt-2">
            {book.available ? (
              <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-700 rounded">Available</span>
            ) : (
              <span className="inline-block px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded">
                Unavailable until {book.dueDate ? new Date(book.dueDate).toLocaleDateString('en-GB') : 'returned'}
              </span>
            )}
          </div>
          {user?.role === 'member' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
              className="mt-4 w-full py-2 px-4 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!book.available}
            >
              {book.available ? 'Rent' : 'Not Available'}
            </button>
          )}
          {user?.role === 'admin' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              className="mt-4 w-full py-2 px-4 rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Deleting...' : 'Delete Book'}
            </button>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-xs relative">
            <button 
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowModal(false)}
            >
              ×
            </button>
            <h3 className="text-lg font-bold mb-2">Rent "{book.title}"</h3>
            <div className="mb-2">
              <label className="block text-sm font-medium">Start Date</label>
              <input
                type="date"
                value={today}
                disabled
                className="w-full border rounded px-2 py-1 bg-gray-100"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium">End Date</label>
              <input
                type="date"
                value={endDate}
                min={today}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <div className="mb-2 text-sm">
              <span>Base period: 7 days</span><br />
              <span>Total days: {days}</span><br />
              <span>Rent: ${rentPerDay} × {days} days = ${totalRent.toFixed(2)}</span><br />
              {extraDays > 0 && (
                <span className="text-red-600">
                  Extra charge for {extraDays} day(s): ${extraCharge.toFixed(2)}
                </span>
              )}
            </div>
            {error && <div className="text-red-500 mb-2">{error}</div>}
            {success && <div className="text-green-600 mb-2">{success}</div>}
            <button
              onClick={handleRent}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mt-2 disabled:opacity-50"
            >
              {loading ? 'Adding to Cart...' : 'Add to Cart'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookCard;