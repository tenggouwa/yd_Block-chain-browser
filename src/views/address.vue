<template>
	<div class="address">
		<!-- 搜索  -->
		<Search></Search>
		<!-- 标题 -->
		<div class="title">
			<i class="iconfont icon-iconfonticonshutiao"></i>
			<span>地址</span>
			<!-- <span v-if="account"> {{account/100000000}}&nbsp;BTY</span> -->
		</div>
		<!-- 区块哈希 -->
		<div class="hash">
			<span>区块地址&nbsp;&nbsp;&nbsp;&nbsp;{{hash}}</span>
		</div>
		<!-- 标题 -->
		<div class="title">
			<i class="iconfont icon-iconfonticonshutiao"></i>
			<span>概况</span>
		</div>
		<!-- 概况 -->
		<div class="allcention">
			<ul>
				<li>
					<span>余额</span>
					<span v-if="tableInfo.balance">{{tableInfo.balance/100000000 }}&nbsp;BTY</span>	
				</li>
				<li>
					<span>总接收</span>
					<span v-if='tableInfo.reciver'>{{tableInfo.reciver/100000000 }}&nbsp;BTY</span>	
				</li>
				<li>
					<span>总发送</span>
					<span v-if="tableInfo.balance">{{(tableInfo.reciver - tableInfo.balance)/100000000 }}&nbsp;BTY</span>	
				</li>
			</ul>
		</div>
		<!-- 标题 -->
		<div class="title">
			<i class="iconfont icon-iconfonticonshutiao"></i>
			<span>交易记录</span>
		</div>
		<!-- 表格 -->
		<div class="table">
			<table>
				<tr class="tr-head">
					<td class="icom"></td>
					<td>哈希值</td>
					<td>来自</td>
					<td class="icom"></td>	
					<td>去向</td>
					<td>价值</td>
					<td>费用</td>
					<td>时间(GMT+8)</td>
					<td>调用函数</td>
				</tr>
				<tr v-for="data in tradeBlock">
					<td class="icom">
						<i v-if="data.receipt.ty == 1" class="iconfont icon-chucuo"></i>
					</td>
					<td class="link">
						<span  @click="goTradeHash(data.hash)">{{data.hash}}</span>
						<!-- <i class="iconfont icon-chucuo"></i> -->
					</td>
					<td>
						<span :class="{link:data.tx.to == $route.query.address}" @click="goLinkAddress(data.fromaddr,data.tx.to,1)">{{data.fromaddr}}</span>
					</td>
					<td class="icom">
						<!-- <i class="iconfont icon-chu" v-if="data.fromaddr == $route.query.address"></i>
						<i class="iconfont icon-jinru green" v-if="data.tx.to == $route.query.address"></i> -->
						<img src="../assets/img/out.png" v-if="data.fromaddr == $route.query.address">
						<img src="../assets/img/IN.png" v-if="data.tx.to == $route.query.address">
					</td>
					<td>
						<span :class="{link:data.fromaddr == $route.query.address }" @click="goLinkAddress(data.tx.to,data.fromaddr,2)">{{data.tx.to}}>{{data.tx.to}}</span>
					</td>
					<td>{{data.amount/100000000}}&nbsp;BTY</td>
					<td>{{data.tx.fee/100000000}}&nbsp;BTY</td>
					<td>{{data.blocktime|timer}}</td>
					<td>{{data.actionname}}</td>
				</tr>
			</table>
		</div>
		<div class="fenye">
			<el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="hashArrParams.params[0].count"
        layout=" prev, next,total"
        :total="tableInfo.txcount"
        >
      </el-pagination>
		</div>
	</div>
