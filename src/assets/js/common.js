import axios from 'axios'

var ajax = function(that, url, params, success, method) {
  // var token = sessionStorage.getItem('token');
  // var openId = sessionStorage.getItem('openId');
  // var params = params || { open_id: openId };
  if (method == 'GET') {
    that.axios({
      method: 'get',
      url: url,
      headers: {
        Authorization: '',
        'Content-Type': 'application/x-www-form-urlencoded;',
      },
      params: params,
    }).then((response) => {
      // console.log(response);
      success(response.data);
    }).catch(function(response) {
      console.log(response);
    })
  } else {
    var params = that.querystring.stringify(params);
    that.axios({
      method: "POST",
      url: url,
      headers: {
        Authorization: '',
        'Content-Type': 'application/x-www-form-urlencoded;',
      },
      data: params,
    }).then((response) => {
      // console.log(response);
      success(response.data);
    }).catch(function(response) {
      console.log(response);
    })
  }
}

export {
  ajax,
}
