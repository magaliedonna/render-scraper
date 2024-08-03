const puppeteer = require("puppeteer");
require("dotenv").config();

const scrapeLogic = async (res, req) => {
  const url = req.query.url;
  const browser = await puppeteer.launch({
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
  });
  try {
        const page = await browser.newPage();
        await page.goto(url);
        await page.setViewport({ width: 1080, height: 1024 });
    
        await page.waitForSelector('svg[class="verify-bar-close--icon"]');
        await page.click('svg[class="verify-bar-close--icon"]');

       const infos = await page.evaluate(() => {
            const img = document.querySelector('div[data-e2e="user-avatar"] span img').getAttribute('src');
            const username = document.querySelector('h1[data-e2e="user-title"]').innerText;
            const bio = document.querySelector('h2[data-e2e="user-bio"]').innerText;
            const like = document.querySelector('strong[data-e2e="likes-count"]').innerText;
            const followers = document.querySelector('strong[data-e2e="followers-count"]').innerText;;
        return{img, username, bio, like, followers};

       });
       res.send({imageProfile: infos.img, username: infos.username, bio: infos.bio, likes: infos.like, followers: infos.followers});
    
    } catch (e) {
    console.error(e);
    res.send("Hum une erreur");
  } finally {
    await browser.close();
  }
};

module.exports = { scrapeLogic };
