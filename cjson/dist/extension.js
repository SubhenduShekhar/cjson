/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.registerGoToImportDefinitionCommand = exports.registerImportFilesCommand = void 0;
const vscode = __importStar(__webpack_require__(2));
const completion_items_1 = __webpack_require__(3);
const utils_1 = __webpack_require__(4);
const goto_definition_1 = __webpack_require__(6);
function registerImportFilesCommand() {
    var fileList = undefined;
    if (vscode.workspace.workspaceFolders?.length != undefined) {
        if (vscode.workspace.workspaceFolders?.length != 0)
            fileList = (0, utils_1.convertDirectoryContentPathToRelative)(vscode.workspace.workspaceFolders[0].uri.path, vscode.workspace.workspaceFolders[0].uri.path);
        else
            fileList = [];
    }
    else
        vscode.window.showErrorMessage("CJSON extension requires opened folder. Select your test data folder and open it");
    let disposable = vscode.languages.registerCompletionItemProvider({ language: "cjson", scheme: "file" }, new completion_items_1.CompletionItems(fileList), ".");
    return disposable;
}
exports.registerImportFilesCommand = registerImportFilesCommand;
function registerGoToImportDefinitionCommand() {
    return vscode.languages.registerDefinitionProvider({
        language: "cjson",
        scheme: "file"
    }, new goto_definition_1.GoToImportDefinition());
}
exports.registerGoToImportDefinitionCommand = registerGoToImportDefinitionCommand;
// export function cjsonRegisterDocumentLinkCommand() {
//     return vscode.languages.registerDocumentLinkProvider({
//         language: "cjson",
//         scheme: "file"
//     }, new CJsonDocumentLinkProvider())
// }
// export function registerGoToDeclarationCommand() {
//     return vscode.languages.registerDeclarationProvider({
//         language: "cjson",
//         scheme: "file"
//     }, new GoToDeclaration());
// }


/***/ }),
/* 2 */
/***/ ((module) => {

module.exports = require("vscode");

/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CompletionItems = void 0;
const vscode_1 = __webpack_require__(2);
class CompletionItems {
    fileList;
    completionItemList = [];
    constructor(fileList) {
        this.fileList = fileList;
    }
    checkAndConfirm(item) {
        for (let i = 0; i < this.completionItemList.length; i++)
            if (JSON.parse(JSON.stringify(this.completionItemList[i].label.valueOf()))["label"] === item)
                return true;
        return false;
    }
    provideCompletionItems(document, position, token, context) {
        var positionCharacterMatch = document.getText(new vscode_1.Range(position, new vscode_1.Position(position.line, position.character - 3)));
        if (positionCharacterMatch === "\"./") {
            if (this.fileList != undefined) {
                for (let i = 0; i < this.fileList.length; i++) {
                    if (!this.checkAndConfirm(this.fileList[i]))
                        this.completionItemList.push(new vscode_1.CompletionItem({
                            label: this.fileList[i]
                        }));
                }
            }
        }
        else {
            this.completionItemList = [];
            console.log("cleared");
        }
        return this.completionItemList;
    }
    resolveCompletionItem(item, token) {
        return item;
    }
}
exports.CompletionItems = CompletionItems;


/***/ }),
/* 4 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.convertDirectoryContentPathToRelative = void 0;
const fs = __importStar(__webpack_require__(5));
function convertDirectoryContentPathToRelative(absDirPath, pathToRemove) {
    absDirPath = absDirPath.substring(1);
    var dirContents = fs.readdirSync(absDirPath);
    var relPaths = [];
    for (let i = 0; i < dirContents.length; i++) {
        relPaths.push(dirContents[i].replace(pathToRemove, ""));
    }
    return relPaths;
}
exports.convertDirectoryContentPathToRelative = convertDirectoryContentPathToRelative;


/***/ }),
/* 5 */
/***/ ((module) => {

module.exports = require("fs");

/***/ }),
/* 6 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GoToImportDefinition = void 0;
const vscode_1 = __webpack_require__(2);
const path_1 = __importDefault(__webpack_require__(7));
class GoToImportDefinition {
    importPaths = [];
    findImportInDocument(documentText) {
        let importPaths = [];
        while (documentText.includes("$import \"")) {
            let imports = documentText.split("$import \"")[1].split("\"")[0];
            documentText = documentText.replace("$import \"" + imports + "\"", "");
            importPaths.push(imports);
        }
        return importPaths;
    }
    findRangeByTextInDocument(document, text) {
        let splitDoc = document.getText().split("\n");
        let startPos = 0, endPos = 0;
        for (let i = 0; i < splitDoc.length; i++) {
            if (splitDoc[i].includes(text)) {
                startPos = splitDoc[i].split(text)[0].length;
                endPos = text.length + startPos;
                return new vscode_1.Range(new vscode_1.Position(i, startPos), new vscode_1.Position(i, endPos));
            }
        }
        return new vscode_1.Range(new vscode_1.Position(0, 0), new vscode_1.Position(0, 0));
    }
    checkPositionInRange(range, position) {
        return range.contains(position);
    }
    provideDefinition(document, position, token) {
        this.importPaths = this.findImportInDocument(document.getText());
        for (let i = 0; i < this.importPaths.length; i++) {
            if (vscode_1.workspace.workspaceFolders !== undefined) {
                var originRange = this.findRangeByTextInDocument(document, this.importPaths[i]);
                if (this.checkPositionInRange(originRange, position)) {
                    var paths = path_1.default.join(path_1.default.dirname(document.fileName), this.importPaths[i]);
                    return [{
                            targetRange: new vscode_1.Range(new vscode_1.Position(0, 9), new vscode_1.Position(700, 19)),
                            targetUri: vscode_1.Uri.file(paths),
                            originSelectionRange: originRange,
                            targetSelectionRange: new vscode_1.Range(new vscode_1.Position(0, 9), new vscode_1.Position(700, 19))
                        }];
                }
            }
        }
    }
}
exports.GoToImportDefinition = GoToImportDefinition;
// export class GoToDeclaration implements DeclarationProvider {
//     provideDeclaration(document: TextDocument, position: Position, token: CancellationToken): ProviderResult<Declaration> {
//         var a:Declaration = {
//             range: new Range(new Position(4, 5), new Position(4, 11)),
//             uri: document.uri
//         }
//         return a;
//     }
// }


/***/ }),
/* 7 */
/***/ ((module) => {

module.exports = require("path");

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.deactivate = exports.activate = void 0;
const register_1 = __webpack_require__(1);
function activate(context) {
    let autoComplete = (0, register_1.registerImportFilesCommand)();
    let goToDefinition = (0, register_1.registerGoToImportDefinitionCommand)();
    // disposable = cjsonRegisterDocumentLinkCommand();
    // disposable = registerGoToDeclarationCommand();
    context.subscriptions.push(autoComplete, goToDefinition);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=extension.js.map