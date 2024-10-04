const express = require("express");
const { handleGenerateNewShortURL, handleUserAnalytics } = require("../controller/url");
const router = express.Router();

router.post('/' , handleGenerateNewShortURL);
router.get('/analytics/:shortid' , handleUserAnalytics);

module.exports = router;