const express=require("express");
const { handleGenerateNewShortUrl, handleGetAnalytics, handleRedirecting } = require("../controllers/url");
const { authenticateUser } = require("../middlewares/auth");
const router= express.Router();

router.post("/",authenticateUser,handleGenerateNewShortUrl);
router.get("/:shortID",handleRedirecting);
router.get("/analytics/:shortID",handleGetAnalytics);

module.exports = router;