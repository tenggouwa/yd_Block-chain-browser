<template>
	<div class="status">
		<!-- 搜索  -->
		<Search></Search>
		<!-- 标题 -->
		<div class="title">
			<i class="iconfont icon-iconfonticonshutiao"></i>
			<span>状态</span>
		</div>
		<!-- 状态栏 -->
		<div class="table">
			<ul>
				<li>
					<span class="link">同步状态</span>
				</li>
				<li>
					<span>同步进程</span>		
					<div class="right slider">
						<mt-range v-model="rangeValue" :barHeight="3" disabled>
						 <!--  <div slot="start">0</div> -->
						  <div slot="end">{{rangeValue}}%</div>
						</mt-range>
					</div>
				</li>
				<li>
					<span>当前同步状态</span>
					<span class="right">{{state.info}}</span>
				</li>
			</ul>
		</div>
	</div>
</template>
<script>
import Search from '../components/search.vue'
import {postStatePeer,postStateLastHeader} from '../assets/js/api-config.js';
import { Toast } from 'mint-ui';
export  default{
	components:{
		Search
	},
  data(){
    return{
    	rangeValue:0,
      state:{
        info:0,
        rate:0,
      },
    }
  },
  mounted() {
    this.getStateInfo();
  },
  methods:{
    getStateInfo(){
      let body = {  
        "jsonrpc":"2.0",  
        "id":'int32',  
        "method":"Chain33.GetPeerInfo",  
        "params":[]  
      }
      postStatePeer(body).then((data) => {
        if(data.error == null){
          let dataArr = data.result.peers;
          let max = 0;
          if(data.result.peers.length != 0){
            max = dataArr[0].header.height;
            for(var i  = 0; i < dataArr.length; i++){
              if(max<dataArr[i].header.height)max=dataArr[i].header.height;
            }
          }
          this.getLastHeader(max);
        }else{
          Toast(data.error);
        }
      });
    },
    getLastHeader:function(max){
      let body = {
        "jsonrpc":"2.0",
        "id":1,
        "method":"Chain33.GetLastHeader",
        "params":[] 
      }
      postStateLastHeader(body).then((data) => {
        if(data.error == null){
          let H3 = data.result.height;
          if(max - H3 < 3){
            this.state.info = '已完成';
            this.state.rate = 100;
          }else{
            this.state.info = '未完成';
            this.state.rate = ((H3)/max)*100;
          }
          this.rangeValue = this.state.rate;
        }else{
          Toast(data.error);
        }
      });
    }
  }
}
</script>
<style>
	.status{
		/*width: 100%;*/
		padding: 10px 13px;
		.search{
			overflow: hidden;
			input{
				float: left;
				width: 82%;
				height: 30px;
				color: #999;
				font-size: 11px;
				border-radius: 3px;
				border: 1px solid #dcdcdc;
				padding: 0 10px;
			}
			.i-search{
				float: right;
				background: #0975a7;
				width: 32px;
				height: 32px;
				border-radius: 3px;
				text-align: center;
				i{
					color: #fff;
					font-size: 26px;
				}
			}
		}
		.title{
			padding: 10px 0;
			color: #0975a7;
			i{
				margin-left: -6px;
			}
			span{
				font-size: 16px;
			}
		}
		.table{
			background: #fff;
			width: 100%;
			height: 180px;
			.link{
				color: #0975a7;
				font-size: 16px;
			}
			li{
				height: 60px;
				padding:0 13px;
				border-bottom: 1px solid #eee;
				span{
					line-height: 60px;
					font-size: 14px;
				}
				.right{
					float: right;
				}
				.slider{
					width: 200px;
					margin-top: 15px;
				}
			}
		}
		
	}
</style>