// const host = 'http://192.168.50.109:82'; // dell
// const host = 'https://www.haipingx.com/&_&/8110';
// const host ='http://122.224.124.250:9006';
//const host ='http://192.168.1.200'
// const host ='https://www.haipingx.com/&_&/8117'
// const host='http://10.5.13.180:8081';
// const host="http://127.0.0.1:9901";//integral
// const host="http://114.215.100.111:9901";//integral稳定版
// const host="https://jf.33.cn:8088";//integral国家电网
const host="http://114.55.101.159:8801"
// const host="http://121.41.33.113:9901";//integral开发版
import axios from 'axios';
var JSONbig = require('json-bigint');
// var JSONstrict = require('json-bigint')({"strict": true});

var querystring = require('querystring');

// export function fetch(url,body) {
//     let data=querystring.stringify(body);
//     return new Promise((resolve, reject) => {
//         axios({
//             method: 'post',
//             url: host,
//             data: data,
//             headers: {
//                'Content-Type': 'application/json;application/x-www-form-urlencoded; charset=UTF-8;'
//             },
//         })
//             .then(response => {
//                 resolve(response.data);
//             });
//     })
// }

export function post(data) {
  data =JSON.stringify(data);
  return new Promise((resolve, reject) => {
    axios({
        url:host,
        method:'post',
        headers: {
          'Content-Type': 'application/json;application/x-www-form-urlencoded; charset=UTF-8;'
        },
        dataType:"text",
        data: data,
        transformResponse:[function (data) {// `transformResponse` 在传递给 then/catch 前，允许修改响应数据
             resolve(JSONbig.parse(data));
         }]
    }).then(response => {
        // let param=param.replace
        resolve(response.data);
    }).catch(function(response){
      console.log('请求失败');
    })
  })
}

export function gethashHeader(body) {
    return post(body);  
}

export function fetchTradeBlock(body) {
    return post(body);
}

export function postblockDetail(body) {//根据区块获取哈希
    return post(body);
}

export function postblockTradeInfo(body) {//根据区块哈希获取交易信息
    return post(body);
}

export function postblockTradeList(body) {//根据哈希数组获取交易列表
    return post(body);
}

export function postTradeHash(body) {//tradeHash,根据交易哈希获取详情
    return post(body);
}

export function postTradeList(body) {//addressDetail,查询地址相关的信息
    return post(body);
}

export function postTradeTable(body) {//addressDetail,查询地址相关的交易
    return post(body);
}

export function postStatePeer(body) {//state,peer
    return post(body);
}

export function postStateLastHeader(body) {//state,GetLastHeader
    return post(body);
}

