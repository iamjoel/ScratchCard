 /**
    * @Class StratchCard 刮刮卡
    * 调用方法
    * var a = new StratchCard({
          el: 'canvas' //挂载的节点元素elementId //default
          font: '40px serif',  //default
          img: {
              url: "", //default
              width: 200, //default
              height: 100, //default
              show: false //是否直接显示图片  //default
          }
      })
      a.init()
    *
    */


 ! function(root, factory) {
     if (typeof exports === 'object' && typeof module === 'object')
         module.exports = factory();
     else if (typeof define === 'function' && define.amd)
         define([], factory);
     else if (typeof exports === 'object')
         exports["StratchCard"] = factory();
     else
         root["StratchCard"] = factory();
 }(this, function() {
     if (typeof Object.assign != 'function') {
         Object.assign = function(target) {
             'use strict';
             if (target == null) {
                 throw new TypeError('Cannot convert undefined or null to object');
             }

             target = Object(target);
             for (var index = 1; index < arguments.length; index++) {
                 var source = arguments[index];
                 if (source != null) {
                     for (var key in source) {
                         if (Object.prototype.hasOwnProperty.call(source, key)) {
                             target[key] = source[key];
                         }
                     }
                 }
             }
             return target;
         };
     }

     function StratchCard(options) {
         if ('ontouchstart' in document) {
             this.start = 'touchstart';
             this.move = 'touchmove';
             this.end = 'touchend';
         } else {
             this.start = 'mousedown';
             this.move = 'mousemove';
             this.end = 'mouseup';
         }

         this.el = options.el || 'canvas'; // elementId
         this.clearRatio = options.clearRatio || 0.3;

         var imgDefaultOptions = {
             url: "",
             width: 200,
             height: 100,
             show: false //是否直接显示图片
         };
         this.img = Object.assign({}, imgDefaultOptions, options.img);
         this.font = options.font || '40px serif';
         this.init = function() {
             var self = this;

             self.canvas = document.getElementById(self.el);
             if (!self.canvas) {
                 alert('canvas节点不存在');
                 return;
             }
             self.ctx = self.canvas.getContext("2d");

             var img = new Image();
             if (self.img.url.trim().length == 0) {
                 var msg = '图片链接不能为空';
                 console.info(msg);
                 return;
             }
             img.src = self.img.url;
             img.width = self.img.width;
             img.height = self.img.height;

             var c = document.getElementById(self.el);
             if (c.getContext('2d')) {
                 img.onload = function() {
                     self.canvas.style.backgroundImage = "url('" + img.src + "')";
                     self.canvas.style.backgroundRepeat = "no-repeat";
                     self.canvas.style.backgroundPosition = "center center";

                     self.canvas.width = img.width;
                     self.canvas.height = img.height;
                     if (self.img.show) return;
                     // 填充画布背景色
                     self.ctx.save();
                     self.ctx.beginPath();
                     self.ctx.fillStyle = '#666';
                     self.ctx.fillRect(0, 0, self.canvas.width, self.canvas.height);
                     self.ctx.restore();

                     // 写'刮刮卡'字样
                     self.ctx.save();
                     self.ctx.font = self.font;
                     self.ctx.fillStyle = '#fff';
                     var wordsWidth = self.ctx.measureText('刮刮卡').width;
                     if (wordsWidth > self.canvas.width) {
                         var msg = 'canvas内文字太长';
                         console.log(msg);
                         return;
                     }
                     self.ctx.textBaseline = 'middle';
                     self.ctx.textAlign = 'center';
                     self.ctx.fillText('刮刮卡', self.canvas.width / 2, self.canvas.height / 2);
                     self.ctx.restore();

                     //事件绑定
                     if (self.start == 'touchstart') {
                         self.canvas.addEventListener(self.start, self.startHandler(self))
                         self.canvas.addEventListener(self.move, self.moveHandler(self))
                         self.canvas.addEventListener(self.end, self.endHandler(self));
                         self.canvas.addEventListener('touchcancel', self.endHandler(self))
                     } else {
                         self.canvas.addEventListener(self.start, self.startHandler(self))
                         self.canvas.addEventListener(self.end, self.endHandler(self));
                     }

                 }
             } else {
                 var msg = '您的浏览器不支持canvas，请更换高版本的浏览器，如chrome';
                 alert(msg);
                 console.info(msg)
                 return false;
             }
         };
         this.startHandler = function(self) {
             return function(e) {
                 self.ctx.save();
                 var e = e || window.event;
                 var XY = self.getXY(e);
                 var ctx_x = XY[0];
                 var ctx_y = XY[1];
                 self.ctx.restore();
             }
         };
         this.moveHandler = function(self) {
             return function(e) {
                 self.ctx.save();
                 var e = e || window.event;
                 var XY = self.getXY(e);
                 var ctx_x = XY[0];
                 var ctx_y = XY[1];

                 self.ctx.fillStyle = 'red';
                 //设置新图像与原图像叠加情况
                 self.ctx.globalCompositeOperation = 'destination-out';
                 self.ctx.beginPath();
                 self.ctx.arc(ctx_x, ctx_y, 10, 0, Math.PI * 2);
                 self.ctx.fill();
                 self.ctx.restore();
             }
         };
         this.endHandler = function(self) {
             return function(e) {
                 var e = e || window.event;
                 var XY = self.getChangedXY(e);
                 var ctx_x = XY[0];
                 var ctx_y = XY[1];
                 var pixels = self.ctx.getImageData(0, 0, self.canvas.width, self.canvas.height);
                 var data = pixels.data,
                     all = data.length;
                 var clearArea = 0;
                 for (var i = 0; i < all; i += 4) {
                     var r = data[i],
                         g = data[i + 1],
                         b = data[i + 2],
                         a = data[i + 3];
                     if (r == 0 && g == 0 && b == 0 && a == 0) {
                         clearArea++;
                     }
                 }
                 // 已擦除区域比例
                 // 0 = 0%, 1 = 100%
                 if (clearArea / all * 4 >= self.clearRatio) {
                     setTimeout(function() {
                         self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
                     }, 300)
                 }

             }
         };
         this.getXY = function(e) {
             var oT = self.canvas.getBoundingClientRect().top;
             var oL = self.canvas.getBoundingClientRect().left;
             var ctx_x = e.clientX || e.touches[0].clientX - oL;
             var ctx_y = e.clientY || e.touches[0].clientY - oT;
             return [ctx_x, ctx_y];
         };
         this.getChangedXY = function(e) {
             var oT = self.canvas.getBoundingClientRect().top;
             var oL = self.canvas.getBoundingClientRect().left;
             var ctx_x = e.clientX || e.changedTouches[0].clientX - oL;
             var ctx_y = e.clientY || e.changedTouches[0].clientY - oT;
             return [ctx_x, ctx_y];
         }
     }
     return StratchCard;
 })
