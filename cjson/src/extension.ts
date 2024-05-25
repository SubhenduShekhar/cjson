import * as vscode from 'vscode';
import { Registers } from './auto_completes/register';


export function activate(context: vscode.ExtensionContext) {

	let autoComplete = Registers.registerImportFilesCommand();

	let goToDefinition = Registers.registerGoToImportDefinitionCommand();

	let a = Registers.registerDeseralizeAndPreviewCommand();

	// disposable = cjsonRegisterDocumentLinkCommand();

	// disposable = registerGoToDeclarationCommand();

	context.subscriptions.push(
		autoComplete,
		goToDefinition,
		a
	);
}

export function deactivate() {}