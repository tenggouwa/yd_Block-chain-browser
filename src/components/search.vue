<template>
<!-- 搜索  -->
	<div class="search">
		<input type="text" v-model="Value" placeholder="请输入交易哈希/区块哈希/地址/区块高度">
		<div class="i-search" @click="submit">
			<i class="iconfont icon-sousuo"></i>
		</div>
	</div>
</template>
<script>
import { post } from '../assets/js/api-config.js';
import { Toast } from 'mint-ui';
	export default{
		data(){
			return{
				Value:'',
				height:0,
				getLastHeighttime:0,
			}
		},
		mounted(){
		  this.height=sessionStorage.getItem('newheigh');
			this.getLastHeighttime=setInterval(()=>{
	      this.getFuckdata();
	    }, 5000);
		},
		methods:{
			//获取最大高度
			getFuckdata(){
				 let body={
         "jsonrpc":"2.0",
          "id":'int32',
          "method":"Chain33.GetLastHeader",
          "params":[] ,
        };
        post(body).then((data) => {
        	if(sessionStorage.getItem('newheigh')==Number(data.result.height)){
        		this.height=sessionStorage.getItem('newheigh');
		        // this.getFuckdata();
		      }else{
		        sessionStorage.setItem('newheigh',Number(data.result.height));
            this.height = sessionStorage.getItem('newheigh');
		      }
        });
			},
			submit() {
				this.height=sessionStorage.getItem('newheigh');
				var reg = /^[0-9]*[1-9][0-9]*$/;
	      if (this.Value.trim()== '') return Toast('请输入交易哈希/区块哈希/地址/区块高度');
	      console.log(this.Value.trim())
	      if (this.Value.trim() == '0'){
	      	Toast('没有0以下的区块了！')
	      	let params = {
            "jsonrpc":"2.0",
            "id":'int32',
            "method":"Chain33.GetBlockHash",
            "params":[{"height":0}] 
          };
          post(params).then(data => {
            if(data.error == null){
              this.$router.push({"path":"/qukuai", query:{'height':0}});
              this.Value = '';
            }else{
            	Toast('输入信息有误，请重新输入');
            	this.Value = '';
            }
          });
	      }else if(reg.test(this.Value.trim())){
	      	console.log(Number(this.Value.trim()));
	      	console.log(Number(this.height))
	        if(Number(this.Value.trim()) <= Number(this.height)){//判断两个高度差---int类型比较
	          let params = {
	            "jsonrpc":"2.0",
	            "id":'int32',
	            "method":"Chain33.GetBlockHash",
	            "params":[{"height":Number(this.Value.trim())}] 
	          };
	          post(params).then(data => {
	            if(data.error == null){
	              this.$router.push({"path":"/qukuai", query:{'height':this.Value.trim()}});
	              this.Value = '';
	            }else{
	            	Toast('输入信息有误，请重新输入');
	            	this.Value = '';
	            }
	          });
	        }else{
	        	Toast('输入的高度不能超过最大高度!');
	        	this.Value = '';
	        }
	      }else{
	        let e = (this.Value).length;
	        if(e == 66){//交易的哈希值---地址62位字节加上16进制标示0x(共64位)
	          let params = {  
	            "jsonrpc":"2.0",  
	            "id":'int32',  
	            "method":"Chain33.QueryTransaction",  
	            "params":[{"hash":this.Value}]  
	          } 
	          post(params).then(data => {
	            if(data.error == null){
	              this.$router.push({"path":'/trade', query:{"hash":this.Value}});
	              this.Value = '';
	            }else{
	            	//区块哈希
	            	let param = {  
	                "jsonrpc":"2.0",
	                "id":'int32',  
	                "method":"Chain33.GetBlockOverview",  
	                "params":[{"hash":this.Value}]  
	              }
	              post(param).then((data) => {
	                if(data.error == null){
	                  this.$router.push({"path":'/qukuai', query:{"height":data.result.head.height}});
	                  this.Value = '';
	                }else{
	                  Toast('输入信息有误，请重新输入');
	                  this.Value = '';
	                } 
	              });
	            }
	          });
	        }else{//地址
	          let params = {  
	            "jsonrpc":"2.0",  
	            "id":'int32',  
	            "method":"Chain33.GetAddrOverview",  
	            "params":[{"addr":this.Value}], 
	          } 
	          post(params).then((data) => {
	            if(data.error == null){
	              this.$router.push({"path":'/address', query:{"address":this.Value, "way":0}});
	              this.Value = '';
	            }else{
	              Toast('输入信息有误，请重新输入');
	              this.Value = '';
	            }
	          });
	        }
	      }
	    },
	  },
    destroyed:function(){
	    clearInterval(this.getLastHeighttime);
	  },
  }
</script>
<style scoped>
	.search{
		overflow: hidden;
		input{
			float: left;
			width: 79%;
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
</style>