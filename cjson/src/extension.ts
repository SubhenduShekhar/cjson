import * as vscode from 'vscode';
import { Registers } from './definitions/register';
import fs from 'fs';
import path from 'path';


export function activate(context: vscode.ExtensionContext) {
	if(vscode.workspace.workspaceFolders !== undefined) {
		let autoComplete = Registers.registerImportFilesCommand();

		let goToDefinition = Registers.registerGoToImportDefinitionCommand();
	
		let relativeVariableMapping = Registers.registerRelativeVariableMappingCommand();
	
		let goToVariableDefinition = Registers.registerGoToVariableDefinitionCommand();
		// let deseralizeAndPreview = Registers.registerDeseralizeAndPreviewCommand();
	
		// disposable = cjsonRegisterDocumentLinkCommand();
	
		// disposable = registerGoToDeclarationCommand();
	
		context.subscriptions.push(
			autoComplete,
			goToDefinition,
			relativeVariableMapping,
			goToVariableDefinition
			// deseralizeAndPreview
		);
	}
}

export function deactivate() {}