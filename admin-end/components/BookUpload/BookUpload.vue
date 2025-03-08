<template>
  <view class="book-upload-container">
    <view class="upload-section">
      <uni-forms ref="uploadForm" :model="uploadData">
        <!-- 各种表单项 -->
        <uni-forms-item label="书名" required>
          <uni-easyinput v-model="uploadData.book_name" placeholder="请输入书名"  />
        </uni-forms-item>
        <uni-forms-item label="作者" required>
          <uni-easyinput v-model="uploadData.author" placeholder="请输入作者" />
        </uni-forms-item>
		<uni-forms-item label="种类" required>
		  <uni-easyinput v-model="uploadData.category" placeholder="请输入种类" />
		</uni-forms-item> 
        <uni-forms-item label="简介" required>
          <uni-easyinput  type="textarea"  autoHeight v-model="uploadData.description" placeholder="请输入简介" maxlength="1000"/>
        </uni-forms-item>
        <uni-forms-item label="收费类型" required>
          <uni-data-checkbox v-model="uploadData.is_free" :localdata="freeOptions"/>
        </uni-forms-item>
        <uni-forms-item label="定价" v-if="!uploadData.is_free">
          <uni-easyinput v-model="uploadData.price" placeholder="请输入定价" />
        </uni-forms-item>
        <uni-forms-item label="免费页数" v-if="!uploadData.is_free">
          <uni-easyinput v-model="uploadData.free_pages" placeholder="请输入免费页数" />
        </uni-forms-item>
        <uni-forms-item label="上传文件" required>
          <uni-file-picker
            file-mediatype="['document']"
            file-extname="pdf,epub"
            limit="1"
            @select="handleFileUpload"
            @fail="handleFail"
            ref="file"
            :auto-upload="false"
          />
        </uni-forms-item>
      </uni-forms>
    </view>
    <view style="width: 100%;">
		<button @click="submitUpload" type="primary" style="max-width: 300px;">上传</button>
	</view>
    <!-- 编辑内容弹窗 -->
    <!-- <uni-popup ref="editPopup" type="center" isMaskClick="true">
		<view style="background-color: #fff; width: 70vw;padding: 50rpx;
		border-radius: 30rpx;">
			<view style="width: 100%;display: flex;justify-content: flex-end;">
				<uni-icons type="closeempty" size="28"
					style="background-color: #ddd;border-radius: 14px; margin-bottom: 20px;"
					@click="closeEditPopup"></uni-icons>
			</view>
			<webEdit editHeight="60vh" :initial-content="uploadData.test" ></webEdit>
		</view>
    </uni-popup> -->
  </view>
</template>

<script>
export default {
  data() {
    return {
      uploadData: {
        book_name: "",
        author: "",
        description: "",
        price: 0,
		test:'<h1>欢迎使用书籍编辑器</h1><p>这是一个示例段落。</p><img src="https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AA1z1V0e.img?w=690&h=1228&m=6" alt="示例图片"><p>你可以在这里编辑内容。</p>',
        is_free: true,
        free_pages: 0,
        file: null,
        file_name: "", // 新增文件名
        file_type: "", // 新增文件类型
		category:""
      },
      freeOptions: [
        { value: true, text: '免费' },
        { value: false, text: '收费' },
      ],
      memberFreeOptions: [
        { value: true, text: '是' },
        { value: false, text: '否' },
      ],
      bookContent: '', // 新增一个变量用于存储书籍内容
    };
  },
  methods: {
    handleFileUpload(event) {
      this.uploadData.file = event.tempFilePaths[0];
      this.uploadData.file_name = event.tempFiles[0].name; // 获取文件名
      this.uploadData.file_type = event.tempFiles[0].extname; // 获取文件类型
      console.log("Selected file path:", this.uploadData.file);
      console.log("Selected file name:", this.uploadData.file_name);
      console.log("Selected file type:", this.uploadData.file_type);
    },
    validateFields() {
      if (!this.uploadData.book_name) {
        uni.showToast({ title: '请填写书名', icon: 'none' });
        return false;
      }
      if (!this.uploadData.author) {
        uni.showToast({ title: '请填写作者', icon: 'none' });
        return false;
      }
      if (!this.uploadData.description) {
        uni.showToast({ title: '请填写简介', icon: 'none' });
        return false;
      }
      if (this.uploadData.is_free === false) {
        if (!this.uploadData.price) {
          uni.showToast({ title: '请填写定价', icon: 'none' });
          return false;
        }
        if (!this.uploadData.free_pages) {
          uni.showToast({ title: '请填写免费页数', icon: 'none' });
          return false;
        }
      }
      if (!this.uploadData.file) {
        uni.showToast({ title: '请选择文件', icon: 'none' });
        return false;
      }
      return true;
    },
	 submitUpload() {
	   if (this.validateFields()) {
		 let that = this;
		 uni.uploadFile({
			 
		   url: this.$store.state.BaseUrl + "/book/upload",
		   filePath: this.uploadData.file, // 文件路径
		   name: 'file', // 后端接收文件的字段名
		   formData: {
			 'title': this.uploadData.book_name, // 书籍标题
			 'author': this.uploadData.author, // 作者
			 'description': this.uploadData.description, // 描述
			 'price': this.uploadData.price, // 价格
			 'category': "未知", // 分类
			 'is_paid': this.uploadData.is_free, // 是否付费
			 'free_pages': this.uploadData.free_pages, // 免费页数
			 'category':this.uploadData.category

		   },
		   success: (uploadRes) => {
			 const res = JSON.parse(uploadRes.data);
			 if (res.book_id) {
			   uni.showToast({ title: '上传成功', icon: 'success' });
			   that.resetForm();
			 } else {
			   uni.showToast({ title: '上传失败: ' + res.error, icon: 'none' });
			 }
		   },
		   fail: (error) => {
			 uni.showToast({ title: '上传失败: ' + error.errMsg, icon: 'none' });
		   },
		 });
	   }
	 },
    openEditPopup() {
      this.$refs.editPopup.open();
    },
    confirmEditContent() {
      this.$refs.editPopup.close();
    },
    closeEditPopup() {
      this.$refs.editPopup.close();
    },
    goToPreview() {
      if (this.uploadData.file) {
        uni.navigateTo({
          url: `/pages/preview/preview?fileUrl=${encodeURIComponent(this.uploadData.file)}&fileName=${encodeURIComponent(this.uploadData.file_name)}&fileType=${encodeURIComponent(this.uploadData.file_type)}`
        });
      } else {
        uni.showToast({ title: '请先上传文件', icon: 'none' });
      }
    },
    getContent(content) {
      this.bookContent = content; // 获取书籍内容并存储
    },
    resetForm() {
      this.uploadData = {
        book_name: "",
        author: "",
        description: "",
        price: "",
        is_free: true,
        free_pages: 0,
        member_free: false,
        file: null,
        file_name: "", // 清空文件名
        file_type: "", // 清空文件类型
      };
      this.bookContent = ''; // 清空书籍内容
      this.$refs.file.clearFiles();
    },
    handleFail(e) {
      console.log('文件选择失败', e);
    }
  }
};
</script>
<style lang="scss" scoped>
.book-upload-container {
  margin: 50rpx;
  padding: 20rpx;
  background-color: #fff;
  border-radius: 8rpx;
  box-shadow: 0 2rpx 12rpx 0 rgba(0, 0, 0, 0.1);

  .upload-section {
    margin-bottom: 20rpx;
  }
}
</style>