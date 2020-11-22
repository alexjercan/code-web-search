import * as vscode from "vscode";

const getSelectedText = (): string | undefined => {
  const activeTextEditor = vscode.window.activeTextEditor;
  if (!activeTextEditor) {
    return undefined;
  }

  const documentText = activeTextEditor.document.getText();
  if (!documentText) {
    return undefined;
  }

  const activeSelection = activeTextEditor.selection;
  if (!activeSelection || activeSelection.isEmpty) {
    return undefined;
  }

  const start = activeTextEditor.document.offsetAt(activeSelection.start);
  const end = activeTextEditor.document.offsetAt(activeSelection.end);

  return documentText.slice(start, end).trim();
};

const textToQuery = (text: string): string | undefined => {
  const config = vscode.workspace.getConfiguration("code-web-search");
  const queryTemplate = config.get<string>("QueryTemplate");
  if (!queryTemplate) {
    return undefined;
  }
  return queryTemplate + encodeURI(text);
};

const webSearch = (query: string) => {
  vscode.commands.executeCommand("vscode.open", vscode.Uri.parse(query));
};

const getText = async (): Promise<string | undefined> => {
  const selectedText = getSelectedText();
  if (!selectedText) {
    return await vscode.window.showInputBox();
  }
  return selectedText;
};

const search = async () => {
  const text = await getText();
  if (!text) {
    return;
  }

  const query = textToQuery(text);
  if (!query) {
    return;
  }

  webSearch(query);
};

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "code-web-search.search",
    search
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
