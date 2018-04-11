<template>
	<div class="header">
		<div class="top">
			<img @click="golinkMain" src="../../static/img/logo.png" alt="">
			<i @click="showTab" class="iconfont icon-caidan"></i>
		</div>
		<div class="ulcont" v-show="show">
			<ul>
				<li :class="{active:index == actine}" v-for="(item,index) in ulList" @click="goLink(index)">{{item.name}}</li>
				
			</ul>
		</div>
	</div>
</template>
<script>
import {gethashHeader} from '../assets/js/api-config.js'
	export default{
		data(){
			return{
				ulList:[
				{
					name:'首页',
					src:'/',
				},
				{
					name:'状态',
					src:'/status',
				},
				{
					name:'联系我们',
					src:'/contant',
				}],
				show:false,
				actine:0,
				newheigh:'',
			}
		},
		watch:{
	    $route(){
	      this.show = false;
	      this.getBlockTrade();
	    }
	  },
	  mounted(){
	  	this.getBlockTrade();
	  	window.addEventListener('scroll', this.scrollfalse);
	  },	
		methods:{
			getBlockTrade() {
	      let _this=this;
	      let body={
	       "jsonrpc":"2.0",
	        "id":'int32',
	        "method":"Chain33.GetLastHeader",
	        "params":[] ,
	      };
	      gethashHeader(body).then((data) => {
	        _this.newheigh=data.result.height;
	        // console.log( _this.newheigh);
	        sessionStorage.setItem("newheigh",_this.newheigh);  
	      });
	    },
			golinkMain(){
				this.$router.push({'path':'/'})
			},
			scrollfalse(){
				this.show = false;
			},
			showTab(){
				this.show = !this.show;
			},
			goLink(e){
				let f = this.ulList[e].src;
				this.$router.push({'path':f})
				this.actine = e;
				this.show = false;
			}
		}
	}
</script>
<style>
	.header{
		width: 100%;
		.top{
			height: 45px;
			background: #111;
			overflow: hidden;
			img{
				float: left;
				width: 67px;
				margin: 8px 0 0 13px;
			}
			i{
				color: #fff;
				float: right;
				font-size: 34px;
				margin: 4px 13px 0 0;
			}
		}
		.ulcont{
			position: fixed;
			width: 100%;
			ul{
				li{
					padding-left: 13px;
					height: 40px;
					line-height: 40px;
					font-size: 14px;
					color: #fff;
					background: #0975a6;
				}
				.active{
					color: #0a76a7;
					background: #fff;
				}
			}
		}
	}
</style>