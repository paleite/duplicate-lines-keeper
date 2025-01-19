import vscode from "vscode";

const getActiveEditorOrNotify = () => {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    vscode.window.showInformationMessage("No editor is active");

    return null;
  }

  return editor;
};

const getSelectedTextOrNotify = (editor: vscode.TextEditor) => {
  const { selection } = editor;

  if (selection.isEmpty) {
    vscode.window.showInformationMessage("Please select some text first");

    return null;
  }

  return editor.document.getText(selection);
};

const countLines = (lines: string[]) =>
  lines.reduce((countMap: Map<string, number>, line: string) => {
    if (line) {
      countMap.set(line, (countMap.get(line) || 0) + 1);
    }

    return countMap;
  }, new Map());

const replaceEditorSelection = async (
  editor: vscode.TextEditor,
  selection: vscode.Selection,
  newText: string,
  message: string,
) => {
  await editor.edit((editBuilder: vscode.TextEditorEdit) =>
    editBuilder.replace(selection, newText),
  );
  vscode.window.showInformationMessage(message);
};

const processLines = (
  filterFn: (count: number) => boolean,
  removalType: "duplicate" | "unique",
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
    (line: string) => line && filterFn(lineCount.get(line)),
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
  processLines((count: number) => count > 1, "unique");

const keepUniques = () =>
  processLines((count: number) => count === 1, "duplicate");

const activate = (context: vscode.ExtensionContext) => {
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
};

const deactivate = () => {
  // Intentionally left blank
};

export { activate, deactivate };
