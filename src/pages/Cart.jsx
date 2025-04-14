import { useState } from 'react';
import { TrashIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';

// Mock cart data
const initialCartItems = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    price: 19.99,
    quantity: 1,
    coverImage: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e"
  },
  {
    id: 2,
    title: "1984",
    author: "George Orwell",
    price: 15.99,
    quantity: 2,
    coverImage: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e"
  }
];

const Cart = () => {
  const [cartItems, setCartItems] = useState(initialCartItems);

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(cartItems.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.1; // 10% tax
  const shipping = cartItems.length > 0 ? 5.99 : 0;
  const total = subtotal + tax + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
          <a href="/browse" className="text-blue-600 hover:text-blue-700 font-medium">
            Continue Shopping →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      {/* Cart Items */}
      <div className="space-y-4 mb-8">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-sm"
          >
            <img
              src={item.coverImage}
              alt={item.title}
              className="h-24 w-20 object-cover rounded"
            />
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
              <p className="text-gray-600">{item.author}</p>
              <p className="text-gray-600">${item.price.toFixed(2)}</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="p-1 rounded-md hover:bg-gray-100"
              >
                <MinusIcon className="h-4 w-4" />
              </button>
              <span className="w-8 text-center">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="p-1 rounded-md hover:bg-gray-100"
              >
                <PlusIcon className="h-4 w-4" />
              </button>
            </div>
            <div className="text-right">
              <p className="text-lg font-medium text-gray-900">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
            <button
              onClick={() => removeItem(item.id)}
              className="text-gray-400 hover:text-red-500"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
        <div className="space-y-2">
          <div className="flex justify-between text-gray-600">
            <p>Subtotal</p>
            <p>${subtotal.toFixed(2)}</p>
          </div>
          <div className="flex justify-between text-gray-600">
            <p>Tax (10%)</p>
            <p>${tax.toFixed(2)}</p>
          </div>
          <div className="flex justify-between text-gray-600">
            <p>Shipping</p>
            <p>${shipping.toFixed(2)}</p>
          </div>
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between font-medium text-gray-900">
              <p>Total</p>
              <p>${total.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => alert('Checkout functionality would be implemented here')}
          className="w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart; 