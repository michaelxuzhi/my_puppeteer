const puppeteer = require('puppeteer');
let fs = require('fs');
let data = [];
let search_word = '123';
(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: false,
    defaultViewport: null,
    userDataDir: './puppeteer_data',
  });
  const page = await browser.newPage();
  // 获取关键字前5页的搜索结果
  for (let i = 0; i <= 5; i++) {
    let pn = i == 0 ? 0 : '' + i + '0';
    await page.goto(`https://www.baidu.com/s?ie=UTF-8&wd=${search_word}&pn=${pn}`);
    await page.waitForSelector('#content_left > div > h3.t > a');

    let res = await page.$$eval('#content_left > div > h3.t > a', item =>
      item.map(x => x.innerText + '    ' + x.href)
    );
    data = data.concat(res);
  }

  // console.log(btn);
  //   await page.click(btn);
  // 写入文件
  fs.writeFile('res_data.json', JSON.stringify(data, null, '\t'), function(err) {
    if (err) {
      console.log(err);
    }
  });
  await browser.close();
})();
