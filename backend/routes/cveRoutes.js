const express = require('express');
const router = express.Router();
const {
  getAllCVEs,
  getCVEById
} = require('../controllers/cveController');

// Core routes
router.get('/', getAllCVEs);
router.get('/:cveId', getCVEById);



module.exports = router;