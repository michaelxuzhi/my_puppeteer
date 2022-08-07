const puppeteer = require('puppeteer');
let fs = require('fs');
let xlsx = require('node-xlsx');
var data = [];

(async () => {
	// 变量说明
	let i_page = 1; // 页码:爬前n页
	let i_totalrows = 100; // 总行数,应该是一次获取的数据量，一页只能爬25条，1000/25条=40页+1= 41页
	let i_reportname = 'PlayerWinsAndLosses'; // 报告名称：$$('#report_reportName')[0].value 用这个获取名称
	let category = '%'; // 目录  %=all MS WS MD WD XD
	let year = '-1'; // 年份 -1=all 1989~2022
	let level = 'all'; // 级别 all=all
	let country = '%'; // 国家 %=all

	const browser = await puppeteer.launch({
		executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
		headless: false,
		defaultViewport: null,
	});
	const page = await browser.newPage();
	for (let page_num = 1; page_num <= i_page; page_num++) {
		await page
			.goto(
				`https://badmintonstatistics.net/home/ReportPartial?page=${page_num}&totalrows=${i_totalrows}&reportname=${i_reportname}&category=${category}&year=${year}&level=${level}&country=${country}`
			)
			.catch(err => {
				console.log(err);
			});
		// await page.waitForSelector('div.reportContainer > table > tbody > tr',{timeout:5000}).catch(err=>{console.log(err)});
		await page
			.waitForSelector('div.reportContainer > table > tbody > tr', { timeout: 5000 })
			.catch(err => {
				console.log(err);
				browser.close();
			});
		let titles = await page.$$eval('div.reportContainer > table > tbody > tr', item =>
			item.map(x => x.innerText)
		);
		// console.log(titles);
		titles = titles.map(item => {
			return item.split('\t');
		});
		// console.log(titles);
		data = data.concat(titles);
	}
	// 写入文件
	// fs.writeFile('yu_data.json', JSON.stringify(data, null, '\t'), function(err) {
	// 	if (err) {
	// 		console.log(err);
	// 	}
	// });

	// console.log(data);
	// 处理data为excel可写格式
	let excel_data = [];
	let excel_obj = {};
	let title = ['运动员', '国家', '目录', '比赛', '赢', '输', '输赢比例'];
	data.unshift(title);
	excel_obj['name'] = 'sheet1';
	excel_obj['data'] = data;
	excel_data.push(excel_obj);
	var buffer = xlsx.build(excel_data);

	// 写入excel
	fs.writeFile('./resut.xlsx', buffer, function(err) {
		if (err) throw err;
		console.log('Write to xls has finished');

		// 读xlsx
		// var obj = xlsx.parse("./" + "resut.xls");
		// console.log(JSON.stringify(obj));
	});

	// await page.screenshot({ path: 'example.png' });
	await browser.close();
})();
