const express = require("express");
const app = express();
const axios = require("axios");
const cheerio = require("cheerio");
const getPrice = async () => {
  const url = "https://coinmarketcap.com/";

  const { data } = await axios.get(url);

  const $ = cheerio.load(data);
  const elementSelector =
    "#__next > div > div.main-content > div.sc-57oli2-0.comDeo.cmc-body-wrapper > div > div > div.h7vnx2-1.bFzXgL > table > tbody > tr";
  const keys = [
    "rank",
    "name",
    "price",
    "24h",
    "7d",
    "marketCap",
    "volume",
    "circulatingSupply",
  ];
  const coinAir = [];

  $(elementSelector).each((parentIdx, parentEle) => {
    let keyIdx = 0;
    let coinObj = {};

    if (parentIdx < 10) {
      $(parentEle)
        .children()
        .each((childIdx, childEle) => {
          const $childItem = cheerio.load(childEle);
          const tdValue = $(childEle).text();
          const logo = $childItem("* > .coin-logo").attr("src");
          if (tdValue) {
            coinObj[keys[keyIdx]] = tdValue;
            keyIdx++;
          }
          if (logo) coinObj["srcLogo"] = logo;
        });
      coinAir.push(coinObj);
    }
  });

  return coinAir;
};

app.get("/", async (req, res) => {
  try {
    const priceFeed = await getPrice();
    return res.status(200).json({
      result: priceFeed,
    });
  } catch (err) {
    return res.status(500).json("Error");
  }
});
app.listen(3333, () => {
  console.log("Server is running on: 3333");
});
