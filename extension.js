const vscode = require("vscode");

const getActiveEditorOrNotify = () => {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    vscode.window.showInformationMessage("No editor is active");

    return null;
  }

  return editor;
};

const getSelectedTextOrNotify = (/** @type {vscode.TextEditor} */ editor) => {
  const { selection } = editor;

  if (selection.isEmpty) {
    vscode.window.showInformationMessage("Please select some text first");

    return null;
  }

  return editor.document.getText(selection);
};

const countLines = (/** @type {string[]} */ lines) =>
  lines.reduce(
    (
      /** @type {Map<string, number>} */ countMap,
      /** @type {string} */ line,
    ) => {
      if (line) {
        countMap.set(line, (countMap.get(line) || 0) + 1);
      }

      return countMap;
    },
    new Map(),
  );

const replaceEditorSelection = async (
  /** @type {vscode.TextEditor} */ editor,
  /** @type {vscode.Selection} */ selection,
  /** @type {string} */ newText,
  /** @type {string} */ message,
) => {
  await editor.edit((/** @type {vscode.TextEditorEdit} */ editBuilder) =>
    editBuilder.replace(selection, newText),
  );
  vscode.window.showInformationMessage(message);
};

const processLines = (
  /** @type {(count: number) => boolean} */ filterFn,
  /** @type {"duplicate" | "unique"} */ removalType,
) => {
  const editor = getActiveEditorOrNotify();
  if (!editor) {
    return;
  }

  const text = getSelectedTextOrNotify(editor);
  if (!text) {
    return;
  }

  const lines = text.split(/\r?\n/);
  const lineCount = countLines(lines);

  const filteredLines = lines.filter(
    (/** @type {string} */ line) => line && filterFn(lineCount.get(line)),
  );
  const removedCount = lines.length - filteredLines.length;

  replaceEditorSelection(
    editor,
    editor.selection,
    filteredLines.join("\n"),
    `Removed ${removedCount} ${removalType} line${removedCount === 1 ? "" : "s"}`,
  );
};

const keepDuplicates = () =>
  processLines((/** @type {number} */ count) => count > 1, "unique");

const keepUniques = () =>
  processLines((/** @type {number} */ count) => count === 1, "duplicate");

function activate(/** @type {vscode.ExtensionContext} */ context) {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "duplicate-lines-manager.keepDuplicates",
      keepDuplicates,
    ),
    vscode.commands.registerCommand(
      "duplicate-lines-manager.keepUniques",
      keepUniques,
    ),
  );
}

function deactivate() {
  // Intentionally left blank
}

module.exports = {
  activate,
  deactivate,
};
