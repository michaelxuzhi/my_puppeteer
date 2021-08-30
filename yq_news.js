const puppeteer = require('puppeteer');
const fs = require('fs');
const browser_config = {
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: false,
  defaultViewport: null,
  userDataDir: './puppeteer_data',
};

// 网址参数配置模块
function webSite() {
  let prot = 'http://';
  let url = prot + 'www.baidu.com';
  return url;
}

// 主要运行模块，浏览器的生命周期
async function run(url, browser_config) {
  const browser = await puppeteer.launch(browser_config);
  const page = await browser.newPage();
  await page.goto(url);
  let elems = await getElem(page);
  await click(elems);
  await close(browser);
}

// 获取元素
async function getElem(page) {
  let input_area = await page.$('#kw');
  let search_btn = await page.$('#su');
  return { input_area, search_btn };
}

// 点击模块
async function click(elems) {
  let { input_area, search_btn } = elems;
  await input_area.type('123');
  await search_btn.click();
  console.log('成功点击');
  await LOG(click.name, '', '');
}

// 关闭浏览器
async function close(browser) {
  await browser.close();
}

// 记log模块，任意地方调用
// 示例： await LOG("parentsName","sonsName","logContent")
async function LOG(par, son, msg) {
  let parComp = !!par ? par : '默认parentsComp',
    sonComp = !!son ? son : '默认sonsComp',
    log_content = !!msg ? msg : '默认msg';
  let log = `${getTime()}  ${parComp}  ${sonComp}  ${log_content}`;
  fs.appendFile('new_log.log', JSON.stringify(log, null, '\t') + '\n', function(err) {
    if (err) {
      console.log(err);
    }
  });
}

// 获取系统日期的方法
function getTime() {
  let date = new Date();
  return String(date.toLocaleString());
}

// main 主运行逻辑
run((url = webSite()), browser_config);
