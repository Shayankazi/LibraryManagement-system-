import { useState, useEffect } from 'react';
import BookCard from '../components/BookCard';
import { fetchBooks } from '../api';

const BrowseBooks = () => {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [genre, setGenre] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // You can expand this list as needed
  const genreOptions = [
    '',
    'Classic',
    'Science Fiction',
    'Fantasy',
    'Mystery',
    'Romance',
    'Adventure',
    'Children\'s',
    'Historical',
    'Philosophical',
    'Horror',
    'Biography',
    'Autobiography',
    'Memoir',
    'Educational',
    'Novel',
    'Fiction',
    'Non-Fiction',
    'Satire',
    'Epic',
    'Drama',
    'Gothic',
  ];

  useEffect(() => {
    setLoading(true);
    fetchBooks({ search: searchQuery, genre })
      .then(setBooks)
      .catch(() => setError('Failed to load books'))
      .finally(() => setLoading(false));
  }, [searchQuery, genre]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Browse Books</h1>
        {/* Genre Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4 max-w-xl">
          <div>
            <select
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={genre}
              onChange={e => setGenre(e.target.value)}
            >
              <option value="">All Genres</option>
              {genreOptions.filter(g => g).map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <div className="relative rounded-md shadow-sm">
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
      </div>
      {loading ? (
        <div className="text-center py-12"><p>Loading books...</p></div>
      ) : error ? (
        <div className="text-center py-12"><p className="text-red-500">{error}</p></div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {books.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
          {books.length === 0 && (
            <>
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No books found matching your search.</p>
              </div>
              {/* Always show a test book for Rent button visibility */}
              <div className="max-w-xs mx-auto">
                <BookCard book={{
                  _id: 'testbook1',
                  title: 'Test Book for Rent',
                  author: 'Demo Author',
                  genre: 'Demo',
                  description: 'This is a demo book to test the Rent button.',
                  coverImage: 'https://covers.openlibrary.org/b/id/8225261-L.jpg',
                  rent: 2.49,
                  rating: 5
                }} />
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default BrowseBooks;