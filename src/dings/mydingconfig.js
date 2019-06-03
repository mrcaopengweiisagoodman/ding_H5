import jsapi from './jsapi.json';
import $ from "jquery";
import mydingready from './mydingready';
const { CORP_ID, AUTH_URL, APP_URL,CONFIG_APP_URL } = require(`config/develop.json`);


class DingConfigMine {
	getFn = () => {
		let url;
		if (window.location.href.indexOf('ismessage=true') != -1) {
			url = `${AUTH_URL}ding/sign?url=${window.location.href}?dd_nav_bgcolor=FF2D87F7`;
		} else {
			url = `${AUTH_URL}ding/sign?url=${CONFIG_APP_URL}?dd_nav_bgcolor=FF2D87F7`;
		}
		$.ajax({
			url: url,
			// url: `http://192.168.3.219:8888/ding/sign?url=http://192.168.3.219:8888/index.html?dd_nav_bgcolor=FF2D87F7`,
			type:"GET",
			dataType:'json',
			success: function (data, status, xhr) {
				if (data.state == 'SUCCESS') {
					let data_config = JSON.parse(data.values.config);
					let jsapiArr= [];
		            for (var i in jsapi ) { 
		            	jsapi[i]
		                ? jsapiArr.push(i)  
		                : ""  
		            };     
					//文档见http://open.dingtalk.com/doc/#权限验证配置-beta
					dd.config({
						agentId: data_config.agentId, // 必填，微应用ID
						corpId: data_config.corpId,//必填，企业ID
						timeStamp: data_config.timeStamp,// 必填，生成签名的时间戳
						nonceStr: data_config.nonceStr, // 必填，生成签名的随机串
						signature: data_config.signature, // 必填，签名
						jsApiList: jsapiArr
						/*jsApiList: [
							'device.geolocation.get',
							'biz.contact.complexPicker',
							'biz.user.get',
							'biz.contact.complexChoose',
							'biz.customContact.choose',
							'biz.contact.departmentsPicker',
							'biz.contact.externalComplexPicker',
							'biz.contact.choose'
						] // 必填，需要使用的jsapi列表*/
					});
					dd.error(function(err) {
						dd.device.notification.alert({
							message: "鉴权失败" + JSON.stringify(err),
							title: "警告",
							buttonName: "确定"
						});
					});
				}
			},
			error: function () {

			}
		});
	}
	ddConfig = (() => {
		fetch(`${AUTH_URL}ding/gain/token`)
		.then( res => res.json())
		.then( r => {
			if (r.state == 'SUCCESS') {
				let token = r.values.token;
				console.log(token)
				// 把token存储到本地，用来获取临时用户id
				localStorage.setItem('access_token',token)
				
				$.ajax({
					url: `${AUTH_URL}ding/gain/ticket`,
					type: 'GET',
					success: res => {
						// alert('get_jsapi_ticket正确',JSON.stringify(res))
						this.getFn();
					},
					error: err => {
						alert('get_jsapi_ticket')
					}
				})
			}
		})
	})();
}

export default new DingConfigMine();
