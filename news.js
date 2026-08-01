/*
 * AIDEC 新着情報
 * 新しいお知らせは、下の配列へ { date, title, url } を追加してください。
 * date は YYYY/MM/DD 形式、url は将来の記事ページのURLを指定します。
 */
window.AIDEC_NEWS = [
  {
    date: "2026/07/30",
    title: "AIDEC開業・ホームページ公開",
    url: "#news-20260730"
  }
];

(function renderFooterNews() {
  const list = document.getElementById("footer-news-list");
  if (!list) return;

  const news = [...window.AIDEC_NEWS]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  news.forEach((item) => {
    const link = document.createElement("a");
    link.className = "footer-news-item";
    link.href = item.url;

    const time = document.createElement("time");
    time.dateTime = item.date.replaceAll("/", "-");
    time.textContent = item.date;

    const title = document.createElement("span");
    title.textContent = item.title;

    link.append(time, title);
    list.append(link);
  });
})();
