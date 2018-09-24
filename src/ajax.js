import axios from 'axios';
import utils from './utils';

// 设置默认参数
axios.defaults.timeout = 20000;
axios.defaults.method = 'post';
axios.defaults.responseType = 'json';

// 请求拦截
axios.interceptors.request.use(beforeRequest, requestError);
axios.interceptors.response.use(afterResponse, responseError);


/**
 * request 请求之前处理
 */
function beforeRequest(config) {
  if (!config.url) throw new Error('请求缺少 url 参数');

  // 全局 Loading
  // if (config.loading) showLoading(config.loading);

  // 保存请求标识，可使用 Ajax.abort(scope) 取消请求
  if (config.scope) {
      let source = axios.CancelToken.source();
      let arr = config.scope._RequestArray_ || [];

      config.cancelToken = source.token;
      config.scope._RequestArray_ = arr;
      config.scope._RequestArray_.push({
          config: config,
          source: source
      });
  }
  // get请求时，如果传的参数不是params，而是data，做一下转换
  if(config.method.toUpperCase() === 'GET' && !config.params && config.data){
      config.params = config.data;
  }

  return config;
}

/**
* request 请求失败处理
*/
function requestError(error) {
  return Promise.reject(error);
}

/**
* response 响应之后处理
*/
function afterResponse(response) {
  responseHandler(response);

  return response.data;
}

/**
 * 处理响应结果
 */
function responseHandler(response) {
  let { config, data } = response;

  config = Object.assign(
      {
          handlerException: true,
          defaultMsg: '操作失败',
          loading: false
      },
      config
  );

  // 全局 Loading
  // if (config.loading) hideLoading();

  if (data && data.code === -1) {
      let defaultMsg = config.defaultMsg;

      if (typeof defaultMsg === 'function') {
          defaultMsg = defaultMsg(data);
      }

      data.msg = data.msg || data.error || defaultMsg;
      // 业务失败，也reject
      utils.error(data.msg);
    //   return Promise.reject(data.msg);
  }

  response.data = data;
}

/**
* response 响应失败处理
*/
function responseError(error) {
  let { config, response, __CANCEL__ } = error;

  if (__CANCEL__ || !config || !response) return Promise.reject(error);

  // 全局 Loading
  // if (config.loading) hideLoading();

  let msg = '';
  switch (response.status) {
      case 404:
          msg = '请求地址不存在，请重试';
          break;
      case 500:
      case 501:
      case 502:
      case 503:
      case 504:
      case 505:
      case 506:
      case 507:
      case 508:
      case 509:
      case 510:
          msg = '服务器错误，请重试';
          break;
      default:
          msg = '请求错误，请重试';
  }

  utils.error(msg);

  return Promise.reject(error);
}

/**
* 手动取消请求
* @param {Object} scope React组件作用域或者对象
* @param {String} url 请求的URL，没有那就终止所有请求
*/
axios.abort = function(scope, url) {
  if (!scope) return console.warn('Request.abort() 缺少参数');

  (scope._RequestArray_ || []).forEach(item => {
      if (!item || !item.config) return;

      // if (item.config.loading) hideLoading();

      if ((url && item.config.url === url) || !url) {
          try {
              item.source.cancel();
          } catch (e) {}
      }
  });

  if (!url) delete scope._RequestArray_;
};

// 异常处理
// axios.exceptionHandler = exceptionHandler;

// 保留此，异常处理中需要
window.axios = axios;

export default axios;