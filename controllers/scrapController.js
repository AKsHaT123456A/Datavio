const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const Flipkart = require('../models/flipkartData');
const User = require('../models/user');
const { handleErrorResponse } = require('../utils/handleError');
const logger = require('../utils/logger');
require("dotenv").config();

module.exports.scrap = async (req, res) => {
    const url = req.body.url;
    const userId = req.user._id;

    try {
        const existingData = await Flipkart.findOne({ userId, url });

        if (existingData) {
            return res.status(200).json(existingData);
        }

        const browser = await puppeteer.launch({
            args: [
                "--disable-setuid-sandbox",
                "--single-process",
                "--no-zygote",
                "--no-sandbox",
            ],
            executablePath: process.env.NODE_ENV === "production" ? process.env.PUPPETEER_EXECUTABLE_PATH : puppeteer.executablePath(),
        });

        const page = await browser.newPage();
        await page.goto(url);

        const content = await page.content();
        const $ = cheerio.load(content);

        const title = $('span[class="B_NuCI"]').text();
        const priceStr = $('div[class="_30jeq3 _16Jk6d"]').text().replace('₹', '').replace(',', '');
        const numReviewsStr = $('span[class="_2_R_DZ"]').text();
        const ratings = $('div[class="_2d4LTz"]').text();
        const mediaCount = $('div[class="_1VfWRb _3jywji YTKFIp"]').length;
        const description = $('div[class="_1mXcCf RmoJUa"]').text();

        const price = parseFloat(priceStr);
        const numReviews = parseInt(numReviewsStr);

        if (!title || isNaN(price) || isNaN(numReviews)) {
            return errorHandler(res, 400, ' Ensure data extraction failded.', 'Validation failed');
        }

        const flipkartData = new Flipkart({
            userId,
            url,
            title,
            price,
            numReviews,
            ratings,
            mediaCount,
            description
        });

        await flipkartData.save();
        const user = await User.findByIdAndUpdate(userId, {
            $push: { url: flipkartData }
        }).populate({ path: "url", model: "Flipkart", select: "userId url title price numReviews ratings mediaCount description" });
        await browser.close();

        res.status(201).json({ message: 'Data scraped and saved successfully.', data: flipkartData });
    } catch (error) {
        logger.error('Error:', error.message);
        handleErrorResponse(res, 500, 'An error occurred while scraping and saving data.', error);
    }
};

