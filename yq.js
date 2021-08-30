const puppeteer = require('puppeteer');
let fs = require('fs');
let data = [];
let data_1 = [];
//let search_word = '疫情';
// 0:国内疫情，1:实时播报，4:国外疫情
let tab_num = 4;
(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: false,
    defaultViewport: null,
    userDataDir: './puppeteer_data',
  });
  const page = await browser.newPage();
  await page.goto(
    `https://voice.baidu.com/act/newpneumonia/newpneumonia/?from=osari_aladin_banner#tab${tab_num}`
  );

  // 国内疫情模块
  await page.waitForSelector('#ptab-0 > div.VirusSummarySix_1-1-315_ZRHUKw>div>div');
  let res = await page.$$eval(
    '#ptab-0 > div.VirusSummarySix_1-1-315_ZRHUKw>div>div',
    item => item.map(x => x.className)
  );
  res = res.map(item => item.split(' ')).filter(item => item.length == 2);
  data = data.concat(res);
  for (let i = 0; i < data.length; i++) {
    let class_name = data[i][1];
    // console.log(class_name);
    let res_last = await page.$$eval(
      `#ptab-0 > div.VirusSummarySix_1-1-315_ZRHUKw>div>div.${class_name}`,
      item => item.map(x => x.innerText)
    );
    console.log(res_last);
    data_1 = data_1.concat(res_last);
  }

  // 实时播报模块

  // 写入文件
  fs.writeFile('yq_data.json', JSON.stringify(data_1, null, '\t'), function(err) {
    if (err) {
      console.log(err);
    }
  });
  await browser.close();
})();
