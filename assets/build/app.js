(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["style-app"],{

/***/ "./assets/src/style.scss":
/*!*******************************!*\
  !*** ./assets/src/style.scss ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ })

}]);

/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/ 		var executeModules = data[2];
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(Object.prototype.hasOwnProperty.call(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 		// add entry modules from loaded chunk to deferred list
/******/ 		deferredModules.push.apply(deferredModules, executeModules || []);
/******/
/******/ 		// run deferred modules when all chunks ready
/******/ 		return checkDeferredModules();
/******/ 	};
/******/ 	function checkDeferredModules() {
/******/ 		var result;
/******/ 		for(var i = 0; i < deferredModules.length; i++) {
/******/ 			var deferredModule = deferredModules[i];
/******/ 			var fulfilled = true;
/******/ 			for(var j = 1; j < deferredModule.length; j++) {
/******/ 				var depId = deferredModule[j];
/******/ 				if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 			}
/******/ 			if(fulfilled) {
/******/ 				deferredModules.splice(i--, 1);
/******/ 				result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 			}
/******/ 		}
/******/
/******/ 		return result;
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		"app": 0
/******/ 	};
/******/
/******/ 	var deferredModules = [];
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// add entry module to deferred list
/******/ 	deferredModules.push(["./assets/src/app.js","style-app"]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ "./assets/src/Components/EditorSelector.js":
/*!*************************************************!*\
  !*** ./assets/src/Components/EditorSelector.js ***!
  \*************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "./node_modules/@babel/runtime/helpers/slicedToArray.js");
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/compose */ "@wordpress/compose");
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_compose__WEBPACK_IMPORTED_MODULE_5__);








var EditorSelector = function EditorSelector(_ref) {
  var EDITOR_MAP = _ref.EDITOR_MAP,
      count = _ref.count,
      editor = _ref.editor,
      setCurrentEditor = _ref.setCurrentEditor,
      sites = _ref.sites;

  var _useState = Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["useState"])(false),
      _useState2 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default()(_useState, 2),
      open = _useState2[0],
      setOpen = _useState2[1];

  var editorsOrderedFromAPI = Object.keys(sites);

  var toggleDropdown = function toggleDropdown() {
    return setOpen(!open);
  };

  return Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["createElement"])("div", {
    className: "ob-dropdown editor-selector"
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__["Button"], {
    onClick: toggleDropdown,
    className: "select ob-dropdown"
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["createElement"])("img", {
    className: "editor-icon",
    src: tiobDash.assets + 'editor-icons/' + EDITOR_MAP[editor].icon,
    alt: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__["__"])('Builder Logo', 'neve')
  }), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["createElement"])("span", null, EDITOR_MAP[editor].niceName), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["createElement"])("span", {
    className: "count"
  }, count[editor]), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__["Dashicon"], {
    size: 14,
    icon: open ? 'arrow-up-alt2' : 'arrow-down-alt2'
  }), open && Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__["Popover"], {
    position: "bottom center",
    onClose: toggleDropdown,
    noArrow: true
  }, open && Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["createElement"])("ul", {
    className: "options"
  }, editorsOrderedFromAPI.map(function (key, index) {
    if (key === editor) {
      return null;
    }

    return Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["createElement"])("li", {
      key: index
    }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["createElement"])("a", {
      href: "#",
      onClick: function onClick(e) {
        e.preventDefault();
        setCurrentEditor(key);
        setOpen(false);
      }
    }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["createElement"])("img", {
      className: "editor-icon",
      src: tiobDash.assets + 'editor-icons/' + EDITOR_MAP[key].icon,
      alt: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__["__"])('Builder Logo', 'neve')
    }), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["createElement"])("span", null, EDITOR_MAP[key].niceName), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["createElement"])("span", {
      className: "count"
    }, count[key])));
  })))));
};

/* harmony default export */ __webpack_exports__["default"] = (Object(_wordpress_compose__WEBPACK_IMPORTED_MODULE_5__["compose"])(Object(_wordpress_data__WEBPACK_IMPORTED_MODULE_4__["withSelect"])(function (select) {
  var _select = select('neve-onboarding'),
      getCurrentEditor = _select.getCurrentEditor,
      getSites = _select.getSites;

  return {
    editor: getCurrentEditor(),
    sites: getSites().sites
  };
}), Object(_wordpress_data__WEBPACK_IMPORTED_MODULE_4__["withDispatch"])(function (dispatch) {
  var _dispatch = dispatch('neve-onboarding'),
      _setCurrentEditor = _dispatch.setCurrentEditor;

  return {
    setCurrentEditor: function setCurrentEditor(editor) {
      return _setCurrentEditor(editor);
    }
  };
}))(EditorSelector));

/***/ }),

/***/ "./assets/src/Components/EditorTabs.js":
/*!*********************************************!*\
  !*** ./assets/src/Components/EditorTabs.js ***!
  \*********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/compose */ "@wordpress/compose");
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_compose__WEBPACK_IMPORTED_MODULE_4__);






var EditorTabs = function EditorTabs(_ref) {
  var EDITOR_MAP = _ref.EDITOR_MAP,
      count = _ref.count,
      onlyProSites = _ref.onlyProSites,
      editor = _ref.editor,
      setCurrentEditor = _ref.setCurrentEditor,
      sites = _ref.sites;
  var editorsOrderedFromAPI = Object.keys(sites);
  return Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
    className: "editor-tabs"
  }, editorsOrderedFromAPI.map(function (key, index) {
    var classes = classnames__WEBPACK_IMPORTED_MODULE_1___default()(['tab', key, {
      active: key === editor
    }]);
    return Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("a", {
      key: index,
      href: "#",
      className: classes,
      onClick: function onClick(e) {
        e.preventDefault();
        setCurrentEditor(key);
      }
    }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("span", {
      className: "icon-wrap"
    }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("img", {
      className: "editor-icon",
      src: tiobDash.assets + 'editor-icons/' + EDITOR_MAP[key].icon,
      alt: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__["__"])('Builder Logo', 'neve')
    })), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("span", {
      className: "editor"
    }, EDITOR_MAP[key].niceName), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("span", {
      className: "count"
    }, count[key]), onlyProSites.includes(key) && Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("span", {
      className: "pro-badge"
    }, "PRO"));
  }));
};

/* harmony default export */ __webpack_exports__["default"] = (Object(_wordpress_compose__WEBPACK_IMPORTED_MODULE_4__["compose"])(Object(_wordpress_data__WEBPACK_IMPORTED_MODULE_3__["withSelect"])(function (select) {
  var _select = select('neve-onboarding'),
      getCurrentEditor = _select.getCurrentEditor,
      getSites = _select.getSites;

  return {
    editor: getCurrentEditor(),
    sites: getSites().sites
  };
}), Object(_wordpress_data__WEBPACK_IMPORTED_MODULE_3__["withDispatch"])(function (dispatch) {
  var _dispatch = dispatch('neve-onboarding'),
      _setCurrentEditor = _dispatch.setCurrentEditor;

  return {
    setCurrentEditor: function setCurrentEditor(editor) {
      return _setCurrentEditor(editor);
    }
  };
}))(EditorTabs));

/***/ }),

/***/ "./assets/src/Components/ImportModal.js":
/*!**********************************************!*\
  !*** ./assets/src/Components/ImportModal.js ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/defineProperty.js");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "./node_modules/@babel/runtime/helpers/slicedToArray.js");
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _utils_site_import__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/site-import */ "./assets/src/utils/site-import.js");
/* harmony import */ var _utils_rest__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/rest */ "./assets/src/utils/rest.js");
/* harmony import */ var _utils_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/common */ "./assets/src/utils/common.js");
/* harmony import */ var _ImportStepper__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./ImportStepper */ "./assets/src/Components/ImportStepper.js");
/* harmony import */ var _ImportModalNote__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./ImportModalNote */ "./assets/src/Components/ImportModalNote.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _ImportModalError__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./ImportModalError */ "./assets/src/Components/ImportModalError.js");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @wordpress/compose */ "@wordpress/compose");
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(_wordpress_compose__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__);




function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/*global tiobDash*/













