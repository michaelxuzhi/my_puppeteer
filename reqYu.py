# -*- coding: utf-8 -*-
import requests as req
from bs4 import BeautifulSoup
import xlwt
import csv
# url = "https://badmintonstatistics.net/home/Rankings/"
# 构造请求标头
header = {
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36"}


class BadmintonData():
    def __init__(self, header):
        # 表格格式：表头+数据
        self.header_list = []
        self.data_list = []
        self.url = "https://badmintonstatistics.net/home/RankingsPartial"
        self.header = header

    def getPageData(self, soup):
        # pass
        '''
        通过BS4对象来获取页面数据
        '''
        data_list_item = []
        # 表格项直接找td
        tableCtx = soup.find_all('td')
        for ctx in tableCtx:
            # print(ctx.string)
            data_list_item.append(ctx.string)
            if len(data_list_item) == len(self.header_list):
                self.data_list.append(data_list_item)
                data_list_item = []

    def getTitle(self, soup):
        '''
        获取表格标题
        '''
        # 如果已经设置好了就跳过,表格标题是获取一次即可
        if len(self.header_list):
            return
        # 表格title直接找th
        tableTH = soup.find_all('th')
        # print(tableTH)
        for title in tableTH:
            # print(title.string)
            self.header_list.append(title.string)
        # 往数据列表头部追加标题内容
        self.data_list.insert(0, self.header_list)

    def writeTable(self, tableName):
        # pass
        '''
        写入xls文件,覆盖=True
        '''
        wbk = xlwt.Workbook()
        sheet = wbk.add_sheet('sheet1', cell_overwrite_ok=True)
        for row in range(0, len(self.data_list)):
            for col in range(0, len(self.data_list[row])):
                sheet.write(row, col, self.data_list[row][col])
        wbk.save(tableName)

    def genBS4(self, page, totalrows, i_type, date, cate, country, pagesize):
        # pass
        '''
        生成beautifulSoup对象格式BS4,处理获取到的html
        '''
        # 获取每一页的表格数据
        for page_num in range(1, page+1):
            # url 的拼接
            real_url = self.url + "?page="+str(page_num)+"&totalrows="+str(totalrows)+"&type=" + \
                str(i_type)+"&date="+str(date)+"&category="+str(cate) + \
                "&country="+str(country)+"&pagesize="+str(pagesize)
            res = req.get(real_url, headers=self.header)
            # soup = BeautifulSoup(res.text, "lxml") # lxml 解析器暂时用不了
            soup = BeautifulSoup(res.text, "html.parser")
            # 处理获取到的页面信息
            self.getTitle(soup)  # 先获取表格标题,一次性的
            self.getPageData(soup)  # 再获取表格内容
            # 写入xls文件
            self.writeTable('test.xls')

    def start(self, page=1, totalrows=1000, i_type='unified', date='2022-08-01', cate='MS', country='%', pagesize=25):
        # print(page, totalrows)
        '''
        启动,已配置默认值
        '''
        self.genBS4(page, totalrows, i_type, date, cate, country, pagesize)


# 类的使用
file1 = BadmintonData(header)
# file1.start(page, totalrows, i_type, date, cate, country, pagesize)
# file1.start(2, 1000)
file1.start(page=2, country='China')
