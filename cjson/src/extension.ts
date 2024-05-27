import * as vscode from 'vscode';
import { Registers } from './definitions/register';


export function activate(context: vscode.ExtensionContext) {

	let autoComplete = Registers.registerImportFilesCommand();

	let goToDefinition = Registers.registerGoToImportDefinitionCommand();

	// let deseralizeAndPreview = Registers.registerDeseralizeAndPreviewCommand();

	// disposable = cjsonRegisterDocumentLinkCommand();

	// disposable = registerGoToDeclarationCommand();

	context.subscriptions.push(
		autoComplete,
		goToDefinition
		// deseralizeAndPreview
	);
}

export function deactivate() {}