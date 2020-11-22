import * as vscode from "vscode";

const CFG_SECTION = "code-web-search";
const CFG_QUERY = "QueryTemplate";
const CFG_ENGINE = "SearchEngine";

const getSelectedText = (): string | undefined => {
  const activeTextEditor = vscode.window.activeTextEditor;
  if (!activeTextEditor) return undefined;

  const documentText = activeTextEditor.document.getText();
  if (!documentText) return undefined;

  const activeSelection = activeTextEditor.selection;
  if (!activeSelection || activeSelection.isEmpty) return undefined;

  const start = activeTextEditor.document.offsetAt(activeSelection.start);
  const end = activeTextEditor.document.offsetAt(activeSelection.end);

  const selectedText = documentText.slice(start, end).trim();
  return selectedText;
};

const textToQuery = (text: string): string | undefined => {
  const config = vscode.workspace.getConfiguration(CFG_SECTION);
  const queryTemplate = config.get<string>(CFG_QUERY);
  const searchEngine = config.get<string>(CFG_ENGINE);
  if (!queryTemplate || !searchEngine) return undefined;
  return queryTemplate
    .replace("%SELECTION%", encodeURI(text))
    .replace("%ENGINE%", searchEngine);
};

const webSearch = (query: string) => {
  vscode.commands.executeCommand("vscode.open", vscode.Uri.parse(query));
};

const search = () => {
  const selectedText = getSelectedText();
  if (!selectedText) return;

  const query = textToQuery(selectedText);
  if (!query) return;

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