var ImportModal = function ImportModal(_ref) {
  var setModal = _ref.setModal,
      editor = _ref.editor,
      siteData = _ref.siteData,
      license = _ref.license;

  var _useState = Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["useState"])({
    content: true,
    customizer: true,
    widgets: true
  }),
      _useState2 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1___default()(_useState, 2),
      general = _useState2[0],
      setGeneral = _useState2[1];

  var _useState3 = Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["useState"])(false),
      _useState4 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1___default()(_useState3, 2),
      pluginsProgress = _useState4[0],
      setPluginsProgress = _useState4[1];

  var _useState5 = Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["useState"])(false),
      _useState6 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1___default()(_useState5, 2),
      contentProgress = _useState6[0],
      setContentProgress = _useState6[1];

  var _useState7 = Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["useState"])(false),
      _useState8 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1___default()(_useState7, 2),
      customizerProgress = _useState8[0],
      setCustomizerProgress = _useState8[1];

  var _useState9 = Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["useState"])(false),
      _useState10 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1___default()(_useState9, 2),
      widgetsProgress = _useState10[0],
      setWidgetsProgress = _useState10[1];

  var _useState11 = Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["useState"])(null),
      _useState12 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1___default()(_useState11, 2),
      frontPageID = _useState12[0],
      setFrontPageID = _useState12[1];

  var _useState13 = Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["useState"])(null),
      _useState14 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1___default()(_useState13, 2),
      currentStep = _useState14[0],
      setCurrentStep = _useState14[1];

  var _useState15 = Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["useState"])(false),
      _useState16 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1___default()(_useState15, 2),
      importing = _useState16[0],
      setImporting = _useState16[1];

  var _useState17 = Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["useState"])(null),
      _useState18 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1___default()(_useState17, 2),
      pluginOptions = _useState18[0],
      setPluginOptions = _useState18[1];

  var _useState19 = Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["useState"])(null),
      _useState20 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1___default()(_useState19, 2),
      error = _useState20[0],
      setError = _useState20[1];

  var _useState21 = Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["useState"])(null),
      _useState22 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1___default()(_useState21, 2),
      importData = _useState22[0],
      setImportData = _useState22[1];

  var _useState23 = Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["useState"])(true),
      _useState24 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1___default()(_useState23, 2),
      fetching = _useState24[0],
      setFetching = _useState24[1];

  Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["useEffect"])(function getImportData() {
    var fetchAddress = siteData.remote_url || siteData.url;
    var url = new URL("".concat(Object(_utils_common__WEBPACK_IMPORTED_MODULE_5__["trailingSlashIt"])(fetchAddress), "wp-json/ti-demo-data/data"));
    url.searchParams.append('license', license.key || 'free');
    Object(_utils_rest__WEBPACK_IMPORTED_MODULE_4__["get"])(url, true, false).then(function (response) {
      if (!response.ok) {
        setError({
          message: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__["__"])('Something went wrong while loading the site data. Please refresh the page and try again.', 'neve'),
          code: 'ti__ob_failed_fetch_response'
        });
        setFetching(false);
      }

      response.json().then(function (result) {
        setImportData(_objectSpread(_objectSpread({}, result), siteData));

        var mandatory = _objectSpread({}, result.mandatory_plugins || {});

        var optional = _objectSpread({}, result.recommended_plugins || {});

        var defaultOff = result.default_off_recommended_plugins || [];
        Object.keys(mandatory).map(function (key) {
          mandatory[key] = true;
        });
        Object.keys(optional).map(function (key) {
          optional[key] = !defaultOff.includes(key);
        });
        setPluginOptions(_objectSpread(_objectSpread({}, optional), mandatory));
        setFetching(false);
      });
    }).catch(function (error) {
      setError({
        message: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__["__"])('Something went wrong while loading the site data. Please refresh the page and try again.', 'neve'),
        code: 'ti__ob_failed_fetch_catch'
      });
      setFetching(false);
    });
  }, []);

  var renderMock = function renderMock() {
    return Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["Fragment"], null, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])("div", {
      className: "modal-body"
    }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])("div", {
      className: "well is-loading"
    }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])("h3", null, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])("div", {
      className: "mock-icon is-loading"
    }), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])("span", {
      className: "is-loading"
    })), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])("ol", null, [1, 2, 3].map(function (i) {
      return Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])("li", {
        key: i
      });
    }))), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])("hr", null), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])("div", {
      className: "options general"
    }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])("h3", {
      className: "is-loading"
    }), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])("ul", null, [1, 2, 3].map(function (i) {
      return Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])("li", {
        key: i
      }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])("div", {
        className: "mock-icon is-loading"
      }), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])("span", {
        className: "is-loading"
      }), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])("div", {
        className: "toggle is-loading"
      }));
    }))), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])("hr", null), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])("div", {
      className: "options plugins"
    }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])("h3", {
      className: "is-loading"
    }), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])("ul", null, [1, 2].map(function (i) {
      return Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])("li", {
        key: i
      }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])("div", {
        className: "mock-icon is-loading"
      }), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])("span", {
        className: "is-loading"
      }), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])("div", {
        className: "toggle is-loading"
      }));
    })))), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])("div", {
      className: "modal-footer"
    }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_12__["Button"], {
      isSecondary: true,
      className: "is-loading"
    }), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_12__["Button"], {
      isPrimary: true,
      className: "is-loading"
    })));
  };

  var renderNote = function renderNote() {
    return Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])(_ImportModalNote__WEBPACK_IMPORTED_MODULE_7__["default"], {
      data: importData,
      externalInstalled: externalPluginsInstalled
    });
  };

  var renderOptions = function renderOptions() {
    var map = {
      content: {
        title: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__["__"])('Content', 'neve'),
        icon: 'admin-post'
      },
      customizer: {
        title: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__["__"])('Customizer', 'neve'),
        icon: 'admin-customizer'
      },
      widgets: {
        title: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__["__"])('Widgets', 'neve'),
        icon: 'admin-generic'
      }
    };
    return Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])("div", {
      className: "options general"
    }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])("h3", null, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__["__"])('General', 'neve'), ":"), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])("ul", null, Object.keys(map).map(function (id, index) {
      return Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])("li", {
        key: index
      }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_12__["Dashicon"], {
        className: classnames__WEBPACK_IMPORTED_MODULE_8___default()({
          active: general[id]
        }),
        icon: map[id].icon
      }), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])("span", null, map[id].title), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])("div", {
        className: "toggle-wrapper"
      }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_12__["ToggleControl"], {
        checked: general[id],
        onChange: function onChange() {
          setGeneral(_objectSpread(_objectSpread({}, general), {}, _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()({}, id, !general[id])));
        }
      })));
    })));
  };

  var renderPlugins = function renderPlugins() {
    if (fetching) {
      return null;
    }

    var allPlugins = _objectSpread(_objectSpread({}, importData.recommended_plugins || {}), importData.mandatory_plugins || {});

    return Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])("div", {
      className: "options plugins"
    }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])("h3", null, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__["__"])('Plugins', 'neve'), ":"), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])("ul", null, Object.keys(allPlugins).map(function (slug, index) {
      return Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])("li", {
        key: index
      }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_12__["Dashicon"], {
        icon: "admin-plugins",
        className: classnames__WEBPACK_IMPORTED_MODULE_8___default()({
          active: pluginOptions[slug]
        })
      }), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])("span", {
        dangerouslySetInnerHTML: {
          __html: allPlugins[slug]
        }
      }), slug in importData.recommended_plugins && Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])("div", {
        className: "toggle-wrapper"
      }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_12__["ToggleControl"], {
        checked: pluginOptions[slug],
        onChange: function onChange() {
          setPluginOptions(_objectSpread(_objectSpread({}, pluginOptions), {}, _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()({}, slug, !pluginOptions[slug])));
        }
      })));
    })));
  };

  function runImport() {
    console.clear();

    if (!pluginOptions) {
      console.log('[S] Plugins.');
      runImportContent();
      return false;
    }

    setCurrentStep('plugins');
    console.log('[P] Plugins.');
    Object(_utils_site_import__WEBPACK_IMPORTED_MODULE_3__["installPlugins"])(pluginOptions).then(function (response) {
      if (!response.success) {
        handleError(response, 'plugins');
        return false;
      }

      console.log('[D] Plugins.');
      setPluginsProgress('done');
      runImportContent();
    }).catch(function (error) {
      return handleError(error, 'plugins');
    });
  }

  function runImportContent() {
    if (!general.content) {
      console.log('[S] Content.');
      runImportCustomizer();
      return false;
    }

    setCurrentStep('content');
    console.log('[P] Content.');
    Object(_utils_site_import__WEBPACK_IMPORTED_MODULE_3__["importContent"])({
      contentFile: importData.content_file,
      source: 'remote',
      frontPage: importData.front_page,
      shopPages: importData.shop_pages,
      demoSlug: importData.slug,
      editor: editor
    }).then(function (response) {
      if (!response.success) {
        handleError(response, 'content');
        return false;
      }

      console.log('[D] Content.');

      if (response.frontpage_id) {
        setFrontPageID(response.frontpage_id);
      }

      setContentProgress('done');
      runImportCustomizer();
    }).catch(function (error) {
      return handleError(error, 'content');
    });
  }

  function runImportCustomizer() {
    if (!general.customizer) {
      console.log('[S] Customizer.');
      runImportWidgets();
      return false;
    }

    setCurrentStep('customizer');
    console.log('[P] Customizer.');
    Object(_utils_site_import__WEBPACK_IMPORTED_MODULE_3__["importMods"])({
      source_url: importData.url,
      theme_mods: importData.theme_mods,
      wp_options: importData.wp_options
    }).then(function (response) {
      if (!response.success) {
        handleError(response, 'customizer');
        return false;
      }

      console.log('[D] Customizer.');
      setCustomizerProgress('done');
      runImportWidgets();
    }).catch(function (error) {
      return handleError(error, 'customizer');
    });
  }

  function runImportWidgets() {
    if (!general.widgets) {
      console.log('[S] Widgets.');
      importDone();
    }

    setCurrentStep('widgets');
    console.log('[P] Widgets.');
    Object(_utils_site_import__WEBPACK_IMPORTED_MODULE_3__["importWidgets"])(importData.widgets).then(function (response) {
      if (!response.success) {
        handleError(response, 'widgets');
        return false;
      }

      console.log('[D] Widgets.');
      setWidgetsProgress('done');
      importDone();
    }).catch(function (error) {
      return handleError(error, 'widgets');
    });
  }

  function importDone() {
    setCurrentStep('done');
    setImporting(false);
  }

  function handleError(error, step) {
    setImporting(false);
    setCurrentStep(null);

    if ('plugins' === step) {
      setContentProgress('skip');
    }

    if (['content', 'plugins'].includes(step)) {
      setCustomizerProgress('skip');
    }

    if (['content', 'plugins', 'customizer'].includes(step)) {
      setWidgetsProgress('skip');
    }

    var map = {
      plugins: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__["__"])('Something went wrong while installing the necessary plugins.', 'neve'),
      content: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__["__"])('Something went wrong while importing the website content.', 'neve'),
      customizer: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__["__"])('Something went wrong while updating the customizer settings.', 'neve'),
      widgets: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__["__"])('Something went wrong while importing the widgets.', 'neve')
    };

    switch (step) {
      case 'plugins':
        setPluginsProgress('error');
        break;

      case 'content':
        setContentProgress('error');
        break;

      case 'customizer':
        setCustomizerProgress('error');
        break;

      case 'widgets':
        setWidgetsProgress('error');
        break;
    }

    setError(error.data ? {
      message: map[step],
      code: error.data
    } : {
      message: map[step]
    });
  }

  var closeModal = function closeModal() {
    if (importing) {
      return false;
    }

    setModal(false);
  };

  var externalPluginsInstalled = siteData.external_plugins ? siteData.external_plugins.every(function (value) {
    return true === value.active;
  }) : true;
  var allOptionsOff = Object.keys(general).every(function (k) {
    return false === general[k];
  });
  var editLinkMap = {
    elementor: "".concat(tiobDash.onboarding.homeUrl, "/wp-admin/post.php?post=").concat(frontPageID, "&action=elementor"),
    brizy: "".concat(tiobDash.onboarding.homeUrl, "/?brizy-edit"),
    'beaver builder': "".concat(tiobDash.onboarding.homeUrl, "/?fl_builder"),
    'thrive architect': "".concat(tiobDash.onboarding.homeUrl, "/wp-admin/post.php?post=").concat(frontPageID, "&action=architect&tve=true"),
    'divi builder': "".concat(tiobDash.onboarding.homeUrl, "/?et_fb=1&PageSpeed=off"),
    gutenberg: "".concat(tiobDash.onboarding.homeUrl, "/wp-admin/post.php?post=").concat(frontPageID, "&action=edit")
  };
  var editLink = editLinkMap[editor];
  return Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_12__["Modal"], {
    className: classnames__WEBPACK_IMPORTED_MODULE_8___default()(['ob-import-modal', {
      fetching: fetching
    }]),
    title: importData && !fetching ? importData.title : Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])("span", {
      className: "is-loading title"
    }),
    onRequestClose: closeModal,
    shouldCloseOnClickOutside: !importing && !fetching,
    isDismissible: !importing && !fetching
  }, fetching ? renderMock() : Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["Fragment"], null, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])("div", {
    className: "modal-body"
  }, !importing && 'done' !== currentStep && !error ? Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["Fragment"], null, renderNote(), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])("hr", null), renderOptions(), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])("hr", null), renderPlugins()) : Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["Fragment"], null, error && Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["Fragment"], null, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])(_ImportModalError__WEBPACK_IMPORTED_MODULE_9__["default"], {
    message: error.message || null,
    code: error.code || null
  }), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])("hr", null)), null !== currentStep && Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])(_ImportStepper__WEBPACK_IMPORTED_MODULE_6__["default"], {
    progress: {
      plugins: pluginsProgress,
      content: contentProgress,
      customizer: customizerProgress,
      widgets: widgetsProgress
    },
    currentStep: currentStep,
    willDo: general
  }), 'done' === currentStep && Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["Fragment"], null, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])("hr", null), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])("p", {
    className: "import-result"
  }, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__["__"])('Content was successfully imported. Enjoy your new site!', 'neve')), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])("hr", null)))), !importing && Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])("div", {
    className: "modal-footer"
  }, 'done' !== currentStep ? Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["Fragment"], null, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_12__["Button"], {
    isSecondary: true,
    onClick: closeModal
  }, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__["__"])('Close', 'neve')), !error && Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_12__["Button"], {
    isPrimary: true,
    disabled: allOptionsOff || !externalPluginsInstalled,
    onClick: function onClick() {
      setImporting(true);
      runImport();
    }
  }, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__["__"])('Import', 'neve'))) : Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["Fragment"], null, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_12__["Button"], {
    isLink: true,
    className: "close",
    onClick: closeModal
  }, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__["__"])('Back to Sites Library', 'neve')), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_12__["Button"], {
    isSecondary: true,
    href: tiobDash.onboarding.homeUrl
  }, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__["__"])('View Website', 'neve')), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_12__["Button"], {
    isPrimary: true,
    href: editLink
  }, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__["__"])('Add your own content', 'neve'))))));
};

/* harmony default export */ __webpack_exports__["default"] = (Object(_wordpress_compose__WEBPACK_IMPORTED_MODULE_11__["compose"])(Object(_wordpress_data__WEBPACK_IMPORTED_MODULE_10__["withSelect"])(function (select) {
  var _select = select('neve-dashboard'),
      getLicense = _select.getLicense;

  var _select2 = select('neve-onboarding'),
      getCurrentEditor = _select2.getCurrentEditor,
      getCurrentSite = _select2.getCurrentSite;

  return {
    editor: getCurrentEditor(),
    siteData: getCurrentSite(),
    license: getLicense()
  };
}), Object(_wordpress_data__WEBPACK_IMPORTED_MODULE_10__["withDispatch"])(function (dispatch) {
  var _dispatch = dispatch('neve-onboarding'),
      setImportModalStatus = _dispatch.setImportModalStatus;

  return {
    setModal: function setModal(status) {
      return setImportModalStatus(status);
    }
  };
}))(ImportModal));

/***/ }),

/***/ "./assets/src/Components/ImportModalError.js":
/*!***************************************************!*\
  !*** ./assets/src/Components/ImportModalError.js ***!
  \***************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);




var ImportModalError = function ImportModalError(_ref) {
  var message = _ref.message,
      code = _ref.code;
  return Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
    className: "well error"
  }, message && Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("h3", null, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__["Dashicon"], {
    icon: "warning"
  }), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("span", null, message)), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("ul", null, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("li", {
    dangerouslySetInnerHTML: {
      __html: tiobDash.onboarding.i18n.troubleshooting
    }
  }), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("li", {
    dangerouslySetInnerHTML: {
      __html: tiobDash.onboarding.i18n.support
    }
  }), code && Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("li", null, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__["__"])('Error code', 'neve'), ": ", Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("code", null, code)), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("li", null, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__["__"])('Error log', 'neve'), ":", ' ', Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__["Button"], {
    isLink: true,
    href: tiobDash.onboarding.logUrl
  }, tiobDash.onboarding.logUrl, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__["Dashicon"], {
    icon: "external"
  })))));
};

/* harmony default export */ __webpack_exports__["default"] = (ImportModalError);

/***/ }),

/***/ "./assets/src/Components/ImportModalNote.js":
/*!**************************************************!*\
  !*** ./assets/src/Components/ImportModalNote.js ***!
  \**************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__);






var ImportModalNote = function ImportModalNote(_ref) {
  var data = _ref.data,
      externalInstalled = _ref.externalInstalled;
  var external = data.external_plugins || null;
  var classes = classnames__WEBPACK_IMPORTED_MODULE_1___default()(['well', {
    warning: external && !externalInstalled
  }]);
  return Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
    className: classes
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("h3", null, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__["Dashicon"], {
    icon: "info"
  }), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("span", null, external && !externalInstalled ? Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__["__"])('To import this demo you have to install the following plugins', 'neve') : Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__["__"])('Note', 'neve'), ":")), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("ol", null, external && !externalInstalled ? external.map(function (plugin, index) {
    return Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("li", {
      key: index
    }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__["Button"], {
      isLink: true,
      href: plugin.author_url
    }, plugin.name));
  }) : Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["Fragment"], null, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("li", null, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__["__"])('We recommend you backup your website content before attempting a full site import.', 'neve')), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("li", null, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__["__"])('Some of the demo images will not be imported and will be replaced by placeholder images.', 'neve')))));
};

/* harmony default export */ __webpack_exports__["default"] = (ImportModalNote);

/***/ }),

/***/ "./assets/src/Components/ImportStepper.js":
/*!************************************************!*\
  !*** ./assets/src/Components/ImportStepper.js ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);





var ImportStepper = function ImportStepper(_ref) {
  var currentStep = _ref.currentStep,
      progress = _ref.progress,
      willDo = _ref.willDo;
  var stepsMap = {
    plugins: {
      label: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__["__"])('Installing Plugins', 'neve'),
      status: progress.plugins,
      willDo: true
    },
    content: {
      label: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__["__"])('Importing Content', 'neve'),
      status: progress.content,
      willDo: willDo.content
    },
    customizer: {
      label: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__["__"])('Importing Customizer Settings', 'neve'),
      status: progress.customizer,
      willDo: willDo.customizer
    },
    widgets: {
      label: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__["__"])('Importing Widgets', 'neve'),
      status: progress.widgets,
      willDo: willDo.widgets
    }
  };
  return Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("ul", {
    className: "stepper"
  }, Object.keys(stepsMap).map(function (key, index) {
    var _stepsMap$key = stepsMap[key],
        label = _stepsMap$key.label,
        status = _stepsMap$key.status,
        willDo = _stepsMap$key.willDo;

    if (!willDo) {
      return null;
    }

    var classes = classnames__WEBPACK_IMPORTED_MODULE_1___default()(['icon', {
      loading: currentStep === key,
      warning: currentStep === key,
      success: 'done' === status,
      error: 'error' === status,
      skip: 'skip' === status
    }]);
    var icon = 'clock';

    if (currentStep === key) {
      icon = 'update';
    }

    if ('done' === status) {
      icon = 'yes';
    }

    if ('error' === status) {
      icon = 'no-alt';
    }

    return Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("li", {
      key: index
    }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("span", {
      className: classes
    }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__["Dashicon"], {
      icon: icon,
      className: currentStep === key ? 'loading' : ''
    })), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("span", null, label));
  }));
};

/* harmony default export */ __webpack_exports__["default"] = (ImportStepper);

