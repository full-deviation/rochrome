/*
 * [jROQuest] Ragnarok Online Japanese (jRO) Quest formatter Chrome Extension
 *
 * https://rowebtool.gungho.jp/quest/{world}/{character}
 * jROクエスト連動機能に以下の拡張機能を追加します。
 * ・完了または未完了のみを表示するフィルタリング機能
 * ・表計算ソフトでキャラクターを管理するためのクリップボードコピー機能
 */

const defaultQuestStatus = 'all'; // 初期状態のクエストステータス
const commonQuestsIndex = 0; // 通常クエストの一覧が格納されているquestsのインデックス
const jobQuestIndex = 1; // 職業関連クエストの一覧が格納されているquestsのインデックス

// コピーコマンドのクエストステータス出力形式
const clearedStatusValue = '○'; // 完了
const notClearedStatusValue = '×'; // 未完了

/** ページの解析情報 */
var pageInfo = {
    'world': '',
    'character': '',
    'quests': [],
    'status': defaultQuestStatus
}


/** メイン処理 */
$(function() {
    analyzePage(); // ページの解析
    processPage(); // ページの加工
});

/**
 * 現在のページを解析し、pageInfoに格納します。
 */
function analyzePage() {

    // 基本情報
    pageInfo.world = $('select[name=world] option:selected').text(); // ワールド
    pageInfo.character = $('ul.characterSelection>li.choosing>dl>dt>a').text(); // キャラクター

    // クエスト一覧(ul.questList)内のクエストliを調査し、{name, cleared}の一覧をまとめて格納
    $('ul.questList').each(function () {
        let questList = $(this);
        let quests = [];

        questList.children().each(function() {
            quests.push({
                'name': $(this).text().trim(),
                'cleared': !$(this).hasClass('unfinished')
            });
        });
        pageInfo.quests.push(quests);
    });

    console.debug('analyzePage() finished.');
}

/**
 * 現在のページを加工します。
 */
function processPage() {

    // クエストステータスの初期化
    initializeQuestStatus();

    console.debug('processPage() finished.');
}

/**
 * クエストステータスを初期化し、イベント処理を追加します。
 * この処理はページ表示時に1回だけ実行します。
 */
function initializeQuestStatus() {

    // クエストステータスに'すべて'を追加し、それぞれにクリックイベントを設定する
    $('p.completion').each(function(index) {
        $(this).empty(); // 一旦空にする

        // 要素の再設定
        $(this).append('クエストステータス：')
               .append('<span name="viewAllQuests">すべて</span>')
               .append('　<span name="viewClearedQuests">完了</span>')
               .append('　<span name="viewNotClearedQuests" class="unfinished">未完了</span>');

        // クエスト一覧のみボタンを付ける
        if (index == commonQuestsIndex) {
            $(this).append('　<button id="copyQuestNames">クエスト名の一覧をコピー</button>')
                   .append('　<button id="copyQuestStatus">完了状況の一覧をコピー</button>')
                   .append('　※職業関連クエストは含みません');
        }
    });

    // クエストステータスのイベント設定
    $('body').on('click', 'span[name=viewAllQuests]', function() {
        changeQuestStatus('all');
    });
    $('body').on('click', 'span[name=viewClearedQuests]', function() {
        changeQuestStatus('cleared');
    });
    $('body').on('click', 'span[name=viewNotClearedQuests]', function() {
        changeQuestStatus('not cleared');
    });
    $('body').on('click', '#copyQuestNames', function() {
        executeCopyQuestNames();
    });
    $('body').on('click', '#copyQuestStatus', function() {
        executeCopyQuestStatus();
    });

    // クエストステータスの適用
    applyQuestStatus(defaultQuestStatus);
}

/**
 * クエストステータスを適用します。
 * @param {string} stat 'cleared', 'not cleared', 'all' のいずれか。
 */
function applyQuestStatus(stat) {

    // クエストステータスの保存
    pageInfo.status = stat;

    // スタイル設定
    $('span[name=viewClearedQuests],span[name=viewNotClearedQuests],span[name=viewAllQuests]')
        .removeClass('selected-status');
    switch (stat) {
        case 'cleared':
            $('span[name=viewClearedQuests]').addClass('selected-status');
            break;

        case 'not cleared':
            $('span[name=viewNotClearedQuests]').addClass('selected-status');
            break;

        default: // 'all'または上記以外
            $('span[name=viewAllQuests]').addClass('selected-status');
            break;
    }
}

/**
 * クエストステータスの変更が呼び出された時に、該当する情報に差し替えます。
 * @param {string} stat 'cleared', 'not cleared', 'all' のいずれか。
 */
function changeQuestStatus(stat) {

    // クエストステータスの書き換え
    applyQuestStatus(stat);

    // クエスト一覧(ul.questList)内のクエストliを差し替え
    $('ul.questList').each(function (index) {
        let questList = $(this);
        let quests = filterQuests(pageInfo.quests[index], stat);

        questList.empty(); // 一旦空にする
        $.each(quests, function(index2, quest) {
            questList.append('<li' + (quest.cleared ? '' : ' class="unfinished"') + '>' + quest.name + '</li>');
        });
    });

    console.debug('changeQuestStatus("' + stat + '") finished.');
}

/**
 * 指定されたクエスト一覧から条件に合致するクエスト情報を抽出して返します。
 * @param {Array} quests {name, cleared} で構成されるクエスト情報の配列。
 * @param {string} stat 抽出対象となる状態。'cleared', 'not cleared', 'all' のいずれか。
 * @returns quests 内で stat に該当するものをフィルタリングしたクエスト情報の配列。
 */
function filterQuests(quests, stat) {

    // statが'all'の場合はそのまま返す
    if (stat == 'all') return quests;

    // フィルタリングを行なう
    let cleared = (stat == 'cleared');
    let filtered = [];
    $.each(quests, function(index, quest) {
        if (quest.cleared == cleared) filtered.push(quest);
    });
    return filtered;
}

/**
 * 現在表示されているクエスト名の一覧をコピーしクリップボードに出力します。
 * 1行目:'クエスト名'
 * 2行目以降:表示されているクエスト名
 */
function executeCopyQuestNames() {
    var text = "クエスト名\n";

    $.each(filterQuests(pageInfo.quests[commonQuestsIndex], pageInfo.status), function(index, quest) {
        text += quest.name + "\n";
    });

    toClipboard(text);
}

/**
 * 現在表示されているクエストステータスの一覧をコピーしクリップボードに出力します。
 * 1行目:キャラクター名
 * 2行目以降:表示されているクエストのクエストステータス
 */
 function executeCopyQuestStatus() {
    var text = pageInfo.character + "\n";

    $.each(filterQuests(pageInfo.quests[commonQuestsIndex], pageInfo.status), function(index, quest) {
        text += (quest.cleared ? clearedStatusValue : notClearedStatusValue) + "\n";
    });

    toClipboard(text);
}

/**
 * 指定されたテキストをクリップボードに出力します。
 * @param {string} text クリップボードに出力する文字列。
 */
function toClipboard(text) {
    let textarea = $('<textarea></textarea>');
    textarea.text(text);
    $('body').append(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
}
