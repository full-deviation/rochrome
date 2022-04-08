/*
 * [jROratorio-collapse] ROratorio hinanjo collapse Chrome Extension
 *
 * http://roratorio-hinanjo.net/roro/m/calcx.html
 * 「ROラトリオ」避難所の総合計算機(最新)において、以下の拡張機能を追加します。
 * ・もう少し折り畳む
 */

/** ページの解析情報 */
var pageInfo = {
    // 折り畳み機能を使うパート一覧
    'multipleCollapse': {
        'BaseStatus': {
            'title': '基本ステータス',
            'tables': [
                {'keyId': 'OBJID_SELECT_BASE_LEVEL', 'content': undefined},
                {'keyId': 'OBJID_SPAN_CHARA_MAXHP',  'content': undefined}
            ]
        },
        'Equipment': {
            'title': '装備アイテム',
            'tables': [
                {'keyId': 'OBJID_QUICK_CONTROL_HEADER', 'content': undefined},
                {'keyId': 'A_SobWeaponName', 'content': undefined},
                {'keyId': 'OBJID_ITEM_INFO_EXTRACT_CHECKBOX', 'content': undefined}
            ]
        },
        'UpperSkills': {
            'title': 'スキル設定',
            'tables': [
                {'keyId': 'OBJID_SKILL_COLUMN_EXTRACT_CHECKBOX', 'content': undefined},
                {'keyId': 'OBJID_CHECK_A1_SKILL_SW', 'content': undefined},
                {'keyId': 'OBJID_CONTROL_CONF_0_HEADER', 'content': undefined},
                {'keyId': 'OBJID_CONTROL_CONF_1_HEADER', 'content': undefined},
                {'keyId': 'OBJID_CONTROL_CONF_2_HEADER', 'content': undefined}
            ]
        }
    }
};

/** メイン処理 */
$(function() {

    // 折り畳み単位を検索
    $.each(pageInfo.multipleCollapse, function(key, part) {
        console.debug('Part: ' + part.title + ' (' + key + ')');

        // 格納テーブル取得
        $.each(part.tables, function(index, table) {
            table.content = parentTableOf(table.keyId);
            console.assert(table.content != undefined);
        });

        // チェックボックスを追加
        let checkboxId = 'extract' + key;
        part.tables[0].content.before(
            '<table border="1"><tbody><tr><td class="title extracted-checkbox">' +
                '<input type="checkbox" checked="checked" id="' + checkboxId + '">' +
                '<label for="' + checkboxId + '">『' + part.title + '』を表示</label>' +
            '</td></tr></tbody></table>');

        // チェックボックスにイベント設定
        $(document).on('change', '#' + checkboxId, function() {
            let part = pageInfo.multipleCollapse[$(this).attr('id').replace('extract', '')];
            console.assert(part != undefined);

            // 親TDのクラスリセット
            let parentTd = $(this).parent();
            parentTd.removeClass('extracted-checkbox')
                    .removeClass('collapsed-checkbox');

            // チェック状態で表示状態を変更し、関連テーブルを切り替え
            if ($(this).prop('checked')) {
                parentTd.addClass('extracted-checkbox');
                console.debug($(this).attr('id') + ': turn on.');
                $.each(part.tables, function(index, table) {
                    table.content.show();
                });
            } else {
                parentTd.addClass('collapsed-checkbox');
                console.debug($(this).attr('id') + ': turn off.');
                $.each(part.tables, function(index, table) {
                    table.content.hide();
                });
            }
        });
    });

    console.debug('initialization() finished.');
});

/**
 * 指定されたIDを持つ要素のテーブルを取得します。
 * @param {string} id テーブルを取得する検索対象のID。
 * @returns idが格納されているtableのうち、form要素に最も近い要素。
 *          存在しない場合はundefined。
 */
function parentTableOf(id) {
    var cursor = $('#' + id);

    if (cursor === undefined) {
        console.error('ID: "' + id + '" not found.');
        return undefined; // 見つからなかった場合はundefined
    }

    var lastTable = undefined;
    do {
        cursor = cursor.parent();
        if (cursor == undefined) break;
        if (cursor.prop('tagName') == 'TABLE') lastTable = cursor;
    } while(cursor.prop('tagName') != "FORM");

    if (lastTable == undefined) {
        console.error('ID: "' + id + '" parent table not found.');
        return undefined;
    }

    console.debug('ID: "' + id + '" parent table found.');
    return lastTable;
}