/***/ }),

/***/ "./assets/src/Components/Main.js":
/*!***************************************!*\
  !*** ./assets/src/Components/Main.js ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/toConsumableArray */ "./node_modules/@babel/runtime/helpers/toConsumableArray.js");
/* harmony import */ var _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "./node_modules/@babel/runtime/helpers/slicedToArray.js");
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _Search__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Search */ "./assets/src/Components/Search.js");
/* harmony import */ var _StarterSiteCard__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./StarterSiteCard */ "./assets/src/Components/StarterSiteCard.js");
/* harmony import */ var _PreviewFrame__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./PreviewFrame */ "./assets/src/Components/PreviewFrame.js");
/* harmony import */ var _ImportModal__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./ImportModal */ "./assets/src/Components/ImportModal.js");
/* harmony import */ var _Migration__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./Migration */ "./assets/src/Components/Migration.js");
/* harmony import */ var react_visibility_sensor__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-visibility-sensor */ "./node_modules/react-visibility-sensor/dist/visibility-sensor.js");
/* harmony import */ var react_visibility_sensor__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(react_visibility_sensor__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var fuse_js_dist_fuse_min__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! fuse.js/dist/fuse.min */ "./node_modules/fuse.js/dist/fuse.min.js");
/* harmony import */ var fuse_js_dist_fuse_min__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(fuse_js_dist_fuse_min__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _EditorTabs__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./EditorTabs */ "./assets/src/Components/EditorTabs.js");
/* harmony import */ var _EditorSelector__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./EditorSelector */ "./assets/src/Components/EditorSelector.js");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_14___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_14__);
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @wordpress/compose */ "@wordpress/compose");
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_15___default = /*#__PURE__*/__webpack_require__.n(_wordpress_compose__WEBPACK_IMPORTED_MODULE_15__);


















var Onboarding = function Onboarding(_ref) {
  var editor = _ref.editor,
      category = _ref.category,
      resetCategory = _ref.resetCategory,
      previewOpen = _ref.previewOpen,
      currentSiteData = _ref.currentSiteData,
      importModal = _ref.importModal,
      isOnboarding = _ref.isOnboarding,
      cancelOnboarding = _ref.cancelOnboarding,
      getSites = _ref.getSites;

  var _useState = Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["useState"])(''),
      _useState2 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1___default()(_useState, 2),
      searchQuery = _useState2[0],
      setSearchQuery = _useState2[1];

  var _useState3 = Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["useState"])(9),
      _useState4 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1___default()(_useState3, 2),
      maxShown = _useState4[0],
      setMaxShown = _useState4[1];

  var _getSites$sites = getSites.sites,
      sites = _getSites$sites === void 0 ? {} : _getSites$sites,
      migration = getSites.migration;

  if (1 > sites.length) {
    return Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["Fragment"], null, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])("p", null, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__["__"])('Starter sites could not be loaded. Please refresh and try again.', 'neve'), isOnboarding && Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_12__["Button"], {
      style: {
        display: 'block',
        margin: '20px auto'
      },
      isPrimary: true,
      onClick: cancelOnboarding
    }, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__["__"])('Close', 'neve'))));
  }

  var tags = [Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__["__"])('Business', 'neve'), Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__["__"])('Ecommerce', 'neve'), Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__["__"])('Fashion', 'neve'), Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__["__"])('Blogging', 'neve'), Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__["__"])('Photography', 'neve')];
  var CATEGORIES = {
    all: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__["__"])('All Categories'),
    free: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__["__"])('Free'),
    business: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__["__"])('Business'),
    portfolio: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__["__"])('Portfolio'),
    woocommerce: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__["__"])('WooCommerce'),
    blog: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__["__"])('Blog'),
    personal: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__["__"])('Personal'),
    other: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__["__"])('Other')
  };
  var EDITOR_MAP = {
    gutenberg: {
      icon: 'gutenberg.jpg',
      niceName: 'Gutenberg'
    },
    elementor: {
      icon: 'elementor.jpg',
      niceName: 'Elementor'
    },
    'beaver builder': {
      icon: 'beaver.jpg',
      niceName: Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["Fragment"], null, "Beaver ", Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])("span", {
        className: "long-name"
      }, "Builder"))
    },
    brizy: {
      icon: 'brizy.jpg',
      niceName: 'Brizy'
    },
    'divi builder': {
      icon: 'divi.jpg',
      niceName: 'Divi'
    },
    'thrive architect': {
      icon: 'thrive.jpg',
      niceName: Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["Fragment"], null, "Thrive ", Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])("span", {
        className: "long-name"
      }, "Architect"))
    }
  };

  var getAllSites = function getAllSites() {
    var finalData = {};
    var builders = getBuilders();
    builders.map(function (builder) {
      var sitesData = sites && sites[builder] ? sites[builder] : {};
      finalData[builder] = _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0___default()(Object.values(sitesData));
    });
    return finalData;
  };

  var filterByCategory = function filterByCategory(sites, category) {
    if ('free' === category) {
      return sites.filter(function (item) {
        return !item.upsell;
      });
    }

    if ('all' !== category) {
      return sites.filter(function (item) {
        return item.keywords.includes(category);
      });
    }

    return sites;
  };

  var filterBySearch = function filterBySearch(sites) {
    if (!searchQuery) {
      return sites;
    }

    var fuse = new fuse_js_dist_fuse_min__WEBPACK_IMPORTED_MODULE_9___default.a(sites, {
      includeScore: true,
      keys: ['title', 'slug', 'keywords']
    });
    return fuse.search(searchQuery).map(function (item) {
      return item.item;
    });
  };

  var getSitesForBuilder = function getSitesForBuilder(builder) {
    var allSites = getAllSites();
    return allSites[builder];
  };

  var getBuilders = function getBuilders() {
    return Object.keys(sites);
  };

  var getCounts = function getCounts() {
    var counts = {
      builders: {},
      categories: {}
    };
    var builders = getBuilders();
    builders.map(function (builder) {
      var buildersFiltered = getSitesForBuilder(builder);
      buildersFiltered = filterByCategory(buildersFiltered, category);
      buildersFiltered = filterBySearch(buildersFiltered);
      counts.builders[builder] = buildersFiltered ? buildersFiltered.length : 0;
    });
    Object.keys(CATEGORIES).map(function (category) {
      var categoriesFiltered = getSitesForBuilder(editor);
      categoriesFiltered = filterByCategory(categoriesFiltered, category);
      categoriesFiltered = filterBySearch(categoriesFiltered);
      counts.categories[category] = categoriesFiltered ? categoriesFiltered.length : 0;
    });
    return counts;
  };

  var getFilteredSites = function getFilteredSites() {
    var allSites = getAllSites();
    var builderSites = allSites[editor];
    builderSites = filterBySearch(builderSites);
    builderSites = filterByCategory(builderSites, category);
    return builderSites;
  };

  var renderSites = function renderSites() {
    var allData = getFilteredSites();
    return allData.slice(0, maxShown).map(function (site, index) {
      return Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])(_StarterSiteCard__WEBPACK_IMPORTED_MODULE_4__["default"], {
        key: index,
        data: site
      });
    });
  };

  var getSiteNav = function getSiteNav() {
    var prev = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    if (null === currentSiteData) {
      return null;
    }

    var allSites = getAllSites()[editor];
    var position = allSites.indexOf(currentSiteData);

    if (-1 === position) {
      return null;
    }

    if (1 === allSites.length) {
      return null;
    }

    if (prev && 0 === position) {
      return allSites[allSites.length - 1];
    }

    if (!prev && position === allSites.length - 1) {
      return allSites[0];
    }

    return allSites[prev ? position - 1 : position + 1];
  };

  function renderMigration() {
    if (!migration) {
      return null;
    }

    return Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])(_Migration__WEBPACK_IMPORTED_MODULE_7__["default"], {
      data: migration
    });
  }

  var onlyProBuilders = getBuilders().filter(function (builder) {
    var upsellSitesCount = Object.keys(sites[builder]).filter(function (site) {
      return true === sites[builder][site].upsell;
    }).length;
    var sitesCount = Object.keys(sites[builder]).length;
    return upsellSitesCount === sitesCount;
  });
  var counted = getCounts();
  return Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["Fragment"], null, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])("div", {
    className: "ob"
  }, renderMigration(), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])("div", {
    className: "ob-head"
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])("h2", null, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__["__"])('Ready to use pre-built websites with 1-click installation', 'neve')), isOnboarding && Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_12__["Button"], {
    isPrimary: true,
    onClick: cancelOnboarding
  }, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__["__"])('Keep the Current Layout', 'neve'))), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])("div", {
    className: "ob-body"
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])(_EditorSelector__WEBPACK_IMPORTED_MODULE_11__["default"], {
    count: counted.builders,
    EDITOR_MAP: EDITOR_MAP
  }), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])(_Search__WEBPACK_IMPORTED_MODULE_3__["default"], {
    count: counted.categories,
    categories: CATEGORIES,
    onSearch: function onSearch(query) {
      setSearchQuery(query);
      setMaxShown(9);
    },
    query: searchQuery
  }), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])(_EditorTabs__WEBPACK_IMPORTED_MODULE_10__["default"], {
    EDITOR_MAP: EDITOR_MAP,
    onlyProSites: onlyProBuilders,
    count: counted.builders
  }), 0 === getFilteredSites().length ? Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])("div", {
    className: "no-results"
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])("p", null, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__["__"])('No results found', 'neve'), ".", ' ', Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_13__["__"])('You can try a different search or use one of the categories below.', 'neve')), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])("div", {
    className: "tags"
  }, tags.map(function (tag, index) {
    return Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_12__["Button"], {
      key: index,
      isPrimary: true,
      className: "tag",
      onClick: function onClick(e) {
        e.preventDefault();
        setSearchQuery(tag);
        resetCategory();
      }
    }, tag);
  }))) : Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])("div", {
    className: "ob-sites"
  }, renderSites()), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])(react_visibility_sensor__WEBPACK_IMPORTED_MODULE_8___default.a, {
    onChange: function onChange(isVisible) {
      if (!isVisible) {
        return false;
      }

      setMaxShown(maxShown + 9);
    }
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])("span", {
    style: {
      height: 10,
      width: 10,
      display: 'block'
    }
  })))), previewOpen && currentSiteData && Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])(_PreviewFrame__WEBPACK_IMPORTED_MODULE_5__["default"], {
    next: getSiteNav(),
    prev: getSiteNav(true)
  }), importModal && currentSiteData && Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__["createElement"])(_ImportModal__WEBPACK_IMPORTED_MODULE_6__["default"], null));
};

/* harmony default export */ __webpack_exports__["default"] = (Object(_wordpress_compose__WEBPACK_IMPORTED_MODULE_15__["compose"])(Object(_wordpress_data__WEBPACK_IMPORTED_MODULE_14__["withDispatch"])(function (dispatch) {
  var _dispatch = dispatch('neve-onboarding'),
      setOnboardingState = _dispatch.setOnboardingState,
      setCurrentCategory = _dispatch.setCurrentCategory;

  return {
    cancelOnboarding: function cancelOnboarding() {
      setOnboardingState(false);
    },
    resetCategory: function resetCategory() {
      setCurrentCategory('all');
    }
  };
}), Object(_wordpress_data__WEBPACK_IMPORTED_MODULE_14__["withSelect"])(function (select) {
  var _select = select('neve-onboarding'),
      getCurrentEditor = _select.getCurrentEditor,
      getCurrentCategory = _select.getCurrentCategory,
      getPreviewStatus = _select.getPreviewStatus,
      getCurrentSite = _select.getCurrentSite,
      getImportModalStatus = _select.getImportModalStatus,
      getOnboardingStatus = _select.getOnboardingStatus,
      getSites = _select.getSites;

  return {
    editor: getCurrentEditor(),
    category: getCurrentCategory(),
    previewOpen: getPreviewStatus(),
    currentSiteData: getCurrentSite(),
    importModal: getImportModalStatus(),
    isOnboarding: getOnboardingStatus(),
    getSites: getSites()
  };
}))(Onboarding));

/***/ }),

/***/ "./assets/src/Components/Migration.js":
/*!********************************************!*\
  !*** ./assets/src/Components/Migration.js ***!
  \********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "./node_modules/@babel/runtime/helpers/slicedToArray.js");
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _utils_rest__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/rest */ "./assets/src/utils/rest.js");
/* harmony import */ var _utils_site_import__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/site-import */ "./assets/src/utils/site-import.js");
/* harmony import */ var _ImportModalNote__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ImportModalNote */ "./assets/src/Components/ImportModalNote.js");
/* harmony import */ var _ImportModalError__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./ImportModalError */ "./assets/src/Components/ImportModalError.js");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_8__);



/* global tiobDash */









