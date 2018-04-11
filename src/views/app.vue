<template>
	<div class="index">
		<div class="top">
			<index-top></index-top>
		</div>
		<div class="body">
			<router-view></router-view>
		</div>
	</div>
</template>
<script>
import indexTop from "../components/header.vue"
export default{
	data(){
		return{

		}
	},
	components:{
  	indexTop
  }
}
</script>
<style>
	.index{
		/*padding-top: 45px;*/
		.body{
			
		}

	}
</style>	