# 依赖

wangeditor    

# 安装

[wangeditor](https://www.wangeditor.com/v5/for-frame.html)

## v2

`npm install @wangeditor/editor-for-vue --save`

## v3

`npm install @wangeditor/editor-for-vue@next --save`

[在线演示,form表单配置editor](https://static-mp-c3d2938e-a10f-4b38-b1d5-791a37326313.next.bspapp.com/webUI/#/pages/demo/form/form)

# props

| props              | 类型     | 默认      | 说明                                                         |
| ------------------ | ------ | ------- | ---------------------------------------------------------- |
| modelValue/v-model | String | -       | 值                                                          |
| mode               | String | default | 主题，可选simple                                                |
| editConfig         | Object |         | [编辑器配置](https://www.wangeditor.com/v5/editor-config.html)  |
| toolbarConfig      | Object |         | [工具栏配置](https://www.wangeditor.com/v5/toolbar-config.html) |
| height             | string | 500     | 编辑器高度                                                      |



# events

| event  | 说明                    |
| ------ | --------------------- |
| change | 输入框内容改变时，回调参数为html富文本 |