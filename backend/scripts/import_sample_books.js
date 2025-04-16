import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import sequelize from '../src/config/database.js';
import { Book } from '../src/models/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function importBooks() {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('Connected to MySQL database');

    // Read sample books
    const sampleBooksPath = join(__dirname, '../../sampleBooks.json');
    const booksData = JSON.parse(await readFile(sampleBooksPath, 'utf8'));
    
    // Import books
    await Book.bulkCreate(booksData.map(book => ({
      ...book,
      available: true
    })));

    console.log(`Successfully imported ${booksData.length} books`);
    process.exit(0);
  } catch (error) {
    console.error('Error importing books:', error);
    process.exit(1);
  }
}

importBooks();