var Migration = function Migration(_ref) {
  var data = _ref.data,
      setToast = _ref.setToast;

  var _useState = Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["useState"])(false),
      _useState2 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default()(_useState, 2),
      dismissed = _useState2[0],
      setDismissed = _useState2[1];

  var _useState3 = Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["useState"])(false),
      _useState4 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default()(_useState3, 2),
      modalOpen = _useState4[0],
      setModalOpen = _useState4[1];

  var _useState5 = Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["useState"])(false),
      _useState6 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default()(_useState5, 2),
      migrating = _useState6[0],
      setMigrating = _useState6[1];

  var _useState7 = Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["useState"])(null),
      _useState8 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default()(_useState7, 2),
      error = _useState8[0],
      setError = _useState8[1];

  var _useState9 = Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["useState"])(null),
      _useState10 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default()(_useState9, 2),
      frontPageID = _useState10[0],
      setFrontPageID = _useState10[1];

  if (dismissed) {
    return null;
  }

  var closeModal = function closeModal() {
    if ('done' === migrating) {
      setDismissed(true);
    }

    setModalOpen(false);
    setError(null);
    setMigrating(false);
  };

  function startMigration() {
    var plugins = Object.keys(data.mandatory_plugins).reduce(function (p, key) {
      p[key] = true;
      return p;
    }, {});
    Object(_utils_site_import__WEBPACK_IMPORTED_MODULE_3__["installPlugins"])(plugins).then(function (r) {
      setMigrating(true);

      if (!r.success) {
        setError({
          code: r.data || null,
          message: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__["__"])('Something went wrong while installing the necessary plugins.', 'neve')
        });
        setMigrating(false);
        return false;
      }

      var template = data.template,
          template_name = data.template_name;
      Object(_utils_rest__WEBPACK_IMPORTED_MODULE_2__["send"])(tiobDash.onboarding.root + '/migrate_frontpage', {
        template: template,
        template_name: template_name
      }).then(function (r) {
        if (!r.success) {
          setError({
            code: r.data || null,
            message: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__["__"])('Something went wrong while importing the website content.', 'neve')
          });
          setMigrating(false);
          return false;
        }

        setFrontPageID(r.data);
        setMigrating('done');
      });
    });
  }

  var renderModal = function renderModal() {
    return Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_7__["Modal"], {
      className: "ob-import-modal migration",
      title: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__["__"])('Migrate', 'neve') + ' ' + data.theme_name,
      onRequestClose: closeModal,
      shouldCloseOnClickOutside: !migrating,
      isDismissible: !migrating
    }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["createElement"])(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["Fragment"], null, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["createElement"])("div", {
      className: "modal-body"
    }, error && Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["createElement"])(_ImportModalError__WEBPACK_IMPORTED_MODULE_5__["default"], {
      message: error.message || null,
      code: error.code || null
    }), false === migrating && !error && Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["createElement"])(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["Fragment"], null, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["createElement"])(_ImportModalNote__WEBPACK_IMPORTED_MODULE_4__["default"], {
      data: data
    }), data.mandatory_plugins && Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["createElement"])(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["Fragment"], null, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["createElement"])("hr", null), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["createElement"])("h3", null, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__["__"])('The following plugins will be installed', 'neve'), ":"), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["createElement"])("ul", null, Object.keys(data.mandatory_plugins).map(function (k, index) {
      return Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["createElement"])("li", {
        key: index
      }, "-", ' ', data.mandatory_plugins[k]);
    })))), 'done' === migrating && Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["createElement"])("p", {
      className: "import-result"
    }, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__["__"])('Content was successfully imported. Enjoy your new site!', 'neve')), true === migrating && Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["createElement"])("div", {
      className: "loading"
    }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_7__["Dashicon"], {
      icon: "update",
      size: 50
    }), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["createElement"])("h3", null, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__["__"])('Migrating', 'neve'), "..."))), (!migrating || 'done' === migrating) && Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["createElement"])("div", {
      className: "modal-footer"
    }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_7__["Button"], {
      isSecondary: 'done' !== migrating,
      isLink: 'done' === migrating,
      className: 'done' === migrating ? 'close' : null,
      onClick: closeModal
    }, 'done' === migrating ? Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__["__"])('Close', 'neve') : Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__["__"])('Cancel', 'neve')), !error && 'done' !== migrating ? Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_7__["Button"], {
      isPrimary: true,
      onClick: function onClick() {
        startMigration();
      }
    }, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__["__"])('Start Migration', 'neve')) : Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["createElement"])(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["Fragment"], null, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_7__["Button"], {
      isSecondary: true,
      href: "".concat(tiobDash.onboarding.homeUrl, "/wp-admin/post.php?post=").concat(frontPageID, "&action=elementor")
    }, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__["__"])('Edit Content', 'neve')), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_7__["Button"], {
      isPrimary: true,
      href: tiobDash.onboarding.homeUrl
    }, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__["__"])('View Website', 'neve'))))));
  };

  return Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["createElement"])("div", {
    className: "ob-migration"
  }, modalOpen && renderModal(), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["createElement"])("h2", null, data.heading), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["createElement"])("p", null, data.description), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["createElement"])("div", {
    className: "card starter-site-card"
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["createElement"])("div", {
    className: "top"
  }, data.screenshot && Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["createElement"])("div", {
    className: "image"
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["createElement"])("img", {
    src: data.screenshot,
    alt: data.theme_name
  }))), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["createElement"])("div", {
    className: "bottom"
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["createElement"])("p", {
    className: "title"
  }, data.theme_name))), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["createElement"])("div", {
    className: "actions"
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_7__["Button"], {
    isPrimary: true,
    onClick: function onClick() {
      setModalOpen(true);
      return false;
    }
  }, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__["__"])('Migrate', 'neve') + ' ' + data.theme_name), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_7__["Button"], {
    isSecondary: true,
    onClick: function onClick() {
      Object(_utils_rest__WEBPACK_IMPORTED_MODULE_2__["send"])(tiobDash.onboarding.root + '/dismiss_migration', {
        theme_mod: data.theme_mod
      }).then(function (r) {
        if (!r.success) {
          setToast(Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__["__"])('Something went wrong. Please reload the page and try again.', 'neve'));
          return false;
        }

        setToast(Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__["__"])('Dismissed', 'neve'));
        setDismissed(true);
      });
    }
  }, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__["__"])('Dismiss', 'neve'))));
};

/* harmony default export */ __webpack_exports__["default"] = (Object(_wordpress_data__WEBPACK_IMPORTED_MODULE_8__["withDispatch"])(function (dispatch) {
  var _dispatch = dispatch('neve-dashboard'),
      _setToast = _dispatch.setToast;

  return {
    setToast: function setToast(message) {
      _setToast(message);
    }
  };
})(Migration)); // export default Migration;

/***/ }),

/***/ "./assets/src/Components/PreviewFrame.js":
/*!***********************************************!*\
  !*** ./assets/src/Components/PreviewFrame.js ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/compose */ "@wordpress/compose");
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_compose__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__);


/* global tiobDash */





var PreviewFrame = function PreviewFrame(_ref) {
  var next = _ref.next,
      prev = _ref.prev,
      siteData = _ref.siteData,
      setSite = _ref.setSite,
      setPreview = _ref.setPreview,
      setModal = _ref.setModal;
  var _tiobDash = tiobDash,
      isRTL = _tiobDash.isRTL;
  return Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
    className: "ob-preview"
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
    className: "preview"
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("iframe", {
    src: siteData.url,
    frameBorder: "0"
  }), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
    className: "loading"
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__["Dashicon"], {
    icon: "update",
    size: 50
  }))), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
    className: "bottom-bar"
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
    className: "navigator"
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__["Button"], {
    onClick: function onClick(e) {
      e.preventDefault();
      setPreview(false);
      setSite(null);
    },
    className: "close",
    label: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__["__"])('Close', 'neve'),
    icon: "no"
  }), prev && Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__["Button"], {
    onClick: function onClick(e) {
      e.preventDefault();
      setSite(prev);
    },
    className: "prev",
    label: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__["__"])('Previous', 'neve'),
    icon: isRTL ? 'arrow-right-alt2' : 'arrow-left-alt2'
  }), next && Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__["Button"], {
    onClick: function onClick(e) {
      e.preventDefault();
      setSite(next);
    },
    className: "next",
    label: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__["__"])('Next', 'neve'),
    icon: isRTL ? 'arrow-left-alt2' : 'arrow-right-alt2'
  })), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
    className: "actions"
  }, siteData.upsell ? Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__["Button"], {
    className: "upgrade",
    isPrimary: true,
    href: siteData.utmOutboundLink || tiobDash.upgradeURL
  }, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__["__"])('Upgrade and Import', 'neve')) : Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__["Button"], {
    className: "import",
    isPrimary: true,
    onClick: function onClick(e) {
      e.preventDefault();
      setModal(true);
    }
  }, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__["__"])('Import', 'neve')))));
};

/* harmony default export */ __webpack_exports__["default"] = (Object(_wordpress_compose__WEBPACK_IMPORTED_MODULE_2__["compose"])(Object(_wordpress_data__WEBPACK_IMPORTED_MODULE_1__["withSelect"])(function (select) {
  var _select = select('neve-onboarding'),
      getCurrentSite = _select.getCurrentSite;

  return {
    siteData: getCurrentSite()
  };
}), Object(_wordpress_data__WEBPACK_IMPORTED_MODULE_1__["withDispatch"])(function (dispatch) {
  var _dispatch = dispatch('neve-onboarding'),
      setCurrentSite = _dispatch.setCurrentSite,
      setPreviewStatus = _dispatch.setPreviewStatus,
      setImportModalStatus = _dispatch.setImportModalStatus;

  return {
    setSite: function setSite(data) {
      return setCurrentSite(data);
    },
    setPreview: function setPreview(status) {
      return setPreviewStatus(status);
    },
    setModal: function setModal(status) {
      return setImportModalStatus(status);
    }
  };
}))(PreviewFrame));

/***/ }),

/***/ "./assets/src/Components/Search.js":
/*!*****************************************!*\
  !*** ./assets/src/Components/Search.js ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "./node_modules/@babel/runtime/helpers/slicedToArray.js");
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/compose */ "@wordpress/compose");
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_compose__WEBPACK_IMPORTED_MODULE_5__);








var Search = function Search(_ref) {
  var count = _ref.count,
      categories = _ref.categories,
      onSearch = _ref.onSearch,
      category = _ref.category,
      setCurrentCategory = _ref.setCurrentCategory,
      query = _ref.query;

  var _useState = Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["useState"])(false),
      _useState2 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default()(_useState, 2),
      open = _useState2[0],
      setOpen = _useState2[1];

  var toggleDropdown = function toggleDropdown() {
    return setOpen(!open);
  };

  var renderCategoriesDropdown = function renderCategoriesDropdown() {
    return Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["createElement"])("div", {
      className: "ob-dropdown categories-selector"
    }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__["Button"], {
      onClick: toggleDropdown,
      className: "select ob-dropdown"
    }, categories[category], Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__["Dashicon"], {
      size: 14,
      icon: open ? 'arrow-up-alt2' : 'arrow-down-alt2'
    }), open && Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__["Popover"], {
      position: "bottom center",
      onClose: toggleDropdown,
      noArrow: true
    }, open && Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["createElement"])("ul", {
      className: "options"
    }, Object.keys(categories).map(function (key, index) {
      if (key === category) {
        return null;
      }

      if ('free' === key && count.all === count[key]) {
        return null;
      }

      return Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["createElement"])("li", {
        key: index
      }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["createElement"])("a", {
        href: "#",
        onClick: function onClick(e) {
          e.preventDefault();
          setCurrentCategory(key);
          setOpen(false);
        }
      }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["createElement"])("span", null, categories[key]), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["createElement"])("span", {
        className: "count"
      }, count[key])));
    })))));
  };

  return Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["createElement"])("div", {
    className: "header-form"
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["createElement"])("div", {
    className: "search"
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["createElement"])("img", {
    src: tiobDash.assets + '/search.svg',
    alt: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__["__"])('Search Icon')
  }), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["createElement"])("input", {
    onChange: function onChange(e) {
      onSearch(e.target.value);
    },
    type: "search",
    value: query,
    placeholder: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__["__"])('Search for a starter site', 'neve') + '...'
  }), renderCategoriesDropdown()));
};

/* harmony default export */ __webpack_exports__["default"] = (Object(_wordpress_compose__WEBPACK_IMPORTED_MODULE_5__["compose"])(Object(_wordpress_data__WEBPACK_IMPORTED_MODULE_4__["withSelect"])(function (select) {
  var _select = select('neve-onboarding'),
      getCurrentCategory = _select.getCurrentCategory;

  return {
    category: getCurrentCategory()
  };
}), Object(_wordpress_data__WEBPACK_IMPORTED_MODULE_4__["withDispatch"])(function (dispatch) {
  var _dispatch = dispatch('neve-onboarding'),
      _setCurrentCategory = _dispatch.setCurrentCategory;

  return {
    setCurrentCategory: function setCurrentCategory(category) {
      return _setCurrentCategory(category);
    }
  };
}))(Search));

/***/ }),

/***/ "./assets/src/Components/StarterSiteCard.js":
/*!**************************************************!*\
  !*** ./assets/src/Components/StarterSiteCard.js ***!
  \**************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "./node_modules/@babel/runtime/helpers/slicedToArray.js");
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_4__);







var StarterSiteCard = function StarterSiteCard(_ref) {
  var data = _ref.data,
      setSite = _ref.setSite,
      setPreview = _ref.setPreview,
      setModal = _ref.setModal;
  var upsell = data.upsell;

  var _useState = Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["useState"])(''),
      _useState2 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default()(_useState, 2),
      actionsClass = _useState2[0],
      setActionClass = _useState2[1];

  var showActions = function showActions() {
    setActionClass('visible');
  };

  var hideActions = function hideActions() {
    setActionClass('');
  };

  return Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["createElement"])("div", {
    onMouseEnter: showActions,
    onMouseLeave: hideActions,
    className: "card starter-site-card"
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["createElement"])("div", {
    className: "top"
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["createElement"])("div", {
    className: 'actions ' + actionsClass
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__["Button"], {
    className: "preview",
    onClick: function onClick(e) {
      e.preventDefault();
      setSite(data);
      setPreview(true);
    }
  }, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__["__"])('Preview', 'neve')), !upsell && Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__["Button"], {
    className: "import",
    onClick: function onClick(e) {
      e.preventDefault();
      setSite(data);
      setModal(true);
    }
  }, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__["__"])('Import', 'neve'))), data.screenshot && Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["createElement"])("div", {
    className: "image",
    style: {
      backgroundImage: "url(\"".concat(data.screenshot, "\")")
    }
  })), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["createElement"])("div", {
    className: "bottom"
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["createElement"])("p", {
    className: "title"
  }, data.title), upsell && Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["createElement"])("span", {
    className: "pro-badge"
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["createElement"])(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__["Dashicon"], {
    icon: "lock",
    size: 15
  }), Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__["createElement"])("span", null, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__["__"])('Premium', 'neve')))));
};

/* harmony default export */ __webpack_exports__["default"] = (Object(_wordpress_data__WEBPACK_IMPORTED_MODULE_4__["withDispatch"])(function (dispatch) {
  var _dispatch = dispatch('neve-onboarding'),
      setCurrentSite = _dispatch.setCurrentSite,
      setPreviewStatus = _dispatch.setPreviewStatus,
      setImportModalStatus = _dispatch.setImportModalStatus;

  return {
    setSite: function setSite(data) {
      return setCurrentSite(data);
    },
    setPreview: function setPreview(status) {
      return setPreviewStatus(status);
    },
    setModal: function setModal(status) {
      return setImportModalStatus(status);
    }
  };
})(StarterSiteCard));

