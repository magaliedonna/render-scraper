const puppeteer = require("puppeteer");
require("dotenv").config();

const scrapeLogic = async (res, req) => {
  const url = req.query.url;
  const browser = await puppeteer.launch({
    headless: true,
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
        let page = await browser.newPage();

        
        await page.goto(url);
        await page.setViewport({ width: 720, height: 1280, deviceScaleFactor: 1,
            isMobile: true });
        await page.setUserAgent('Mozilla/5.0 (Linux; Android 4.2.2; Nexus 7 Build/JDQ39) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.90 Safari/537.36');
;
        await page.waitForSelector('svg[class="verify-bar-close--icon"]', { visible: true });
        await page.click('svg[class="verify-bar-close--icon"]', { delay: 100 });

       const infos = await page.evaluate(() => {
            let img = document.querySelector('div[data-e2e="user-avatar"] span img').getAttribute('src');
            let username = document.querySelector('h1[data-e2e="user-title"]').innerText;
            let bio = document.querySelector('h2[data-e2e="user-bio"]').innerText;
            let like = document.querySelector('strong[data-e2e="likes-count"]').innerText;
            let followers = document.querySelector('strong[data-e2e="followers-count"]').innerText;;
        return{img, username, bio, like, followers};

       });

       res.send({imageProfile: infos.img, username: infos.username, bio: infos.bio, likes: infos.like, followers: infos.followers});
    
    } catch (e) {
    console.error(e);
    res.send("<h1>Hum une erreur</h1>");
  } finally {
    await browser.close();
  }
};

module.exports = { scrapeLogic };
