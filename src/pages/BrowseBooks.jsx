import { useState } from 'react';
import BookCard from '../components/BookCard';

const mockBooks = [
  {
    id: 1,
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    price: 19.99,
    genre: 'Classic',
    rating: 4.5,
    coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e',
    description: 'A story of decadence and excess, exploring the American Dream.'
  },
  {
    id: 2,
    title: '1984',
    author: 'George Orwell',
    price: 15.99,
    genre: 'Science Fiction',
    rating: 4.7,
    coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e',
    description: 'A dystopian social science fiction novel and cautionary tale.'
  },
  // Add more mock books as needed
];

const BrowseBooks = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBooks = mockBooks.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.genre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Browse Books</h1>
        
        {/* Search Bar */}
        <div className="max-w-xl">
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md"
              placeholder="Search by title, author, or genre"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>

      {/* No Results */}
      {filteredBooks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No books found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default BrowseBooks; 