</template>
<script>
import Search from '../components/search.vue'
import {postTradeList,postTradeTable,postblockTradeList} from '../assets/js/api-config.js';
import {filterTime} from '../assets/js/filters';
import { Toast } from 'mint-ui';
export default{
	components:{
		Search
	},
  data(){
    return{
      tableInfo:{},
      tradeBlock: [],
      hash:'',
      account:'',
      isShow:false,
      currentPage:1,
      hashArrString:[],
      hashArrParams:{
        "jsonrpc":"2.0",
        "id":'int32',
        "method":"Chain33.GetTxByAddr",
        "params":[{ 
          "addr":'',
          "flag":0,
          "count":10,
          "direction":0,
          "height":-1,
          "index":0
        }],
      },
      nextHeight:{},
      preHeight:{},
    }
  },
  filters:{
    timer:function(value){
      return filterTime(value,'Y-M-D h:m:s')
    }
  },
  watch: {
    '$route' (to, from) {
      this.hash = this.$route.query.address;
      this.getTradeList(this.hash);

      this.hashArrString = [];
      this.tradeBlock = [];

      this.hashArrParams.params[0].addr = this.$route.query.address;
      this.hashArrParams.params[0].flag = 0;
      // this.hashArrParams.params[0].flag = Number(this.$route.query.way);
      this.getTradeTable(0);
    }
  },
  mounted() {
    this.reload();
  },
  methods:{
  	reload(){
  		this.tradeBlock = [];
  		this.hash = this.$route.query.address;
      this.getTradeList(this.hash);
      this.hashArrParams.params[0].addr = this.$route.query.address;
      this.hashArrParams.params[0].flag = Number(this.$route.query.way);
      this.getTradeTable(0);
  	},
  	goLinkAddress(clock,to,f){//点击地址（来自和去向）click:点击的那一个；to:另一个；
  		if(f == 1){//来自
  			if(clock == this.$route.query.address){

  			}else if(to == this.$route.query.address){
  				this.$router.push({'path':'/address','query':{'address':clock,'way':f}});
  				setTimeout(()=>{
			  		this.reload();
			  	},200)
  				
  			}
  		}else if(f == 2){//去向
  			if(clock == this.$route.query.address){

  			}else if(to == this.$route.query.address){
  				this.$router.push({'path':'/address','query':{'address':clock,'way':f}});
  				setTimeout(()=>{
			  		this.reload();
			  	},200)
  			}
  		}
  	},
  	//跳转交易
    goTradeHash(hash){
      this.$router.push({'path':'/trade','query':{'hash':hash}})
    },
    //分页
    handleSizeChange(val){
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange:function(currentPage){
      console.log(currentPage,this.currentPage)
      this.tradeBlock = [];
      this.hashArrString = [];
      if(currentPage >= this.currentPage){
        this.hashArrParams.params[0].direction = 0;
        this.currentPage = currentPage;
        this.hashArrParams.params[0].height = this.nextHeight.height;
        this.hashArrParams.params[0].index = this.nextHeight.index;
        this.getTradeTable(0);
      }else{
        this.hashArrParams.params[0].direction = 1;
        this.currentPage = currentPage;
        this.hashArrParams.params[0].height = this.preHeight.height;
        this.hashArrParams.params[0].index = this.preHeight.index;
        this.getTradeTable(1);
      }
    },
    getTradeList(hash){
      let body = {  
        "jsonrpc":"2.0",  
        "id":'int32',  
        "method":"Chain33.GetAddrOverview",  
        "params":[{"addr":hash}], 
      } 
      postTradeList(body).then((data) => {
        if(data.error == null){
          this.tableInfo = data.result;
        }else{
        	Toast(data.error);
        }
      });
    },
    getTradeTable:function(index){//根据信息获取交易的哈希数组  index=0向后翻页 index=1向前翻页
      postTradeTable(this.hashArrParams).then((data) => {
        // console.log(data.result);
        if(data.result==null){
          this.isShow=true;
          return;
        }
        if(data.error == null){
          let hashArr = data.result.txinfos;
          if(index==0){
            for(var i=0; i <hashArr.length; i++){
              this.hashArrString.push(hashArr[i].hash);
            } 
            this.nextHeight = hashArr[hashArr.length-1];
            this.preHeight = hashArr[0];
          }else{
            for(var i=hashArr.length; i >0; i--){
              this.hashArrString.push(hashArr[i-1].hash);
            }
            this.preHeight = hashArr[hashArr.length-1];
           this.nextHeight = hashArr[0];
          }
          this.getTradeTableInfo(this.hashArrString);
        }else{
          Toast(data.error);
        }
      })
    },
    getTradeTableInfo(hashArr){//根据哈希数组获取table的数据
      let body = {
      "jsonrpc":"2.0",
      "id":'int32',
      "method":"Chain33.GetTxByHashes",
      "params":[{"hashes": this.hashArrString}]  
      }
      postblockTradeList(body).then((data) => {
        this.tradeBlock = data.result.txs;
        if(data.error == null){
          this.tradeBlock = data.result.txs;
          if(this.tradeBlock.length == 0){
            return this.isShow = true;
          }
          for(var i = 0; i<this.tradeBlock.length; i++){
            this.tradeBlock[i].hash = this.hashArrString[i];
          }     
        }else{
          this.$notify({
            title:'提示',
            message:data.error,
            type:'warning'
          })
        }
      });
    }
  }
}
</script>
<style>
.address{
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
		background: #fff;
		border:1px solid #eee;
		li{
			height: 44px;
			line-height: 44px;
			border-bottom:1px solid #eee;
			span{
				display: inline-block;
				width: 30%;
				padding-left: 13px;
			}
			span:last-child{
				width: 60%;
				padding-left: 13px;
			}
		}
	}
	.fenye{
		/*width: 50%;*/
		margin: 0 auto;
		text-align: center;
		margin-top: 20px;
	}
	.table::-webkit-scrollbar {
		display: none;
	}
	.table{
		width: 100%;
		overflow-x: auto;
		table{
			table-layout: fixed;
			text-align: center;
			width: 200%;
			tr{
				height: 60px;
				/*line-height: 60px;*/
				color: #333;
				font-size: 13px;
				border: 1px solid #eee;
				background: #f9f9f9;
				.link{
					color: #0975a7;
				}
				td{
					padding: 0 10px 0 0;
					width: 16%;
					text-overflow: ellipsis;
					overflow: hidden;
					white-space: nowrap;
					span{
						max-width: 40px;
						
					}
					i{
						color: #ff4e00;
						font-size: 20px;
					}
					.green{
						color: #8ac009;
					}
				}
				.icom{
					width: 27px;
					padding: 0;
					img{
						width: 25px;
						height: 15px;
						margin-top: 5px;
					}
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