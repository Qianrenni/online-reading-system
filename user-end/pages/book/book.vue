<template>
	
	<view 
	style="min-height: 100vh;"
	:style="{'background':theme.currentTheme.backgroundColors[0],'color':theme.currentTheme.foregroundColors[0]}">
		<uni-nav-bar 
		  title="我的书架" 
		  :fixed="true"
		  :border="true"
		  :backgroundColor="theme.currentTheme.backgroundColors[1]"
		  :color="theme.currentTheme.foregroundColors[0]"
		  statusBar
		>
		<block slot="left">
				<u-icon
				name="clock"
				:size="50"
			    @click="showHistory"
				style="margin-right: 50rpx;"
				></u-icon>
		</block>
		<block slot="right">
			<u-icon
			:name="this.$store.state.vuex_bookbutton" 
			:size="50" 
			@click="tabook">
			</u-icon>
		</block>
		</uni-nav-bar>
		<view>
			<view v-if="isHistory" class="u-m-t-20">
				<history-box 
				:book="readingHistory"
				:options="options" 
				:style="{'background':theme.currentTheme.backgroundColors[0],'color':theme.currentTheme.foregroundColors[0]}"
				></history-box>
			</view>
			<view v-else>
				<view v-if="this.$store.state.vuex_bookstyle == 'card'" class="u-m-t-20">
					<card-box :book="shelfBooks" ></card-box>
				</view>
				<view v-else class="u-m-t-20" >
					<list-box 
					:book="shelfBooks" 
					:options="options" 
					:style="{'background':theme.currentTheme.backgroundColors[0],'color':theme.currentTheme.foregroundColors[0]}"
					>
					</list-box>
				</view>
				<view style="margin-bottom:30rpx;">
					<u-divider
					:style="{'background':theme.currentTheme.backgroundColors[0],'color':theme.currentTheme.foregroundColors[0]}"
					>您的书架共有{{shelfBooks.length}}本书</u-divider>
				</view>
			</view>
			<u-tabbar
			:bgColor="theme.currentTheme.backgroundColors[1]"
			v-model="this.$store.state.vuex_current" 
			:activeColor="this.$store.state.vuex_activeColor" 
			:list="this.$store.state.vuex_tabbar">
			</u-tabbar>
		</view>
	</view>
</template>

<script>
import { theme } from '../../configJs/theme';
import {mapState} from 'vuex'
	export default {
		data() {
			return {
				theme:theme,
				btnWidth: 180,
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#dd524d'
					}
				}],
				isHistory:false
			}
		},
		methods: {
			showHistory(){
				this.isHistory=!this.isHistory;
			},
			tabook() {
				this.isHistory=false;
				console.log(this.$store.state.vuex_bookstyle);
				if (this.$store.state.vuex_bookstyle === 'card') {
					this.$u.vuex('vuex_bookstyle', 'list');
					this.$u.vuex('vuex_bookbutton', 'list-dot');
				} else if (this.$store.state.vuex_bookstyle === 'list') {
					this.$u.vuex('vuex_bookstyle', 'card');
					this.$u.vuex('vuex_bookbutton', 'grid');
				}
			}
		},
		computed:{
			...mapState({
				readingHistory:state=>state.readingHistory,
				shelfBooks:state=>state.onShelfBooks
			})
		}
	}
</script>
<style lang="scss">
</style>