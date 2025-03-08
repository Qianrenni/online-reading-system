<template name='RecomAdmin' style="">
	<view style="background-color: #FFFFFF;display: flex;align-items: center;width: 100%;flex-direction: column;">
		<view style="padding: 30upx;font-size: 30px;width: 90%;border-bottom: 1px solid #EBEEF5;font-weight: 100;">
			基于协同过滤算法的美食个性化服务的设计与实现
		</view>
		<!-- 统计数量 -->
		
			<view style="width: 90%;padding: 30upx;display: flex;flex-direction: row;justify-content: center;align-items: center;border-bottom: 1px solid #EBEEF5;">
				<view style="display: flex;flex-direction: column;align-items: center;justify-content: center;width: 25%;">
					<view style="display: flex;flex-direction: row;padding: 10upx;align-items: center;">
						<view class="num" style="font-size: 55px;margin-right: 15upx;font-weight: 500;">
							150
						</view>
						<view style="font-size: 30px;color: #999999;">
							条
						</view>
					</view>
					<view style="font-size: 15px;font-weight: 550;">
						总浏览数量
					</view>
				</view>
				<view style="display: flex;flex-direction: column;align-items: center;justify-content: center;width: 25%;">
					<view style="display: flex;flex-direction: row;padding: 10upx;align-items: center;">
						<view class="num" style="font-size: 55px;margin-right: 15upx;font-weight: 500;">
							200
						</view>
						<view style="font-size: 30px;color: #999999;">
							条
						</view>
					</view>
					<view style="font-size: 15px;font-weight: 550;">
						总推荐数量
					</view>
				</view>
				<view style="display: flex;flex-direction: column;align-items: center;justify-content: center;width: 25%;">
					<view style="display: flex;flex-direction: row;padding: 10upx;align-items: center;">
						<view class="num" style="font-size: 55px;margin-right: 15upx;font-weight: 500;">
							170
						</view>
						<view style="font-size: 30px;color: #999999;">
							条
						</view>
					</view>
					<view style="font-size: 15px;font-weight: 550;">
						总收藏数量
					</view>
				</view>
			</view>
		<!-- 统计数量end -->
		<!-- 图标体现 -->
		<view style="display: flex;flex-direction: row;width: 90%;justify-content: center;align-items: center;margin-top: 20upx;">
			<!-- 柱状图 -->
			<view style="width: 33%;display: flex;align-items: center;justify-content: center;">
				<view class="qiun-columns" style="background-color: #FFFFFF;">
					<u-charts :canvas-id="ColumnList.id" :chartType="ColumnList.chartType" cWidth="300" cHeight="300" :opts="ColumnList.opts" :ref="ColumnList.id"/>

				</view>
			</view>
			<!-- 柱状图end -->
			<!-- 元饼图 -->
			<view style="width: 33%;display: flex;align-items: center;justify-content: center;">
				<canvas canvas-id="canvasPie" id="canvasPie" style="width: 500upx; height:400upx;background-color: #FFFFFF;"></canvas>
			</view>
			
			<!-- 元饼图end -->
			<!-- 折线图 -->
			<view style="width: 33%;display: flex;align-items: center;justify-content: center;">
				<view class="qiun-columns" style="background-color: #FFFFFF;">
					<u-charts :canvas-id="LineList.id" :chartType="LineList.chartType" cWidth="300" cHeight="300" :opts="LineList.opts" :ref="LineList.id"/>
				</view>
			</view>
			<!-- 折线图end -->
		</view>
		
		<!-- 图标体现end -->
		<!-- 我的浏览 -->
		<view style="width: 90%;padding: 30upx;border-bottom: 1px solid #EBEEF5;display: flex;flex-direction: column;">
			<view style="font-size: 30px;">
				我的浏览--详细列表
			</view>
			<!-- 商城商品管理id=3 -->
			<ViewAdmin :PageNum='PageNum' :pageList='pageList' :Num='Num' :PersonList='PersonList' style="width: 100%;display: flex;justify-content: center;align-items: center;"></ViewAdmin>
			<!-- 商城商品管理end-->
		</view>
		<!-- 我的浏览end -->
		<!-- 我的推荐 -->
		<view style="width: 90%;padding: 30upx;border-bottom: 1px solid #EBEEF5;display: flex;flex-direction: column;">
			<view style="font-size: 30px;">
				我的推荐--详细列表
			</view>
			<!-- 商城商品管理id=3 -->
			<ViewAdmin :PageNum='PageNum' :pageList='pageList' :Num='Num' :PersonList='PersonList' style="width: 100%;display: flex;justify-content: center;align-items: center;"></ViewAdmin>
			<!-- 商城商品管理end-->
		</view>
		<!-- 我的推荐end -->
		<!-- 我的推荐 -->
		<view style="width: 90%;padding: 30upx;border-bottom: 1px solid #EBEEF5;display: flex;flex-direction: column;">
			<view style="font-size: 30px;">
				我的收藏--详细列表
			</view>
			<!-- 商城商品管理id=3 -->
			<ViewAdmin :PageNum='PageNum' :pageList='pageList' :Num='Num' :PersonList='PersonList' style="width: 100%;display: flex;justify-content: center;align-items: center;"></ViewAdmin>
			<!-- 商城商品管理end-->
		</view>
		<!-- 我的收藏end -->
		
	</view>
