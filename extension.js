const vscode = require("vscode");

const keepDuplicates = () => {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    vscode.window.showInformationMessage("No editor is active");

    return;
  }

  const { selection } = editor;

  if (selection.isEmpty) {
    vscode.window.showInformationMessage("Please select some text first");

    return;
  }

  const text = editor.document.getText(selection);
  const lines = text.split(/\r?\n/);

  const lineCount = new Map();
  for (const line of lines) {
    if (line) {
      lineCount.set(line, (lineCount.get(line) || 0) + 1);
    }
  }

  const duplicateLines = lines.filter(
    (line) => !line || lineCount.get(line) > 1
  );

  editor
    .edit((editBuilder) => {
      editBuilder.replace(selection, duplicateLines.join("\n"));
    })
    .then(() => {
      const removedCount = lines.length - duplicateLines.length;
      vscode.window.showInformationMessage(
        `Removed ${removedCount} unique line${removedCount === 1 ? "" : "s"}`
      );
    });
};

const keepUniques = () => {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    vscode.window.showInformationMessage("No editor is active");

    return;
  }

  const { selection } = editor;

  if (selection.isEmpty) {
    vscode.window.showInformationMessage("Please select some text first");

    return;
  }

  const text = editor.document.getText(selection);
  const lines = text.split(/\r?\n/);

  const lineCount = new Map();
  for (const line of lines) {
    if (line) {
      lineCount.set(line, (lineCount.get(line) || 0) + 1);
    }
  }

  const uniqueLines = lines.filter((line) => line && lineCount.get(line) === 1);

  editor
    .edit((editBuilder) => {
      editBuilder.replace(selection, uniqueLines.join("\n"));
    })
    .then(() => {
      const removedCount = lines.length - uniqueLines.length;
      vscode.window.showInformationMessage(
        `Removed ${removedCount} duplicate line${removedCount === 1 ? "" : "s"}`
      );
    });
};

function activate(context) {
  const keepDuplicatesDisposable = vscode.commands.registerCommand(
    "duplicate-lines-manager.keepDuplicates",
    keepDuplicates
  );

  const keepUniquesDisposable = vscode.commands.registerCommand(
    "duplicate-lines-manager.keepUniques",
    keepUniques
  );

  context.subscriptions.push(keepDuplicatesDisposable, keepUniquesDisposable);
}

function deactivate() {
  // Intentionally left blank
}

module.exports = {
  activate,
  deactivate,
};
