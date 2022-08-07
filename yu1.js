const puppeteer = require('puppeteer');
let fs = require('fs');
let xlsx = require('node-xlsx');
var data = [];

(async () => {
	// 变量说明
	//PlayerWinsAndLosses
	//TournamenWinnersStatsMaster
	//FirstSetWins
	//FirstSetLosses
	//MostPointsH2H
	//PerformanceFollowingWorldChampionship
	//MostCalendarYearsWithFinal
	//WeeksInTop10Ranking
	//MostConsecutiveWeeksTop10BWFRanking
	//finalsmatches
	let i_page = 6; // 页码:爬前n页
	let i_totalrows = 1000; // 总行数,应该是一次获取的数据量，一页只能爬25条，1000/25条=40页+1= 41页
	let i_Type = 'unified'; // 报告名称：$$('#report_reportName')[0].value 用这个获取名称
	let Period = '2022-08-01'; // 周期  周一日期
	let Category = 'MS'; // 项目
	let country = '%'; // 国家 %=all

	const browser = await puppeteer.launch({
		executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
		headless: false,
		defaultViewport: null,
	});
	const page = await browser.newPage();
	for (let page_num = 1; page_num <= i_page; page_num++) {
		await page.goto(
			`https://badmintonstatistics.net/home/RankingsPartial?page=${page_num}&totalrows=${i_totalrows}&type=${i_Type}&date=${Period}&category=${Category}&country=${country}`
		);
		//await page.waitForSelector('div.reportContainer > table > tbody > tr');
		await page
			// .waitForSelector('div.reportContainer > table > tbody > tr', { timeout: 5000 })
			.waitForSelector('div.reportcontainer > table > tbody > tr', { timeout: 5000 })
			.catch(err => {
				console.log(err);
				browser.close();
			});
		let titles = await page.$$eval('div.reportcontainer > table > tbody > tr', item =>
			item.map(x => x.innerText)
		);
		console.log(titles);
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

	// 处理data为excel可写格式
	let excel_data = [];
	let excel_obj = {};
	// let title = ['运动员', '国家', '对手', '国家', '项目', '交手场次', '胜场', '负场', '胜者总分', '负者总分', '分差'];
	let title = ['Rank', 'Players', 'Country', 'Category', 'Points'];
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
