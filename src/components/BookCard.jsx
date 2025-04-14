import { useState } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';

const BookCard = ({ book }) => {
  const [isAdding, setIsAdding] = useState(false);
  const { title, author, price, genre, rating, coverImage, description } = book;

  const handleAddToCart = () => {
    setIsAdding(true);
    // In a real app, this would integrate with a cart management system
    setTimeout(() => {
      alert(`Added "${title}" to cart!`);
      setIsAdding(false);
    }, 500);
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <img
        src={coverImage}
        alt={title}
        className="h-48 w-full object-cover"
      />
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            <p className="text-gray-600">{author}</p>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {genre}
          </span>
        </div>
        <p className="mt-2 text-gray-500 text-sm line-clamp-2">{description}</p>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-yellow-400">★</span>
            <span className="ml-1 text-sm text-gray-600">{rating}</span>
          </div>
          <span className="text-lg font-bold text-blue-600">${price}</span>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className={`mt-4 w-full py-2 px-4 rounded-lg text-white transition-colors duration-200 ${
            isAdding
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isAdding ? 'Adding to Cart...' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default BookCard; 