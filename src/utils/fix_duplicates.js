import mongoose from 'mongoose';
import Category from '../models/category.js';
import Expense from '../models/expense.js';
import dotenv from 'dotenv';

dotenv.config();

async function removeDuplicateCategories() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get all categories
    const categories = await Category.find();
    console.log('All categories:', categories.map(c => ({ id: c._id, name: c.name })));

    // Group by name
    const duplicates = {};
    categories.forEach(cat => {
      if (!duplicates[cat.name]) {
        duplicates[cat.name] = [];
      }
      duplicates[cat.name].push(cat);
    });

    // Find and remove duplicates
    for (const [name, cats] of Object.entries(duplicates)) {
      if (cats.length > 1) {
        console.log(`Found ${cats.length} categories named "${name}"`);
        console.log('Categories:', cats.map(c => ({ id: c._id, name: c.name })));
        
        // Keep the first one and delete others
        const keepCat = cats[0];
        for (let i = 1; i < cats.length; i++) {
          const deleteCat = cats[i];
          console.log(`Deleting category: ${deleteCat.name} (${deleteCat._id})`);
          await Category.findByIdAndDelete(deleteCat._id);
        }
      }
    }

    // Verify results
    const remainingCategories = await Category.find();
    console.log('Remaining categories:', remainingCategories.map(c => ({ id: c._id, name: c.name })));

    console.log('Duplicate removal completed successfully');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

removeDuplicateCategories();