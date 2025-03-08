// store/theme.js
import Vue from 'vue';

export const theme = new Vue({
  data: {
    currentTheme: {
      backgroundColors: ["#FFFFFF", "#FFFFFF", "#f9f9f9", "#FFFFFF", "#FFFFFF"], // 纯白到浅灰
      foregroundColors: ["#000000", "#1A1A1A", "#333333", "#4D4D4D", "#666666"],
	  backgroundMask: "linear-gradient(-180deg, rgba(255, 255, 255, 0) 0%, #fff 80%)"
    },
    darkTheme: {
      backgroundColors: ["#000000", "#242424", "#202020", "#303030", "#404040"], // 黑到深灰
      foregroundColors: ["#FFFFFF", "#E0E0E0", "#C0C0C0", "#A0A0A0", "#808080"],
	  backgroundMask: "linear-gradient(-180deg, rgba(0, 0, 0, 0) 0%, #000 80%)"
    },
    dayTheme: {
      backgroundColors: ["#FFFFFF", "#FFFFFF", "#f9f9f9", "#FFFFFF", "#FFFFFF"], // 纯白到浅灰
      foregroundColors: ["#000000", "#1A1A1A", "#333333", "#4D4D4D", "#666666"],
	  backgroundMask: "linear-gradient(-180deg, rgba(255, 255, 255, 0) 0%, #fff 80%)"
    },
    flag: false,
	ReadingSetting:{
	},
    change() {
      if (this.flag) {
        Object.assign(this.currentTheme, this.dayTheme);
        this.flag = false;
      } else {
        Object.assign(this.currentTheme, this.darkTheme);
        this.flag = true;
      }
	  uni.setStorageSync("theme",this.flag);
	  console.log("存储主题样式");
    }
  },
  created() {
  	const flag=uni.getStorageSync("theme");
	console.log("theme is",flag);
	if(flag==undefined){
		return;
	}else{
		if(this.flag!=flag){
			this.change();
		}
	}
  }
});