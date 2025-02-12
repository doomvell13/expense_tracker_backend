import Expense from '../models/expense.js';
import Tag from '../models/tag.js'

export const addExpense = async (req, res) => {
  try {
    console.log('Received request body:', req.body); // Debug log

    const expense = new Expense({
      description: req.body.description,
      amount: req.body.amount,
      category: req.body.category,
      type: req.body.type, 
      tags: req.body.tags || [], 
      date: req.body.date,
      user: req.user._id
    });

    if (req.body.tags && req.body.tags.length > 0) {
      for (const tagName of req.body.tags) {
        await Tag.findOneAndUpdate(
          { 
            user: req.user._id,
            name: tagName 
          },
          { 
            $inc: { usageCount: 1 },
            lastUsed: new Date()
          },
          { 
            upsert: true,
            new: true
          }
        );
      }
    }
    
    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    console.error('Error saving expense:', error); // Debug log
    res.status(400).json({ error: error.message });
  }
};

export const getExpenses = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    console.log('Received date params:', { startDate, endDate });
    
    // Build query object
    const query = { user: req.user._id };
    
    // Add date filtering if dates are provided
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        // Create date at start of day in UTC
        const start = new Date(startDate);
        start.setUTCHours(0, 0, 0, 0);
        query.date.$gte = start;
        console.log('Start date in UTC:', start.toISOString());
      }
      if (endDate) {
        // Create date at end of day in UTC
        const end = new Date(endDate);
        end.setUTCHours(23, 59, 59, 999);
        query.date.$lte = end;
        console.log('End date in UTC:', end.toISOString());
      }
    }

    console.log('Fetching expenses with query:', JSON.stringify(query, null, 2));
    
    const expenses = await Expense.find(query).sort({ date: -1 });
    console.log(`Found ${expenses.length} expenses`);
    console.log('Date range of results:',
      expenses.length > 0 ? {
        earliest: new Date(Math.min(...expenses.map(e => e.date))).toISOString(),
        latest: new Date(Math.max(...expenses.map(e => e.date))).toISOString()
      } : 'No results'
    );
    
    res.json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ error: error.message });
  }
};

export const updateExpense = async (req, res) => {
  try {
    const updates = {
      description: req.body.description,
      amount: req.body.amount,
      category: req.body.category,
      tags: req.body.tags, // Include tags in updates
      date: req.body.date
    };

    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      updates,
      { new: true }
    );

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    res.json(expense);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.user._id 
    });
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    res.json({ message: 'Expense deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};