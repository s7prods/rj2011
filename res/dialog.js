/**
 * Dialog JavaScript 
 * Made by shc0743(https://github.com/shc0743/)
 * Copyright 2021(c) shc0743. All rights reserved.
 */
 "I don't do that 'use strict'.";

 /*
 Usage:
 CreateDialogEx({
     element: A DOM element,
     modal?: Is a modal dialog,
     
 })
 CreateDialog(DlgElement,modal)
 */
 
 (function () {
     function loadjs(newJS) {
         var scriptObj = document.createElement("script");
         scriptObj.src = newJS;
         var p = new Promise(function (resolve, reject) {
             scriptObj.onload = function (e) {
                 resolve(e);
             };
             scriptObj.onerror = function (e) {
                 reject(e);
             };
             document.head.append(scriptObj);
         });
         return p;
     }
     if (!(window.loadjs)) Object.defineProperty(window, "loadjs", {
         value: loadjs,
         writable: false,
         enumerable: true,
         configurable: true
     });
     if (window.jQuery) return;
     loadjs("https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.js");
 })();
 window.addEventListener("load", function () {
     (function (
         window,
         parent,
         undefined,
         document,
         eval,
         Object,
         event,
         TRUE,
         _,
         __,
         ___,
         $,
         self,
         CopyRightInfo) {
         if (TRUE !== true) throw TRUE;
         let stylel = document.createElement("style");
         stylel.innerHTML = `
         a{
             cursor: pointer;
             color: blue;
         }
         button{
             cursor: pointer;
         }
         *[disabled]{
             cursor: not-allowed !important;
         }
         .dialog{
             position: fixed;
             left: 50%;
             top : 50%;
             z-index: 57;
             border: 1px solid #000;
         }
         .dlgmodal{
             /*transform: translate(-50%,-50%);*/
             z-index: 75;
         }
         dialogtitle, .dialogtitle{
             /*border-bottom: 1px solid;*/
             margin: 10px 10px;
             padding: 10px 10px;
             background: #e9e9e9;
             border: 1px solid #dddddd;
             display: block;
         }
         .closebtn{
             cursor: pointer;
             position: absolute;
             right: 11px;
         }
         .maxbtn{
             cursor: pointer;
             position: absolute;
             right:20px;
         }
         .rbmenu{
             position: fixed;
             background: #ffffff;
             border: 1px solid #ccc;
             padding: 5px 5px;
             z-index: 76;
         }
         `;
         self.window.document.head.appendChild(stylel);
         function getRandom(min, max) {
             return Math.floor(Math.random() * (max - min + 1)) + min;
         }
         function BindMove(el, q) {
             var definedCursor;
             $(el.querySelector(q)).mousedown(function (e) {
                 definedCursor = el.querySelector(q).style.cursor; el.querySelector(q).style.cursor = 'move';
                 //设置移动后的默认位置
                 var endx = 0;
                 var endy = 0;
                 //获取div的初始位置，要注意的是需要转整型，因为获取到值带px
                 var left = parseInt($(el).css("left"));
                 var top = parseInt($(el).css("top"));
                 //获取鼠标按下时的坐标，区别于下面的es.pageX,es.pageY
                 var downx = e.pageX;
                 var downy = e.pageY;  //pageY的y要大写，必须大写！
                 // 鼠标按下时给div挂事件
                 $(el).bind("mousemove", function (es) {
                     //es.pageX,es.pageY:获取鼠标移动后的坐标
                     var endx = es.pageX - downx + left;  //计算div的最终位置
                     var endy = es.pageY - downy + top;
                     if (endx < 0) endx = 0; if (endy < 0) endy = 0;
                     //带上单位
                     $(el).css("left", endx + "px").css("top", endy + "px")
                 });
             })
             $(el.querySelector(q)).mouseup(function () {
                 el.querySelector(q).style.cursor = definedCursor;
                 //鼠标弹起时给div取消事件
                 $(el).unbind("mousemove");
             })
             $(document).mouseup(function (e) {
                 dragJob = false;
             });
         };
 
         function BindResize(el, cel, isLeftOrTop = false) {
             //初始化参数
             var els = el.style,
                 //鼠标的 X 和 Y 轴坐标 
                 x = y = 0;
             var cels = cel.style;
             $(el).mousedown(function (e) {
                 //按下元素后，计算当前鼠标与对象计算后的坐标 
                 if (isLeftOrTop) {
                     x = cel.offsetWidth - e.clientX,
                         y = cel.offsetHeight - e.clientY;
                 } else {
                     x = e.clientX - cel.offsetWidth,
                         y = e.clientY - cel.offsetHeight;
                 }
                 //在支持 setCaptue 做些东东 
                 el.setCapture ? (
                     //捕捉焦点 
                     el.setCapture(),
                     //设置事件 
                     el.onmousemove = function (ev) {
                         mouseMove(ev || event)
                     },
                     el.onmouseup = mouseUp
                 ) : (
                     //绑定事件 
                     $(document).bind("mousemove", mouseMove).bind("mouseup", mouseUp)
                 );
                 //防止默认事件
                 e.preventDefault()
             });
             function mouseMove(e) {
                 //if(isLeftOrTop){
                 //    cels.width = x - e.clientX + 'px'
                 //    cels.height = y - e.clientY + 'px'
                 //} else {
                 cels.width = e.clientX - x + 'px'
                 cels.height = e.clientY - y + 'px'
                 //}
             }
             //停止事件 
             function mouseUp() {
                 //在支持 releaseCapture 做些东东 
                 el.releaseCapture ? (
                     //释放焦点 
                     el.releaseCapture(),
                     //移除事件 
                     el.onmousemove = el.onmouseup = null
                 ) : (
                     //卸载事件
                     $(document).unbind("mousemove", mouseMove).unbind("mouseup", mouseUp)
                 )
             }
         }
 
         function CenterElement(ele) {
             var eleW = ele.offsetWidth;
             var eleH = ele.offsetHeight;
             var height = window.document.documentElement.clientHeight;
             var width = window.document.documentElement.clientWidth;
             var left = (width - eleW) / 2;
             var top = (height - eleH) / 2;
 
             ele.style.left = left + "px";
             ele.style.top = top + "px";
         }
 
         if (CopyRightInfo == "Copyright 2021(c) shc0743. All rights reserved.") {
             return (
                 (function (___) {
                     function CreateDialog(DlgElement, modal) {
                         var o = {
                             element: DlgElement,
                             modal: modal,
                         };
                         return CreateDialogEx(o);
                     }
                     Object.defineProperty(window, "CreateDialog", {
                         enumerable: true,
                         configurable: true,
                         get() {
                             return CreateDialog;
                         },
                         set(val) {
                             throw new SyntaxError("Try to change readonly attribute \"CreateDialog\" for value \"" + val + "\".");
                         }
                     });
                     Object.defineProperty(window, "EndDialog", {
                         enumerable: true,
                         configurable: true,
                         get() {
                             return (DlgElement) => {
                                 return CreateDialogEx.remove(DlgElement);
                             };
                         },
                         set(val) {
                             throw new SyntaxError("Try to change readonly attribute \"EndDialog\" for value \"" + val + "\".");
                         }
                     });
 
                     //  DlgFunctions
                     var DlgFunctions = {};
                     DlgFunctions.dlg = {};
 
                     function BlurRightBtnMenu() {
                         b.hidden = 1;
                         document.documentElement.removeEventListener("mouseup", BlurRightBtnMenu);
                     }
 
                     //Main
                     function CreateDialogEx(def) {
                         try {
                             var DlgElement = def.element, modal = !!def.modal;
                             //首先判断她是不是对话框
                             if (DlgElement.isDialog) return new Error("Dialog is created.");
                             DlgElement.isDialog = true;
                             //return false;
                             DlgElement.style.background = def.el_bg || "#ffffff";
                             DlgElement.style.overflow = "auto";
                             DlgElement.hidden = 0;
                             DlgElement.afterremove = def.remove;
                             if (def.pos) {
                                 DlgElement.style.left = def.pos.x || "50%";
                                 DlgElement.style.top = def.pos.y || "50%";
                             } else {
                                 DlgElement.style.left = "50%";
                                 DlgElement.style.top = "50%";
                             }
                             //防止class=null
                             if (DlgElement.getAttribute("class") == null) DlgElement.setAttribute("class", "");
                             DlgElement.setAttribute("class", (DlgElement.getAttribute("class") + " dialog").replace(/\s+/ig, " "));
                             DlgElement.modal = modal;
                             {
                                 DlgFunctions.dlg.mouse_move_resize = function (e) {
                                     var
                                         x = e.screenX - DlgElement.style.left.replace("px", ""),
                                         y = e.screenY - DlgElement.style.top.replace("px", ""),
                                         cx = DlgElement.clientWidth,
                                         cy = DlgElement.clientHeight;
                                     if (x < 10 && y < 10) {
                                         DlgElement.style.cursor = "nw-resize";
                                     } else if (x < 10 && cy - y < 10) {
                                         DlgElement.style.cursor = "sw-resize";
                                     } else if (cx - x < 10 && y < 10) {
                                         DlgElement.style.cursor = "ne-resize";
                                     } else if (cx - x < 10 && cy - y < 10) {
                                         DlgElement.style.cursor = "se-resize";
                                     } else {
                                         DlgElement.style.cursor = "auto";
                                     }
                                 }
                             }
                             CenterElement(DlgElement);
                             //如果是modal...
                             if (modal) {
                                 DlgElement.setAttribute("class", (DlgElement.getAttribute("class") + " dlgmodal").replace(/\s+/ig, " "));
                                 var RandomModalId = getRandom(10000000, 99999999);
                                 if (typeof def._modal == 'object') {
                                     var bgcolor = def._modal.bgcolor || "#cccccc", opac = def._modal.opacity || "0.5";
                                 } else {
                                     var bgcolor = "#cccccc", opac = "0.5";
                                 }
                                 var bgel = document.createElement("div");
                                 bgel.setAttribute("class", "DlgBg_id_" + RandomModalId);
                                 bgel.setAttribute("style", `position:fixed;left:0;top:0;width:100%;height:100%;background:${bgcolor};opacity:${opac};z-index:73;`);
                                 document.body.appendChild(bgel);
                             }
                             //标题栏
                             do {
                                 let a = DlgElement.querySelector(".dialogtitle") || DlgElement.querySelector("dialogtitle");
                                 if (a == null) break;
                                 a.style.cursor = "default";
                                 a.style.userSelect = "none";
                                 a.oncontextmenu = a.onselect = () => { return false };
                                 a.onmousedown = function () {
                                     if (DlgElement.modal) return;
                                     let a = document.querySelectorAll(".dialog");
                                     let b = a.length;
                                     for (let i = 0; i < b; ++i) {
                                         if (!a[i].modal) a[i].style.zIndex = '57';
                                     }
                                     if (!(this.parentElement.modal)) this.parentElement.style.zIndex = '60';
                                 };
                                 if (DlgElement.querySelector(".dialogtitle")) {
                                     BindMove(DlgElement, ".dialogtitle");
                                 } else {
                                     BindMove(DlgElement, "dialogtitle");
                                 }
                             } while (0);
                             //关闭按钮
                             do {
                                 let a = DlgElement.querySelector(".closebtn");
                                 if (modal) DlgElement.ModalId = RandomModalId; else DlgElement.ModalId = 0;
                                 if (a == null) break;
                                 a.onclick = function () {
                                     CreateDialogEx.remove(this.parentElement.parentElement);
                                 };
                             } while (0);
                             //调整大小
                             do {
                                 //DlgElement.addEventListener('mousemove',DlgFunctions.dlg.mouse_move_resize);
                                 //BindResize(a.querySelector(".ResizeBr"),DlgElement,0);
                                 //BindResize(a.querySelector(".ResizeTl"),DlgElement,1);
                             } while (0);
                             //右键菜单
                             do {
                                 let a = DlgElement.querySelector(".dialogtitle") || DlgElement.querySelector("dialogtitle");
                                 let b = DlgElement.querySelector(".rbmenu");
                                 if (a == null || b == null) break;
                                 b.hidden = 1;
                                 a.oncontextmenu = function (e) {
                                     if (!(this.contextmenu)) return e.preventDefault();
                                     b.hidden = 0;
                                     b.style.left = e.clientX + "px";
                                     b.style.top = e.clientY + "px";
                                     document.documentElement.addEventListener("mouseup", BlurRightBtnMenu);
                                 };
                                 b.onmouseup = function (e) {
                                     e.stopPropagation();
                                 };
                             } while (0);
                             //最大化
                             do {
                                 let a = DlgElement.querySelector(".maxbtn");
                                 if (a == null) break;
                                 let maxtex = a.getAttribute("data-text") || "Reset";
                                 let oldtex = a.innerHTML;
                                 let nFlags = true;
                                 let oldSize = { x: 0, y: 0 };
                                 let oldPos = { x: 0, y: 0 };
                                 let oldTrans = "";
                                 a.onclick = function () {
                                     if (nFlags) {
                                         oldSize.x = this.parentElement.parentElement.style.width;
                                         oldSize.y = this.parentElement.parentElement.style.height;
                                         oldPos.x = this.parentElement.parentElement.style.left;
                                         oldPos.y = this.parentElement.parentElement.style.top;
                                         oldTrans = this.parentElement.parentElement.style.transform;
                                         this.parentElement.parentElement.style.width = "100%";
                                         this.parentElement.parentElement.style.height = "100%";
                                         this.parentElement.parentElement.style.left = "-2px";
                                         this.parentElement.parentElement.style.top = "-2px";
                                         this.parentElement.parentElement.style.transform = "translate(0,0)";
                                         a.innerHTML = maxtex;
                                     } else {
                                         this.parentElement.parentElement.style.width = oldSize.x;
                                         this.parentElement.parentElement.style.height = oldSize.y;
                                         this.parentElement.parentElement.style.left = oldPos.x;
                                         this.parentElement.parentElement.style.top = oldPos.y;
                                         this.parentElement.parentElement.style.transform = oldTrans;
                                         a.innerHTML = oldtex;
                                     }
                                     nFlags = !nFlags;
                                 };
                             } while (0);
                             // ESC关闭
                             if (!def.noCloseOnEsc) {
                                 DlgElement.closeOnEscHandle = function(event) {
                                     if (event.keyCode == 27) { // ESC
                                         CreateDialogEx.remove(DlgElement);
                                     }
                                 }
                                 document.documentElement.addEventListener('keydown',DlgElement.closeOnEscHandle);
                             }
                             //返回
                             return DlgElement;
                         } catch (e) { return e; }
                     }
                     CreateDialogEx.remove = function (DlgElement) {
                         DlgElement.isDialog = false; DlgElement.hidden = 1;
                         if (DlgElement.afterremove) {
                             DlgElement.remove();
                         }
                         do {
                             let a = DlgElement.querySelector("dialogtitle");
                             if (a == null) break;
                             BindMove(a, true);
                             delete a.oncontextmenu; delete a.onselect;
                         } while (0);
                         do {
                             let a = DlgElement.querySelector(".closebtn");
                             if (DlgElement.ModalId) document.querySelector(".DlgBg_id_" + DlgElement.ModalId).remove();
                             if (a == null) break;
                             delete a.onclick;
                         } while (0);
                         do {
                             let b = DlgElement.querySelector(".rbmenu");
                             if (b == null) break;
                             delete b.onmouseup;
                         } while (0);
                         do {
                             let a = DlgElement.querySelector(".maxbtn");
                             if (a == null) break;
                             delete a.onclick;
                         } while (0);
                         document.documentElement.removeEventListener("mouseup", BlurRightBtnMenu);
                         document.documentElement.removeEventListener('keydown',DlgElement.closeOnEscHandle);
                         return DlgElement.setAttribute("class", DlgElement.getAttribute("class").replace("dialog", "").replace("null", "").replace("dlgmodal", ""));
                     };
                     //End Main 
 
                     Object.defineProperty(window, "CreateDialogEx", {
                         enumerable: true,
                         configurable: true,
                         get() {
                             return CreateDialogEx;
                         },
                         set(val) {
                             throw new SyntaxError("Try to change readonly attribute \"CreateDialogEx\" for value \"" + val + "\".");
                         }
                     });
                 }(__))
             );
         } else {
 
         }
     })(
         window.self.window,
         window.parent,
         void ((function () { return window.Object = self.Object })()),
         self.document,
         window.eval = self.eval,
         this.window.self.Object,
         window.event || event,
         false != (false || true || false),
         void 0,
         document,
         window,
         window.jQuery,
         window.self,
         `Copyright 2021(c) shc0743. All rights reserved.`
     );
 }, false);