/***/ }),

/***/ "./assets/src/app.js":
/*!***************************!*\
  !*** ./assets/src/app.js ***!
  \***************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./style.scss */ "./assets/src/style.scss");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_style_scss__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _store_reducer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./store/reducer */ "./assets/src/store/reducer.js");
/* harmony import */ var _store_actions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./store/actions */ "./assets/src/store/actions.js");
/* harmony import */ var _store_selectors__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./store/selectors */ "./assets/src/store/selectors.js");
/* harmony import */ var _Components_Main__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Components/Main */ "./assets/src/Components/Main.js");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_6__);








Object(_wordpress_data__WEBPACK_IMPORTED_MODULE_6__["registerStore"])('neve-onboarding', {
  reducer: _store_reducer__WEBPACK_IMPORTED_MODULE_2__["default"],
  actions: _store_actions__WEBPACK_IMPORTED_MODULE_3__["default"],
  selectors: _store_selectors__WEBPACK_IMPORTED_MODULE_4__["default"]
});

var Root = function Root() {
  return Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])("div", {
    className: "tiob-wrap"
  }, Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(_Components_Main__WEBPACK_IMPORTED_MODULE_5__["default"], null));
};

Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["render"])(Object(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__["createElement"])(Root, null), document.getElementById('tpc-app'));

/***/ }),

/***/ "./assets/src/store/actions.js":
/*!*************************************!*\
  !*** ./assets/src/store/actions.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  refreshSites: function refreshSites(sites) {
    return {
      type: 'REFRESH_SITES',
      payload: {
        sites: sites
      }
    };
  },
  setCurrentEditor: function setCurrentEditor(editor) {
    return {
      type: 'SET_CURRENT_EDITOR',
      payload: {
        editor: editor
      }
    };
  },
  setCurrentCategory: function setCurrentCategory(category) {
    return {
      type: 'SET_CURRENT_CATEGORY',
      payload: {
        category: category
      }
    };
  },
  setCurrentSite: function setCurrentSite(siteData) {
    return {
      type: 'SET_FOCUSED_SITE',
      payload: {
        siteData: siteData
      }
    };
  },
  setPreviewStatus: function setPreviewStatus(previewStatus) {
    if (previewStatus) {
      document.body.classList.add('ob-overflow-off');
    } else {
      document.body.classList.remove('ob-overflow-off');
    }

    return {
      type: 'SET_PREVIEW_STATUS',
      payload: {
        previewStatus: previewStatus
      }
    };
  },
  setImportModalStatus: function setImportModalStatus(importModalStatus) {
    if (importModalStatus) {
      document.body.classList.add('ob-overflow-off');
    } else {
      document.body.classList.remove('ob-overflow-off');
    }

    return {
      type: 'SET_IMPORT_MODAL_STATUS',
      payload: {
        importModalStatus: importModalStatus
      }
    };
  },
  setOnboardingState: function setOnboardingState(state) {
    return {
      type: 'SET_ONBOARDING',
      payload: {
        state: state
      }
    };
  }
});

/***/ }),

/***/ "./assets/src/store/reducer.js":
/*!*************************************!*\
  !*** ./assets/src/store/reducer.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/defineProperty.js");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__);


function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/* global tiobDash  */
var _tiobDash = tiobDash,
    onboarding = _tiobDash.onboarding;
var firstEditor = 'undefined' !== typeof onboarding.sites && 'undefined' !== typeof onboarding.sites.sites ? Object.keys(onboarding.sites.sites)[0] : 'gutenberg';
var selectedEditor = localStorage.getItem('neve-onboarding-editor') || firstEditor;
var initialState = {
  sites: onboarding.sites || {},
  editor: selectedEditor,
  category: 'all',
  previewStatus: false,
  importModalStatus: false,
  currentSite: null,
  importing: false,
  isOnboarding: onboarding.onboarding || false,
  migrationData: null
};
/* harmony default export */ __webpack_exports__["default"] = (function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case 'REFRESH_SITES':
      var sites = action.payload.sites;
      return _objectSpread(_objectSpread({}, state), {}, {
        sites: sites
      });

    case 'SET_CURRENT_EDITOR':
      var editor = action.payload.editor;
      localStorage.setItem('neve-onboarding-editor', editor);
      return _objectSpread(_objectSpread({}, state), {}, {
        editor: editor
      });

    case 'SET_CURRENT_CATEGORY':
      var category = action.payload.category;
      return _objectSpread(_objectSpread({}, state), {}, {
        category: category
      });

    case 'SET_FOCUSED_SITE':
      var siteData = action.payload.siteData;
      return _objectSpread(_objectSpread({}, state), {}, {
        currentSite: siteData
      });

    case 'SET_PREVIEW_STATUS':
      var previewStatus = action.payload.previewStatus;
      return _objectSpread(_objectSpread({}, state), {}, {
        previewStatus: previewStatus
      });

    case 'SET_IMPORT_MODAL_STATUS':
      var importModalStatus = action.payload.importModalStatus;
      return _objectSpread(_objectSpread({}, state), {}, {
        importModalStatus: importModalStatus
      });

    case 'SET_ONBOARDING':
      var status = action.payload.status;
      return _objectSpread(_objectSpread({}, state), {}, {
        isOnboarding: status
      });
  }

  return state;
});

/***/ }),

/***/ "./assets/src/store/selectors.js":
/*!***************************************!*\
  !*** ./assets/src/store/selectors.js ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  getSites: function getSites(state) {
    return state.sites;
  },
  getMigrationData: function getMigrationData(state) {
    return state.migrationData;
  },
  getCurrentEditor: function getCurrentEditor(state) {
    return state.editor;
  },
  getCurrentCategory: function getCurrentCategory(state) {
    return state.category;
  },
  getCurrentSite: function getCurrentSite(state) {
    return state.currentSite;
  },
  getPreviewStatus: function getPreviewStatus(state) {
    return state.previewStatus;
  },
  getImportModalStatus: function getImportModalStatus(state) {
    return state.importModalStatus;
  },
  getOnboardingStatus: function getOnboardingStatus(state) {
    return state.isOnboarding;
  }
});

/***/ }),

/***/ "./assets/src/utils/common.js":
/*!************************************!*\
  !*** ./assets/src/utils/common.js ***!
  \************************************/
/*! exports provided: trailingSlashIt */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "trailingSlashIt", function() { return trailingSlashIt; });
/* global tiobDash */
var untrailingSlashIt = function untrailingSlashIt(str) {
  return str.replace(/\/$/, '');
};

var trailingSlashIt = function trailingSlashIt(str) {
  return untrailingSlashIt(str) + '/';
};



/***/ }),

/***/ "./assets/src/utils/rest.js":
/*!**********************************!*\
  !*** ./assets/src/utils/rest.js ***!
  \**********************************/
/*! exports provided: fetchOptions, changeOption, send, get */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fetchOptions", function() { return fetchOptions; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "changeOption", function() { return changeOption; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "send", function() { return send; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "get", function() { return get; });
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ "@babel/runtime/regenerator");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "./node_modules/@babel/runtime/helpers/asyncToGenerator.js");
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/defineProperty.js");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_api__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/api */ "@wordpress/api");
/* harmony import */ var _wordpress_api__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_api__WEBPACK_IMPORTED_MODULE_4__);





var fetchOptions = function fetchOptions() {
  var settings;
  return _wordpress_api__WEBPACK_IMPORTED_MODULE_4__["loadPromise"].then(function () {
    settings = new _wordpress_api__WEBPACK_IMPORTED_MODULE_4__["models"].Settings();
    return settings.fetch();
  });
};
var changeOption = function changeOption(option, value) {
  var module = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var pro = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
  option = (pro ? 'nv_pro_' : '') + option + (module ? '_status' : '');
  var model = new _wordpress_api__WEBPACK_IMPORTED_MODULE_4__["models"].Settings(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_2___default()({}, option, value));
  return new Promise(function (resolve) {
    model.save().then(function (r) {
      if (!r || !r[option] === value) {
        resolve({
          success: false
        });
      }

      resolve(isValid(option, r));
    });
  });
};
var send = function send(route, data) {
  var simple = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  return requestData(route, simple, data);
};
var get = function get(route) {
  var simple = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var useNonce = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  return requestData(route, simple, {}, 'GET', useNonce);
};

var requestData = /*#__PURE__*/function () {
  var _ref = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee(route) {
    var simple,
        data,
        method,
        useNonce,
        options,
        _args = arguments;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            simple = _args.length > 1 && _args[1] !== undefined ? _args[1] : false;
            data = _args.length > 2 && _args[2] !== undefined ? _args[2] : {};
            method = _args.length > 3 && _args[3] !== undefined ? _args[3] : 'POST';
            useNonce = _args.length > 4 && _args[4] !== undefined ? _args[4] : true;
            options = {
              method: method,
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
              }
            };

            if (useNonce) {
              options.headers['x-wp-nonce'] = tiobDash.nonce;
            }

            if ('POST' === method) {
              options.body = JSON.stringify(data);
            }

            _context.next = 9;
            return fetch(route, options).then(function (response) {
              return simple ? response : response.json();
            });

          case 9:
            return _context.abrupt("return", _context.sent);

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function requestData(_x) {
    return _ref.apply(this, arguments);
  };
}();

var isValid = function isValid(option, optionsArray) {
  if ('nv_pro_typekit_id' === option) {
    if (!optionsArray.neve_pro_typekit_data) {
      return {
        message: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__["__"])('Typekit Project ID is invalid', 'neve'),
        success: false
      };
    }
  }

  return {
    success: true
  };
};

/***/ }),

/***/ "./assets/src/utils/site-import.js":
/*!*****************************************!*\
  !*** ./assets/src/utils/site-import.js ***!
  \*****************************************/
/*! exports provided: importWidgets, importMods, installPlugins, importContent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "importWidgets", function() { return importWidgets; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "importMods", function() { return importMods; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "installPlugins", function() { return installPlugins; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "importContent", function() { return importContent; });
/* harmony import */ var _rest__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./rest */ "./assets/src/utils/rest.js");
/* global tiobDash */
var _tiobDash = tiobDash,
    onboarding = _tiobDash.onboarding;

var importWidgets = function importWidgets(data) {
  return Object(_rest__WEBPACK_IMPORTED_MODULE_0__["send"])(onboarding.root + '/import_widgets', data);
};
var importMods = function importMods(data) {
  return Object(_rest__WEBPACK_IMPORTED_MODULE_0__["send"])(onboarding.root + '/import_theme_mods', data);
};
var installPlugins = function installPlugins(pluginArray) {
  return Object(_rest__WEBPACK_IMPORTED_MODULE_0__["send"])(onboarding.root + '/install_plugins', pluginArray);
};
var importContent = function importContent(data) {
  return Object(_rest__WEBPACK_IMPORTED_MODULE_0__["send"])(onboarding.root + '/import_content', data);
};

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/arrayLikeToArray.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/arrayLikeToArray.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

module.exports = _arrayLikeToArray;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/arrayWithHoles.js":
/*!***************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/arrayWithHoles.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

module.exports = _arrayWithHoles;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/arrayWithoutHoles.js":
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/arrayWithoutHoles.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var arrayLikeToArray = __webpack_require__(/*! ./arrayLikeToArray */ "./node_modules/@babel/runtime/helpers/arrayLikeToArray.js");

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return arrayLikeToArray(arr);
}

module.exports = _arrayWithoutHoles;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/asyncToGenerator.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/asyncToGenerator.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

module.exports = _asyncToGenerator;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/defineProperty.js":
/*!***************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/defineProperty.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

module.exports = _defineProperty;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/iterableToArray.js":
/*!****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/iterableToArray.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

module.exports = _iterableToArray;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/iterableToArrayLimit.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/iterableToArrayLimit.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

module.exports = _iterableToArrayLimit;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/nonIterableRest.js":
/*!****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/nonIterableRest.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

module.exports = _nonIterableRest;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/nonIterableSpread.js":
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/nonIterableSpread.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

module.exports = _nonIterableSpread;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/slicedToArray.js":
/*!**************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/slicedToArray.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var arrayWithHoles = __webpack_require__(/*! ./arrayWithHoles */ "./node_modules/@babel/runtime/helpers/arrayWithHoles.js");

var iterableToArrayLimit = __webpack_require__(/*! ./iterableToArrayLimit */ "./node_modules/@babel/runtime/helpers/iterableToArrayLimit.js");

var unsupportedIterableToArray = __webpack_require__(/*! ./unsupportedIterableToArray */ "./node_modules/@babel/runtime/helpers/unsupportedIterableToArray.js");

var nonIterableRest = __webpack_require__(/*! ./nonIterableRest */ "./node_modules/@babel/runtime/helpers/nonIterableRest.js");

