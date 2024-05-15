import * as vscode from 'vscode';
import { registerImportFilesCommand as autoCompleteRegister, registerGoToImportDefinitionCommand } from './auto_completes/register';


export function activate(context: vscode.ExtensionContext) {

	let autoComplete = autoCompleteRegister();

	let goToDefinition = registerGoToImportDefinitionCommand();

	// disposable = cjsonRegisterDocumentLinkCommand();

	// disposable = registerGoToDeclarationCommand();

	context.subscriptions.push(
		autoComplete,
		goToDefinition
	);
}

export function deactivate() {}
