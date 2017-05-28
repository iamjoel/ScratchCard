## 刮刮卡
 暂时只支持移动端，pc端尚不支持
## Usages用法
```
#@Class StratchCard 刮刮卡
调用方法
var a = new StratchCard({
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
 ```

## API
| options    | type    | default   |      |
| --------   |  ----   | -----     | ---- |
| el      |   string  |   "canvas"     |    canvas元素id    |
| clearRatio  |   number  |   0.3   |   清除区域比例大于此数值，自动显示背景图  |
| font      |  string  |    '40px serif'    |  遮罩层的字  |
|   img  |    obj  |   {url: "", width: 200, height: 100, show: false}  |      |
|   img.url  |   string   |    ""     |   背景图地址   |
|   img.width    |   number   |     200  |  背景图宽度，也是canvas的宽度    |
|  img.height   |   string |    100  |    背景图高度，也是canvas高度   |
|  img.show   |   boolean  |    false   |   是否直接显示背景图，默认不显示  |
