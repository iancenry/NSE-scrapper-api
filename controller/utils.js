import axios from 'axios';
import * as cheerio from 'cheerio';

let lastData = null;

const getData = async (req, res) => {
  try {
    const response = await axios.get('https://afx.kwayisi.org/nse/');
    const html = response.data;
    const $ = cheerio.load(html);
    const stocks = [];

    $('div.t > table > tbody > tr', html).each(function () {
      let row = {};
      row['ticker'] = $($(this).find('td')[0]).text();
      row['name'] = $($(this).find('td')[1]).text();
      row['volume'] = $($(this).find('td')[2]).text();
      row['price'] = $($(this).find('td')[3]).text();
      row['change'] = $($(this).find('td')[4]).text();
      stocks.push(row);
    });
    // If data has changed from last fetch update lastData else return last data
    if (JSON.stringify(stocks) !== JSON.stringify(lastData)) {
      lastData = stocks;
      return stocks;
    } else {
      // no change in data
      return lastData;
    }
  } catch (error) {
    return error.message;
  }
};

export { getData };
