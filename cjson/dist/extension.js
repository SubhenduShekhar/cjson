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
exports.registerCommand = void 0;
const vscode = __importStar(__webpack_require__(2));
const completion_items_1 = __webpack_require__(3);
const utils_1 = __webpack_require__(4);
function registerCommand() {
    var fileList = undefined;
    if (vscode.workspace.workspaceFolders?.length != undefined) {
        if (vscode.workspace.workspaceFolders?.length != 0)
            fileList = (0, utils_1.convertDirectoryContentPathToRelative)(vscode.workspace.workspaceFolders[0].uri.path, vscode.workspace.workspaceFolders[0].uri.path);
        else
            fileList = [];
    }
    else
        vscode.window.showErrorMessage("CJSON extension requires opened folder. Select your test data folder and open it");
    let disposable = vscode.languages.registerCompletionItemProvider({ language: "cjson", scheme: "file" }, new completion_items_1.CompletionItems(fileList), "$import ");
    return disposable;
}
exports.registerCommand = registerCommand;


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
        if (this.fileList != undefined) {
            for (let i = 0; i < this.fileList.length; i++) {
                if (!this.checkAndConfirm(this.fileList[i]))
                    this.completionItemList.push(new vscode_1.CompletionItem({
                        label: "\"" + this.fileList[i] + "\""
                    }));
            }
        }
        return this.completionItemList;
    }
    resolveCompletionItem(item, token) {
        throw new Error("Method not implemented.");
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
    for (let i = 0; i < dirContents.length; i++)
        relPaths.push(dirContents[i].replace(pathToRemove, ""));
    return relPaths;
}
exports.convertDirectoryContentPathToRelative = convertDirectoryContentPathToRelative;


/***/ }),
/* 5 */
/***/ ((module) => {

module.exports = require("fs");

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
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
    let disposable = (0, register_1.registerCommand)();
    context.subscriptions.push(disposable);
}
exports.activate = activate;
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=extension.js.map