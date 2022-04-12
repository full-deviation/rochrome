# jROQuest formatter Chrome Extension

Ragnarok Online Japanese (jRO) のクエスト連動 https://rowebtool.gungho.jp/quest において、以下の機能を追加します。

- クエストステータスにクリックイベントを追加。
  - 「完了」をクリックすると、完了したクエスト一覧を表示。
  - 「未完了」をクリックすると、未完了のクエスト一覧を表示。
  - 「すべて」をクリックすると、完了/未完了が混在するクエスト一覧を表示。
- コピーボタンを追加
  - 「クエスト名の一覧をコピー」をクリックすると、クリップボードにクエスト名の一覧をコピー。
  - 「完了状況の一覧をコピー」をクリックすると、クリップボードにキャラ名と完了であれば「○」、未完了であれば「×」を記載した一覧をコピー。
  - コピーされるクエスト名および完了状況に職業関連クエストは含まれません。
  - コピーした内容をExcelやGoogle Spreadsheetに貼り付けることにより、キャラクター別のクエスト進捗状況やクリア人数をまとめる行為を支援します。

## 注意事項および免責事項

- 非公式のChrome拡張機能であり、作者はガンホー・オンライン・エンターテイメント株式会社およびGRAVITY社とは一切関係がありません。
- アカウントハック等のセキュリティリスクを常に警戒し、公開されているソースおよびダウンロードファイルに問題がないことを入念に確認してください。
- このChrome拡張によりいかなる損失や損害などが発生しても責任を負いかねます、ご了承ください。
- 公式から公開停止の要請があれば公開を停止します。

## 使用方法について

1. [jroquest-1.1.zip](https://github.com/full-deviation/rochrome/raw/master/dist/jroquest-1.1.zip) をダウンロードし解凍
1. Google Chrome > ︙ > その他のツール > 拡張機能 を開く
1. 右上のデベロッパーモードを有効にする
1. 解凍したjroquestフォルダをGoogle Chromeにドラッグ＆ドロップ
1. [ラグナロクオンライン公式サイト](http://ragnarokonline.gungho.jp/) でログインを行ない、 [クエスト連動](https://rowebtool.gungho.jp/quest) を開く

## 使用停止について

1. Google Chrome > ︙ > その他のツール > 拡張機能 を開く
1. jROQuest formatter の枠内にあるトグルボタンで無効にするか、今後使用しない場合は削除を選択する
  1. 削除を選択した場合、ダウンロードおよび解凍したファイルの削除も行ない、デベロッパーモードを有効にした理由がこのChrome拡張機能のみである場合、デベロッパーモードを無効にする

## 権利表記

©Gravity Co., Ltd. & LeeMyoungJin(studio DTDS) All rights reserved.
©GungHo Online Entertainment, Inc. All Rights Reserved.
