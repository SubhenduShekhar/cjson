import * as vscode from 'vscode';
import { Registers } from './auto_completes/register';


export function activate(context: vscode.ExtensionContext) {

	let autoComplete = Registers.registerImportFilesCommand();

	let goToDefinition = Registers.registerGoToImportDefinitionCommand();

	// disposable = cjsonRegisterDocumentLinkCommand();

	// disposable = registerGoToDeclarationCommand();

	context.subscriptions.push(
		autoComplete,
		goToDefinition
	);
}

export function deactivate() {}
