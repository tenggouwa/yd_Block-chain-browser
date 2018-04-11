<template>
	<div class="qukuai">
		<!-- 搜索  -->
		<Search></Search>
		<!-- 标题 -->
		<div class="title">
			<i class="iconfont icon-iconfonticonshutiao"></i>
			<span>区块 {{data.Height}}</span>
		</div>
		<!-- 区块哈希 -->
		<div class="hash">
			<span>区块哈希 &nbsp;{{data.Hash}}</span>
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
					<span>交易数量</span>
					<span>{{Txcount}}</span>	
				</li>
				<li>
					<span>高度</span>
					<span>{{blockInfo.height}}</span>	
				</li>
				<li>
					<span>区块收益</span>
					<span>30(矿工18+发展基金12)</span>	
				</li>
				<li>
					<span>时间(GMT+8)</span>
					<span>{{blockInfo.blocktime|timer}}</span>	
				</li>
				<li>
					<span>默克尔根</span>
					<div class="auto">{{blockInfo.txhash}}	</div>
				</li>
				<li>
					<span>状态哈希</span>
					<div class="auto">{{blockInfo.statehash}}	</div>
				</li>
				<li>
					<span>上一块</span>
					<span class="link" @click="goLink(blockInfo.height,0)">{{lastblock}}</span>	
				</li>
				<li>
					<span>下一块</span>
					<span class="link" @click="goLink(blockInfo.height,1)">{{nextblock}}</span>
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
					<td>去向</td>
					<td>价值</td>
					<td>费用</td>
					<td>时间(GMT+8)</td>
					<td>调用函数</td>
				</tr>
				<tr  v-for="data in blockTable">
					<td class="icom">
						<i class="iconfont icon-chucuo"  v-if="data.receipt.ty == 1"></i>
					</td>
					<td class="link"  @click="goTradeHash(data.hash)">
						<span>{{data.hash}}</span>
						<!-- <i class="iconfont icon-chucuo"></i> -->
					</td>
					<td class="link">
						<span @click="goAdress(data.fromaddr,0)">{{data.fromaddr}}</span>
					</td>
					<td class="link">
						<span @click="goAdress(data.tx.to,0)">{{data.tx.to}}</span>
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
				small
	      @size-change="handleSizeChange"
	      @current-change="handleCurrentChange"
	      :current-page="pageIndex"
	      :page-size="pagesize"
	      :total="total"
	      layout="prev, pager, next, jumper"
	      >
	    </el-pagination>
		</div>
	</div>
