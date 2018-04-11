import Vue from 'vue'
import Router from 'vue-router'
import index from '../views/app.vue'

Vue.use(Router)

export default new Router({
  mode:'history',
  base:"/webapp",
  routes: [
    {
      path: '/',
      component: index,
      children:
      [
      	{
          path:"/",
          component: function(resolve){
            require(['../views/main.vue'],resolve);
          }
        },
        {
          path:"status",
          component: function(resolve){
            require(['../views/status.vue'],resolve);
          }
        },
        {
          path:"contant",
          component: function(resolve){
            require(['../views/contant.vue'],resolve);
          }
        },
        {
          path:"qukuai",
          component: function(resolve){
            require(['../views/qukuai.vue'],resolve);
          }
        },
        {
          path:"address",
          component: function(resolve){
            require(['../views/address.vue'],resolve);
          }
        },
        {
          path:"trade",
          component: function(resolve){
            require(['../views/trade.vue'],resolve);
          }
        },
        ]
    }
  ]
})
