const router = require('express').Router();

const { scrap } = require('../controllers/scrapController');
const { auth } = require('../middleware/auth');

router.post('/scrape', auth, scrap);

module.exports = router;