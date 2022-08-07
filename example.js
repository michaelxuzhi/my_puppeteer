const puppeteer = require('puppeteer');
/*puppeteer.launch({headless:false}).then((browser)=>{
    browser.newPage().then(page=>{
        page.goto("http://baidu.com")
    })
})*/
async function run() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1366, height: 786 },
  });
  const page = await browser.newPage(); //打开一个新页面
  await page.goto('http://baidu.com');
  const input_area = await page.$('#kw');

  await input_area.type('hello world');

  const search_btn = await page.$('#su');
  await search_btn.click();
}
run();
