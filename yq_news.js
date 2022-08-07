const puppeteer = require('puppeteer');
const fs = require('fs');
const browser_config = {
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: false,
  defaultViewport: null,
  userDataDir: './puppeteer_data',
};
// 0:国内疫情，1:实时播报，4:国外疫情
let tab_num = 1;
// 目标元素选择器配置
const seletors = {
  news_sels: `#ptab-${tab_num} > div.Virus_1-1-315_2SKAfr > div > div`,
};

// 网址参数配置模块
function webSite() {
  let prot = 'https';
  let url = `${prot}://voice.baidu.com/act/newpneumonia/newpneumonia/?from=osari_aladin_banner#tab${tab_num}`;
  return url;
}

// 主要运行模块，浏览器的生命周期
async function run(url, browser_config) {
  const browser = await puppeteer.launch(browser_config);
  const page = await browser.newPage();
  await page.goto(url);
  await elemsSelector(page);
  await LOG('parent', 'son', 'msg');
  // let elems = await getElem(page);
  // await click(elems);
  await close(browser);
}

// 元素选择器
async function elemsSelector(page) {
  // 等待元素加载完毕
  await page.waitForSelector(seletors.news_sels);
  let new_obj = {};
  let news_list = await page.$$eval(seletors.news_sels, item =>
    item.map(x => x.innerText)
  );
  // console.log(news_list);
  for (let i = 0; i <= news_list.length; i + 2) {
    new_obj[news_list[i]] = news_list[i + 1];
  }
  console.log(new_obj);
}
// 获取元素
async function getElem(page) {}

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
  fileRecord('append', 'new_log.log', log);
}

// 获取系统日期的方法
function getTime() {
  let date = new Date();
  return String(date.toLocaleString());
}

// 写入文件
function fileRecord(reMethod, fileDir, data) {
  fs[`${reMethod}File`](fileDir, JSON.stringify(data, null, '\t') + '\n', function(err) {
    if (err) {
      console.log(err);
    }
  });
}

// main 主运行逻辑
run((url = webSite()), browser_config);