function _slicedToArray(arr, i) {
  return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || unsupportedIterableToArray(arr, i) || nonIterableRest();
}

module.exports = _slicedToArray;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/toConsumableArray.js":
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/toConsumableArray.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var arrayWithoutHoles = __webpack_require__(/*! ./arrayWithoutHoles */ "./node_modules/@babel/runtime/helpers/arrayWithoutHoles.js");

var iterableToArray = __webpack_require__(/*! ./iterableToArray */ "./node_modules/@babel/runtime/helpers/iterableToArray.js");

var unsupportedIterableToArray = __webpack_require__(/*! ./unsupportedIterableToArray */ "./node_modules/@babel/runtime/helpers/unsupportedIterableToArray.js");

var nonIterableSpread = __webpack_require__(/*! ./nonIterableSpread */ "./node_modules/@babel/runtime/helpers/nonIterableSpread.js");

function _toConsumableArray(arr) {
  return arrayWithoutHoles(arr) || iterableToArray(arr) || unsupportedIterableToArray(arr) || nonIterableSpread();
}

module.exports = _toConsumableArray;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/unsupportedIterableToArray.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/unsupportedIterableToArray.js ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var arrayLikeToArray = __webpack_require__(/*! ./arrayLikeToArray */ "./node_modules/@babel/runtime/helpers/arrayLikeToArray.js");

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return arrayLikeToArray(o, minLen);
}

module.exports = _unsupportedIterableToArray;

/***/ }),

/***/ "./node_modules/classnames/index.js":
/*!******************************************!*\
  !*** ./node_modules/classnames/index.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
  Copyright (c) 2017 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames () {
		var classes = [];

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes.push(arg);
			} else if (Array.isArray(arg) && arg.length) {
				var inner = classNames.apply(null, arg);
				if (inner) {
					classes.push(inner);
				}
			} else if (argType === 'object') {
				for (var key in arg) {
					if (hasOwn.call(arg, key) && arg[key]) {
						classes.push(key);
					}
				}
			}
		}

		return classes.join(' ');
	}

	if ( true && module.exports) {
		classNames.default = classNames;
		module.exports = classNames;
	} else if (true) {
		// register as 'classnames', consistent with npm package name
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
			return classNames;
		}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {}
}());


/***/ }),

