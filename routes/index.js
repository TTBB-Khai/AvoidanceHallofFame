const express = require('express');
const router = express.Router();

router.use('/avoidance', require('./avoidance'));

module.exports = router;