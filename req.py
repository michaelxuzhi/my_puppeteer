import requests as req
from bs4 import BeautifulSoup
url = "https://badmintonstatistics.net/home/Rankings/"
# url = "https://badmintonstatistics.net/home/RankingsPartial?page=1&totalrows=1000&type=unified&date=2022-08-01&category=MS&country=%&pagesize=25"


# 构造请求标头
header = {
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36"}

res = req.get(url, headers=header)
# soup = BeautifulSoup(res.text, "lxml")
soup = BeautifulSoup(res.text, "html.parser")

# print(res.text)
# print(soup.prettify())
# print(soup.td.string)

# 找 class='reportcontainer' 的div，然后遍历其children
divContainer = soup.find_all('div', 'reportcontainer').contents
# for child in divContainer.contents:
# print(child.name)
# if child.name == 'td':
# print(child)