/***/ "./node_modules/fuse.js/dist/fuse.min.js":
/*!***********************************************!*\
  !*** ./node_modules/fuse.js/dist/fuse.min.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Fuse.js v6.4.1 - Lightweight fuzzy-search (http://fusejs.io)
 *
 * Copyright (c) 2020 Kiro Risk (http://kiro.me)
 * All Rights Reserved. Apache Software License 2.0
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */
var e,t;e=this,t=function(){"use strict";function e(t){return(e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(t)}function t(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function n(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function r(e,t,r){return t&&n(e.prototype,t),r&&n(e,r),e}function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function c(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&u(e,t)}function s(e){return(s=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function u(e,t){return(u=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function h(e,t){return!t||"object"!=typeof t&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function f(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=s(e);if(t){var i=s(this).constructor;n=Reflect.construct(r,arguments,i)}else n=r.apply(this,arguments);return h(this,n)}}function l(e){return function(e){if(Array.isArray(e))return d(e)}(e)||function(e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}(e)||function(e,t){if(e){if("string"==typeof e)return d(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?d(e,t):void 0}}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function d(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function v(e){return Array.isArray?Array.isArray(e):"[object Array]"===x(e)}function g(e){return"string"==typeof e}function y(e){return"number"==typeof e}function p(e){return!0===e||!1===e||function(e){return m(e)&&null!==e}(e)&&"[object Boolean]"==x(e)}function m(t){return"object"===e(t)}function k(e){return null!=e}function M(e){return!e.trim().length}function x(e){return null==e?void 0===e?"[object Undefined]":"[object Null]":Object.prototype.toString.call(e)}var b=function(e){return"Invalid value for key ".concat(e)},S=function(e){return"Pattern length exceeds max of ".concat(e,".")},_=Object.prototype.hasOwnProperty,w=function(){function e(n){var r=this;t(this,e),this._keys=[],this._keyMap={};var i=0;n.forEach((function(e){var t=L(e);i+=t.weight,r._keys.push(t),r._keyMap[t.id]=t,i+=t.weight})),this._keys.forEach((function(e){e.weight/=i}))}return r(e,[{key:"get",value:function(e){return this._keyMap[e]}},{key:"keys",value:function(){return this._keys}},{key:"toJSON",value:function(){return JSON.stringify(this._keys)}}]),e}();function L(e){var t=null,n=null,r=null,i=1;if(g(e)||v(e))r=e,t=O(e),n=j(e);else{if(!_.call(e,"name"))throw new Error(function(e){return"Missing ".concat(e," property in key")}("name"));var o=e.name;if(r=o,_.call(e,"weight")&&(i=e.weight)<=0)throw new Error(function(e){return"Property 'weight' in key '".concat(e,"' must be a positive integer")}(o));t=O(o),n=j(o)}return{path:t,id:n,weight:i,src:r}}function O(e){return v(e)?e:e.split(".")}function j(e){return v(e)?e.join("."):e}var A=c({},{isCaseSensitive:!1,includeScore:!1,keys:[],shouldSort:!0,sortFn:function(e,t){return e.score===t.score?e.idx<t.idx?-1:1:e.score<t.score?-1:1}},{},{includeMatches:!1,findAllMatches:!1,minMatchCharLength:1},{},{location:0,threshold:.6,distance:100},{},{useExtendedSearch:!1,getFn:function(e,t){var n=[],r=!1;return function e(t,i,o){if(i[o]){var c=t[i[o]];if(!k(c))return;if(o===i.length-1&&(g(c)||y(c)||p(c)))n.push(function(e){return null==e?"":function(e){if("string"==typeof e)return e;var t=e+"";return"0"==t&&1/e==-1/0?"-0":t}(e)}(c));else if(v(c)){r=!0;for(var a=0,s=c.length;a<s;a+=1)e(c[a],i,o+1)}else i.length&&e(c,i,o+1)}else n.push(t)}(e,g(t)?t.split("."):t,0),r?n:n[0]},ignoreLocation:!1,ignoreFieldNorm:!1}),I=/[^ ]+/g;function C(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:3,t=new Map;return{get:function(n){var r=n.match(I).length;if(t.has(r))return t.get(r);var i=parseFloat((1/Math.sqrt(r)).toFixed(e));return t.set(r,i),i},clear:function(){t.clear()}}}var E=function(){function e(){var n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},r=n.getFn,i=void 0===r?A.getFn:r;t(this,e),this.norm=C(3),this.getFn=i,this.isCreated=!1,this.setIndexRecords()}return r(e,[{key:"setSources",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];this.docs=e}},{key:"setIndexRecords",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];this.records=e}},{key:"setKeys",value:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];this.keys=t,this._keysMap={},t.forEach((function(t,n){e._keysMap[t.id]=n}))}},{key:"create",value:function(){var e=this;!this.isCreated&&this.docs.length&&(this.isCreated=!0,g(this.docs[0])?this.docs.forEach((function(t,n){e._addString(t,n)})):this.docs.forEach((function(t,n){e._addObject(t,n)})),this.norm.clear())}},{key:"add",value:function(e){var t=this.size();g(e)?this._addString(e,t):this._addObject(e,t)}},{key:"removeAt",value:function(e){this.records.splice(e,1);for(var t=e,n=this.size();t<n;t+=1)this.records[t].i-=1}},{key:"getValueForItemAtKeyId",value:function(e,t){return e[this._keysMap[t]]}},{key:"size",value:function(){return this.records.length}},{key:"_addString",value:function(e,t){if(k(e)&&!M(e)){var n={v:e,i:t,n:this.norm.get(e)};this.records.push(n)}}},{key:"_addObject",value:function(e,t){var n=this,r={i:t,$:{}};this.keys.forEach((function(t,i){var o=n.getFn(e,t.path);if(k(o))if(v(o))!function(){for(var e=[],t=[{nestedArrIndex:-1,value:o}];t.length;){var c=t.pop(),a=c.nestedArrIndex,s=c.value;if(k(s))if(g(s)&&!M(s)){var u={v:s,i:a,n:n.norm.get(s)};e.push(u)}else v(s)&&s.forEach((function(e,n){t.push({nestedArrIndex:n,value:e})}))}r.$[i]=e}();else if(!M(o)){var c={v:o,n:n.norm.get(o)};r.$[i]=c}})),this.records.push(r)}},{key:"toJSON",value:function(){return{keys:this.keys,records:this.records}}}]),e}();function $(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},r=n.getFn,i=void 0===r?A.getFn:r,o=new E({getFn:i});return o.setKeys(e.map(L)),o.setSources(t),o.create(),o}function R(e,t){var n=e.matches;t.matches=[],k(n)&&n.forEach((function(e){if(k(e.indices)&&e.indices.length){var n={indices:e.indices,value:e.value};e.key&&(n.key=e.key.src),e.idx>-1&&(n.refIndex=e.idx),t.matches.push(n)}}))}function F(e,t){t.score=e.score}function P(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=t.errors,r=void 0===n?0:n,i=t.currentLocation,o=void 0===i?0:i,c=t.expectedLocation,a=void 0===c?0:c,s=t.distance,u=void 0===s?A.distance:s,h=t.ignoreLocation,f=void 0===h?A.ignoreLocation:h,l=r/e.length;if(f)return l;var d=Math.abs(a-o);return u?l+d/u:d?1:l}function N(){for(var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:A.minMatchCharLength,n=[],r=-1,i=-1,o=0,c=e.length;o<c;o+=1){var a=e[o];a&&-1===r?r=o:a||-1===r||((i=o-1)-r+1>=t&&n.push([r,i]),r=-1)}return e[o-1]&&o-r>=t&&n.push([r,o-1]),n}function D(e){for(var t={},n=0,r=e.length;n<r;n+=1){var i=e.charAt(n);t[i]=(t[i]||0)|1<<r-n-1}return t}var z=function(){function e(n){var r=this,i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},o=i.location,c=void 0===o?A.location:o,a=i.threshold,s=void 0===a?A.threshold:a,u=i.distance,h=void 0===u?A.distance:u,f=i.includeMatches,l=void 0===f?A.includeMatches:f,d=i.findAllMatches,v=void 0===d?A.findAllMatches:d,g=i.minMatchCharLength,y=void 0===g?A.minMatchCharLength:g,p=i.isCaseSensitive,m=void 0===p?A.isCaseSensitive:p,k=i.ignoreLocation,M=void 0===k?A.ignoreLocation:k;if(t(this,e),this.options={location:c,threshold:s,distance:h,includeMatches:l,findAllMatches:v,minMatchCharLength:y,isCaseSensitive:m,ignoreLocation:M},this.pattern=m?n:n.toLowerCase(),this.chunks=[],this.pattern.length){var x=function(e,t){r.chunks.push({pattern:e,alphabet:D(e),startIndex:t})},b=this.pattern.length;if(b>32){for(var S=0,_=b%32,w=b-_;S<w;)x(this.pattern.substr(S,32),S),S+=32;if(_){var L=b-32;x(this.pattern.substr(L),L)}}else x(this.pattern,0)}}return r(e,[{key:"searchIn",value:function(e){var t=this.options,n=t.isCaseSensitive,r=t.includeMatches;if(n||(e=e.toLowerCase()),this.pattern===e){var i={isMatch:!0,score:0};return r&&(i.indices=[[0,e.length-1]]),i}var o=this.options,c=o.location,a=o.distance,s=o.threshold,u=o.findAllMatches,h=o.minMatchCharLength,f=o.ignoreLocation,d=[],v=0,g=!1;this.chunks.forEach((function(t){var n=t.pattern,i=t.alphabet,o=t.startIndex,y=function(e,t,n){var r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{},i=r.location,o=void 0===i?A.location:i,c=r.distance,a=void 0===c?A.distance:c,s=r.threshold,u=void 0===s?A.threshold:s,h=r.findAllMatches,f=void 0===h?A.findAllMatches:h,l=r.minMatchCharLength,d=void 0===l?A.minMatchCharLength:l,v=r.includeMatches,g=void 0===v?A.includeMatches:v,y=r.ignoreLocation,p=void 0===y?A.ignoreLocation:y;if(t.length>32)throw new Error(S(32));for(var m,k=t.length,M=e.length,x=Math.max(0,Math.min(o,M)),b=u,_=x,w=d>1||g,L=w?Array(M):[];(m=e.indexOf(t,_))>-1;){var O=P(t,{currentLocation:m,expectedLocation:x,distance:a,ignoreLocation:p});if(b=Math.min(O,b),_=m+k,w)for(var j=0;j<k;)L[m+j]=1,j+=1}_=-1;for(var I=[],C=1,E=k+M,$=1<<k-1,R=0;R<k;R+=1){for(var F=0,D=E;F<D;){var z=P(t,{errors:R,currentLocation:x+D,expectedLocation:x,distance:a,ignoreLocation:p});z<=b?F=D:E=D,D=Math.floor((E-F)/2+F)}E=D;var K=Math.max(1,x-D+1),q=f?M:Math.min(x+D,M)+k,W=Array(q+2);W[q+1]=(1<<R)-1;for(var J=q;J>=K;J-=1){var T=J-1,U=n[e.charAt(T)];if(w&&(L[T]=+!!U),W[J]=(W[J+1]<<1|1)&U,R&&(W[J]|=(I[J+1]|I[J])<<1|1|I[J+1]),W[J]&$&&(C=P(t,{errors:R,currentLocation:T,expectedLocation:x,distance:a,ignoreLocation:p}))<=b){if(b=C,(_=T)<=x)break;K=Math.max(1,2*x-_)}}var V=P(t,{errors:R+1,currentLocation:x,expectedLocation:x,distance:a,ignoreLocation:p});if(V>b)break;I=W}var B={isMatch:_>=0,score:Math.max(.001,C)};if(w){var G=N(L,d);G.length?g&&(B.indices=G):B.isMatch=!1}return B}(e,n,i,{location:c+o,distance:a,threshold:s,findAllMatches:u,minMatchCharLength:h,includeMatches:r,ignoreLocation:f}),p=y.isMatch,m=y.score,k=y.indices;p&&(g=!0),v+=m,p&&k&&(d=[].concat(l(d),l(k)))}));var y={isMatch:g,score:g?v/this.chunks.length:1};return g&&r&&(y.indices=d),y}}]),e}(),K=function(){function e(n){t(this,e),this.pattern=n}return r(e,[{key:"search",value:function(){}}],[{key:"isMultiMatch",value:function(e){return q(e,this.multiRegex)}},{key:"isSingleMatch",value:function(e){return q(e,this.singleRegex)}}]),e}();function q(e,t){var n=e.match(t);return n?n[1]:null}var W=function(e){a(i,e);var n=f(i);function i(e){return t(this,i),n.call(this,e)}return r(i,[{key:"search",value:function(e){var t=e===this.pattern;return{isMatch:t,score:t?0:1,indices:[0,this.pattern.length-1]}}}],[{key:"type",get:function(){return"exact"}},{key:"multiRegex",get:function(){return/^="(.*)"$/}},{key:"singleRegex",get:function(){return/^=(.*)$/}}]),i}(K),J=function(e){a(i,e);var n=f(i);function i(e){return t(this,i),n.call(this,e)}return r(i,[{key:"search",value:function(e){var t=-1===e.indexOf(this.pattern);return{isMatch:t,score:t?0:1,indices:[0,e.length-1]}}}],[{key:"type",get:function(){return"inverse-exact"}},{key:"multiRegex",get:function(){return/^!"(.*)"$/}},{key:"singleRegex",get:function(){return/^!(.*)$/}}]),i}(K),T=function(e){a(i,e);var n=f(i);function i(e){return t(this,i),n.call(this,e)}return r(i,[{key:"search",value:function(e){var t=e.startsWith(this.pattern);return{isMatch:t,score:t?0:1,indices:[0,this.pattern.length-1]}}}],[{key:"type",get:function(){return"prefix-exact"}},{key:"multiRegex",get:function(){return/^\^"(.*)"$/}},{key:"singleRegex",get:function(){return/^\^(.*)$/}}]),i}(K),U=function(e){a(i,e);var n=f(i);function i(e){return t(this,i),n.call(this,e)}return r(i,[{key:"search",value:function(e){var t=!e.startsWith(this.pattern);return{isMatch:t,score:t?0:1,indices:[0,e.length-1]}}}],[{key:"type",get:function(){return"inverse-prefix-exact"}},{key:"multiRegex",get:function(){return/^!\^"(.*)"$/}},{key:"singleRegex",get:function(){return/^!\^(.*)$/}}]),i}(K),V=function(e){a(i,e);var n=f(i);function i(e){return t(this,i),n.call(this,e)}return r(i,[{key:"search",value:function(e){var t=e.endsWith(this.pattern);return{isMatch:t,score:t?0:1,indices:[e.length-this.pattern.length,e.length-1]}}}],[{key:"type",get:function(){return"suffix-exact"}},{key:"multiRegex",get:function(){return/^"(.*)"\$$/}},{key:"singleRegex",get:function(){return/^(.*)\$$/}}]),i}(K),B=function(e){a(i,e);var n=f(i);function i(e){return t(this,i),n.call(this,e)}return r(i,[{key:"search",value:function(e){var t=!e.endsWith(this.pattern);return{isMatch:t,score:t?0:1,indices:[0,e.length-1]}}}],[{key:"type",get:function(){return"inverse-suffix-exact"}},{key:"multiRegex",get:function(){return/^!"(.*)"\$$/}},{key:"singleRegex",get:function(){return/^!(.*)\$$/}}]),i}(K),G=function(e){a(i,e);var n=f(i);function i(e){var r,o=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},c=o.location,a=void 0===c?A.location:c,s=o.threshold,u=void 0===s?A.threshold:s,h=o.distance,f=void 0===h?A.distance:h,l=o.includeMatches,d=void 0===l?A.includeMatches:l,v=o.findAllMatches,g=void 0===v?A.findAllMatches:v,y=o.minMatchCharLength,p=void 0===y?A.minMatchCharLength:y,m=o.isCaseSensitive,k=void 0===m?A.isCaseSensitive:m;return t(this,i),(r=n.call(this,e))._bitapSearch=new z(e,{location:a,threshold:u,distance:f,includeMatches:d,findAllMatches:g,minMatchCharLength:p,isCaseSensitive:k}),r}return r(i,[{key:"search",value:function(e){return this._bitapSearch.searchIn(e)}}],[{key:"type",get:function(){return"fuzzy"}},{key:"multiRegex",get:function(){return/^"(.*)"$/}},{key:"singleRegex",get:function(){return/^(.*)$/}}]),i}(K),H=function(e){a(i,e);var n=f(i);function i(e){return t(this,i),n.call(this,e)}return r(i,[{key:"search",value:function(e){for(var t,n=0,r=[],i=this.pattern.length;(t=e.indexOf(this.pattern,n))>-1;)n=t+i,r.push([t,n-1]);var o=!!r.length;return{isMatch:o,score:o?1:0,indices:r}}}],[{key:"type",get:function(){return"include"}},{key:"multiRegex",get:function(){return/^'"(.*)"$/}},{key:"singleRegex",get:function(){return/^'(.*)$/}}]),i}(K),Q=[W,H,T,U,B,V,J,G],X=Q.length,Y=/ +(?=([^\"]*\"[^\"]*\")*[^\"]*$)/;function Z(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return e.split("|").map((function(e){for(var n=e.trim().split(Y).filter((function(e){return e&&!!e.trim()})),r=[],i=0,o=n.length;i<o;i+=1){for(var c=n[i],a=!1,s=-1;!a&&++s<X;){var u=Q[s],h=u.isMultiMatch(c);h&&(r.push(new u(h,t)),a=!0)}if(!a)for(s=-1;++s<X;){var f=Q[s],l=f.isSingleMatch(c);if(l){r.push(new f(l,t));break}}}return r}))}var ee=new Set([G.type,H.type]),te=function(){function e(n){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},i=r.isCaseSensitive,o=void 0===i?A.isCaseSensitive:i,c=r.includeMatches,a=void 0===c?A.includeMatches:c,s=r.minMatchCharLength,u=void 0===s?A.minMatchCharLength:s,h=r.findAllMatches,f=void 0===h?A.findAllMatches:h,l=r.location,d=void 0===l?A.location:l,v=r.threshold,g=void 0===v?A.threshold:v,y=r.distance,p=void 0===y?A.distance:y;t(this,e),this.query=null,this.options={isCaseSensitive:o,includeMatches:a,minMatchCharLength:u,findAllMatches:f,location:d,threshold:g,distance:p},this.pattern=o?n:n.toLowerCase(),this.query=Z(this.pattern,this.options)}return r(e,[{key:"searchIn",value:function(e){var t=this.query;if(!t)return{isMatch:!1,score:1};var n=this.options,r=n.includeMatches;e=n.isCaseSensitive?e:e.toLowerCase();for(var i=0,o=[],c=0,a=0,s=t.length;a<s;a+=1){var u=t[a];o.length=0,i=0;for(var h=0,f=u.length;h<f;h+=1){var d=u[h],v=d.search(e),g=v.isMatch,y=v.indices,p=v.score;if(!g){c=0,i=0,o.length=0;break}if(i+=1,c+=p,r){var m=d.constructor.type;ee.has(m)?o=[].concat(l(o),l(y)):o.push(y)}}if(i){var k={isMatch:!0,score:c/i};return r&&(k.indices=o),k}}return{isMatch:!1,score:1}}}],[{key:"condition",value:function(e,t){return t.useExtendedSearch}}]),e}(),ne=[];function re(e,t){for(var n=0,r=ne.length;n<r;n+=1){var i=ne[n];if(i.condition(e,t))return new i(e,t)}return new z(e,t)}var ie="$and",oe="$or",ce="$path",ae="$val",se=function(e){return!(!e[ie]&&!e[oe])},ue=function(e){return!!e[ce]},he=function(e){return!v(e)&&m(e)&&!se(e)},fe=function(e){return i({},ie,Object.keys(e).map((function(t){return i({},t,e[t])})))},le=function(){function e(n){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},i=arguments.length>2?arguments[2]:void 0;t(this,e),this.options=c({},A,{},r),this.options.useExtendedSearch,this._keyStore=new w(this.options.keys),this.setCollection(n,i)}return r(e,[{key:"setCollection",value:function(e,t){if(this._docs=e,t&&!(t instanceof E))throw new Error("Incorrect 'index' type");this._myIndex=t||$(this.options.keys,this._docs,{getFn:this.options.getFn})}},{key:"add",value:function(e){k(e)&&(this._docs.push(e),this._myIndex.add(e))}},{key:"remove",value:function(){for(var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:function(){return!1},t=[],n=0,r=this._docs.length;n<r;n+=1){var i=this._docs[n];e(i,n)&&(this.removeAt(n),n-=1,t.push(i))}return t}},{key:"removeAt",value:function(e){this._docs.splice(e,1),this._myIndex.removeAt(e)}},{key:"getIndex",value:function(){return this._myIndex}},{key:"search",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=t.limit,r=void 0===n?-1:n,i=this.options,o=i.includeMatches,c=i.includeScore,a=i.shouldSort,s=i.sortFn,u=i.ignoreFieldNorm,h=g(e)?g(this._docs[0])?this._searchStringList(e):this._searchObjectList(e):this._searchLogical(e);return de(h,{ignoreFieldNorm:u}),a&&h.sort(s),y(r)&&r>-1&&(h=h.slice(0,r)),ve(h,this._docs,{includeMatches:o,includeScore:c})}},{key:"_searchStringList",value:function(e){var t=re(e,this.options),n=this._myIndex.records,r=[];return n.forEach((function(e){var n=e.v,i=e.i,o=e.n;if(k(n)){var c=t.searchIn(n),a=c.isMatch,s=c.score,u=c.indices;a&&r.push({item:n,idx:i,matches:[{score:s,value:n,norm:o,indices:u}]})}})),r}},{key:"_searchLogical",value:function(e){var t=this,n=function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},r=n.auto,i=void 0===r||r,o=function e(n){var r=Object.keys(n),o=ue(n);if(!o&&r.length>1&&!se(n))return e(fe(n));if(he(n)){var c=o?n[ce]:r[0],a=o?n[ae]:n[c];if(!g(a))throw new Error(b(c));var s={keyId:j(c),pattern:a};return i&&(s.searcher=re(a,t)),s}var u={children:[],operator:r[0]};return r.forEach((function(t){var r=n[t];v(r)&&r.forEach((function(t){u.children.push(e(t))}))})),u};return se(e)||(e=fe(e)),o(e)}(e,this.options),r=this._myIndex.records,i={},o=[];return r.forEach((function(e){var r=e.$,c=e.i;if(k(r)){var a=function e(n,r,i){if(!n.children){var o=n.keyId,c=n.searcher,a=t._findMatches({key:t._keyStore.get(o),value:t._myIndex.getValueForItemAtKeyId(r,o),searcher:c});return a&&a.length?[{idx:i,item:r,matches:a}]:[]}switch(n.operator){case ie:for(var s=[],u=0,h=n.children.length;u<h;u+=1){var f=e(n.children[u],r,i);if(!f.length)return[];s.push.apply(s,l(f))}return s;case oe:for(var d=[],v=0,g=n.children.length;v<g;v+=1){var y=e(n.children[v],r,i);if(y.length){d.push.apply(d,l(y));break}}return d}}(n,r,c);a.length&&(i[c]||(i[c]={idx:c,item:r,matches:[]},o.push(i[c])),a.forEach((function(e){var t,n=e.matches;(t=i[c].matches).push.apply(t,l(n))})))}})),o}},{key:"_searchObjectList",value:function(e){var t=this,n=re(e,this.options),r=this._myIndex,i=r.keys,o=r.records,c=[];return o.forEach((function(e){var r=e.$,o=e.i;if(k(r)){var a=[];i.forEach((function(e,i){a.push.apply(a,l(t._findMatches({key:e,value:r[i],searcher:n})))})),a.length&&c.push({idx:o,item:r,matches:a})}})),c}},{key:"_findMatches",value:function(e){var t=e.key,n=e.value,r=e.searcher;if(!k(n))return[];var i=[];if(v(n))n.forEach((function(e){var n=e.v,o=e.i,c=e.n;if(k(n)){var a=r.searchIn(n),s=a.isMatch,u=a.score,h=a.indices;s&&i.push({score:u,key:t,value:n,idx:o,norm:c,indices:h})}}));else{var o=n.v,c=n.n,a=r.searchIn(o),s=a.isMatch,u=a.score,h=a.indices;s&&i.push({score:u,key:t,value:o,norm:c,indices:h})}return i}}]),e}();function de(e,t){var n=t.ignoreFieldNorm,r=void 0===n?A.ignoreFieldNorm:n;e.forEach((function(e){var t=1;e.matches.forEach((function(e){var n=e.key,i=e.norm,o=e.score,c=n?n.weight:null;t*=Math.pow(0===o&&c?Number.EPSILON:o,(c||1)*(r?1:i))})),e.score=t}))}function ve(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},r=n.includeMatches,i=void 0===r?A.includeMatches:r,o=n.includeScore,c=void 0===o?A.includeScore:o,a=[];return i&&a.push(R),c&&a.push(F),e.map((function(e){var n=e.idx,r={item:t[n],refIndex:n};return a.length&&a.forEach((function(t){t(e,r)})),r}))}return le.version="6.4.1",le.createIndex=$,le.parseIndex=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=t.getFn,r=void 0===n?A.getFn:n,i=e.keys,o=e.records,c=new E({getFn:r});return c.setKeys(i),c.setIndexRecords(o),c},le.config=A,function(){ne.push.apply(ne,arguments)}(te),le}, true?module.exports=t():undefined;

/***/ }),

/***/ "./node_modules/react-visibility-sensor/dist/visibility-sensor.js":
/*!************************************************************************!*\
  !*** ./node_modules/react-visibility-sensor/dist/visibility-sensor.js ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory(__webpack_require__(/*! react */ "react"), __webpack_require__(/*! react-dom */ "react-dom"));
	else {}
})(this, function(__WEBPACK_EXTERNAL_MODULE__1__, __WEBPACK_EXTERNAL_MODULE__2__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

if (false) { var throwOnDirectAccess, ReactIs; } else {
  // By explicitly using `prop-types` you are opting into new production behavior.
  // http://fb.me/prop-types-in-prod
  module.exports = __webpack_require__(5)();
}


/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__1__;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__2__;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

// Tell whether the rect is visible, given an offset
//
// return: boolean
module.exports = function (offset, rect, containmentRect) {
  var offsetDir = offset.direction;
  var offsetVal = offset.value; // Rules for checking different kind of offsets. In example if the element is
  // 90px below viewport and offsetTop is 100, it is considered visible.

  switch (offsetDir) {
    case 'top':
      return containmentRect.top + offsetVal < rect.top && containmentRect.bottom > rect.bottom && containmentRect.left < rect.left && containmentRect.right > rect.right;

    case 'left':
      return containmentRect.left + offsetVal < rect.left && containmentRect.bottom > rect.bottom && containmentRect.top < rect.top && containmentRect.right > rect.right;

    case 'bottom':
      return containmentRect.bottom - offsetVal > rect.bottom && containmentRect.left < rect.left && containmentRect.right > rect.right && containmentRect.top < rect.top;

    case 'right':
      return containmentRect.right - offsetVal > rect.right && containmentRect.left < rect.left && containmentRect.top < rect.top && containmentRect.bottom > rect.bottom;
  }
};

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return VisibilitySensor; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(0);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _lib_is_visible_with_offset__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(3);
/* harmony import */ var _lib_is_visible_with_offset__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_lib_is_visible_with_offset__WEBPACK_IMPORTED_MODULE_3__);


function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }






