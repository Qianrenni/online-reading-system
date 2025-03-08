<template>
  <view class="container">
    <view class="page-body">
      <view class="wrapper">
        <view class="toolbar" @tap="format" style="height: 120px; overflow-y: auto;">
          <view :class="formats.bold ? 'ql-active' : ''" class="iconfont icon-zitijiacu" data-name="bold"></view>
          <view :class="formats.italic ? 'ql-active' : ''" class="iconfont icon-zitixieti" data-name="italic"></view>
          <view :class="formats.underline ? 'ql-active' : ''" class="iconfont icon-zitixiahuaxian" data-name="underline"></view>
          <view :class="formats.strike ? 'ql-active' : ''" class="iconfont icon-zitishanchuxian" data-name="strike"></view>
          <view :class="formats.align === 'left' ? 'ql-active' : ''" class="iconfont icon-zuoduiqi" data-name="align" data-value="left"></view>
          <view :class="formats.align === 'center' ? 'ql-active' : ''" class="iconfont icon-juzhongduiqi" data-name="align" data-value="center"></view>
          <view :class="formats.align === 'right' ? 'ql-active' : ''" class="iconfont icon-youduiqi" data-name="align" data-value="right"></view>
          <view :class="formats.align === 'justify' ? 'ql-active' : ''" class="iconfont icon-zuoyouduiqi" data-name="align" data-value="justify"></view>
          <view :class="formats.lineHeight ? 'ql-active' : ''" class="iconfont icon-line-height" data-name="lineHeight" data-value="2"></view>
          <view :class="formats.letterSpacing ? 'ql-active' : ''" class="iconfont icon-Character-Spacing" data-name="letterSpacing" data-value="2em"></view>
          <view :class="formats.marginTop ? 'ql-active' : ''" class="iconfont icon-722bianjiqi_duanqianju" data-name="marginTop" data-value="20px"></view>
          <view :class="formats.marginBottom ? 'ql-active' : ''" class="iconfont icon-723bianjiqi_duanhouju" data-name="marginBottom" data-value="20px"></view>
          <view class="iconfont icon-clearedformat" @tap="removeFormat"></view>
          <view :class="formats.fontFamily ? 'ql-active' : ''" class="iconfont icon-font" data-name="fontFamily" data-value="Pacifico"></view>
          <view :class="formats.fontSize === '24px' ? 'ql-active' : ''" class="iconfont icon-fontsize" data-name="fontSize" data-value="24px"></view>
          <view :class="formats.color === '#0000ff' ? 'ql-active' : ''" class="iconfont icon-text_color" data-name="color" data-value="#0000ff"></view>
          <view :class="formats.backgroundColor === '#00ff00' ? 'ql-active' : ''" class="iconfont icon-fontbgcolor" data-name="backgroundColor" data-value="#00ff00"></view>
          <view class="iconfont icon-date" @tap="insertDate"></view>
          <view class="iconfont icon--checklist" data-name="list" data-value="check"></view>
          <view :class="formats.list === 'ordered' ? 'ql-active' : ''" class="iconfont icon-youxupailie" data-name="list" data-value="ordered"></view>
          <view :class="formats.list === 'bullet' ? 'ql-active' : ''" class="iconfont icon-wuxupailie" data-name="list" data-value="bullet"></view>
          <view class="iconfont icon-undo" @tap="undo"></view>
          <view class="iconfont icon-redo" @tap="redo"></view>
          <view class="iconfont icon-outdent" data-name="indent" data-value="-1"></view>
          <view class="iconfont icon-indent" data-name="indent" data-value="+1"></view>
          <view class="iconfont icon-fengexian" @tap="insertDivider"></view>
          <view class="iconfont icon-charutupian" @tap="insertImage"></view>
          <view :class="formats.header === 1 ? 'ql-active' : ''" class="iconfont icon-format-header-1" data-name="header" :data-value="1"></view>
          <view :class="formats.script === 'sub' ? 'ql-active' : ''" class="iconfont icon-zitixiabiao" data-name="script" data-value="sub"></view>
          <view :class="formats.script === 'super' ? 'ql-active' : ''" class="iconfont icon-zitishangbiao" data-name="script" data-value="super"></view>
          <view class="iconfont icon-shanchu" @tap="clear"></view>
          <view :class="formats.direction === 'rtl' ? 'ql-active' : ''" class="iconfont icon-direction-rtl" data-name="direction" data-value="rtl"></view>
        </view>
        <view class="editor-wrapper">
          <scroll-view scroll-y="true" :style="{ height: editHeight }">
            <editor
              id="editor"
              class="ql-container"
              placeholder="开始输入..."
              show-img-size
              show-img-toolbar
              show-img-resize
              @statuschange="onStatusChange"
              @ready="onEditorReady"
            ></editor>
          </scroll-view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    initialContent: {
      type: String,
      default: ""
    },
    editHeight: {
      type: String,
      default: "30vh"
    }
  },
  data() {
    return {
      readOnly: false,
      formats: {},
      editorCtx: null
    };
  },
  watch: {
    initialContent: {
      immediate: true, // 立即触发监听器
      handler(newVal) {
        if (this.editorCtx) {
          this.setInitialContent(newVal);
        } else {
          console.warn("Editor context is not ready yet. Content will be set after initialization.");
        }
      }
    }
  },
  methods: {
    setInitialContent() {
      if (this.editorCtx) {
        this.editorCtx.setContents({
          html: this.initialContent || '父组件传入内容为空' // 如果内容为空，默认插入一个空段落
        });
      }
    },
    onEditorReady() {
      uni.createSelectorQuery().select("#editor").context((res) => {
        if (res.context) {
          this.editorCtx = res.context;
          console.log("Editor context initialized successfully");
          // 设置初始内容
          this.setInitialContent();
        } else {
          console.error("Failed to initialize editor context");
        }
      }).exec();
    },
    onStatusChange(e) {
      this.formats = e.detail;
    },
    format(e) {
      const { name, value } = e.target.dataset;
      if (!name) return;
      this.editorCtx.format(name, value);
    },
    undo() {
      this.editorCtx.undo();
    },
    redo() {
      this.editorCtx.redo();
    },
    removeFormat() {
      this.editorCtx.removeFormat();
    },
    insertDate() {
      const date = new Date();
      const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
      this.editorCtx.insertText({ text: formatDate });
    },
    insertImage() {
      uni.chooseImage({
        count: 1,
        success: (res) => {
          this.editorCtx.insertImage({
            src: res.tempFilePaths[0],
            alt: "图像",
            success: () => {
              console.log("insert image success");
            }
          });
        }
      });
    },
    insertDivider() {
      this.editorCtx.insertDivider({
        success: () => {
          console.log("insert divider success");
        }
      });
    },
    clear() {
      uni.showModal({
        title: "清空编辑器",
        content: "确定清空编辑器全部内容？",
        success: (res) => {
          if (res.confirm) {
            this.editorCtx.clear({
              success: () => {
                console.log("clear success");
              }
            });
          }
        }
      });
    },
    getEditorContent() {
      return new Promise((resolve) => {
        this.editorCtx.getContents({
          success: (res) => {
            resolve(res.html);
          }
        });
      });
    }
  }
};
</script>

<style>
@import "./editor-icon.css";
.wrapper {
  height: 100%;
}
.editor-wrapper {
  background: #fff;
}
.iconfont {
  display: inline-block;
  padding: 8px 8px;
  width: 24px;
  height: 24px;
  cursor: pointer;
  font-size: 20px;
}
.toolbar {
  box-sizing: border-box;
  border-bottom: 0;
  font-family: "Helvetica Neue", "Helvetica", "Arial", sans-serif;
}
.ql-container {
  box-sizing: border-box;
  padding: 12px 15px;
  width: 100%;
  min-height: 30vh;
  height: 100%;
  margin-top: 20px;
  font-size: 16px;
  line-height: 1.5;
}
.ql-active {
  color: #06c;
}
</style>