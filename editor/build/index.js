!function(e){var t={};function r(n){if(t[n])return t[n].exports;var a=t[n]={i:n,l:!1,exports:{}};return e[n].call(a.exports,a,a.exports,r),a.l=!0,a.exports}r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)r.d(n,a,function(t){return e[t]}.bind(null,a));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=19)}([function(e,t){!function(){e.exports=this.wp.element}()},function(e,t){!function(){e.exports=this.regeneratorRuntime}()},function(e,t){function r(e,t,r,n,a,c,o){try{var i=e[c](o),s=i.value}catch(e){return void r(e)}i.done?t(s):Promise.resolve(s).then(n,a)}e.exports=function(e){return function(){var t=this,n=arguments;return new Promise((function(a,c){var o=e.apply(t,n);function i(e){r(o,a,c,i,s,"next",e)}function s(e){r(o,a,c,i,s,"throw",e)}i(void 0)}))}}},function(e,t){!function(){e.exports=this.wp.primitives}()},function(e,t,r){var n=r(11),a=r(12),c=r(13),o=r(15);e.exports=function(e,t){return n(e)||a(e,t)||c(e,t)||o()}},function(e,t,r){"use strict";const n=r(16),a=r(17),c=r(18);function o(e){if("string"!=typeof e||1!==e.length)throw new TypeError("arrayFormatSeparator must be single character string")}function i(e,t){return t.encode?t.strict?n(e):encodeURIComponent(e):e}function s(e,t){return t.decode?a(e):e}function l(e){const t=e.indexOf("#");return-1!==t&&(e=e.slice(0,t)),e}function u(e){const t=(e=l(e)).indexOf("?");return-1===t?"":e.slice(t+1)}function p(e,t){return t.parseNumbers&&!Number.isNaN(Number(e))&&"string"==typeof e&&""!==e.trim()?e=Number(e):!t.parseBooleans||null===e||"true"!==e.toLowerCase()&&"false"!==e.toLowerCase()||(e="true"===e.toLowerCase()),e}function m(e,t){o((t=Object.assign({decode:!0,sort:!0,arrayFormat:"none",arrayFormatSeparator:",",parseNumbers:!1,parseBooleans:!1},t)).arrayFormatSeparator);const r=function(e){let t;switch(e.arrayFormat){case"index":return(e,r,n)=>{t=/\[(\d*)\]$/.exec(e),e=e.replace(/\[\d*\]$/,""),t?(void 0===n[e]&&(n[e]={}),n[e][t[1]]=r):n[e]=r};case"bracket":return(e,r,n)=>{t=/(\[\])$/.exec(e),e=e.replace(/\[\]$/,""),t?void 0!==n[e]?n[e]=[].concat(n[e],r):n[e]=[r]:n[e]=r};case"comma":case"separator":return(t,r,n)=>{const a="string"==typeof r&&r.includes(e.arrayFormatSeparator),c="string"==typeof r&&!a&&s(r,e).includes(e.arrayFormatSeparator);r=c?s(r,e):r;const o=a||c?r.split(e.arrayFormatSeparator).map(t=>s(t,e)):null===r?r:s(r,e);n[t]=o};default:return(e,t,r)=>{void 0!==r[e]?r[e]=[].concat(r[e],t):r[e]=t}}}(t),n=Object.create(null);if("string"!=typeof e)return n;if(!(e=e.trim().replace(/^[?#&]/,"")))return n;for(const a of e.split("&")){let[e,o]=c(t.decode?a.replace(/\+/g," "):a,"=");o=void 0===o?null:["comma","separator"].includes(t.arrayFormat)?o:s(o,t),r(s(e,t),o,n)}for(const e of Object.keys(n)){const r=n[e];if("object"==typeof r&&null!==r)for(const e of Object.keys(r))r[e]=p(r[e],t);else n[e]=p(r,t)}return!1===t.sort?n:(!0===t.sort?Object.keys(n).sort():Object.keys(n).sort(t.sort)).reduce((e,t)=>{const r=n[t];return Boolean(r)&&"object"==typeof r&&!Array.isArray(r)?e[t]=function e(t){return Array.isArray(t)?t.sort():"object"==typeof t?e(Object.keys(t)).sort((e,t)=>Number(e)-Number(t)).map(e=>t[e]):t}(r):e[t]=r,e},Object.create(null))}t.extract=u,t.parse=m,t.stringify=(e,t)=>{if(!e)return"";o((t=Object.assign({encode:!0,strict:!0,arrayFormat:"none",arrayFormatSeparator:","},t)).arrayFormatSeparator);const r=r=>t.skipNull&&null==e[r]||t.skipEmptyString&&""===e[r],n=function(e){switch(e.arrayFormat){case"index":return t=>(r,n)=>{const a=r.length;return void 0===n||e.skipNull&&null===n||e.skipEmptyString&&""===n?r:null===n?[...r,[i(t,e),"[",a,"]"].join("")]:[...r,[i(t,e),"[",i(a,e),"]=",i(n,e)].join("")]};case"bracket":return t=>(r,n)=>void 0===n||e.skipNull&&null===n||e.skipEmptyString&&""===n?r:null===n?[...r,[i(t,e),"[]"].join("")]:[...r,[i(t,e),"[]=",i(n,e)].join("")];case"comma":case"separator":return t=>(r,n)=>null==n||0===n.length?r:0===r.length?[[i(t,e),"=",i(n,e)].join("")]:[[r,i(n,e)].join(e.arrayFormatSeparator)];default:return t=>(r,n)=>void 0===n||e.skipNull&&null===n||e.skipEmptyString&&""===n?r:null===n?[...r,i(t,e)]:[...r,[i(t,e),"=",i(n,e)].join("")]}}(t),a={};for(const t of Object.keys(e))r(t)||(a[t]=e[t]);const c=Object.keys(a);return!1!==t.sort&&c.sort(t.sort),c.map(r=>{const a=e[r];return void 0===a?"":null===a?i(r,t):Array.isArray(a)?a.reduce(n(r),[]).join("&"):i(r,t)+"="+i(a,t)}).filter(e=>e.length>0).join("&")},t.parseUrl=(e,t)=>{t=Object.assign({decode:!0},t);const[r,n]=c(e,"#");return Object.assign({url:r.split("?")[0]||"",query:m(u(e),t)},t&&t.parseFragmentIdentifier&&n?{fragmentIdentifier:s(n,t)}:{})},t.stringifyUrl=(e,r)=>{r=Object.assign({encode:!0,strict:!0},r);const n=l(e.url).split("?")[0]||"",a=t.extract(e.url),c=t.parse(a,{sort:!1}),o=Object.assign(c,e.query);let s=t.stringify(o,r);s&&(s="?"+s);let u=function(e){let t="";const r=e.indexOf("#");return-1!==r&&(t=e.slice(r)),t}(e.url);return e.fragmentIdentifier&&(u="#"+i(e.fragmentIdentifier,r)),`${n}${s}${u}`}},function(e,t,r){var n;!function(){"use strict";var r={}.hasOwnProperty;function a(){for(var e=[],t=0;t<arguments.length;t++){var n=arguments[t];if(n){var c=typeof n;if("string"===c||"number"===c)e.push(n);else if(Array.isArray(n)&&n.length){var o=a.apply(null,n);o&&e.push(o)}else if("object"===c)for(var i in n)r.call(n,i)&&n[i]&&e.push(i)}}return e.join(" ")}e.exports?(a.default=a,e.exports=a):void 0===(n=function(){return a}.apply(t,[]))||(e.exports=n)}()},function(e,t){e.exports=function(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}},,,function(e,t,r){},function(e,t){e.exports=function(e){if(Array.isArray(e))return e}},function(e,t){e.exports=function(e,t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e)){var r=[],n=!0,a=!1,c=void 0;try{for(var o,i=e[Symbol.iterator]();!(n=(o=i.next()).done)&&(r.push(o.value),!t||r.length!==t);n=!0);}catch(e){a=!0,c=e}finally{try{n||null==i.return||i.return()}finally{if(a)throw c}}return r}}},function(e,t,r){var n=r(14);e.exports=function(e,t){if(e){if("string"==typeof e)return n(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?n(e,t):void 0}}},function(e,t){e.exports=function(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}},function(e,t){e.exports=function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}},function(e,t,r){"use strict";e.exports=e=>encodeURIComponent(e).replace(/[!'()*]/g,e=>"%"+e.charCodeAt(0).toString(16).toUpperCase())},function(e,t,r){"use strict";var n=new RegExp("%[a-f0-9]{2}","gi"),a=new RegExp("(%[a-f0-9]{2})+","gi");function c(e,t){try{return decodeURIComponent(e.join(""))}catch(e){}if(1===e.length)return e;t=t||1;var r=e.slice(0,t),n=e.slice(t);return Array.prototype.concat.call([],c(r),c(n))}function o(e){try{return decodeURIComponent(e)}catch(a){for(var t=e.match(n),r=1;r<t.length;r++)t=(e=c(t,r).join("")).match(n);return e}}e.exports=function(e){if("string"!=typeof e)throw new TypeError("Expected `encodedURI` to be of type `string`, got `"+typeof e+"`");try{return e=e.replace(/\+/g," "),decodeURIComponent(e)}catch(t){return function(e){for(var t={"%FE%FF":"��","%FF%FE":"��"},r=a.exec(e);r;){try{t[r[0]]=decodeURIComponent(r[0])}catch(e){var n=o(r[0]);n!==r[0]&&(t[r[0]]=n)}r=a.exec(e)}t["%C2"]="�";for(var c=Object.keys(t),i=0;i<c.length;i++){var s=c[i];e=e.replace(new RegExp(s,"g"),t[s])}return e}(e)}}},function(e,t,r){"use strict";e.exports=(e,t)=>{if("string"!=typeof e||"string"!=typeof t)throw new TypeError("Expected the arguments to be of type `string`");if(""===t)return[e];const r=e.indexOf(t);return-1===r?[e]:[e.slice(0,r),e.slice(r+t.length)]}},function(e,t,r){"use strict";r.r(t);r(10);var n=r(7),a=r.n(n);function c(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function o(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?c(Object(r),!0).forEach((function(t){a()(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):c(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}var i=wp.data.registerStore,s={isFetching:!0,isPreview:!1,tab:"library",templates:[],patterns:[],library:{items:[],currentPage:0,totalPages:0},preview:{type:"templates",item:{}}};i("tpc/block-editor",{reducer:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:s,t=arguments.length>1?arguments[1]:void 0;return"SET_FETCHING"===t.type?o(o({},e),{},{isFetching:t.isFetching}):"TOGGLE_PREVIEW"===t.type?o(o({},e),{},{isPreview:!e.isPreview}):"UPDATE_CURRENT_TAB"===t.type?e.isPreview?e:o(o({},e),{},{tab:t.tab}):"UPDATE_TEMPLATES"===t.type?o(o({},e),{},{templates:t.items}):"UPDATE_PATTERNS"===t.type?o(o({},e),{},{patterns:t.items}):"UPDATE_LIBRARY"===t.type?o(o({},e),{},{library:{items:t.items,currentPage:Number(t.currentPage),totalPages:Number(t.totalPages)}}):"SET_PREVIEW_DATA"===t.type?o(o({},e),{},{preview:t.preview}):e},selectors:{isFetching:function(e){return e.isFetching},isPreview:function(e){return e.isPreview},getCurrentTab:function(e){return e.tab},getTemplates:function(e){return e.templates},getPatterns:function(e){return e.patterns},getLibrary:function(e){return e.library},getPreview:function(e){return e.preview}},actions:{setFetching:function(e){return{type:"SET_FETCHING",isFetching:e}},togglePreview:function(e){return{type:"TOGGLE_PREVIEW",isPreview:e}},updateCurrentTab:function(e){return{type:"UPDATE_CURRENT_TAB",tab:e}},updateTemplates:function(e){return{type:"UPDATE_TEMPLATES",items:e}},updatePatterns:function(e){return{type:"UPDATE_PATTERNS",items:e}},updateLibrary:function(e,t,r){return{type:"UPDATE_LIBRARY",items:e,currentPage:t,totalPages:r}},setPreviewData:function(e){return{type:"SET_PREVIEW_DATA",preview:e}}}});var l=r(0),u=wp.primitives,p=u.Path,m=u.SVG,d=function(){return Object(l.createElement)(m,{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg"},Object(l.createElement)(p,{d:"M22.8063 24H1.19365C0.534714 24 0 23.4653 0 22.8063V1.19365C0 0.534714 0.534714 0 1.19365 0H22.8063C23.4653 0 24 0.534714 24 1.19365V22.8063C24 23.4653 23.4653 24 22.8063 24Z",fill:"#14171C"}),Object(l.createElement)(p,{d:"M19.8466 20.8187V7.39687V4.43164H16.884H3.45947L6.422 7.39687H16.884V17.8562L19.8466 20.8187Z",fill:"white"}),Object(l.createElement)(p,{d:"M10.138 14.1429L10.1407 17.0838L12.7764 19.7195L12.7656 11.5152L4.55859 11.5044L7.19435 14.1375L10.138 14.1429Z",fill:"white"}))},f=function(){return Object(l.createElement)(m,{width:"100",height:"100",viewBox:"0 0 100 100",fill:"none",xmlns:"http://www.w3.org/2000/svg",className:"wp-block-ti-tpc-templates-cloud__icon"},Object(l.createElement)(p,{d:"M95.0264 100H4.97356C2.22797 100 0 97.772 0 95.0264V4.97356C0 2.22797 2.22797 0 4.97356 0H95.0264C97.772 0 100 2.22797 100 4.97356V95.0264C100 97.772 97.772 100 95.0264 100Z",fill:"#0366D6"}),Object(l.createElement)(p,{d:"M82.6941 86.7448V30.8205V18.4653H70.3502H14.4146L26.7584 30.8205H70.3502V74.401L82.6941 86.7448Z",fill:"white"}),Object(l.createElement)(p,{d:"M42.2416 58.9291L42.2528 71.183L53.2352 82.1653L53.1902 47.9806L18.9941 47.9355L29.9765 58.9066L42.2416 58.9291Z",fill:"white"}))},b=r(1),w=r.n(b),g=r(2),v=r.n(g),y=r(4),h=r.n(y),O=r(5),j="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)||"undefined"!=typeof msCrypto&&"function"==typeof msCrypto.getRandomValues&&msCrypto.getRandomValues.bind(msCrypto),_=new Uint8Array(16);function k(){if(!j)throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return j(_)}var E=/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;for(var x=function(e){return"string"==typeof e&&E.test(e)},P=[],S=0;S<256;++S)P.push((S+256).toString(16).substr(1));var T=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,r=(P[e[t+0]]+P[e[t+1]]+P[e[t+2]]+P[e[t+3]]+"-"+P[e[t+4]]+P[e[t+5]]+"-"+P[e[t+6]]+P[e[t+7]]+"-"+P[e[t+8]]+P[e[t+9]]+"-"+P[e[t+10]]+P[e[t+11]]+P[e[t+12]]+P[e[t+13]]+P[e[t+14]]+P[e[t+15]]).toLowerCase();if(!x(r))throw TypeError("Stringified UUID is invalid");return r};var C=function(e,t,r){var n=(e=e||{}).random||(e.rng||k)();if(n[6]=15&n[6]|64,n[8]=63&n[8]|128,t){r=r||0;for(var a=0;a<16;++a)t[r+a]=n[a];return t}return T(n)};function B(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function N(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?B(Object(r),!0).forEach((function(t){a()(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):B(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}var L=wp.i18n.__,A=wp.apiFetch,F=wp.blocks.serialize,I=wp.components,D=I.Button,V=I.Icon,M=I.Modal,R=I.PanelBody,U=I.TextControl,H=I.ToggleControl,z=wp.data,G=z.useDispatch,q=z.useSelect,$=wp.editPost,W=$.PluginBlockSettingsMenuItem,Z=$.PluginSidebar,Y=$.PluginSidebarMoreMenuItem,J=wp.element,K=J.Fragment,Q=J.useState,X=J.useEffect,ee=function(){var e=Q(!1),t=h()(e,2),r=t[0],n=t[1],a=Q(!1),c=h()(a,2),o=c[0],i=c[1],s=Q(""),u=h()(s,2),p=u[0],m=u[1],f=G("core/notices"),b=f.createErrorNotice,g=f.createSuccessNotice,y=G("core/editor").editPost,j=q((function(e){var t=e("core/block-editor"),r=t.getSelectedBlockCount,n=t.getSelectedBlock,a=t.getMultiSelectedBlocks,c=1===r()?n():a();return F(c)}),[]),_=q((function(e){var t=(0,e("core/block-editor").getBlocks)();return F(t)}),[]),k=q((function(e){return{meta:e("core/editor").getEditedPostAttribute("meta")||{},postTitle:e("core/editor").getEditedPostAttribute("title")||L("Template")}})),E=k.meta,x=k.postTitle,P=k.meta,S=P._template_sync,T=P._template_id,B=q((function(e,t){var r=t.forceIsSaving,n=e("core/editor"),a=n.isSavingPost,c=n.isPublishingPost,o=n.isAutosavingPost,i=r||a(),s=o();return(c()||i)&&!s})),I=Q(S),z=h()(I,2),$=z[0],J=z[1],ee=Q(T),te=h()(ee,2),re=te[0],ne=te[1];X((function(){y({meta:N(N({},E),{},{_template_sync:$,_template_id:re})})}),[$,re]),X((function(){B&&$&&ce()}),[B,$]);var ae=function(){var e=v()(w.a.mark((function e(){var t,r,a,c;return w.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return i(!0),t={__file:"wp_export",version:2,content:j},r=Object(O.stringifyUrl)({url:window.tiTpc.endpoint,query:N(N({},window.tiTpc.params),{},{template_name:p,template_type:"gutenberg"})}),e.prev=3,e.next=6,A({url:r,method:"POST",data:t,parse:!1});case 6:if(!(a=e.sent).ok){e.next=12;break}return e.next=10,a.json();case 10:(c=e.sent).message?b(c.message,{type:"snackbar"}):(window.localStorage.setItem("tpcCacheBuster",C()),g(L("Template saved."),{type:"snackbar"}));case 12:e.next=17;break;case 14:e.prev=14,e.t0=e.catch(3),e.t0.message&&b(e.t0.message,{type:"snackbar"});case 17:i(!1),n(!1),m("");case 20:case"end":return e.stop()}}),e,null,[[3,14]])})));return function(){return e.apply(this,arguments)}}(),ce=function(){var e=v()(w.a.mark((function e(){var t,r,n,a;return w.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return i(!0),t={__file:"wp_export",version:2,content:_},r=re?Object(O.stringifyUrl)({url:window.tiTpc.endpoint+re,query:N(N({},window.tiTpc.params),{},{template_name:x})}):Object(O.stringifyUrl)({url:window.tiTpc.endpoint,query:N(N({},window.tiTpc.params),{},{template_name:x,template_type:"gutenberg"})}),e.prev=3,e.next=6,A({url:r,method:"POST",data:t,parse:!1});case 6:if(!(n=e.sent).ok){e.next=12;break}return e.next=10,n.json();case 10:(a=e.sent).message?b(a.message,{type:"snackbar"}):(a.template_id&&ne(a.template_id),window.localStorage.setItem("tpcCacheBuster",C()),g(L("Template saved."),{type:"snackbar"}));case 12:e.next=17;break;case 14:e.prev=14,e.t0=e.catch(3),e.t0.message&&b(e.t0.message,{type:"snackbar"});case 17:i(!1);case 18:case"end":return e.stop()}}),e,null,[[3,14]])})));return function(){return e.apply(this,arguments)}}();return Object(l.createElement)(K,null,Object(l.createElement)(W,{label:L("Save as Template"),icon:"none",onClick:function(){return n(!0)}}),Object(l.createElement)(Y,{icon:Object(l.createElement)(V,{icon:d}),target:"ti-tpc"},L("Templates Cloud")),Object(l.createElement)(Z,{name:"ti-tpc",title:L("Templates Cloud"),className:"ti-tpc-components-panel"},Object(l.createElement)(R,null,L("Save this page as a template in your Templates Cloud library."),Object(l.createElement)(D,{isPrimary:!0,isLarge:!0,isBusy:o,disabled:o,onClick:ce},L("Save Page as Template")),Object(l.createElement)(H,{label:L("Automatically sync to the cloud"),checked:$,onChange:function(){return J(!$)}}))),r&&Object(l.createElement)(M,{title:L("Save Template"),onRequestClose:function(){return n(!1)}},Object(l.createElement)(U,{label:L("Template Name"),value:p,onChange:m}),Object(l.createElement)(D,{isPrimary:!0,isBusy:o,disabled:o,onClick:ae},L("Save"))))},te=r(3),re=Object(l.createElement)(te.SVG,{xmlns:"http://www.w3.org/2000/svg",viewBox:"-2 -2 24 24"},Object(l.createElement)(te.Path,{d:"M10.2 3.28c3.53 0 6.43 2.61 6.92 6h2.08l-3.5 4-3.5-4h2.32c-.45-1.97-2.21-3.45-4.32-3.45-1.45 0-2.73.71-3.54 1.78L4.95 5.66C6.23 4.2 8.11 3.28 10.2 3.28zm-.4 13.44c-3.52 0-6.43-2.61-6.92-6H.8l3.5-4c1.17 1.33 2.33 2.67 3.5 4H5.48c.45 1.97 2.21 3.45 4.32 3.45 1.45 0 2.73-.71 3.54-1.78l1.71 1.95c-1.28 1.46-3.15 2.38-5.25 2.38z"})),ne=Object(l.createElement)(te.SVG,{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},Object(l.createElement)(te.Path,{d:"M13 11.9l3.3-3.4-1.1-1-3.2 3.3-3.2-3.3-1.1 1 3.3 3.4-3.5 3.6 1 1L12 13l3.5 3.5 1-1z"})),ae=r(6),ce=r.n(ae);function oe(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function ie(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?oe(Object(r),!0).forEach((function(t){a()(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):oe(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}var se=wp.apiFetch,le=wp.data.dispatch,ue=le("tpc/block-editor").updateLibrary,pe=le("core/notices").createNotice,me=function(e){pe("warning",e,{context:"themeisle-blocks/notices/templates-cloud",isDismissible:!0})},de=function(){var e=v()(w.a.mark((function e(){var t,r,n,a,c,o,i=arguments;return w.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=i.length>0&&void 0!==i[0]?i[0]:{per_page:10,page:0},r=Object(O.stringifyUrl)({url:window.tiTpc.endpoint,query:ie(ie({cache:window.localStorage.getItem("tpcCacheBuster")},window.tiTpc.params),t)}),e.prev=2,e.next=5,se({url:r,method:"GET",parse:!1});case 5:if(!(n=e.sent).ok){e.next=15;break}return e.next=9,n.json();case 9:if(!(a=e.sent).message){e.next=12;break}return e.abrupt("return",me(a.message));case 12:c=n.headers.get("x-wp-totalpages"),o=t.page,ue(a,o,c);case 15:e.next=20;break;case 17:e.prev=17,e.t0=e.catch(2),e.t0.message&&me(e.t0.message);case 20:case"end":return e.stop()}}),e,null,[[2,17]])})));return function(){return e.apply(this,arguments)}}(),fe=function(){var e=v()(w.a.mark((function e(t){var r,n,a;return w.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=Object(O.stringifyUrl)({url:window.tiTpc.endpoint+t.template_id,query:ie(ie({cache:window.localStorage.getItem("tpcCacheBuster")},window.tiTpc.params),t)}),e.prev=1,e.next=4,se({url:r,method:"POST",data:t,parse:!1});case 4:if(!(n=e.sent).ok){e.next=11;break}return e.next=8,n.json();case 8:if(!(a=e.sent).message){e.next=11;break}return e.abrupt("return",me(a.message));case 11:return window.localStorage.setItem("tpcCacheBuster",C()),e.next=14,de();case 14:e.next=19;break;case 16:e.prev=16,e.t0=e.catch(1),e.t0.message&&me(e.t0.message);case 19:case"end":return e.stop()}}),e,null,[[1,16]])})));return function(t){return e.apply(this,arguments)}}(),be=function(){var e=v()(w.a.mark((function e(t){var r,n,a;return w.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=Object(O.stringifyUrl)({url:window.tiTpc.endpoint+t+"/import",query:ie({cache:window.localStorage.getItem("tpcCacheBuster")},window.tiTpc.params)}),n={},e.prev=2,e.next=5,se({url:r,method:"GET",parse:!1});case 5:if(!(a=e.sent).ok){e.next=12;break}return e.next=9,a.json();case 9:if(!(n=e.sent).message){e.next=12;break}return e.abrupt("return",me(n.message));case 12:e.next=17;break;case 14:e.prev=14,e.t0=e.catch(2),e.t0.message&&me(e.t0.message);case 17:return e.abrupt("return",n);case 18:case"end":return e.stop()}}),e,null,[[2,14]])})));return function(t){return e.apply(this,arguments)}}(),we=function(){var e=v()(w.a.mark((function e(t){var r,n,a;return w.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=Object(O.stringifyUrl)({url:window.tiTpc.endpoint+t+"/clone",query:ie({cache:window.localStorage.getItem("tpcCacheBuster")},window.tiTpc.params)}),e.prev=1,e.next=4,se({url:r,method:"POST",parse:!1});case 4:if(!(n=e.sent).ok){e.next=11;break}return e.next=8,n.json();case 8:if(!(a=e.sent).message){e.next=11;break}return e.abrupt("return",me(a.message));case 11:return window.localStorage.setItem("tpcCacheBuster",C()),e.next=14,de();case 14:e.next=19;break;case 16:e.prev=16,e.t0=e.catch(1),e.t0.message&&me(e.t0.message);case 19:case"end":return e.stop()}}),e,null,[[1,16]])})));return function(t){return e.apply(this,arguments)}}(),ge=function(){var e=v()(w.a.mark((function e(t){var r,n,a;return w.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=Object(O.stringifyUrl)({url:window.tiTpc.endpoint+t,query:ie({cache:window.localStorage.getItem("tpcCacheBuster"),_method:"DELETE"},window.tiTpc.params)}),e.prev=1,e.next=4,se({url:r,method:"POST"});case 4:if(!(n=e.sent).ok){e.next=11;break}return e.next=8,n.json();case 8:if(!(a=e.sent).message){e.next=11;break}return e.abrupt("return",me(a.message));case 11:return window.localStorage.setItem("tpcCacheBuster",C()),e.next=14,de();case 14:e.next=19;break;case 16:e.prev=16,e.t0=e.catch(1),e.t0.message&&me(e.t0.message);case 19:case"end":return e.stop()}}),e,null,[[1,16]])})));return function(t){return e.apply(this,arguments)}}(),ve=wp.i18n.__,ye=wp.components,he=ye.Button,Oe=ye.ButtonGroup,je=ye.Icon,_e=wp.data,ke=_e.useDispatch,Ee=_e.useSelect,xe={templates:ve("Page Templates"),patterns:ve("Patterns"),library:ve("My Library")},Pe=function(e){var t=e.closeModal,r=ke("tpc/block-editor"),n=r.setFetching,a=r.updateCurrentTab,c=Ee((function(e){return e("tpc/block-editor").isFetching()})),o=Ee((function(e){return e("tpc/block-editor").isPreview()})),i=Ee((function(e){return e("tpc/block-editor").getCurrentTab()})),s=function(){var e=v()(w.a.mark((function e(){return w.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return window.localStorage.setItem("tpcCacheBuster",C()),n(!0),e.next=4,de();case 4:n(!1);case 5:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return Object(l.createElement)("div",{className:"wp-block-ti-tpc-templates-cloud__modal-header"},Object(l.createElement)("div",{className:"wp-block-ti-tpc-templates-cloud__modal-header__left"},Object(l.createElement)(je,{icon:f})),Object(l.createElement)("div",{className:"wp-block-ti-tpc-templates-cloud__modal-header__center"},Object.keys(xe).map((function(e){return Object(l.createElement)(he,{key:e,onClick:function(){return a(e)},className:ce()("wp-block-ti-tpc-templates-cloud__modal-header__tabs",{"is-active":e===i})},xe[e])}))),Object(l.createElement)("div",{className:"wp-block-ti-tpc-templates-cloud__modal-header__right"},"library"===i&&!o&&Object(l.createElement)(Oe,null,Object(l.createElement)(he,{label:ve("Re-sync Library"),icon:re,disabled:c,className:ce()("is-sync",{"is-loading":c}),onClick:s})),Object(l.createElement)(he,{label:ve("Close Modal"),icon:ne,onClick:t})))},Se=wp.i18n.__,Te=wp.blocks.parse,Ce=wp.blockEditor.BlockPreview,Be=wp.components,Ne=Be.Button,Le=Be.Placeholder,Ae=Be.Spinner,Fe=wp.compose.useViewportMatch,Ie=wp.data,De=Ie.useDispatch,Ve=Ie.useSelect,Me=wp.element,Re=Me.useEffect,Ue=Me.useState,He=function(e){var t=e.isFetching,r=e.importBlocks,n=Fe("large",">="),a=Fe("large","<="),c=Fe("small",">="),o=Fe("small","<="),i=1400;!n&&!a&&c&&!o?i=960:!(n||a||c||o)&&(i=600);var s=De("tpc/block-editor"),u=s.setFetching,p=s.togglePreview,m=Ve((function(e){return e("tpc/block-editor").getPreview()})).item;Re((function(){y()}),[]);var d=Ue(""),f=h()(d,2),b=f[0],g=f[1],y=function(){var e=v()(w.a.mark((function e(){return w.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return u(!0),e.next=3,O();case 3:u(!1);case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),O=function(){var e=v()(w.a.mark((function e(){var t;return w.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return u(!0),e.next=3,be(m.template_id);case 3:(t=e.sent).__file&&t.content&&"wp_export"===t.__file&&g(t.content),u(!1);case 6:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return Object(l.createElement)("div",{className:"wp-block-ti-tpc-templates-cloud__modal-content"},Object(l.createElement)("div",{className:"wp-block-ti-tpc-templates-cloud__modal-content__preview-header"},Object(l.createElement)("div",{className:"wp-block-ti-tpc-templates-cloud__modal-content__preview-header__left"},m.template_name||Se("Template")),Object(l.createElement)("div",{className:"wp-block-ti-tpc-templates-cloud__modal-content__preview-header__right"},Object(l.createElement)(Ne,{isSecondary:!0,isLarge:!0,onClick:p},Se("Close Preview")),Object(l.createElement)(Ne,{isPrimary:!0,isLarge:!0,isBusy:t,disabled:t,onClick:function(){p(),r(b)}},Se("Import")))),t?Object(l.createElement)(Le,null,Object(l.createElement)(Ae,null)):Object(l.createElement)("div",{className:"wp-block-ti-tpc-templates-cloud__modal-content__preview-content"},Object(l.createElement)(Ce,{blocks:Te(b),viewportWidth:i})))},ze=Object(l.createElement)(te.SVG,{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},Object(l.createElement)(te.Path,{d:"M7 5.5h10a.5.5 0 01.5.5v12a.5.5 0 01-.5.5H7a.5.5 0 01-.5-.5V6a.5.5 0 01.5-.5zM17 4H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2zm-1 3.75H8v1.5h8v-1.5zM8 11h8v1.5H8V11zm6 3.25H8v1.5h6v-1.5z"})),Ge=Object(l.createElement)(te.SVG,{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},Object(l.createElement)(te.Path,{d:"M18.3 5.6L9.9 16.9l-4.6-3.4-.9 1.2 5.8 4.3 9.3-12.6z"})),qe=Object(l.createElement)(te.SVG,{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},Object(l.createElement)(te.Path,{d:"M20.1 5.1L16.9 2 6.2 12.7l-1.3 4.4 4.5-1.3L20.1 5.1zM4 20.8h8v-1.5H4v1.5z"})),$e=Object(l.createElement)(te.SVG,{viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg"},Object(l.createElement)(te.Path,{d:"M18 4h-7c-1.1 0-2 .9-2 2v3H6c-1.1 0-2 .9-2 2v7c0 1.1.9 2 2 2h7c1.1 0 2-.9 2-2v-3h3c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-4.5 14c0 .3-.2.5-.5.5H6c-.3 0-.5-.2-.5-.5v-7c0-.3.2-.5.5-.5h3V13c0 1.1.9 2 2 2h2.5v3zm0-4.5H11c-.3 0-.5-.2-.5-.5v-2.5H13c.3 0 .5.2.5.5v2.5zm5-.5c0 .3-.2.5-.5.5h-3V11c0-1.1-.9-2-2-2h-2.5V6c0-.3.2-.5.5-.5h7c.3 0 .5.2.5.5v7z"})),We=Object(l.createElement)(te.SVG,{xmlns:"http://www.w3.org/2000/svg",viewBox:"-2 -2 24 24"},Object(l.createElement)(te.Path,{d:"M12 4h3c.6 0 1 .4 1 1v1H3V5c0-.6.5-1 1-1h3c.2-1.1 1.3-2 2.5-2s2.3.9 2.5 2zM8 4h3c-.2-.6-.9-1-1.5-1S8.2 3.4 8 4zM4 7h11l-.9 10.1c0 .5-.5.9-1 .9H5.9c-.5 0-.9-.4-1-.9L4 7z"})),Ze=wp.i18n.__,Ye=wp.components,Je=Ye.Button,Ke=Ye.Icon,Qe=Ye.TextControl,Xe=wp.data.useDispatch,et=wp.element.useState,tt=function(e){var t=e.item,r=e.importBlocks,n=Xe("tpc/block-editor"),a=n.togglePreview,c=n.setPreviewData,o=et(!1),i=h()(o,2),s=i[0],u=i[1],p=et(!1),m=h()(p,2),d=m[0],f=m[1],b=et(t.template_name),g=h()(b,2),y=g[0],O=g[1],j=function(){var e=v()(w.a.mark((function e(){var n;return w.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return u("importing"),e.next=3,be(t.template_id);case 3:(n=e.sent).__file&&n.content&&"wp_export"===n.__file&&r(n.content),u(!1);case 6:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),_=function(){var e=v()(w.a.mark((function e(){return w.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return u("updating"),e.next=3,fe({template_id:t.template_id,template_name:y||t.template_name});case 3:u(!1),f(!d);case 5:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),k=function(){var e=v()(w.a.mark((function e(){return w.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return u("duplicating"),e.next=3,we(t.template_id);case 3:u(!1);case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),E=function(){var e=v()(w.a.mark((function e(){return w.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(window.confirm(Ze("Are you sure you want to delete this template?"))){e.next=2;break}return e.abrupt("return",!1);case 2:return u("deleting"),e.next=5,ge(t.template_id);case 5:u(!1);case 6:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),x=function(){var e=v()(w.a.mark((function e(){return w.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:a(),c({type:"library",item:t});case 2:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return Object(l.createElement)("div",{key:t.template_id,className:"wp-block-ti-tpc-templates-cloud__modal-content__table_row"},Object(l.createElement)("div",{className:"wp-block-ti-tpc-templates-cloud__modal-content__table_row__title"},Object(l.createElement)(Ke,{icon:ze}),d?Object(l.createElement)(Qe,{label:Ze("Template Name"),hideLabelFromVision:!0,value:y,onChange:O}):t.template_name),Object(l.createElement)("div",{className:"wp-block-ti-tpc-templates-cloud__modal-content__table_row__controls"},Object(l.createElement)(Je,{label:Ze(d?"Update":"Edit"),icon:d?"updating"===s?re:Ge:qe,disabled:!1!==s,className:ce()({"is-loading":"updating"===s}),onClick:d?_:function(){return f(!d)}}),Object(l.createElement)(Je,{label:Ze("Duplicate"),icon:"duplicating"===s?re:$e,disabled:!1!==s,className:ce()({"is-loading":"duplicating"===s}),onClick:k}),Object(l.createElement)(Je,{label:Ze("Delete"),icon:"deleting"===s?re:We,disabled:!1!==s,className:ce()({"is-loading":"deleting"===s}),onClick:E})),Object(l.createElement)("div",{className:"wp-block-ti-tpc-templates-cloud__modal-content__table_row__actions"},Object(l.createElement)(Je,{isSecondary:!0,isLarge:!0,disabled:!1!==s,onClick:x},Ze("Preview")),Object(l.createElement)(Je,{isPrimary:!0,isLarge:!0,isBusy:"importing"===s,disabled:!1!==s,onClick:j},Ze("Import"))))},rt=wp.i18n.__,nt=wp.components,at=nt.Button,ct=nt.ButtonGroup,ot=nt.Placeholder,it=nt.Spinner,st=wp.data,lt=st.useDispatch,ut=st.useSelect,pt=function(e){var t=e.isFetching,r=e.importBlocks,n=lt("tpc/block-editor").setFetching,a=ut((function(e){return e("tpc/block-editor").getLibrary()})),c=a.items,o=a.currentPage,i=a.totalPages,s=[],u=function(){var e=v()(w.a.mark((function e(t){return w.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n(!0),e.next=3,de({per_page:10,page:t});case 3:n(!1);case 4:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}();return t?Object(l.createElement)(ot,null,Object(l.createElement)(it,null)):Boolean(c.length)?Object(l.createElement)("div",{className:"wp-block-ti-tpc-templates-cloud__modal-content__table"},c.map((function(e){return Object(l.createElement)(tt,{key:e.template_id,item:e,importBlocks:r})})),1<i&&Object(l.createElement)(ct,{className:"wp-block-ti-tpc-templates-cloud__modal-content__pagination"},Object(l.createElement)((function(){for(var e=0;e<i;e++){var t=e===o;s.push(Object(l.createElement)(at,{isPrimary:t,disabled:t,onClick:u},e+1))}return s}),null))):Object(l.createElement)("div",{className:"wp-block-ti-tpc-templates-cloud__modal-content__table"},rt("No templates available. Add a new one?"))},mt=wp.components.Notice,dt=wp.data,ft=dt.useDispatch,bt=dt.useSelect,wt=function(){var e=bt((function(e){return e("core/notices").getNotices("themeisle-blocks/notices/templates-cloud")})),t=ft("core/notices").removeNotice;return Object(l.createElement)("div",{className:"wp-block-ti-tpc-templates-cloud__modal-content__notices"},e.map((function(e){return Object(l.createElement)(mt,{key:e.id,status:e.status,isDismissible:e.isDismissible,onRemove:function(){return t(e.id,"themeisle-blocks/notices/templates-cloud")},actions:e.actions},e.content)})))},gt=wp.i18n.__,vt=wp.data,yt=vt.useDispatch,ht=vt.useSelect,Ot=wp.element.useEffect,jt=function(e){var t=e.importBlocks,r=yt("tpc/block-editor").setFetching,n=ht((function(e){return e("tpc/block-editor").isFetching()})),a=ht((function(e){return e("tpc/block-editor").isPreview()})),c=ht((function(e){return e("tpc/block-editor").getCurrentTab()}));Ot((function(){o()}),[]);var o=function(){var e=v()(w.a.mark((function e(){return w.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r(!0),e.next=3,de();case 3:r(!1);case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return a?Object(l.createElement)(He,{isFetching:n,importBlocks:t}):Object(l.createElement)("div",{className:"wp-block-ti-tpc-templates-cloud__modal-content"},Object(l.createElement)(wt,null),"library"===c?Object(l.createElement)(pt,{isFetching:n,importBlocks:t}):gt("We are still working on this. Please check back later. Thank you!"))},_t=wp.blocks.parse,kt=wp.components.Modal,Et=wp.data.useDispatch,xt=function(e){var t=e.clientId,r=Et("core/block-editor"),n=r.removeBlock,a=r.replaceBlocks,c=function(){return n(t)};return Object(l.createElement)(kt,{onRequestClose:c,shouldCloseOnEsc:!1,shouldCloseOnClickOutside:!1,isDismissible:!1,overlayClassName:"wp-block-ti-tpc-templates-cloud__modal"},Object(l.createElement)(Pe,{closeModal:c}),Object(l.createElement)(jt,{importBlocks:function(e){return a(t,_t(e))}}))},Pt=wp.i18n.__,St=wp.blocks.registerBlockType,Tt=wp.plugins.registerPlugin;St("ti-tpc/templates-cloud",{title:Pt("Templates Cloud"),description:Pt("A cloud based templates library which enables you to create ready-made website in no time."),icon:d,category:"design",keywords:["templates cloud","patterns","template library"],supports:{html:!1},edit:xt,save:function(){return null}}),Tt("ti-tpc",{render:ee,icon:d})}]);