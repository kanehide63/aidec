$ErrorActionPreference='Stop';$root=Split-Path -Parent $MyInvocation.MyCommand.Path;$html=Get-Content (Join-Path $root 'pricing\index.html') -Raw
$required=@('AI企業診断360','98,800円','戦略レポート アップデート','49,800円','伴走プラン','19,800円','成長プラン','39,800円','Web制作','55,000円','99,000円','199,000円','Web運用サポート','5,500円','9,900円','19,900円','Google・Web情報整備支援','AI導入・業務活用支援','業務改善・システム導入支援','個別見積','専用管理サイト','990円','14,800円','29,800円','1ページ〜','9,800円')
foreach($text in $required){if(-not $html.Contains($text)){throw "必須文字列がありません: $text"}}
$links=@('/ai360/','/ai-business/','/google-web/','/operations/','/support/','/web/','/contact/');foreach($href in $links){if(-not $html.Contains("href=`"$href")){throw "必須リンクがありません: $href"}}
if(-not (Get-Content (Join-Path $root 'sitemap.xml') -Raw).Contains('https://ai-dec.jp/pricing/')){throw 'sitemap登録がありません'}
Write-Output 'Pricing verification passed.'
