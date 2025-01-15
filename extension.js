const vscode = require("vscode");

function activate(context) {
  let disposable = vscode.commands.registerCommand(
    "duplicate-lines-keeper.keepDuplicates",
    function () {
      const editor = vscode.window.activeTextEditor;

      if (!editor) {
        vscode.window.showInformationMessage("No editor is active");
        return;
      }

      const selection = editor.selection;

      if (selection.isEmpty) {
        vscode.window.showInformationMessage("Please select some text first");
        return;
      }

      const text = editor.document.getText(selection);
      const lines = text.split(/\r?\n/);

      const lineCount = new Map();
      for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine) {
          lineCount.set(trimmedLine, (lineCount.get(trimmedLine) || 0) + 1);
        }
      }

      const duplicateLines = lines.filter((line) => {
        const trimmedLine = line.trim();
        return !trimmedLine || lineCount.get(trimmedLine) > 1;
      });

      editor
        .edit((editBuilder) => {
          editBuilder.replace(selection, duplicateLines.join("\n"));
        })
        .then(() => {
          const removedCount = lines.length - duplicateLines.length;
          vscode.window.showInformationMessage(
            `Removed ${removedCount} unique line${removedCount === 1 ? "" : "s"}`,
          );
        });
    },
  );

  context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