function normalizeRect(rect) {
  if (rect.width === undefined) {
    rect.width = rect.right - rect.left;
  }

  if (rect.height === undefined) {
    rect.height = rect.bottom - rect.top;
  }

  return rect;
}

var VisibilitySensor =
/*#__PURE__*/
function (_React$Component) {
  _inherits(VisibilitySensor, _React$Component);

  function VisibilitySensor(props) {
    var _this;

    _classCallCheck(this, VisibilitySensor);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(VisibilitySensor).call(this, props));

    _defineProperty(_assertThisInitialized(_this), "getContainer", function () {
      return _this.props.containment || window;
    });

    _defineProperty(_assertThisInitialized(_this), "addEventListener", function (target, event, delay, throttle) {
      if (!_this.debounceCheck) {
        _this.debounceCheck = {};
      }

      var timeout;
      var func;

      var later = function later() {
        timeout = null;

        _this.check();
      };

      if (throttle > -1) {
        func = function func() {
          if (!timeout) {
            timeout = setTimeout(later, throttle || 0);
          }
        };
      } else {
        func = function func() {
          clearTimeout(timeout);
          timeout = setTimeout(later, delay || 0);
        };
      }

      var info = {
        target: target,
        fn: func,
        getLastTimeout: function getLastTimeout() {
          return timeout;
        }
      };
      target.addEventListener(event, info.fn);
      _this.debounceCheck[event] = info;
    });

    _defineProperty(_assertThisInitialized(_this), "startWatching", function () {
      if (_this.debounceCheck || _this.interval) {
        return;
      }

      if (_this.props.intervalCheck) {
        _this.interval = setInterval(_this.check, _this.props.intervalDelay);
      }

      if (_this.props.scrollCheck) {
        _this.addEventListener(_this.getContainer(), "scroll", _this.props.scrollDelay, _this.props.scrollThrottle);
      }

      if (_this.props.resizeCheck) {
        _this.addEventListener(window, "resize", _this.props.resizeDelay, _this.props.resizeThrottle);
      } // if dont need delayed call, check on load ( before the first interval fires )


      !_this.props.delayedCall && _this.check();
    });

    _defineProperty(_assertThisInitialized(_this), "stopWatching", function () {
      if (_this.debounceCheck) {
        // clean up event listeners and their debounce callers
        for (var debounceEvent in _this.debounceCheck) {
          if (_this.debounceCheck.hasOwnProperty(debounceEvent)) {
            var debounceInfo = _this.debounceCheck[debounceEvent];
            clearTimeout(debounceInfo.getLastTimeout());
            debounceInfo.target.removeEventListener(debounceEvent, debounceInfo.fn);
            _this.debounceCheck[debounceEvent] = null;
          }
        }
      }

      _this.debounceCheck = null;

      if (_this.interval) {
        _this.interval = clearInterval(_this.interval);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "check", function () {
      var el = _this.node;
      var rect;
      var containmentRect; // if the component has rendered to null, dont update visibility

      if (!el) {
        return _this.state;
      }

      rect = normalizeRect(_this.roundRectDown(el.getBoundingClientRect()));

      if (_this.props.containment) {
        var containmentDOMRect = _this.props.containment.getBoundingClientRect();

        containmentRect = {
          top: containmentDOMRect.top,
          left: containmentDOMRect.left,
          bottom: containmentDOMRect.bottom,
          right: containmentDOMRect.right
        };
      } else {
        containmentRect = {
          top: 0,
          left: 0,
          bottom: window.innerHeight || document.documentElement.clientHeight,
          right: window.innerWidth || document.documentElement.clientWidth
        };
      } // Check if visibility is wanted via offset?


      var offset = _this.props.offset || {};
      var hasValidOffset = _typeof(offset) === "object";

      if (hasValidOffset) {
        containmentRect.top += offset.top || 0;
        containmentRect.left += offset.left || 0;
        containmentRect.bottom -= offset.bottom || 0;
        containmentRect.right -= offset.right || 0;
      }

      var visibilityRect = {
        top: rect.top >= containmentRect.top,
        left: rect.left >= containmentRect.left,
        bottom: rect.bottom <= containmentRect.bottom,
        right: rect.right <= containmentRect.right
      }; // https://github.com/joshwnj/react-visibility-sensor/pull/114

      var hasSize = rect.height > 0 && rect.width > 0;
      var isVisible = hasSize && visibilityRect.top && visibilityRect.left && visibilityRect.bottom && visibilityRect.right; // check for partial visibility

      if (hasSize && _this.props.partialVisibility) {
        var partialVisible = rect.top <= containmentRect.bottom && rect.bottom >= containmentRect.top && rect.left <= containmentRect.right && rect.right >= containmentRect.left; // account for partial visibility on a single edge

        if (typeof _this.props.partialVisibility === "string") {
          partialVisible = visibilityRect[_this.props.partialVisibility];
        } // if we have minimum top visibility set by props, lets check, if it meets the passed value
        // so if for instance element is at least 200px in viewport, then show it.


        isVisible = _this.props.minTopValue ? partialVisible && rect.top <= containmentRect.bottom - _this.props.minTopValue : partialVisible;
      } // Deprecated options for calculating offset.


      if (typeof offset.direction === "string" && typeof offset.value === "number") {
        console.warn("[notice] offset.direction and offset.value have been deprecated. They still work for now, but will be removed in next major version. Please upgrade to the new syntax: { %s: %d }", offset.direction, offset.value);
        isVisible = _lib_is_visible_with_offset__WEBPACK_IMPORTED_MODULE_3___default()(offset, rect, containmentRect);
      }

      var state = _this.state; // notify the parent when the value changes

      if (_this.state.isVisible !== isVisible) {
        state = {
          isVisible: isVisible,
          visibilityRect: visibilityRect
        };

        _this.setState(state);

        if (_this.props.onChange) _this.props.onChange(isVisible);
      }

      return state;
    });

    _this.state = {
      isVisible: null,
      visibilityRect: {}
    };
    return _this;
  }

  _createClass(VisibilitySensor, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.node = react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.findDOMNode(this);

      if (this.props.active) {
        this.startWatching();
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.stopWatching();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      // re-register node in componentDidUpdate if children diffs [#103]
      this.node = react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.findDOMNode(this);

      if (this.props.active && !prevProps.active) {
        this.setState({
          isVisible: null,
          visibilityRect: {}
        });
        this.startWatching();
      } else if (!this.props.active) {
        this.stopWatching();
      }
    }
  }, {
    key: "roundRectDown",
    value: function roundRectDown(rect) {
      return {
        top: Math.floor(rect.top),
        left: Math.floor(rect.left),
        bottom: Math.floor(rect.bottom),
        right: Math.floor(rect.right)
      };
    }
    /**
     * Check if the element is within the visible viewport
     */

  }, {
    key: "render",
    value: function render() {
      if (this.props.children instanceof Function) {
        return this.props.children({
          isVisible: this.state.isVisible,
          visibilityRect: this.state.visibilityRect
        });
      }

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.Children.only(this.props.children);
    }
  }]);

  return VisibilitySensor;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);

_defineProperty(VisibilitySensor, "defaultProps", {
  active: true,
  partialVisibility: false,
  minTopValue: 0,
  scrollCheck: false,
  scrollDelay: 250,
  scrollThrottle: -1,
  resizeCheck: false,
  resizeDelay: 250,
  resizeThrottle: -1,
  intervalCheck: true,
  intervalDelay: 100,
  delayedCall: false,
  offset: {},
  containment: null,
  children: react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", null)
});

_defineProperty(VisibilitySensor, "propTypes", {
  onChange: prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.func,
  active: prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.bool,
  partialVisibility: prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.oneOfType([prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.bool, prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.oneOf(["top", "right", "bottom", "left"])]),
  delayedCall: prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.bool,
  offset: prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.oneOfType([prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.shape({
    top: prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.number,
    left: prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.number,
    bottom: prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.number,
    right: prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.number
  }), // deprecated offset property
  prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.shape({
    direction: prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.oneOf(["top", "right", "bottom", "left"]),
    value: prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.number
  })]),
  scrollCheck: prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.bool,
  scrollDelay: prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.number,
  scrollThrottle: prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.number,
  resizeCheck: prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.bool,
  resizeDelay: prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.number,
  resizeThrottle: prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.number,
  intervalCheck: prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.bool,
  intervalDelay: prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.number,
  containment: typeof window !== "undefined" ? prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.instanceOf(window.Element) : prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.any,
  children: prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.oneOfType([prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.element, prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.func]),
  minTopValue: prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.number
});



/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactPropTypesSecret = __webpack_require__(6);

function emptyFunction() {}
function emptyFunctionWithReset() {}
emptyFunctionWithReset.resetWarningCache = emptyFunction;

module.exports = function() {
  function shim(props, propName, componentName, location, propFullName, secret) {
    if (secret === ReactPropTypesSecret) {
      // It is still safe when called from React.
      return;
    }
    var err = new Error(
      'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
      'Use PropTypes.checkPropTypes() to call them. ' +
      'Read more at http://fb.me/use-check-prop-types'
    );
    err.name = 'Invariant Violation';
    throw err;
  };
  shim.isRequired = shim;
  function getShim() {
    return shim;
  };
  // Important!
  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
  var ReactPropTypes = {
    array: shim,
    bool: shim,
    func: shim,
    number: shim,
    object: shim,
    string: shim,
    symbol: shim,

    any: shim,
    arrayOf: getShim,
    element: shim,
    elementType: shim,
    instanceOf: getShim,
    node: shim,
    objectOf: getShim,
    oneOf: getShim,
    oneOfType: getShim,
    shape: getShim,
    exact: getShim,

    checkPropTypes: emptyFunctionWithReset,
    resetWarningCache: emptyFunction
  };

  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

module.exports = ReactPropTypesSecret;


/***/ })
/******/ ]);
});

/***/ }),

/***/ "@babel/runtime/regenerator":
/*!**********************************************!*\
  !*** external {"this":"regeneratorRuntime"} ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

(function() { module.exports = this["regeneratorRuntime"]; }());

/***/ }),

/***/ "@wordpress/api":
/*!**************************************!*\
  !*** external {"this":["wp","api"]} ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports) {

(function() { module.exports = this["wp"]["api"]; }());

/***/ }),

/***/ "@wordpress/components":
/*!*********************************************!*\
  !*** external {"this":["wp","components"]} ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

(function() { module.exports = this["wp"]["components"]; }());

/***/ }),

/***/ "@wordpress/compose":
/*!******************************************!*\
  !*** external {"this":["wp","compose"]} ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

(function() { module.exports = this["wp"]["compose"]; }());

/***/ }),

/***/ "@wordpress/data":
/*!***************************************!*\
  !*** external {"this":["wp","data"]} ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

(function() { module.exports = this["wp"]["data"]; }());

/***/ }),

/***/ "@wordpress/element":
/*!******************************************!*\
  !*** external {"this":["wp","element"]} ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

(function() { module.exports = this["wp"]["element"]; }());

/***/ }),

/***/ "@wordpress/i18n":
/*!***************************************!*\
  !*** external {"this":["wp","i18n"]} ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

(function() { module.exports = this["wp"]["i18n"]; }());

/***/ }),

/***/ "react":
/*!*********************************!*\
  !*** external {"this":"React"} ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

(function() { module.exports = this["React"]; }());

/***/ }),

/***/ "react-dom":
/*!************************************!*\
  !*** external {"this":"ReactDOM"} ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

(function() { module.exports = this["ReactDOM"]; }());

/***/ })

/******/ });
//# sourceMappingURL=app.js.map