const puppeteer = require('puppeteer');
let fs = require('fs');
let data = [];
(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: false,
    defaultViewport: null,
    userDataDir: './puppeteer_data',
  });
  const page = await browser.newPage();
  // await page.goto('https://www.bilibili.com');

  for (let i = 1; i <= 12; i++) {
    for (let pages = 0; pages <= 10; pages++) {
      // var that = this;
      let month = i.toString();
      month = month.length > 1 ? month : '0' + month;
      await page.goto(
        'https://www.bilibili.com/v/music/original/?spm_id_from=333.5.b_7375626e6176.2#' +
          `/all/click/0/${pages}/2020-${month}-01,2020-${month}-28`
      );
      await page.waitForSelector('div.vd-list-cnt > ul > li > div > div.r > a');
      let titles = await page.$$eval(
        'div.vd-list-cnt > ul > li > div > div.r > a',
        item => item.map(x => x.innerText)
      );
      // console.log(titles);
      titles = titles.map(item => {
        return `2020-${month}   ` + item;
      });
      // console.log(titles);
      data = data.concat(titles);
    }
  }
  // console.log(data);
  // 写入文件
  fs.writeFile('song_data.json', JSON.stringify(data, null, '\t'), function(err) {
    if (err) {
      console.log(err);
    }
  });

  // await page.screenshot({ path: 'example.png' });
  await browser.close();
})();
