<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
body{
    width: 100%;
    height: 100vh;
    background: #f3f3f3;
    #app {
	  width:100%;
	  height: 100%;
    ::-webkit-input-placeholder {
  /* WebKit browsers */
  color: #999;
}

:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: #999;
}

::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: #999;
}

:-ms-input-placeholder {
  /* Internet Explorer 10+ */
  color: #999;
}
	}
}


</style>