</template>

<script>
	var canvaPie=null;
	var _self;
	export default{
		name:'RecomAdmin',
		data(){
			return{
				ColumnList:{
					chartType: "column",
					id: 'aaa',
					opts: {
						categories:['浏览数','推荐数','收藏数'],
						series:[
							{
								// area:[1000,100,100,100],
								color:'#facc14',
								data:[150,200,170,],
								index:0,
								legendShape:'rect',
								name:"商品数",
								pointShape:"circle",
								show:true,
								type:"column"
							}
						]
					},
				},
				LineList:{
					chartType: "line",
					id: 'aa',
					opts: {
						categories:['浏览数','推荐数','收藏数'],
						series:[
							{
								// area:[1000,100,100,100],
								color:'#facc14',
								data:[150,200,170,],
								index:0,
								legendShape:'rect',
								name:"商品数",
								// pointShape:"circle",
								show:true,
								// type:"line"
							}
						]
					},
				},
				cWidth:'',
				cHeight:''
				
			}
		},
		beforeMount(){
			this.cWidth=uni.upx2px(500);
			this.cHeight=uni.upx2px(400);
			_self = this
			uni.request({
								url: 'https://www.ucharts.cn/data.json',
								data:{
								},
								success: function(res) {
									console.log(res.data.data)
									let Pie={series:[]};
									//这里我后台返回的是数组，所以用等于，如果您后台返回的是单条数据，需要push进去
									Pie.series=[
										{
											"name": "浏览数",
											"data": 150
										}, 
										{
											"name": "推荐数",
											"data": 200
										}, 
										{
											"name": "收藏数",
											"data": 170
										}];
	
									
									_self.showPie("canvasPie",Pie);
								},
								fail: () => {
									_self.tips="网络错误，小程序端请检查合法域名";
								},
							});
		},
		// 此处定义传入的数据
		props: {
		    ViewList: {
		        type: Array,
		        value: null
		    },
			RecomList: {
			    type: Array,
			    value: null
			},
			CollectList: {
			    type: Array,
			    value: null
			},
			
			// 浏览参数传入
			PersonList: {
			    type: Array,
			    value: null
			},
			Num: {
			    type: Number,
			    value: null
			},
			PageNum: {
			    type: Number,
			    value: null
			},
			pageList: {
			    type: Array,
			    value: null
			},
		},
		methods:{
			showPie(canvasId,chartData){
							canvaPie=new Charts({
								$this:_self,
								canvasId: canvasId,
								type: 'pie',
								fontSize:11,
								legend:{
								  show:true,
								  position:'right',
								  float:'center',
								  itemGap:10,
								  padding:5,
								  lineHeight:26,
								  margin:5,
								  borderWidth :1
								},
								background:'#FFFFFF',
								pixelRatio:1,
								series: chartData.series,
								animation: true,
								width: _self.cWidth,
								height: _self.cHeight,
								dataLabel: true,
								extra: {
									pie: {
									  labelWidth:15
									}
								},
							});
							
						},
		}
	}
</script>

<style>
	.num{
		color: #0088CC;
	}
	.num:hover{
		color: #005580;
		text-decoration: underline;
	}
</style>
