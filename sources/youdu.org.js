const baseUrl = "https://www.yodu.org"

/**
 * 搜索
 * @params {string} key
 * @returns {[{name, author, cover, detail}]}
 */
const search = (key) => {
  let response = POST(`${baseUrl}/sa`,{data:`searchkey=${key}&searchtype=all`,headers:["Cookie:jq_Obj=1; PHPSESSID=n1l42q7uvlqrv71s9r128q3vdk; jieqiUserInfo=jieqiUserId%3D26029%2CjieqiUserUname%3Djimmy53e%2CjieqiUserName%3Djimmy53e%2CjieqiUserGroup%3D3%2CjieqiUserGroupName%3D%E6%99%AE%E9%80%9A%E4%BC%9A%E5%91%98%2CjieqiUserVip%3D0%2CjieqiUserHonorId%3D2%2CjieqiUserHonor%3D%E5%91%86%E8%90%8C%2CjieqiUserToken%3D819e18ff55550e0787e5a8c547358cce%2CjieqiCodeLogin%3D0%2CjieqiCodePost%3D0%2CjieqiUserPassword%3D8c03d65956cb27e6168718b8adaac466%2CjieqiUserLogin%3D1638602979; jieqiVisitInfo=jieqiUserLogin%3D1638602979%2CjieqiUserId%3D26029; zh_choose=n; Hm_lvt_d6c21518da630dd4f86d47c04de176de=1638602981; __gads=ID=f3e210ccebb43de1-2261feb859cf0005:T=1638603441:RT=1638603441:S=ALNI_MZ8QwNZgsv88qprvm0WJivmtVIceA; jieqiVisitId=article_articleviews%3D9922%7C15277; Hm_lpvt_d6c21518da630dd4f86d47c04de176de=1638603444"]})
  let array = []
  let $ = HTML.parse(response)
  if ($('[name=keywords]').attr('content') == "图书搜索,文学搜索,小说搜索,有度中文网") {
    $('ul.ser-ret > li.pr').forEach((child) => {
      let $ = HTML.parse(child)
      array.push({
        name: $('h3').text(),
        author: $('em > span:nth-child(4)').text(),
        cover: $('img').attr('_src'),
        detail: `${baseUrl}${$('h3 > a').attr('href').replace("?for-search","")}`
      })
    })
  } else {
    // 搜索跳转主页问题
    array.push({
      name: $('h1.oh').text(),
      author: $('.ttl > span').text(),
      cover: $('span.g_thumb > img').attr('src'),
      detail: $('[property=og:url]').attr('content')
    })
  }
  return JSON.stringify(array)
}

/**
 * 详情
 * @params {string} url
 * @returns {[{summary, status, category, words, update, lastChapter, catalog}]}
 */
const detail = (url) => {
  let response = GET(url)
  let $ = HTML.parse(response)
  let book = {
    summary: $('div.det-abt').text(),
    status: $('strong.mr15:nth-child(3)').text(),
    category: $('strong.mr15:nth-child(2)').text(),
    words: $('strong.mr15:nth-child(4)').text().replace("字",""),
    update: $('small.c_small').text(),
    lastChapter: $('a.lst-chapter').text(),
    catalog: url
  }
  return JSON.stringify(book)
}

/**
 * 目录
 * @params {string} url
 * @returns {[{name, url, vip}]}
 */
const catalog = (url) => {
  let response = GET(url)
  let $ = HTML.parse(response)
  let array = []
  $('#chapterList > li').forEach((booklet) => {
    let $ = HTML.parse(booklet)
    if ($("li.volumes").text()) array.push({ name: $("li").text() })
    else array.push({
      name: $("a").text(),
      url: `${baseUrl}${$("a").attr("href")}`
    })
  })
  return JSON.stringify(array)
}

/**
 * 章节
 * @params {string} url
 * @returns {string}
 */
const chapter = (url) => {
  let content = ""
  let i = 2
  let first_url = url
  while (true) {
    let response = GET(url).replace("（本章未完）","")
    let $ = HTML.parse(response)
    content += $('#TextContent')
    let next_btn = $('.mlfy_page > a:nth-child(5)').text()
    if (next_btn != "-->") {
      break
    }
    url = first_url.replace('.html', `_${i}.html`);
    i += 1
  }
  return content
}

var bookSource = JSON.stringify({
  name: "有度中文",
  url: "youdu.org",
  version: 101
})
