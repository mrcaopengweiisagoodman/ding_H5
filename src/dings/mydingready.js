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
     			if (data.state == 'SUCCESS') {
	      			_this.globalData = {
	     				access_token: token,
	     				code: result.code,
	     				userId: data.values.userId
	     			}
	     			localStorage.setItem('userId',data.values.userId);
	     			_this.getUserInfo(data.values.userId);
     			}
     			/*dd.device.notification.alert({
					message: "请求成功！access_token---" + JSON.stringify(data),
					title: "提示信息",
					buttonName: "确定"
				});*/
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
	}
	/*
	* 获取用户名称、部门信息
	* @param userId
	*/
	getUserInfo = (userId) => {
		fetch(`${AUTH_URL}ding/gain/dept/info/${userId}`)
		.then(res => res.json())
		.then(data => {
			if (data.state == 'SUCCESS') {
				/*dd.device.notification.alert({
					message: "用户信息 : " + JSON.stringify(data),
					title: "用户信息",
					buttonName: "OK"
				});*/
     			localStorage.setItem('userName',data.values.name);
     			// 部门信息
     			localStorage.setItem('dept',JSON.stringify(data.values));
			}
		})
	}
	/**
	* 需要鉴权的ddapi
	* @param             context     上下文
	* @param            stateDataStr 需要更改的state的key值
	* @param [String]   ddApiState   需要使用的ddapi
	* @param [String]   pageTitle    当前页面的标题
	* @param [Function] setFn        更改状态的函数
	*                |-For Example
	*        		 |-1、jsx
					 |--- a、发送自定义事件：dispatchFn=(val)=>{this.dispatch('setStateData',{data_lianxiren: val})}
					 |--- b、触发调用钉钉API：setFn = (e) => {mydingready.ddReady({pageTitle: '添加招投标',setFn: this.dispatchFn});
					 |--- c、把触发函数绑定在节点上：<p className="title" style={{height: '100px'}} onClick={this.setFn}>更改状态</p>
	*@param [Object] otherData  其他所需参数(多为调用jsapi时所需参数)
	*/
	ddReady = ({
		context,
		stateDataStr,
		ddApiState,
		pageTitle,
		setFn,
		otherData
	}) => {
		let _this = context,
			stateStr,
			isMultiple = true,
			self = this;
		dd.ready(function() {
			dd.biz.navigation.setTitle({ 
				title: pageTitle ,
				onSuccess: res => {
				},
				onFail: res => {
				}
			});
			if (ddApiState == 'approver' || ddApiState == 'copyPerson' || ddApiState == 'userIds') {
				stateStr = ddApiState;
				ddApiState = 'lianxiren';
			}
			let ddJsApiHandle = {
				getUser: self.getUser,
				// 选择联系人
				lianxiren: () => {
					dd.biz.contact.complexPicker({
						title:"选取联系人或者部门",            //标题
						corpId: CORP_ID,              //企业的corpId
						appId: AGENTID,             //企业的corpId
						multiple: stateDataStr == 'beTransfer' ? false : true,            //是否多选
						limitTips:"超出了",          //超过限定人数返回提示
						maxUsers:1000,            //最大可选人数
						pickedUsers:[],            //已选用户
						// pickedDepartments:[],          //已选部门
						disabledUsers:[],            //不可选用户
						// disabledDepartments:[],        //不可选部门
						requiredUsers:[],            //必选用户（不可取消选中状态）
						// requiredDepartments:[],        //必选部门（不可取消选中状态）
						permissionType:"GLOBAL",          //可添加权限校验，选人权限，目前只有GLOBAL这个参数
						responseUserOnly: true,        //返回人，或者返回人和部门
						startWithDepartmentId:0 ,   //仅支持0和-1
						onSuccess: function(result) {
							let users = JSON.parse(JSON.stringify(result)).users;
							/*dd.device.notification.alert({
								message: "DD 联系人啊成功了 : " + JSON.stringify(result),
								title: "Huooo",
								buttonName: "OK"
							});*/
							if (stateStr == 'approver') {
								setFn({
									approver: users
								})
							} else if (stateStr == 'copyPerson') {
								setFn({
									copyPerson: users
								})
							} else if (stateStr == 'userIds') {
								let { messageBoard , emplIds} = context.state,
									userIds = users,
									now_user_str = '';
								for (let el of userIds) {
									if (messageBoard.indexOf(el.name) != -1) {
							            for (let ele of messageBoard) {
							                if(otherData.writeMsg.indexOf(ele) != -1) {
							                	setFn({writeMsg: otherData.writeMsg.substring(0,otherData.writeMsg.length - 1)});
							                	context.props.form.setFieldsValue({
												    content: otherData.writeMsg.substring(0,otherData.writeMsg.length - 1)
												});
												dd.device.notification.alert({
													message: '该联系人已经选取！'+JSON.stringify(userIds)+ "---" +JSOn.stringify(messageBoard),
													title: "温馨提示",
													buttonName: "确定"
												});
							                	return
							                }
							            }
							        }
					                // 再次选人时
					                if (JSON.stringify(messageBoard).indexOf(el.name) == -1) {
					                	now_user_str += `${el.name}  @`;
					                }
					                messageBoard.push(el.name);
					                emplIds.push(el.emplId);
					            }
			            		now_user_str = now_user_str.substring(0,now_user_str.length-1);
								context.props.form.setFieldsValue({
								    // content: otherData.writeMsg + [...new Set(messageBoard)].join('@') + '  ',
								    content: otherData.writeMsg + now_user_str + '  ',
								});
								setFn({
									userIds: users,
									messageBoard: [...new Set(messageBoard)],
									emplIds: [...new Set(emplIds)],
									isChooseContact: otherData.isChooseContact,
									writeMsg: otherData.writeMsg + [...new Set(messageBoard)].join('@') + '  '
								});
							} else {
								// 转交时联系人为单选
								setFn({
									[stateDataStr]: users
								});
								context.conveyFn2(users[0]);
							}
						},
						onFail : function(err) {
							dd.device.notification.alert({
								message: "选择联系人错误:" + JSON.stringify(err),
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
					    space:{corpId: CORP_ID,spaceId: otherData.spaceId,isCopy: 0, max: 9},
					    file:{spaceId: otherData.spaceId,max:10},
					    types:["file","space"],//PC端支持["photo","file","space"]
					    onSuccess : function(result) {
					    	let enclosure = context.state.enclosure.concat(result.data);
					    	if (result.data.length) {
					    		setFn({enclosure: enclosure});
					    	}
					    },
					   	onFail : function(err) {
					   		dd.device.notification.alert({
								message: "文件选取失败" + JSON.stringify(err),
								title: "选取文件",
								buttonName: "确定"
							});
					   	}
					});
				},
				// 预览钉盘文件
				previewFile: () => {
					dd.biz.cspace.preview({
			            corpId: CORP_ID,
			            spaceId: otherData.spaceId,
			            fileId: otherData.fileId,
			            fileName: otherData.fileName,
			            fileSize: otherData.fileSize,
			            fileType: otherData.fileType,
			            onSuccess: function(res) {
			            },
			            onFail: function(err) {
			            	dd.device.notification.alert({
					            message: "文件预览失败！---" + JSON.stringify(err),
					            title: "温馨提示",
					            buttonName: "确定"
					        });
			                // 无，直接在native页面显示具体的错误
			            }
			        });
				},
				// 选取部门
				departments: () => {
					dd.biz.contact.departmentsPicker({
					    title:"选取部门",            //标题
					    corpId: CORP_ID,              //企业的corpId
					    appId: AGENTID,              //微应用的Id
					    multiple: true,            //是否多选
					    limitTips: "超出了",          //超过限定人数返回提示
					    maxDepartments: 1,            //最大选择部门数量
					    pickedDepartments:[],          //已选部门
					    disabledDepartments:[],        //不可选部门
					    requiredDepartments:[],        //必选部门（不可取消选中状态）
					    permissionType: "GLOBAL",          //选人权限，目前只有GLOBAL这个参数
					    onSuccess: function(result) {
		                	setFn({departments: result.departments});
					    },
					   	onFail : function(err) {
					   		dd.device.notification.alert({
								message: "选择部门出错:" + JSON.stringify(err),
								title: "警告",
								buttonName: "确定"
							});
					   	}
					});
				}
			}
			ddJsApiHandle[ddApiState]();
		})
		
	}
}

export default new DingReadyMine();
