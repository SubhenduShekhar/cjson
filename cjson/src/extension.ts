// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { registerCommand as autoCompleteRegister } from './auto_completes/register';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	let disposable = autoCompleteRegister();

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
