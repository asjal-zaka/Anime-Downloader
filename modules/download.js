import axios from "axios";
import { load } from "cheerio";
import puppeteer from "puppeteer"

const baseURL = "https://anitaku.to";

export const getLinks = async (epID) => {
 const searchURL = await axios.get(`${baseURL}/${epID}`);
const $ = load(await searchURL.data)
const link = $('.dowloads').find('a').attr('href');
return link;
}

export const getDownload = async (link) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(link, { waitUntil: 'networkidle2', timeout: 60000 });
  await page.waitForSelector('.dowload');
  const links = await page.$$eval('.dowload a', anchors => {
    const anchorsHref = anchors.map(anchor => anchor.href);
    const anchorsText= anchors.map(anchor => anchor.innerText);
    const resolutions = anchorsText.map(download => {
      const startIdx = download.indexOf('(') + 1;
      const endIdx = download.indexOf('-');
      return download.substring(startIdx, endIdx).trim();
  });
  return { anchorsHref, resolutions };
  });
  await browser.close();
  return links;
};