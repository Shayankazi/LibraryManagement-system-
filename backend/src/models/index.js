import Book from './Book.js';
import User from './User.js';
import Rental from './Rental.js';
import Transaction from './Transaction.js';
import Donation from './Donation.js';

// User-Book relationships
Book.belongsTo(User, { as: 'borrowedBy', foreignKey: 'borrowedById' });
User.hasMany(Book, { as: 'borrowedBooks', foreignKey: 'borrowedById' });

// User-Rental relationships
User.hasMany(Rental, { foreignKey: 'userId' });
Rental.belongsTo(User, { foreignKey: 'userId' });

// Book-Rental relationships
Book.hasMany(Rental, { foreignKey: 'bookId' });
Rental.belongsTo(Book, { foreignKey: 'bookId' });

// User-Transaction relationships
User.hasMany(Transaction, { foreignKey: 'userId' });
Transaction.belongsTo(User, { foreignKey: 'userId' });

// Book-Transaction relationships
Book.hasMany(Transaction, { foreignKey: 'bookId' });
Transaction.belongsTo(Book, { foreignKey: 'bookId' });

export {
  Book,
  User,
  Rental,
  Transaction,
  Donation
};