!function(e){var t={};function r(n){if(t[n])return t[n].exports;var a=t[n]={i:n,l:!1,exports:{}};return e[n].call(a.exports,a,a.exports,r),a.l=!0,a.exports}r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)r.d(n,a,function(t){return e[t]}.bind(null,a));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=28)}([function(e,t){e.exports=window.wp.element},function(e,t){e.exports=window.wp.components},function(e,t){e.exports=window.regeneratorRuntime},function(e,t){e.exports=window.wp.data},function(e,t){e.exports=window.wp.primitives},function(e,t){function r(e,t,r,n,a,c,i){try{var o=e[c](i),s=o.value}catch(e){return void r(e)}o.done?t(s):Promise.resolve(s).then(n,a)}e.exports=function(e){return function(){var t=this,n=arguments;return new Promise((function(a,c){var i=e.apply(t,n);function o(e){r(i,a,c,o,s,"next",e)}function s(e){r(i,a,c,o,s,"throw",e)}o(void 0)}))}}},function(e,t,r){var n;!function(){"use strict";var r={}.hasOwnProperty;function a(){for(var e=[],t=0;t<arguments.length;t++){var n=arguments[t];if(n){var c=typeof n;if("string"===c||"number"===c)e.push(n);else if(Array.isArray(n)&&n.length){var i=a.apply(null,n);i&&e.push(i)}else if("object"===c)for(var o in n)r.call(n,o)&&n[o]&&e.push(o)}}return e.join(" ")}e.exports?(a.default=a,e.exports=a):void 0===(n=function(){return a}.apply(t,[]))||(e.exports=n)}()},function(e,t){e.exports=function(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}},function(e,t,r){var n=r(18),a=r(19),c=r(14),i=r(20);e.exports=function(e,t){return n(e)||a(e,t)||c(e,t)||i()}},function(e,t,r){"use strict";const n=r(25),a=r(26),c=r(27);function i(e){if("string"!=typeof e||1!==e.length)throw new TypeError("arrayFormatSeparator must be single character string")}function o(e,t){return t.encode?t.strict?n(e):encodeURIComponent(e):e}function s(e,t){return t.decode?a(e):e}function l(e){const t=e.indexOf("#");return-1!==t&&(e=e.slice(0,t)),e}function u(e){const t=(e=l(e)).indexOf("?");return-1===t?"":e.slice(t+1)}function p(e,t){return t.parseNumbers&&!Number.isNaN(Number(e))&&"string"==typeof e&&""!==e.trim()?e=Number(e):!t.parseBooleans||null===e||"true"!==e.toLowerCase()&&"false"!==e.toLowerCase()||(e="true"===e.toLowerCase()),e}function d(e,t){i((t=Object.assign({decode:!0,sort:!0,arrayFormat:"none",arrayFormatSeparator:",",parseNumbers:!1,parseBooleans:!1},t)).arrayFormatSeparator);const r=function(e){let t;switch(e.arrayFormat){case"index":return(e,r,n)=>{t=/\[(\d*)\]$/.exec(e),e=e.replace(/\[\d*\]$/,""),t?(void 0===n[e]&&(n[e]={}),n[e][t[1]]=r):n[e]=r};case"bracket":return(e,r,n)=>{t=/(\[\])$/.exec(e),e=e.replace(/\[\]$/,""),t?void 0!==n[e]?n[e]=[].concat(n[e],r):n[e]=[r]:n[e]=r};case"comma":case"separator":return(t,r,n)=>{const a="string"==typeof r&&r.includes(e.arrayFormatSeparator),c="string"==typeof r&&!a&&s(r,e).includes(e.arrayFormatSeparator);r=c?s(r,e):r;const i=a||c?r.split(e.arrayFormatSeparator).map(t=>s(t,e)):null===r?r:s(r,e);n[t]=i};default:return(e,t,r)=>{void 0!==r[e]?r[e]=[].concat(r[e],t):r[e]=t}}}(t),n=Object.create(null);if("string"!=typeof e)return n;if(!(e=e.trim().replace(/^[?#&]/,"")))return n;for(const a of e.split("&")){let[e,i]=c(t.decode?a.replace(/\+/g," "):a,"=");i=void 0===i?null:["comma","separator"].includes(t.arrayFormat)?i:s(i,t),r(s(e,t),i,n)}for(const e of Object.keys(n)){const r=n[e];if("object"==typeof r&&null!==r)for(const e of Object.keys(r))r[e]=p(r[e],t);else n[e]=p(r,t)}return!1===t.sort?n:(!0===t.sort?Object.keys(n).sort():Object.keys(n).sort(t.sort)).reduce((e,t)=>{const r=n[t];return Boolean(r)&&"object"==typeof r&&!Array.isArray(r)?e[t]=function e(t){return Array.isArray(t)?t.sort():"object"==typeof t?e(Object.keys(t)).sort((e,t)=>Number(e)-Number(t)).map(e=>t[e]):t}(r):e[t]=r,e},Object.create(null))}t.extract=u,t.parse=d,t.stringify=(e,t)=>{if(!e)return"";i((t=Object.assign({encode:!0,strict:!0,arrayFormat:"none",arrayFormatSeparator:","},t)).arrayFormatSeparator);const r=r=>t.skipNull&&null==e[r]||t.skipEmptyString&&""===e[r],n=function(e){switch(e.arrayFormat){case"index":return t=>(r,n)=>{const a=r.length;return void 0===n||e.skipNull&&null===n||e.skipEmptyString&&""===n?r:null===n?[...r,[o(t,e),"[",a,"]"].join("")]:[...r,[o(t,e),"[",o(a,e),"]=",o(n,e)].join("")]};case"bracket":return t=>(r,n)=>void 0===n||e.skipNull&&null===n||e.skipEmptyString&&""===n?r:null===n?[...r,[o(t,e),"[]"].join("")]:[...r,[o(t,e),"[]=",o(n,e)].join("")];case"comma":case"separator":return t=>(r,n)=>null==n||0===n.length?r:0===r.length?[[o(t,e),"=",o(n,e)].join("")]:[[r,o(n,e)].join(e.arrayFormatSeparator)];default:return t=>(r,n)=>void 0===n||e.skipNull&&null===n||e.skipEmptyString&&""===n?r:null===n?[...r,o(t,e)]:[...r,[o(t,e),"=",o(n,e)].join("")]}}(t),a={};for(const t of Object.keys(e))r(t)||(a[t]=e[t]);const c=Object.keys(a);return!1!==t.sort&&c.sort(t.sort),c.map(r=>{const a=e[r];return void 0===a?"":null===a?o(r,t):Array.isArray(a)?a.reduce(n(r),[]).join("&"):o(r,t)+"="+o(a,t)}).filter(e=>e.length>0).join("&")},t.parseUrl=(e,t)=>{t=Object.assign({decode:!0},t);const[r,n]=c(e,"#");return Object.assign({url:r.split("?")[0]||"",query:d(u(e),t)},t&&t.parseFragmentIdentifier&&n?{fragmentIdentifier:s(n,t)}:{})},t.stringifyUrl=(e,r)=>{r=Object.assign({encode:!0,strict:!0},r);const n=l(e.url).split("?")[0]||"",a=t.extract(e.url),c=t.parse(a,{sort:!1}),i=Object.assign(c,e.query);let s=t.stringify(i,r);s&&(s="?"+s);let u=function(e){let t="";const r=e.indexOf("#");return-1!==r&&(t=e.slice(r)),t}(e.url);return e.fragmentIdentifier&&(u="#"+o(e.fragmentIdentifier,r)),`${n}${s}${u}`}},function(e,t){e.exports=window.wp.apiFetch},function(e,t,r){var n=r(22),a=r(23),c=r(14),i=r(24);e.exports=function(e){return n(e)||a(e)||c(e)||i()}},function(e,t){e.exports=window.wp.i18n},,function(e,t,r){var n=r(15);e.exports=function(e,t){if(e){if("string"==typeof e)return n(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?n(e,t):void 0}}},function(e,t){e.exports=function(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}},function(e,t){e.exports=window.wp.keycodes},,function(e,t){e.exports=function(e){if(Array.isArray(e))return e}},function(e,t){e.exports=function(e,t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e)){var r=[],n=!0,a=!1,c=void 0;try{for(var i,o=e[Symbol.iterator]();!(n=(i=o.next()).done)&&(r.push(i.value),!t||r.length!==t);n=!0);}catch(e){a=!0,c=e}finally{try{n||null==o.return||o.return()}finally{if(a)throw c}}return r}}},function(e,t){e.exports=function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}},function(e,t,r){},function(e,t,r){var n=r(15);e.exports=function(e){if(Array.isArray(e))return n(e)}},function(e,t){e.exports=function(e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}},function(e,t){e.exports=function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}},function(e,t,r){"use strict";e.exports=e=>encodeURIComponent(e).replace(/[!'()*]/g,e=>"%"+e.charCodeAt(0).toString(16).toUpperCase())},function(e,t,r){"use strict";var n=new RegExp("%[a-f0-9]{2}","gi"),a=new RegExp("(%[a-f0-9]{2})+","gi");function c(e,t){try{return decodeURIComponent(e.join(""))}catch(e){}if(1===e.length)return e;t=t||1;var r=e.slice(0,t),n=e.slice(t);return Array.prototype.concat.call([],c(r),c(n))}function i(e){try{return decodeURIComponent(e)}catch(a){for(var t=e.match(n),r=1;r<t.length;r++)t=(e=c(t,r).join("")).match(n);return e}}e.exports=function(e){if("string"!=typeof e)throw new TypeError("Expected `encodedURI` to be of type `string`, got `"+typeof e+"`");try{return e=e.replace(/\+/g," "),decodeURIComponent(e)}catch(t){return function(e){for(var t={"%FE%FF":"��","%FF%FE":"��"},r=a.exec(e);r;){try{t[r[0]]=decodeURIComponent(r[0])}catch(e){var n=i(r[0]);n!==r[0]&&(t[r[0]]=n)}r=a.exec(e)}t["%C2"]="�";for(var c=Object.keys(t),o=0;o<c.length;o++){var s=c[o];e=e.replace(new RegExp(s,"g"),t[s])}return e}(e)}}},function(e,t,r){"use strict";e.exports=(e,t)=>{if("string"!=typeof e||"string"!=typeof t)throw new TypeError("Expected the arguments to be of type `string`");if(""===t)return[e];const r=e.indexOf(t);return-1===r?[e]:[e.slice(0,r),e.slice(r+t.length)]}},function(e,t,r){"use strict";r.r(t);var n=r(7),a=r.n(n),c=r(8),i=r.n(c),o=r(0),s=r(1),l=r(3);function u(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function p(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?u(Object(r),!0).forEach((function(t){a()(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):u(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}var d={isFetching:!0,isPreview:!1,tab:3===parseInt(window.tiTpc?window.tiTpc.tier:0)?"library":"templates",templates:{items:[],currentPage:0,totalPages:0},library:{items:[],currentPage:0,totalPages:0},preview:{}};Object(l.registerStore)("tpc/beaver",{reducer:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:d,t=arguments.length>1?arguments[1]:void 0;return"SET_FETCHING"===t.type?p(p({},e),{},{isFetching:t.isFetching}):"TOGGLE_PREVIEW"===t.type?p(p({},e),{},{isPreview:!e.isPreview}):"UPDATE_CURRENT_TAB"===t.type?p(p({},e),{},{tab:t.tab}):"UPDATE_TEMPLATES"===t.type?p(p({},e),{},{templates:{items:t.items,currentPage:Number(t.currentPage),totalPages:Number(t.totalPages)}}):"UPDATE_LIBRARY"===t.type?p(p({},e),{},{library:{items:t.items,currentPage:Number(t.currentPage),totalPages:Number(t.totalPages)}}):"SET_PREVIEW_DATA"===t.type?p(p({},e),{},{preview:t.preview}):e},selectors:{isFetching:function(e){return e.isFetching},isPreview:function(e){return e.isPreview},getCurrentTab:function(e){return e.tab},getTemplates:function(e){return e.templates},getLibrary:function(e){return e.library},getPreview:function(e){return e.preview}},actions:{setFetching:function(e){return{type:"SET_FETCHING",isFetching:e}},togglePreview:function(e){return{type:"TOGGLE_PREVIEW",isPreview:e}},updateCurrentTab:function(e){return{type:"UPDATE_CURRENT_TAB",tab:e}},updateTemplates:function(e,t,r){return{type:"UPDATE_TEMPLATES",items:e,currentPage:t,totalPages:r}},updateLibrary:function(e,t,r){return{type:"UPDATE_LIBRARY",items:e,currentPage:t,totalPages:r}},setPreviewData:function(e){return{type:"SET_PREVIEW_DATA",preview:e}}}}),r(21);var b,m=r(2),f=r.n(m),y=r(5),g=r.n(y),w=r(6),v=r.n(w),O=new Uint8Array(16);function h(){if(!b&&!(b="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)||"undefined"!=typeof msCrypto&&"function"==typeof msCrypto.getRandomValues&&msCrypto.getRandomValues.bind(msCrypto)))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return b(O)}for(var j=/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i,E=function(e){return"string"==typeof e&&j.test(e)},x=[],P=0;P<256;++P)x.push((P+256).toString(16).substr(1));var S=function(e,t,r){var n=(e=e||{}).random||(e.rng||h)();if(n[6]=15&n[6]|64,n[8]=63&n[8]|128,t){r=r||0;for(var a=0;a<16;++a)t[r+a]=n[a];return t}return function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,r=(x[e[t+0]]+x[e[t+1]]+x[e[t+2]]+x[e[t+3]]+"-"+x[e[t+4]]+x[e[t+5]]+"-"+x[e[t+6]]+x[e[t+7]]+"-"+x[e[t+8]]+x[e[t+9]]+"-"+x[e[t+10]]+x[e[t+11]]+x[e[t+12]]+x[e[t+13]]+x[e[t+14]]+x[e[t+15]]).toLowerCase();if(!E(r))throw TypeError("Stringified UUID is invalid");return r}(n)},T=r(4),k=Object(o.createElement)(T.SVG,{xmlns:"http://www.w3.org/2000/svg",viewBox:"-2 -2 24 24"},Object(o.createElement)(T.Path,{d:"M10.2 3.28c3.53 0 6.43 2.61 6.92 6h2.08l-3.5 4-3.5-4h2.32c-.45-1.97-2.21-3.45-4.32-3.45-1.45 0-2.73.71-3.54 1.78L4.95 5.66C6.23 4.2 8.11 3.28 10.2 3.28zm-.4 13.44c-3.52 0-6.43-2.61-6.92-6H.8l3.5-4c1.17 1.33 2.33 2.67 3.5 4H5.48c.45 1.97 2.21 3.45 4.32 3.45 1.45 0 2.73-.71 3.54-1.78l1.71 1.95c-1.28 1.46-3.15 2.38-5.25 2.38z"})),C=Object(o.createElement)(T.SVG,{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},Object(o.createElement)(T.Path,{d:"M13 11.9l3.3-3.4-1.1-1-3.2 3.3-3.2-3.3-1.1 1 3.3 3.4-3.5 3.6 1 1L12 13l3.5 3.5 1-1z"})),B=wp.primitives,L=B.Path,_=B.SVG,F=function(){return Object(o.createElement)(_,{width:"100",height:"100",viewBox:"0 0 100 100",fill:"none",xmlns:"http://www.w3.org/2000/svg",className:"tpc-template-cloud-icon"},Object(o.createElement)(L,{d:"M95.0264 100H4.97356C2.22797 100 0 97.772 0 95.0264V4.97356C0 2.22797 2.22797 0 4.97356 0H95.0264C97.772 0 100 2.22797 100 4.97356V95.0264C100 97.772 97.772 100 95.0264 100Z",fill:"#0366D6"}),Object(o.createElement)(L,{d:"M82.6941 86.7448V30.8205V18.4653H70.3502H14.4146L26.7584 30.8205H70.3502V74.401L82.6941 86.7448Z",fill:"white"}),Object(o.createElement)(L,{d:"M42.2416 58.9291L42.2528 71.183L53.2352 82.1653L53.1902 47.9806L18.9941 47.9355L29.9765 58.9066L42.2416 58.9291Z",fill:"white"}))},N=r(11),D=r.n(N),I=r(9),A=r(10),R=r.n(A);function V(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function M(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?V(Object(r),!0).forEach((function(t){a()(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):V(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}var H=lodash.omit,U=function(e){return FLBuilder.alert(e)},z=Object(l.dispatch)("tpc/beaver").setFetching,G=function(){var e=g()(f.a.mark((function e(){var t,r,n,a,c,i,o,s,u,p=arguments;return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=p.length>0&&void 0!==p[0]?p[0]:{},r=M(M({cache:localStorage.getItem("tpcCacheBuster")},window.tiTpc.params),{},{per_page:20,page:0,premade:!0,template_site_slug:"general"},H(t,"isScroll")),n=Object(I.stringifyUrl)({url:window.tiTpc.endpoint+"page-templates",query:r}),e.prev=3,z(!0),e.next=7,R()({url:n,method:"GET",parse:!1});case 7:if(a=e.sent,z(!1),!a.ok){e.next=20;break}return e.next=12,a.json();case 12:if(!(c=e.sent).message){e.next=15;break}return e.abrupt("return",U(c.message));case 15:i=c,t.isScroll&&(o=Object(l.select)("tpc/beaver").getTemplates(),i=[].concat(D()(o.items),D()(c))),s=a.headers.get("x-wp-totalpages"),u=r.page,Object(l.dispatch)("tpc/beaver").updateTemplates(i,u,s);case 20:e.next=25;break;case 22:e.prev=22,e.t0=e.catch(3),e.t0.message&&U(e.t0.message);case 25:case"end":return e.stop()}}),e,null,[[3,22]])})));return function(){return e.apply(this,arguments)}}(),Q=function(){var e=g()(f.a.mark((function e(){var t,r,n,a,c,i,o,s,u,p=arguments;return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=p.length>0&&void 0!==p[0]?p[0]:{},r=M({per_page:20,page:0},H(t,"isScroll")),n=Object(I.stringifyUrl)({url:window.tiTpc.endpoint+"templates",query:M(M({cache:localStorage.getItem("tpcCacheBuster")},window.tiTpc.params),r)}),e.prev=3,z(!0),e.next=7,R()({url:n,method:"GET",parse:!1});case 7:if(a=e.sent,z(!1),!a.ok){e.next=20;break}return e.next=12,a.json();case 12:if(!(c=e.sent).message){e.next=15;break}return e.abrupt("return",U(c.message));case 15:i=c,t.isScroll&&(o=Object(l.select)("tpc/beaver").getLibrary(),i=[].concat(D()(o.items),D()(c))),s=a.headers.get("x-wp-totalpages"),u=r.page,Object(l.dispatch)("tpc/beaver").updateLibrary(i,u,s);case 20:e.next=25;break;case 22:e.prev=22,e.t0=e.catch(3),e.t0.message&&U(e.t0.message);case 25:case"end":return e.stop()}}),e,null,[[3,22]])})));return function(){return e.apply(this,arguments)}}(),$=function(){var e=g()(f.a.mark((function e(t){var r,n,a;return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=Object(I.stringifyUrl)({url:"".concat(window.tiTpc.endpoint,"templates/").concat(t.template_id),query:M(M({cache:localStorage.getItem("tpcCacheBuster")},window.tiTpc.params),t)}),e.prev=1,e.next=4,R()({url:r,method:"POST",parse:!1});case 4:if(!(n=e.sent).ok){e.next=11;break}return e.next=8,n.json();case 8:if(!(a=e.sent).message){e.next=11;break}return e.abrupt("return",U(a.message));case 11:return localStorage.setItem("tpcCacheBuster",S()),e.next=14,Q();case 14:e.next=19;break;case 16:e.prev=16,e.t0=e.catch(1),e.t0.message&&U(e.t0.message);case 19:case"end":return e.stop()}}),e,null,[[1,16]])})));return function(t){return e.apply(this,arguments)}}(),q=function(){var e=g()(f.a.mark((function e(t){var r,n,a;return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=Object(I.stringifyUrl)({url:"".concat(window.tiTpc.endpoint,"templates/").concat(t),query:M({cache:localStorage.getItem("tpcCacheBuster"),_method:"DELETE"},window.tiTpc.params)}),e.prev=1,e.next=4,R()({url:r,method:"POST"});case 4:if(!(n=e.sent).ok){e.next=11;break}return e.next=8,n.json();case 8:if(!(a=e.sent).message){e.next=11;break}return e.abrupt("return",U(a.message));case 11:return localStorage.setItem("tpcCacheBuster",S()),e.next=14,Q();case 14:e.next=19;break;case 16:e.prev=16,e.t0=e.catch(1),e.t0.message&&U(e.t0.message);case 19:case"end":return e.stop()}}),e,null,[[1,16]])})));return function(t){return e.apply(this,arguments)}}();function W(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function Z(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?W(Object(r),!0).forEach((function(t){a()(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):W(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}var Y=function(e){var t=e.closeModal,r=e.getOrder,n=e.getSearchQuery,a=Object(l.useDispatch)("tpc/beaver"),c=a.setFetching,i=a.updateCurrentTab,u={templates:window.tiTpc.library.tabs.templates};3===parseInt(window.tiTpc.tier)&&(u.library=window.tiTpc.library.tabs.library);var p=Object(l.useSelect)((function(e){return e("tpc/beaver").isFetching()})),d=Object(l.useSelect)((function(e){return e("tpc/beaver").isPreview()})),b=Object(l.useSelect)((function(e){return e("tpc/beaver").getCurrentTab()})),m=function(){var e=g()(f.a.mark((function e(){var t;return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return window.localStorage.setItem("tpcCacheBuster",S()),c(!0),t=r(),e.next=5,G(Z({search:n()},t));case 5:return e.next=7,Q(Z({search:n()},t));case 7:c(!1);case 8:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return Object(o.createElement)("div",{className:"modal-header"},Object(o.createElement)("div",{className:"left"},Object(o.createElement)(s.Icon,{icon:F})),Object(o.createElement)("div",{className:"center"},Object.keys(u).map((function(e){return Object(o.createElement)(s.Button,{key:e,onClick:function(){return i(e)},className:v()("tabs",{"is-active":e===b})},u[e])}))),Object(o.createElement)("div",{className:"right"},"library"===b&&!d&&Object(o.createElement)(s.ButtonGroup,null,Object(o.createElement)(s.Button,{label:window.tiTpc.library.actions.sync,icon:k,disabled:p,className:v()("is-sync",{"is-loading":p}),onClick:m})),Object(o.createElement)(s.Button,{label:window.tiTpc.library.actions.close,icon:C,onClick:t})))},K=r(12),J=function(e){var t=e.isFetching,r=e.importTemplate,n=Object(l.useDispatch)("tpc/beaver").togglePreview,a=Object(l.useSelect)((function(e){return e("tpc/beaver").getPreview()})).item;return Object(o.createElement)("div",{className:"tpc-modal-content"},Object(o.createElement)("div",{className:"preview-header"},Object(o.createElement)("div",{className:"left"},a.template_name||Object(K.__)("Template")),Object(o.createElement)("div",{className:"right"},Object(o.createElement)(s.Button,{isSecondary:!0,onClick:n},Object(K.__)("Close Preview")),Object(o.createElement)(s.Button,{isPrimary:!0,isBusy:t,disabled:t,onClick:function(){n(),r(a.template_id)}},Object(K.__)("Import")))),t?Object(o.createElement)(s.Placeholder,null,Object(o.createElement)(s.Spinner,null)):Object(o.createElement)("div",{className:"preview-content"},Object(o.createElement)("iframe",{src:a.link||"",title:a.template_name||""})))},X=Object(o.createElement)(T.SVG,{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},Object(o.createElement)(T.Path,{d:"M13.5 6C10.5 6 8 8.5 8 11.5c0 1.1.3 2.1.9 3l-3.4 3 1 1.1 3.4-2.9c1 .9 2.2 1.4 3.6 1.4 3 0 5.5-2.5 5.5-5.5C19 8.5 16.5 6 13.5 6zm0 9.5c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z"})),ee=Object(o.createElement)(T.SVG,{xmlns:"https://www.w3.org/2000/svg",viewBox:"0 0 24 24"},Object(o.createElement)(T.Path,{d:"M3 15h18v-2H3v2zm0 4h18v-2H3v2zm0-8h18V9H3v2zm0-6v2h18V5H3z"})),te=Object(o.createElement)(T.SVG,{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},Object(o.createElement)(T.Path,{d:"M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7.8 16.5H5c-.3 0-.5-.2-.5-.5v-6.2h6.8v6.7zm0-8.3H4.5V5c0-.3.2-.5.5-.5h6.2v6.7zm8.3 7.8c0 .3-.2.5-.5.5h-6.2v-6.8h6.8V19zm0-7.8h-6.8V4.5H19c.3 0 .5.2.5.5v6.2z",fillRule:"evenodd",clipRule:"evenodd"})),re=r(16);function ne(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function ae(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?ne(Object(r),!0).forEach((function(t){a()(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):ne(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}var ce={date:window.tiTpc.library.filters.sortLabels.date,template_name:window.tiTpc.library.filters.sortLabels.name,modified:window.tiTpc.library.filters.sortLabels.modified},ie=function(e){var t=e.layout,r=e.sortingOrder,n=e.setLayout,a=e.searchQuery,c=e.onSearch,i=e.setSearchQuery,l=e.setSortingOrder,u=e.changeOrder;return Object(o.createElement)("div",{className:"filters"},Object(o.createElement)("div",{className:"display-sorting"},Object(o.createElement)("div",{className:"sorting-label"},window.tiTpc.library.filters.sortLabel),Object(o.createElement)("div",{className:"sorting-filter"},Object.keys(ce).map((function(e){return Object(o.createElement)(s.Button,{key:e,className:v()({"is-selected":e===r.orderby,"is-asc":"ASC"===r.order}),onClick:function(){var t={order:"DESC",orderby:e};e===r.orderby&&"DESC"===r.order&&(t.order="ASC"),l(ae({},t)),u(ae({},t))}},ce[e])})))),Object(o.createElement)("div",{className:"view-filters"},Object(o.createElement)("div",{className:"search-filters"},Object(o.createElement)("input",{placeholder:window.tiTpc.library.filters.searchLabel,className:"filter-search",value:a,onChange:function(e){return i(e.target.value)},onKeyDown:function(e){e.keyCode===re.ENTER&&c()}}),Object(o.createElement)(s.Icon,{icon:X})),Object(o.createElement)(s.Button,{label:window.tiTpc.library.filters.sortLabels.list,icon:ee,onClick:function(){return n("list")},isPressed:"list"===t}),Object(o.createElement)(s.Button,{label:window.tiTpc.library.filters.sortLabels.grid,icon:te,onClick:function(){return n("grid")},isPressed:"grid"===t})))},oe=Object(o.createElement)(T.SVG,{xmlns:"http://www.w3.org/2000/svg",viewBox:"-2 -2 24 24"},Object(o.createElement)(T.Path,{d:"M12 4h3c.6 0 1 .4 1 1v1H3V5c0-.6.5-1 1-1h3c.2-1.1 1.3-2 2.5-2s2.3.9 2.5 2zM8 4h3c-.2-.6-.9-1-1.5-1S8.2 3.4 8 4zM4 7h11l-.9 10.1c0 .5-.5.9-1 .9H5.9c-.5 0-.9-.4-1-.9L4 7z"})),se=Object(o.createElement)(T.SVG,{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},Object(o.createElement)(T.Path,{d:"M7 5.5h10a.5.5 0 01.5.5v12a.5.5 0 01-.5.5H7a.5.5 0 01-.5-.5V6a.5.5 0 01.5-.5zM17 4H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2zm-1 3.75H8v1.5h8v-1.5zM8 11h8v1.5H8V11zm6 3.25H8v1.5h6v-1.5z"})),le=Object(o.createElement)(T.SVG,{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},Object(o.createElement)(T.Path,{d:"M18.3 5.6L9.9 16.9l-4.6-3.4-.9 1.2 5.8 4.3 9.3-12.6z"})),ue=Object(o.createElement)(T.SVG,{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},Object(o.createElement)(T.Path,{d:"M20.1 5.1L16.9 2 6.2 12.7l-1.3 4.4 4.5-1.3L20.1 5.1zM4 20.8h8v-1.5H4v1.5z"})),pe=function(e){var t=e.layout,r=e.item,n=e.importTemplate,a=e.deletable,c=Object(l.useDispatch)("tpc/beaver"),u=c.togglePreview,p=c.setPreviewData,d=Object(o.useState)(!1),b=i()(d,2),m=b[0],y=b[1],w=Object(o.useState)(!1),O=i()(w,2),h=O[0],j=O[1],E=Object(o.useState)(r.template_name),x=i()(E,2),P=x[0],S=x[1],T=function(){var e=g()(f.a.mark((function e(){return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return y("updating"),e.next=3,$({template_id:r.template_id,template_name:P||r.template_name});case 3:return e.next=5,Q();case 5:y(!1),j(!h);case 7:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),C=function(){var e=g()(f.a.mark((function e(){return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(window.confirm(window.tiTpc.library.deleteItem)){e.next=2;break}return e.abrupt("return",!1);case 2:return y("deleting"),e.next=5,q(r.template_id);case 5:y(!1);case 6:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),B=function(){var e=g()(f.a.mark((function e(){return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:u(),p({type:"library",item:r});case 2:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();if("grid"===t){var L={backgroundImage:"url(".concat(r.template_thumbnail,")")};return Object(o.createElement)("div",{key:r.template_id,className:"table-grid"},Object(o.createElement)("div",{style:L,className:v()("grid-preview",{"is-loading":h||!1!==m})},Object(o.createElement)("div",{className:"preview-actions"},!a&&Object(o.createElement)(s.Button,{isSecondary:!0,disabled:!1!==m,onClick:B},window.tiTpc.library.actions.preview),Object(o.createElement)(s.Button,{isPrimary:!0,isBusy:"importing"===m,disabled:!1!==m,onClick:function(){return n(r.template_id)}},window.tiTpc.library.actions.import),a&&Object(o.createElement)("div",{className:"preview-controls"},Object(o.createElement)(s.Button,{label:window.tiTpc.library.actions.delete,icon:"deleting"===m?k:oe,disabled:!1!==m,className:v()({"is-loading":"deleting"===m}),onClick:C})))),Object(o.createElement)("div",{className:"card-footer"},Object(o.createElement)("p",null,r.template_name)))}var _=v()("actions",{"no-controls":!a});return Object(o.createElement)("div",{key:r.template_id,className:"table-row"},Object(o.createElement)("div",{className:"row-title"},Object(o.createElement)(s.Icon,{icon:se}),h?Object(o.createElement)(s.TextControl,{label:window.tiTpc.exporter.textLabel,hideLabelFromVision:!0,value:P,onChange:S}):r.template_name),a&&Object(o.createElement)("div",{className:"row-controls"},Object(o.createElement)(s.Button,{label:h?window.tiTpc.library.actions.update:window.tiTpc.library.actions.edit,icon:h?"updating"===m?k:le:ue,disabled:!1!==m,className:v()({"is-loading":"updating"===m}),onClick:h?T:function(){return j(!h)}},h?window.tiTpc.library.actions.update:window.tiTpc.library.actions.edit),Object(o.createElement)(s.Button,{label:window.tiTpc.library.actions.delete,icon:"deleting"===m?k:oe,disabled:!1!==m,className:v()({"is-loading":"deleting"===m}),onClick:C},"deleting"===m?window.tiTpc.library.actions.deleting+"...":window.tiTpc.library.actions.delete)),Object(o.createElement)("div",{className:_},!a&&Object(o.createElement)(s.Button,{isSecondary:!0,disabled:!1!==m,onClick:B},window.tiTpc.library.actions.preview),Object(o.createElement)(s.Button,{isPrimary:!0,isBusy:"importing"===m,disabled:!1!==m,onClick:function(){return n(r.template_id)}},window.tiTpc.library.actions.import)))},de=function(e){var t=e.total,r=e.current,n=e.onChange;if(t<2)return null;for(var a=[],c=function(e){var t=e===r;a.push(Object(o.createElement)(s.Button,{key:"page-".concat(e),isPrimary:t,disabled:t,onClick:function(){return n(e)}},e+1))},i=0;i<t;i++)c(i);return Object(o.createElement)(s.ButtonGroup,{className:"pagination"},a)};function be(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function me(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?be(Object(r),!0).forEach((function(t){a()(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):be(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}var fe=function(e){var t=e.importTemplate,r=e.isGeneral,n=void 0!==r&&r,a=e.isFetching,c=e.getOrder,u=e.setQuery,p=e.getSearchQuery,d=e.setSorting,b=Object(l.useSelect)((function(e){return n?e("tpc/beaver").getTemplates():e("tpc/beaver").getLibrary()})),m=b.items,y=b.currentPage,w=b.totalPages,O=Object(l.useDispatch)("tpc/beaver").setFetching,h=Object(o.useState)("grid"),j=i()(h,2),E=j[0],x=j[1],P=function(){var e=g()(f.a.mark((function e(){var t;return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t=c(),!n){e.next=6;break}return e.next=4,G(me({search:p()},t));case 4:e.next=8;break;case 6:return e.next=8,Q(me({search:p()},t));case 8:O(!1);case 9:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();Object(o.useEffect)((function(){m&&m.length>0||P()}),[n]);var S=function(){var e=g()(f.a.mark((function e(){var t;return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(O(!0),t=c(),!n){e.next=7;break}return e.next=5,G(me({search:p()},t));case 5:e.next=9;break;case 7:return e.next=9,Q(me({search:p()},t));case 9:O(!1);case 10:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),T=function(){var e=g()(f.a.mark((function e(t){var r;return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(O(!0),r=c(),!n){e.next=7;break}return e.next=5,G(me({search:p(),page:t},r));case 5:e.next=9;break;case 7:return e.next=9,Q(me({search:p(),page:t},r));case 9:O(!1);case 10:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),k=function(){var e=g()(f.a.mark((function e(t){return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(O(!0),!n){e.next=6;break}return e.next=4,G(me(me({},t),{},{search:p()}));case 4:e.next=8;break;case 6:return e.next=8,Q(me(me({},t),{},{search:p()}));case 8:O(!1);case 9:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}();if(a)return Object(o.createElement)(o.Fragment,null,Object(o.createElement)(ie,{layout:E,sortingOrder:c(),setLayout:x,searchQuery:p(),onSearch:S,setSearchQuery:u,setSortingOrder:d,changeOrder:k}),Object(o.createElement)(s.Placeholder,null,Object(o.createElement)(s.Spinner,null)));if(!Boolean(m.length))return Object(o.createElement)("div",{className:"table-content"},Object(o.createElement)(ie,{layout:E,sortingOrder:c(),setLayout:x,searchQuery:p(),onSearch:S,setSearchQuery:u,setSortingOrder:d,changeOrder:k}),window.tiTpc.library[404]);var C=v()("table-content",{"is-grid":"grid"===E});return Object(o.createElement)(o.Fragment,null,Object(o.createElement)(ie,{layout:E,sortingOrder:c(),setLayout:x,searchQuery:p(),onSearch:S,setSearchQuery:u,setSortingOrder:d,changeOrder:k}),Object(o.createElement)("div",{className:C},m.map((function(e){return Object(o.createElement)(pe,{sortingOrder:c(),deletable:!n,key:e.template_id,layout:E,item:e,importTemplate:t})}))),Object(o.createElement)(de,{onChange:T,current:y,total:w}))},ye=function(e){var t=e.importTemplate,r=e.getOrder,n=e.setQuery,a=e.getSearchQuery,c=e.setSorting,i=Object(l.useSelect)((function(e){return e("tpc/beaver").isFetching()})),s=Object(l.useSelect)((function(e){return e("tpc/beaver").isPreview()})),u=Object(l.useSelect)((function(e){return e("tpc/beaver").getCurrentTab()}));return s?Object(o.createElement)(J,{isFetching:i,importTemplate:t}):Object(o.createElement)("div",{className:"tpc-modal-content"},Object(o.createElement)(fe,{isFetching:i,isGeneral:"templates"===u,importTemplate:t,getOrder:r,setQuery:n,getSearchQuery:a,setSorting:c}))};function ge(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function we(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?ge(Object(r),!0).forEach((function(t){a()(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):ge(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}window.tiTpc||(window.tiTpc={});var ve=document.createElement("div");ve.id="ti-tpc-beaver-modal",ve.style="display:none;",document.body.appendChild(ve);var Oe=document.getElementById("tmpl-fl-row-overlay");if(window.tpcExport=function(e){var t=e.closest(".fl-row").dataset.node,r='<div class="tpc-template-cloud-export-modal">\n\t\t<h1>'.concat(window.tiTpc.exporter.modalLabel,'</h1>\n\t\t<label for="tpc-').concat(t,'">').concat(window.tiTpc.exporter.textLabel,'</label>\n\t\t<input id="tpc-').concat(t,'" type="text" placeholder="').concat(window.tiTpc.exporter.textPlaceholder,'" />\n\t</div>');FLBuilder.confirm({message:r,ok:function(){var e=document.getElementById("tpc-".concat(t)).value||"Template";setTimeout((function(){FLBuilder.showAjaxLoader(),FLBuilder.ajax({action:"ti_export_template",node:t,title:e},(function(e){void 0===e.success||e.success||FLBuilder.alert("<h1>".concat(window.tiTpc.exporter.exportFailed,"</h1> ").concat(e.data)),FLBuilder.hideAjaxLoader()}))}),1e3)},strings:{ok:window.tiTpc.exporter.buttonLabel,cancel:window.tiTpc.exporter.cancelLabel}})},Oe){var he=Oe.textContent;Oe.textContent=he.replace('<li><a class="fl-block-row-reset" href="javascript:void(0);">Reset Row Width</a></li>','<li><a class="fl-block-row-reset" href="javascript:void(0);">Reset Row Width</a></li><li><a class="fl-block-row-tpc-export" onclick="window.tpcExport(this)" href="javascript:void(0);">Export to Templates Cloud</a></li>')}Object(o.render)(Object(o.createElement)((function(){var e=Object(l.useSelect)((function(e){return e("tpc/beaver").getCurrentTab()})),t=Object(o.useState)(null),r=i()(t,2),n=r[0],a=r[1],c=Object(o.useState)(!1),u=i()(c,2),p=u[0],d=u[1],b=Object(o.useState)({templates:"",library:""}),m=i()(b,2),f=m[0],y=m[1],g=Object(o.useState)({templates:{order:"DESC",orderby:"date"},library:{order:"DESC",orderby:"date"}}),w=i()(g,2),v=w[0],O=w[1],h=Object(l.useDispatch)("tpc/beaver").setFetching;window.tiTpc.initBeaver=function(e){return function(e){a(e),d(!0)}(e)};var j=function(){d(!1),FLBuilder._settingsCancelClicked()},E="templates"===e,x=function(){return E?f.templates:f.library},P=function(){return E?v.templates:v.library};return p?Object(o.createElement)(s.Modal,{title:window.tiTpc.library.templatesCloud,shouldCloseOnClickOutside:!1,onRequestClose:j,isDismissible:!1,overlayClassName:"tpc-template-cloud-modal"},Object(o.createElement)(Y,{closeModal:j,getOrder:P,getSearchQuery:x}),Object(o.createElement)(ye,{importTemplate:function(e){h(!0),FLBuilder.ajax({action:"ti_get_position",node:n},(function(t){FLBuilder._settingsCancelClicked();var r=t;FLBuilder.ajax({action:"ti_apply_template",template:e,position:r},(function(e){if(h(!1),void 0!==e.success&&!e.success)return FLBuilder.alert("<h1>".concat(window.tiTpc.exporter.importFailed,"</h1> ").concat(e.data));j();var t=FLBuilder._jsonParse(e);t.layout&&(FLBuilder._renderLayout(t.layout),FLBuilder.triggerHook("didApplyTemplate"))}))}))},getOrder:P,setQuery:function(e){return y(we(we({},f),{},E?{templates:e}:{library:e}))},getSearchQuery:x,setSorting:function(e){return O(we(we({},v),{},E?{templates:e}:{library:e}))}})):Object(o.createElement)("p",null,":)")}),null),document.getElementById("ti-tpc-beaver-modal"))}]);