</template>
<script>
import Search from '../components/search.vue'
import {postblockDetail,postblockTradeInfo,postblockTradeList} from '../assets/js/api-config.js';
import {filterTime} from '../assets/js/filters';
import { Toast } from 'mint-ui';
export default{
	components:{
		Search
	},
  data() {
    return {
      isBlue:true,
      data:{
        Height:0,
        Hash:''
      },
      blockInfo:{},
      Txcount:'',
      blockTable:[],
      isShow:false,
      hashlist:[],
      pagesize:10,
      pageIndex:0,
      total:0,
      nextblock:'',
      lastblock:'',
    }
  },
  filters:{
    timer:function(value){
      return filterTime(value,'Y-M-D h:m:s')
    }
  },
  watch:{
    $route(){
      this.reload();
    }
  },
  mounted: function() {
    this.reload();
  },
  methods:{
  	//初始化
  	reload(){
  		if(this.$route.query.height == '0'){
  			Toast('没有1以下的区块了！')
  			this.data.Height = 1;
  			this.height = sessionStorage.getItem('newheigh');
	      this.getblockDetail();
  		}else{

  			this.data.Height = this.$route.query.height;
	  		this.height = sessionStorage.getItem('newheigh');
	      this.getblockDetail();
  		}
  	},
    goAdress:function(hash,data){
      this.$router.push({'path':'/address', query:{'address':hash,'way':data}})
    },
    // 上一块，下一块跳转
  	goLink(e,f){
  		console.log(e)
			if(f == 0 && e!=0){//上一块
  			this.$router.push({"path":"/qukuai", query:{'height':e-1}});
  			this.reload();
  		}else if(f == 0 && e == 0){//当前高度为0
  			Toast('没有上一块了');
  		}else if(f == 1 && e+1>Number(this.height)){//下一块大于最大区块高度
  			Toast('没有下一块了');
  		}else if(f == 1 && e+1<=Number(this.height)){//下一块
  			this.$router.push({"path":"/qukuai", query:{'height':e+1}});
  			this.reload();
  		}
  	},
    goTradeHash:function(hash){
      this.$router.push({path:'/trade', query:{'hash':hash}});
    },
    getblockDetail: function(){
      let params = {
        "jsonrpc":"2.0",
        "id":'int32',
        "method":"Chain33.GetBlockHash",
        "params":[{"height":Number(this.data.Height)}] 
      }
      postblockDetail(params).then((data) => {
        this.data.Hash = data.result.hash;
        this.getBlockInfo(data.result.hash);
      });
    },
    getBlockInfo(hash){//获取概况
      this.hashlist=[];
      let params = {  
        "jsonrpc":"2.0",
        "id":'int32',  
        "method":"Chain33.GetBlockOverview",  
        "params":[{"hash":hash}]  
      }
      postblockTradeInfo(params).then((data) => {
        this.Txcount = data.result.txcount;
        this.blockInfo = data.result.head;
        this.hashlist=data.result.txhashes;
        this.total=this.hashlist.length;
        // console.log(this.hashlist)
        this.nextblock = this.blockInfo.height+1;
        this.lastblock = this.blockInfo.height-1;
        if(this.nextblock>this.height){
        	this.nextblock = '暂无数据';
        }else{

        }
        if(Number(this.lastblock) <= 0){
        	this.lastblock = '暂无数据';
        }else{

        }
        this.getBlockTable();
      });
    },
    getBlockTable:function(){
      let _this=this;
      let hasharrlist=[];
      let  array=[];
      this.blockTable=[];
      // console.log(this.hashlist.length,)
      if(this.hashlist.length<=this.pagesize){
        for (let i=0;i<this.hashlist.length;i++){
          hasharrlist.push(this.hashlist[i])
        }
      }
      else{
        if(this.hashlist.length<(this.pageIndex)*(this.pagesize)&&this.hashlist.length>(this.pageIndex-1)*(this.pagesize)){
          for(let i=(this.pageIndex-1)*(this.pagesize);i<this.hashlist.length;i++){
             hasharrlist.push(this.hashlist[i])
          }
        }
        if(this.hashlist.length>(this.pageIndex)*(this.pagesize)){
          for(let i=(this.pageIndex-1)*(this.pagesize);i<(this.pageIndex)*(this.pagesize);i++){
            hasharrlist.push(this.hashlist[i])
          }
        }
      }
      if(hasharrlist.length==0){
        return;
      }
      let params = {  
        "jsonrpc":"2.0",  
        "id":"int32",  
        "method":"Chain33.GetTxByHashes",  
        "params":[{"hashes": hasharrlist}]  
      }
      postblockTradeList(params).then((data)=>{
        array=data.result.txs
        for(let i = 0; i<hasharrlist.length;i++){
           // console.log(typeof(array[i]))
          array[i].hash=hasharrlist[i];
        }
        // console.log( array)
        this.blockTable=array;
      });
      
    },
    handleSizeChange(val) {
      this.pagesize=val;
      this.getBlockTable();
    },
    handleCurrentChange(val) {
      // console.log(val)
      this.pageIndex=val;
      this.getBlockTable();
    }
  }
}
</script>
<style>
.qukuai{
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
				float: left;
				display: block;
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
			span:last-child{
				width: 60%;
				padding-left: 13px;
			}
			.link{
				color: #0975a7;
			}
		}
	}
	.fenye{
		/*width: 50%;*/
		margin: 0 auto;
		text-align: center;
		margin-top: 10px;
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
				}
				.icom{
					width: 20px;
					padding: 0;
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