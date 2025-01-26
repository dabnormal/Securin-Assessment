const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const { syncCVEs } = require('./services/syncService');
const cveRouter = require('./routes/cveRoutes');
const errorHandler = require('./utils/errorHandler');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/cves', cveRouter);

// Error handling
app.use(errorHandler);

// Schedule daily sync at midnight
cron.schedule('0 0 * * *', syncCVEs);

// Initial sync on startup
// syncCVEs().then(() => {
//   console.log('Initial data sync completed');
// });

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});