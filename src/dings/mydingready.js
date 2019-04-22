import jsapi from './jsapi.json';
import $ from "jquery";
const { CORP_ID, AUTH_URL, APP_URL , AGENTID} = require(`config/develop.json`);


class DingReadyMine {
	// 存储access_token、免登码、用户userid
	globalData = () => {
		return{
			access_token: null,
			code: null,
			userId: null
		}
	}
	/**
	* 获取access_token，进行免登、获取用户临时id
	* code有效时间为：5min
	*/
	getUser = () => {
		let _this = this;
		dd.runtime.permission.requestAuthCode({
		    corpId: CORP_ID,
		    onSuccess: function(result) {
		    /*{
		        code: 'hYLK98jkf0m' //string authCode
		    }*/
		    localStorage.setItem('codeCreateTime',new Date());
		    let token = localStorage.getItem('access_token');
		    fetch(`${AUTH_URL}ding/gain/userId?accessToken=${token}&code=${result.code}`)
     		.then( res => res.json())
     		.then( data => {
     			// localStorage.setItem('userId',);
     			if (data.state == 'SUCCESS') {
	      			_this.globalData = {
	     				access_token: token,
	     				code: result.code,
	     				userId: data.values.userId
	     			}
     			}
     			dd.device.notification.alert({
					message: "请求成功！" + JSON.stringify(data),
					title: "提示信息",
					buttonName: "确定"
				});
     		})
		    },
		    onFail : function(err) {
		    	dd.device.notification.alert({
					message: "登录失败，请重新进入！",
					title: "提示信息",
					buttonName: "确定"
				});
		    }
		})
	};
	/**
	* 需要鉴权的ddapi
	* @param  context    上下文
	* @param [String]   ddApiState 需要使用的ddapi
	* @param [String]   pageTitle  当前页面的标题
	* @param [Function] setFn      更改状态的函数
	*                |-For Example
	*        		 |-1、jsx
					 |--- a、发送自定义事件：dispatchFn=(val)=>{this.dispatch('setStateData',{data_lianxiren: val})}
					 |--- b、触发调用钉钉API：setFn = (e) => {mydingready.ddReady({pageTitle: '添加招投标',setFn: this.dispatchFn});
					 |--- c、把触发函数绑定在节点上：<p className="title" style={{height: '100px'}} onClick={this.setFn}>更改状态</p>
	*@param [Object] otherData  其他所需参数(多为调用jsapi时所需参数)
	*/
	ddReady = ({
		context,
		ddApiState,
		pageTitle,
		setFn,
		otherData
	}) => {
		/*if (setFn) {
			console.log(setFn)
			setFn({
				data_lianxiren: '测试值'
			});
		}*/
		let _this = context,
			stateStr,
			self = this;
		dd.ready(function() {
			dd.biz.navigation.setTitle({ 
				title: pageTitle ,
				onSuccess: res => {
				},
				onFail: res => {
				}
			});
			if (ddApiState == 'approver' || ddApiState == 'copyPerson') {
				stateStr = ddApiState;
				ddApiState = 'lianxiren';
			}
			let ddJsApiHandle = {
				getUser: self.getUser,
				// 选择联系人
				lianxiren: () => {
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
						permissionType:"GLOBAL",          //可添加权限校验，选人权限，目前只有GLOBAL这个参数
						responseUserOnly:false,        //返回人，或者返回人和部门
						startWithDepartmentId:0 ,   //仅支持0和-1
						onSuccess: function(result) {
							dd.device.notification.alert({
								message: "DD 联系人啊成功了 : " + JSON.stringify(result),
								title: "Huooo",
								buttonName: "OK"
							});
							/*setFn({
								data_lianxiren: JSON.stringify(result)
							});*/
							setFn({
								approver: JSON.parse(JSON.stringify(result)).users
							})
							// 把获取到的数据返回
							// {"users":[{"name":"田帅","avatar":"","emplId":"0125056400954069"},{"name":"曹鹏伟","avatar":"","emplId":"042827545726609513"}],"departments":[{"id":111712572,"name":"部门1","number":1},{"id":111012582,"name":"＆","number":1}],"selectedCount":4}
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
								message: "选择联系人错误:" + JSON.stringify(result),
								title: "警告",
								buttonName: "确定"
							});
						}
					});
				},
				// 获取位置
				weizhi: () => {
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
				},
				// 钉盘上传文件
				uploadFile: () => {
					dd.biz.util.uploadAttachment({
					    image:{multiple:true,compress:false,max:9,spaceId: "12345"},
					    space:{corpId:"xxx3020",spaceId:"12345",isCopy:1 , max:9},
					    file:{spaceId:"12345",max:1},
					    types:["photo","camera","file","space"],//PC端支持["photo","file","space"]
					    onSuccess : function(result) {
					    	dd.device.notification.alert({
								message: "选取的文件---: " + JSON.stringify(result),
								title: "选取文件",
								buttonName: "确定"
							});
					    },
					   	onFail : function(err) {

					   	}
					});
				}
			}
			ddJsApiHandle[ddApiState]();
			/*if (ddApiState == 'lianxiren') {
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
					permissionType:"GLOBAL",          //可添加权限校验，选人权限，目前只有GLOBAL这个参数
					responseUserOnly:false,        //返回人，或者返回人和部门
					startWithDepartmentId:0 ,   //仅支持0和-1
					onSuccess: function(result) {
						dd.device.notification.alert({
							message: "DD 联系人啊成功了 : " + JSON.stringify(result),
							title: "Huooo",
							buttonName: "OK"
						});
						setFn({
							data_lianxiren: JSON.stringify(result)
						});
						// 把获取到的数据返回
						// {"users":[{"name":"田帅","avatar":"","emplId":"0125056400954069"},{"name":"曹鹏伟","avatar":"","emplId":"042827545726609513"}],"departments":[{"id":111712572,"name":"部门1","number":1},{"id":111012582,"name":"＆","number":1}],"selectedCount":4}
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
							message: "选择联系人错误:" + JSON.stringify(result),
							title: "警告",
							buttonName: "确定"
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
			}*/

		})
		
	}
}

export default new DingReadyMine();
