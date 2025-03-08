<template>
   <view class="bookshelf-container" >
	   <view class="book-grid-item" v-for="(item, index) in book" :key="index" @click="tabinfo(index)"
	   :style="{backgroundColor:theme.currentTheme.backgroundColors[1]}"
	   >
			<image :src="item.url" mode="scaleToFill" style="border-radius: 6px;" />
        <view class="u-light-color u-font-12">{{ item.read ==0 ?'未读' : '上次读到第'+item.read+'章' }}</view>
      </view>
      <view class="book-grid-item" @click="gohome">
        <view class="u-book-wrap u-flex u-row-center" style="height: 250rpx;width: 175rpx;">
          <u-icon name="/static/image/san_book.png" size="80" label="点我发现\n更多书籍" label-pos="bottom"
                  label-size="23" label-color="#cdcdcd" margin-top="20"></u-icon>
        </view>
      </view>
  </view>
</template>
<script>
	import store from '../../store';
	import { theme } from '../../configJs/theme';
	export default {
		props: ["book"],
		data() {
			return {
				theme:theme
			}
		},
		methods: {
		   async	tabinfo(index) {
			   uni.showLoading({
			   	
			   });
				await  store.dispatch('updateBook',this.book[index]);
				uni.hideLoading();
				uni.navigateTo({
					url:'/pages/book/read'
				})
			},
			touchstart(index) {
				console.log(index)
				return false;
			},
			gopage(url) {
				console.log(url);
				uni.navigateTo({
					url: url
				})
			},
			gohome(){
				uni.switchTab({
					url:"/pages/index/index"
				})
			}
			
		}
	}
</script>
<style lang="scss" scoped>
  .bookshelf-container {
    display: flex;
    justify-content: flex-start;
	flex-wrap: wrap;
    width: 100%;
	.book-grid-item {
		cursor: pointer;
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	  width: 236rpx;
	  margin-left: 7rpx;
	  margin-right: 7rpx;
	  height: 300rpx;
	  margin-bottom: 15rpx;
	overflow: hidden;
	 image {
	   width: 175rpx;
	   height: 250rpx;
	 }
	  .u-book-wrap {
	    width: 100%;
	    height: 250rpx;
	    border-width: 1px;
	    border-color: #ddd;
	    border-style: dashed;
	    background-color: rgb(250, 250, 250);
	    border-radius: 6px;
	    display: flex;
	    justify-content: center;
	    align-items: center;
	  }
	}
  }
</style>