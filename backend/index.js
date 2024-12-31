const express = require('express');
const axios = require('axios');
const cors = require('cors');
const cheerio = require('cheerio');
const Sentiment = require('sentiment'); 
const sentimentAnalyzer = new Sentiment();


const app = express();

app.use(cors());

const productUrl = "https://www.amazon.com/HP-i3-1125G4-Processor-Anti-Glare-Accessories/dp/B0CJQVVSL2/ref=sr_1_1_sspa?dib=eyJ2IjoiMSJ9.kuslKlXXv2lRPqY7IfE9WHDGtsIgFIQhUJ63TYSY4xr-SJ6IVTTagl4o_FCue59nC9nJ8XZmP6-qrKgqBenCYgswx63lCSHBx78KiRPHBusWWgIjNymhA0hEoBgVI77f6H6l4rIZowgRkAs9YKN4qY61hge9v0wZg-XTabv3yoGbsrFEzNVO2TICecMKIEAeSzom_QP0Zecml1YoamyWU2vQVF8fZIEXL3Gtokky4_c.i740TwTVHZ9DYF4uVDKXY_0h_xb9hLvsObPy6GeD6d0&dib_tag=se&keywords=laptops&qid=1734101062&sr=8-1-spons&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&th=1";

const FinalInfo = []; 

app.get("/reviews", async (req, res) => {
    
    let overallScore = 0;
    let reviewCount = 0;
    let positiveReviews = 0;
    let negativeScoreSum = 0;
    let negativeReviews = 0;
    let neutralReviews = 0;
    let positiveScoreSum = 0;

    try {
       
        const HTMLData = (await axios.get(productUrl)).data;
        const $ = cheerio.load(HTMLData);

        $('#cm-cr-dp-review-list>li').each((index, reviewElement) => {
            const reviewText = $(reviewElement).find('.a-size-base.review-text').text();
            const analysisResult = sentimentAnalyzer.analyze(reviewText).score;
            reviewCount++;

            overallScore += analysisResult;
           

            if (analysisResult > 0) {
              
                positiveScoreSum += analysisResult;
                positiveReviews++;
            } else if (analysisResult === 0) {
                neutralReviews++;
            } else {
                negativeReviews++;
                negativeScoreSum -= analysisResult; 
            }

            FinalInfo[index] = { score: analysisResult, review: reviewText };
        });

        
        const productTitle = $('#title span').text();

       
        res.json({
            ProductName: productTitle,
            TotalScore: overallScore,
            TotalReviews: reviewCount,
            PositiveReviews: positiveReviews,
            NegativeReviews: negativeReviews,
            NeutralReviews: neutralReviews,
            PositiveScore: positiveScoreSum,
            NegativeScore: negativeScoreSum
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch data from the URL." });
    }
});


app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
