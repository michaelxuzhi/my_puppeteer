const puppeteer = require('puppeteer');
let fs = require('fs');
let moviesData = {};
let data = {};
(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: false,
    defaultViewport: null,
    // userDataDir: './puppeteer_data',
  });
  const page = await browser.newPage();

let showUrl = `https://www.90ys.cc/detail/`;
for(let i = 1;i<=500;i++){
    let realUrl = `${showUrl}${i}.html`;
    await page.goto(realUrl);
    await page.waitForSelector('h1');
    let movieName = await page.$eval('h1',item=>item.innerText);
    data[movieName] = [];
    let movieList = await page.$$eval('div.tab-content > ul.list-unstyled > li',item=>item.map(x =>{ let i = {}; i['num']= x.innerText; i['id'] = x.getAttribute('data-id');return i} ));
    movieList.forEach(ele => {
      let movieUrl = `https://www.90ys.cc/video/`;
      movieUrl = `${movieUrl}${ele['id']}.html`;
      ele['url'] = movieUrl;
      // 数据拼接
      data[movieName] = movieList
    });
    moviesData = data;
}

  // 写入文件
  fs.writeFile('90ys_movies_data.json',JSON.stringify(moviesData,null,'\t'),function(err){
    if(err){console.log(err)}
})

  await browser.close();
})();
