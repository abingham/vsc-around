'use strict';

import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

    context.subscriptions.push(
        vscode.commands.registerTextEditorCommand(
            'extension.around',
            (textEditor, edit) => { around(textEditor, edit); }));
}

export function deactivate() {
}

function insertTokens(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, insBefore: string, insAfter: string) {

    textEditor.edit(editBuilder => {
        textEditor.selections.forEach(selection => {
            let selected = textEditor.document.getText(selection);
            editBuilder.replace(selection, insBefore + selected + insAfter);
        })
    });
}

function around(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
    vscode.window.showInputBox().then(function (trigger) {
        if (trigger === undefined) {
            return;
        }
        const pairs = vscode.workspace.getConfiguration('around.pairs');
        var tokens = [trigger, trigger];
        if (trigger in pairs) {
            tokens = pairs[trigger]
        }
        insertTokens(textEditor, edit, tokens[0], tokens[1]);
    });
}