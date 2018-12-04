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

    const document = textEditor.document;
    const newSelections: vscode.Selection[] = [];

    textEditor.edit(editBuilder => {

        textEditor.selections.forEach(selection => {

            const adjust = selection.start.line == selection.end.line ? 1 : 0;
            editBuilder.insert(selection.start, insBefore);
            editBuilder.insert(selection.end, insAfter);
            newSelections.push(new vscode.Selection(selection.start.translate(0, 1), selection.end.translate(0, adjust)));

        });
    }).then(() => {

        textEditor.selections
        textEditor.selections = newSelections;

    });
}

function around(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
    vscode.window.showInputBox().then(function(trigger) {
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