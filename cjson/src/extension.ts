import * as vscode from 'vscode';
import { registerImportFilesCommand as autoCompleteRegister, registerGoToDefinitionCommand} from './auto_completes/register';


export function activate(context: vscode.ExtensionContext) {

	let autoComplete = autoCompleteRegister();

	let goToDefinition = registerGoToDefinitionCommand();

	// disposable = cjsonRegisterDocumentLinkCommand();

	// disposable = registerGoToDeclarationCommand();

	context.subscriptions.push(
		autoComplete,
		goToDefinition
	);
}

export function deactivate() {}
