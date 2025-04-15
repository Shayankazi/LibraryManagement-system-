import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="relative overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Welcome to Our</span>
                <span className="block text-blue-600">Online Bookstore</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Discover your next great read from our vast collection of books. 
                From bestsellers to rare finds, we have something for every reader.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <Link
                    to="/browse"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                  >
                    Browse Books
                  </Link>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <Link
                    to="/donate"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg md:px-10"
                  >
                    Donate a Book
                  </Link>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <img
          className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
          src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f"
          alt="Library"
        />
      </div>
    </div>
  );
};

export default Home;

const features = [
  {
    name: 'Wide Selection',
    description: 'Browse through thousands of books across various genres and categories.',
    icon: '📚',
  },
  {
    name: 'Easy Purchase',
    description: 'Simple and secure checkout process with multiple payment options.',
    icon: '💳',
  },
  {
    name: 'Fast Delivery',
    description: 'Get your books delivered right to your doorstep.',
    icon: '🚚',
  },
  {
    name: 'Best Prices',
    description: 'Competitive prices and regular discounts on your favorite books.',
    icon: '💰',
  },
]; 