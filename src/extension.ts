'use strict';

import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

    context.subscriptions.push(
        vscode.commands.registerTextEditorCommand(
            'extension.around',
            around
        )
    );
}

export function deactivate() {
}

function getSelectionRange(selection: vscode.Range, document: vscode.TextDocument) {
    if (selection.isEmpty) {
        // if a selection is empty, we assume the user wants to surround the current word.
        return document.getWordRangeAtPosition(selection.start);
    }
    return selection
}

function insertTokens(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, insBefore: string, insAfter: string) {
    textEditor.edit(editBuilder => {
        textEditor.selections.forEach(selection => {
            let range = getSelectionRange(selection, textEditor.document);
            if (range === undefined) {
                return;
            }
            let selected = textEditor.document.getText(range);
            editBuilder.replace(range, insBefore + selected + insAfter);
        })
    });
}

function around(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, ...args: any[]) {
    if (args.length == 2) {
        insertTokens(textEditor, edit, args[0], args[1])
    }
    else {
        vscode.window.showInputBox().then(function (trigger) {
            if (trigger === undefined) {
                return;
            }
            trigger = trigger.replace("\\n", "\n")

            const pairs = vscode.workspace.getConfiguration('around.pairs');

            const start: string[] = []
            const end: string[] = []

            // If the trigger exactly matches a key in "pairs", use just that mapping.
            if (trigger in pairs) {
                let [s, e] = pairs[trigger]
                start.push(s)
                end.push(e)
            }

            // Otherwise,  process each character in the trigger independently.
            else {
                for (let char of trigger) {
                    let [s, e] = char in pairs ? pairs[char] : [char, char]
                    start.push(s)
                    end.unshift(e)
                }
            }

            insertTokens(textEditor, edit, start.join(''), end.join(''));
        });
    }
}
