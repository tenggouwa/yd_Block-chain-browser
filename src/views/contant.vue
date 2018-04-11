<template>
	<div class="contant">
		<!-- 标题 -->
		<div class="title">
			联系我们
		</div>
		<!-- 滑动 -->
		<div class="slide">
			<ul>
				<li v-for='(item,index) in ulList' @click="getSrcimg(index)">
					<div :class='{active:index == nice}'>
						<i :class="'iconfont'+' '+item.icon"></i>
					</div>
					<span>
						{{item.name}}
					</span>
				</li>
			</ul>
		</div>
		<!-- 二维码 -->
		<div class="erweima">
			<img :src="this.imgSrc" height="384" width="369" alt="">
			<p>{{srcName}}</p>
			<p class="sao">扫一扫 联系我们</p>
		</div>
	</div>
</template>
<script>
	export default{
		data(){
			return{
				ulList:[
					{
						icon:'icon-weixin',
						name:'微信',
						src:require('../assets/img/1/weixin.png'),
						tit:'yfx0323',
					},
					{
						icon:'icon-weixingongzhonghao',
						name:'微信公众号',
						src:require('../assets/img/1/bty.png'),
						tit:'比特元Bityuan',
					},
					{
						icon:'icon-QQ',
						name:'QQ',
						src:require('../assets/img/1/QQqun.png'),
						tit:'238866636',
					},
					{
						icon:'icon-twitter',
						name:'Twitter',
						src:require('../assets/img/1/TWITTER.png'),
						tit:'Twitter',
					},
					{
						icon:'icon-kefu',
						name:'BItciontalk',
						src:require('../assets/img/1/BItciontalk.png'),
						tit:'BItciontalk',
					},
					{
						icon:'icon-qun',
						name:'电报群',
						src:require('../assets/img/1/dianbaoqun.png'),
						tit:'电报群',
					}],
					imgSrc:require("../assets/img/1/weixin.png"),
					srcName:'微信',
					nice:'0',
			}
		},
		methods:{
			// add(){
			// 	this.$router.push({'path':'/trade'})
			// },
			getSrcimg(e){
				this.nice = e;
				this.imgSrc = this.ulList[e].src;
				this.srcName = this.ulList[e].tit;
			}
		}
	}
</script>
<style>
	.contant{
		height:100vh;
		padding-top: 34px; 
		background: #292733;
		color: #fff;
		.title{
			width: 145px;
			height: 38px;
			border: 1px solid #3e3b4d;
			text-align: center;
			font-size: 19px;
			line-height: 39px;
			margin: 0 auto;
		}
		.slide::-webkit-scrollbar {
			display: none;
		}
		.slide{
			margin-top:30px;
			overflow-x: auto;
			ul{
				padding-bottom: 56px;
				width: 570px;
				overflow: hidden;
				li{
					float: left;
					text-align: center;
					padding: 0 17px;
					div{
						margin: 16px 0;
						border-radius: 50%;
						background: rgba( 255,255,255,0.1);
						width: 60px;
						height: 60px;
						i{
							color: #0975a7;
							font-size: 40px;
							line-height: 60px;
						}
					}
					.active{
						background: #0975a7;
						i{
							color: #fff;
						}
					}
				}
			}
		}
		.erweima{
			width: 325px;
			/*height: 331px;*/
			background: #fff;
			margin: 0 auto;
			text-align: center;
			img{
				margin: 30px 0 0 0;
				width: 184.5px;
				height: 184.5px;
			}
			p{
				color: #333;
				font-size: 20px;
				margin-top: 20px;
			}
			.sao{
				color: #999;
				font-size: 16px;
				margin-top: 10px;
				padding-bottom: 10px;

			}
		}
	}
</style>