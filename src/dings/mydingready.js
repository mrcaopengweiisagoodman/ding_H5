import jsapi from './jsapi.json';
import $ from "jquery";


const { CORP_ID, AUTH_URL, APP_URL , AGENTID} = require(`config/develop.json`);


class DingReadyMine {
	/**
	* 需要鉴权的ddapi
	* @param context    上下文
	* @param ddApiState 需要使用的ddapi
	* @param appInfo    企业和微应用信息
	* @param pageTitle  当前页面的标题
	*/
	ddReady = ({context,ddApiState,pageTitle}) => {
		let _this = context;
		dd.ready(function() {
			dd.biz.navigation.setTitle({ 
				title: pageTitle ,
				onSuccess: res => {
				},
				onFail: res => {
				}
			});
			
			if (ddApiState == 'lianxiren') {
				dd.biz.contact.complexPicker({
					title:"测试标题",            //标题
					corpId: CORP_ID,              //企业的corpId
					appId: AGENTID,             //企业的corpId
					multiple:true,            //是否多选
					limitTips:"超出了",          //超过限定人数返回提示
					maxUsers:1000,            //最大可选人数
					pickedUsers:[],            //已选用户
					pickedDepartments:[],          //已选部门
					disabledUsers:[],            //不可选用户
					disabledDepartments:[],        //不可选部门
					requiredUsers:[],            //必选用户（不可取消选中状态）
					requiredDepartments:[],        //必选部门（不可取消选中状态）
					permissionType:"xxx",          //可添加权限校验，选人权限，目前只有GLOBAL这个参数
					responseUserOnly:false,        //返回人，或者返回人和部门
					startWithDepartmentId:0 ,   //仅支持0和-1
					onSuccess: function(result) {
						dd.device.notification.alert({
							message: "DD 联系人啊成功了 : " + JSON.stringify(result),
							title: "Huooo",
							buttonName: "OK"
						});
						// 把获取到的数据返回
						//
						//{
						//    selectedCount:1,                              //选择人数
					   //     users:[{"name":"","avatar":"","emplId":""}]，//返回选人的列表，列表中的对象包含name（用户名），avatar（用户头像），emplId（用户工号）三个字段
						//    departments:[{"id":,"name":"","number":}]//返回已选部门列表，列表中每个对象包含id（部门id）、name（部门名称）、number（部门人数）
						// }
						//
					},
					onFail : function(err) {
						dd.device.notification.alert({
							message: "联系人错误: " + JSON.stringify(result),
							title: "Huooo",
							buttonName: "OK"
						});
					}
				});
			} else if (ddApiState == 'weizhi') {
				dd.device.notification.alert({
					message: "dd状态---: " + ddApiState,
					title: "状态api",
					buttonName: "OK"
				});
				dd.device.geolocation.get({
					targetAccuracy : 200,
					coordinate : 1,
					withReGeocode : false,
					useCache:true, //默认是true，如果需要频繁获取地理位置，请设置false
					onSuccess : function(result) {
						alert('位置成功啦啦啦啦啦啦啦啦');
					},
					onFail : function (err) {
						// body...
						dd.device.notification.alert({
							message: "DD 位置失败 : " + JSON.stringify(err),
							title: "位置失败",
							buttonName: "OK"
						});
					},
				})
			}
			// _this.dispatch('setDdApiState','');

		})
		
	}
}

export default new DingReadyMine();
