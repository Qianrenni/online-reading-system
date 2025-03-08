# webEdit WEB富文本编辑器-官方修改版 简介
![输入图片说明](20220903130550.jpg)

ids是必填且在同一页面有两个及以上的webEdit组件时要填写不重复的ID

![](https://7463-tcb-4sotguuynvcrc4qec556a-7e2cec-1302588695.tcb.qcloud.la/other/20220903130550.jpg)

```html
<template>
      <uni-forms-item name="content" label="产品介绍">
        <webEdit v-model="content" ids="content"></webEdit>
      </uni-forms-item>
</template>

```

```javascript

export default {
	data() { 
		return {
			content: `<p>这里是内容</p>`
		}
	}
}
```