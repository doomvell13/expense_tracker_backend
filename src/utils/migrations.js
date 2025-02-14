import mongoose from 'mongoose';
import Category from '../models/category.js';
import Expense from '../models/expense.js';
import dotenv from 'dotenv';

dotenv.config();

const standardCategories = [
  {
    name: 'Food & Drink',
    icon: 'restaurant'
  },
  {
    name: 'Shopping',
    icon: 'shopping_cart'
  },
  {
    name: 'Learning',
    icon: 'school'
  },
  {
    name: 'Bills & Fees',
    icon: 'receipt'
  },
  {
    name: 'Salary',
    icon: 'payments'
  },
  {
    name: 'Business',
    icon: 'business'
  },
  {
    name: 'Other',
    icon: 'more_horiz'
  }
];

// Map all variations to the standard name
const categoryMappings = {
  'Food and Drinks': 'Food & Drink',
  'Food & Drinks': 'Food & Drink',
  'Food and Drink': 'Food & Drink',
  'Bills and Fees': 'Bills & Fees',
  'Education': 'Learning'
};

async function migrate() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get the first user from the system
    const firstExpense = await Expense.findOne();
    if (!firstExpense) {
      console.log('No expenses found');
      return;
    }
    const userId = firstExpense.user;

    // Update expense categories to standard names
    for (const [oldName, newName] of Object.entries(categoryMappings)) {
      console.log(`Updating expenses with category "${oldName}" to "${newName}"`);
      await Expense.updateMany(
        { category: oldName },
        { $set: { category: newName } }
      );
    }

    // Delete all existing categories for this user
    console.log('Deleting existing categories');
    await Category.deleteMany({ user: userId });

    // Create new standardized categories
    console.log('Creating standardized categories');
    for (const category of standardCategories) {
      try {
        await Category.create({
          name: category.name,
          icon: category.icon,
          user: userId
        });
        console.log(`Created category: ${category.name}`);
      } catch (error) {
        if (error.code === 11000) {
          console.log(`Category ${category.name} already exists, skipping`);
          continue;
        }
        throw error;
      }
    }

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
  }
}

migrate();