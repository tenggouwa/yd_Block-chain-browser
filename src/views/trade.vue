<template>
	<div class="trade">
		<!-- 搜索  -->
		<!-- <div class="search">
			<input type="text" placeholder="输入区块高度／哈希／地址">
			<div class="i-search">
				<i class="iconfont icon-sousuo"></i>
			</div>
		</div> -->
		<Search></Search>
		<!-- 标题 -->
		<div class="title">
			<i class="iconfont icon-iconfonticonshutiao"></i>
			<span>交易</span>
		</div>
		<!-- 区块哈希 -->
		<div class="hash">
			<span>交易哈希&nbsp;&nbsp;&nbsp;&nbsp;{{hash}}</span>
		</div>
		<!-- 标题 -->
		<div class="title">
			<i class="iconfont icon-iconfonticonshutiao"></i>
			<span>交易详情</span>
		</div>
		<!-- 概况 -->
		<div class="allcention">
			<ul>
				<li>
					<span>接收状态</span>
					<span>{{tradehInfoState|receiptState}}</span>	
				</li>
				<li>
					<span>区块高度</span>
					<span @click="selectblockdetail(tradehInfo.height)" class="link">{{tradehInfo.height}}</span>	
				</li>
				<li>
					<span>时间(GMT+8)</span>
					<span>{{tradehInfo.blocktime|timer}}</span>	
				</li>
				<li>
					<span>来自</span>
					<div class="link auto" @click="goAdressDetail(tradehInfo.fromaddr,0,tradehInfo.amount)">{{tradehInfo.fromaddr}}</div>	
				</li>
				<li>
					<span>去向</span>
					<div class="link auto" @click="goAdressDetail(tradehInfoTx.to,0,tradehInfo.amount)">{{tradehInfoTx.to}}</div>
				</li>
				<li>
					<span>价值</span>
					<span>{{tradehInfo.amount/100000000}}&nbsp;BTY</span>	
				</li>
				<li>
					<span>费用</span>
					<span>{{tradehInfoTx.fee/100000000}}&nbsp;BTY</span>	
				</li>
				<li>
					<span>随机数</span>
					<span>{{tradehInfoTx.nonce}}</span>	
				</li>
				<li>
					<span>执行器</span>
					<span>{{tradehInfoTx.execer}}</span>	
				</li>
				<li>
					<span>调用函数</span>
					<span>{{tradehInfo.actionname}}</span>	
				</li>
				<li class="mian">
					<span class="hundred">输入数据</span><br>
					<div class="kuai">
						<p><pre>{{tradehInfoTx.payload}}</pre></p>
					</div>
				</li>
				<li class="mian">
					<span class="hundred">输出数据</span><br>
					<div class="kuai">
						<p><pre>{{tradehInfo.receipt}}</pre></p>
					</div>
				</li>
			</ul>
		</div>
	</div>
</template>
<script>
import Search from '../components/search.vue'
import {postTradeHash} from '../assets/js/api-config.js';
import {filterTime} from '../assets/js/filters';
var JSONbig = require('json-bigint');
export default {
	components:{
		Search
	},
  data() {
    return {
			hash:'',
			tradehInfo:{},
			tradehInfoState:0,
			tradehInfoTx:{},
    }
  },
  mounted: function() {
    this.$nextTick(function() {
      this.hash = this.$route.query.hash;
      this.getTradeDetail(this.hash);
    })
  },
  filters:{
    receiptState:function(value){
      if(value == 1){
        return '失败'
      }else if(value == 2){
        return '成功'
      }
    },
    timer:function(value){
      return filterTime(value, 'Y-M-D h:m:s');
    }
  },
  methods:{
    selectblockdetail(height){
      this.$router.push({"path":"/qukuai", query:{'height':height}});
    },
    goAdressDetail:function(hash,data,account){
      this.$router.push({'path':'/address', query:{'address':hash,'way':data}})
    },
    getTradeDetail:function(hash) {
      let params = {  
        "jsonrpc":"2.0",  
        "id":'int32',  
        "method":"Chain33.QueryTransaction",  
        "params":[{"hash":hash}]  
      } 
      postTradeHash(params).then((data) => {
        this.tradehInfo = data.result;
        this.tradehInfoState = data.result.receipt.ty;
        this.tradehInfoTx = data.result.tx;
        this.tradehInfoTx.nonce=JSONbig.stringify(this.tradehInfoTx.nonce).replace(/\"/g,"");
      });
    },
  }
}
</script>
<style>
.trade{
	background: #f3f3f3;
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
	.hash{
		/*width: 100%;*/
		height: 37px;
		background: #e5e5e5;
		padding: 0 12px;
		overflow-x: auto;
		span{
			white-space: nowrap;  /*强制span不换行*/
			line-height: 37px;
			color: #333;
			font-size: 13px;
		}
	}
	.hash::-webkit-scrollbar {
		display: none;
	}
	.allcention{
		/*overflow: hidden;*/
		background: #fff;
		border:1px solid #eee;
		li{
			height: 44px;
			line-height: 44px;
			border-bottom:1px solid #eee;
			span{
				float: left;
				display: block;
				height: 44px;
				overflow-x: auto;
				max-width: 200px;
				width: 30%;
				padding-left: 13px;
			}
			.auto{
				white-space: nowrap;
				float: left;
				display: block;
				height: 44px;
				overflow-y: auto;
				max-width: 200px;
				width: 60%;
				/*padding-left: 13px;*/
				margin-left: 13px;
			}
			.auto::-webkit-scrollbar {
				display: none;
			}
			.link{
				color: #0975a7;
			}
			span:last-child{
				width: 60%;
				padding-left: 13px;
			}
			
		}
		.mian{
			height: auto;
			padding-bottom: 10px;
			.hundred{

			}
			.kuai{
				/*width: 100%;*/
				height: 230px;
				padding-left: 13px;
				margin: 0 13px;
				background: #f9f9f9;
				border:1px solid #eee;
				color: #6e6e6e;
				word-wrap:break-word;
				overflow-y: auto;
				/*overflow: auto;*/
				p{
					width: 100%;
					pre{
						width: 100%;
						white-space: pre-wrap;
						word-wrap: break-word;
					}
				}
			}
		}
	}
	
}
</style>