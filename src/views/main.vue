<template>
	<div class="main">
		<!-- 搜索  -->
		<Search></Search>
		<!-- 标题 -->
		<div class="title">
			<i class="iconfont icon-iconfonticonshutiao"></i>
			<span>最新区块</span>
		</div>
		<!-- 表格 -->
		<div class="table">
			<table 
				v-infinite-scroll="loadMore"
			  infinite-scroll-disabled="loading"
			  infinite-scroll-distance="10">
				<tr class="tr-head">
					<td width="25%">高度</td>
					<td>时间(GMT+8)</td>
					<td width="25%">交易数量</td>
				</tr>
				<tr v-for="item in tradeBlock">
					<td class="link" @click="goBlockDetail(item.height)">{{item.height}}</td>
					<td>{{item.blocktime|timers}}</td>
					<td>{{item.txcount}}</td>
				</tr>
			</table>
		</div>
	</div>
</template>
<script>
import Search from "../components/search.vue"
import {gethashHeader,fetchTradeBlock,fetchLatestTrade,fetchTopInfo,postTradeList, postTradeDetail, postblockDetail} from '../assets/js/api-config.js';
import { filterTime } from '../assets/js/filters.js';
import axios from 'axios';
import { Toast,InfiniteScroll,Indicator } from 'mint-ui';
export default{
	components:{
		Search
	},
	data(){
		return {
		  str:'',
	      pagesize:10,
	      newheigh:0,
	      tradeBlock: [],
	      isShow:false,
	      sw:true,
	      getLastHeighttime:0,
	    }
	},
	filters:{
    timers:function(data){
      return filterTime(data,"Y-M-D h:m:s")
    }
  },
  mounted(){
    this.getBlockTrade();
    this.getLastHeighttime=setInterval(()=>{
      this.getBlockTrade();
    }, 5000);
	  Indicator.open('加载中...');
  },
  methods: {
  	//瀑布流
  	loadMore() {
  		if(this.newheigh == 0){
  			// console.log('初始')
  		}else{
  			this.newheigh = this.newheigh-1;
  			Indicator.open('加载中...');
  			this.getList();
  		}
		},
    goBlockDetail(height){//点击高度，跳转到区块
      this.$router.push({"path":"/qukuai", query:{'height':height}});
    },
    scrollEvennt(){
      // console.log(123)
      this.getList()
    },
    getBlockTrade() {
      let _this=this;
      let body={
       "jsonrpc":"2.0",
        "id":'int32',
        "method":"Chain33.GetLastHeader",
        "params":[] ,
      };
      gethashHeader(body).then((data) => {
        // console.log(data.result.height)
        if(Number(sessionStorage.getItem('newheigh'))==Number(data.result.height)&&_this.tradeBlock.length>0){
            sessionStorage.setItem("newheigh",Number(data.result.height));
        }else{
          _this.tradeBlock=[];
          console.log()
          _this.newheigh=data.result.height;
          sessionStorage.setItem("newheigh",_this.newheigh);  
          _this.getList();
        }
        
      });
    },
    getList(){
      let _this=this;
      let param={
        "jsonrpc":"2.0",
        "id":'int32',
        "method":"Chain33.GetHeaders",
        "params":[{
          'start':_this.newheigh-_this.pagesize+1,
          'end':_this.newheigh,
          'isdetail':false
        }] 
      };
      fetchTradeBlock(param).then((data) => {
        if(data.result==null){
          Toast('没有更多数据了');
        }else{
        	Indicator.close();
        	let newarray=(data.result.items)
        	newarray = newarray.reverse()
	        for(let item in newarray){
	          _this.tradeBlock.push(newarray[item]);
	        }
	        _this.sw=true;
	        _this.newheigh=data.result.items[data.result.items.length-1].height;
	        if( _this.tradeBlock.length == 0){
	           return this.isShow = true;
	        }
        }
      })
    },
  },
  destroyed:function(){
    clearInterval(this.getLastHeighttime);
  },
}
</script>
<style>
	.main{
		/*width: 100%;*/
		padding: 10px 13px;
		background: #f6f6f6;
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
			table{
				text-align: center;
				width: 100%;
				tr{
					height: 60px;
					line-height: 60px;
					color: #333;
					font-size: 13px;
					border: 1px solid #eee;
					background: #f9f9f9;
					.link{
						color: #0975a7;
					}
				}
				tr:nth-child(odd){
					background: #fff;
				}
				.tr-head{
					height: 60px;
					color: #333;
					font-size: 14px;
					font-weight: bold;
				}
			}
		}
	}
</style>