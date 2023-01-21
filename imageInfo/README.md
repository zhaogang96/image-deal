# 一个用于获取图片信息的库，支持浏览器环境使用

## 支持的图片类型
>
>jpg、png、gif

## 用法

### 安装

```
npm install --save @imagedeal/imageinfo
```

### 选择图片后直接获取图片信息

```
import { getImgInfo } from "@imagedeal/imageinfo";

const el = document.getElementById("choose");
el.addEventListener("change", e => {
 const file = e.target.files[0];
 getImgInfo(file, console.log);
});

```

#### 输出示例

<pre>
width: 960
height: 600
realType: "image/jpeg"
size: 626894
type: "image/jpeg"
</pre>

### 通过图片链接获取图片信息

待开发
