// 添加招标
require('./PageAddtendering.less');
import logic from './PageLogic';
import { Component, LogicRender } from 'refast';  
import {
	InputItem,
	TextareaItem,
	Toast
} from 'antd-mobile';
import { createForm } from 'rc-form';
import mydingready from './../../dings/mydingready';
const { AUTH_URL, IMGCOMMONURI } = require(`config/develop.json`);


class AddtenderingForm extends Component {
    constructor(props) { 
        super(props, logic);     
		mydingready.ddReady({pageTitle: '添加招投标'});

    }
	submit = () => {
		this.props.form.validateFields((error, value) => {
			console.log(error, value);
			if (!error) {
				let { approver } = this.state;

			}
		});
	}
	/**
	* 调用钉钉api（设置state）
	*/
	setFn = (e) => {
		mydingready.ddReady({setFn: this.dispatchFn});
	}
	/**
	* 发送自定义事件（设置state）
	*/
	dispatchFn = (val) => {
		dd.device.notification.alert({
			message: "dispatchFn---" + JSON.stringify(val),
			title: "Huooo",
			buttonName: "OK"
		});

		this.dispatch('setStateData',val)
	}
	/**
	* 调用钉钉api
	* 选择联系人、附件等
	* @param addApiState 要执行的api
	*
	*/
	toDdJsApi = (ddApiState) => {
	/*	mydingready.ddReady({
			context: this,
			ddApiState: 'lianxiren',
			setFn: this.dispatchFn
		});*/
		if (ddApiState == 'uploadFile') {
			// 获取企业自定义空间

		}
		mydingready.ddReady({
			context: this,
			ddApiState: ddApiState,
			setFn: this.dispatchFn
		});
		dd.device.notification.alert({
			message: "选取联系人返回的信息:--- " + JSON.stringify(ddApiState),
			title: "联系人返回信息",
			buttonName: "确定"
		});
	}

	/*
	* 删除选中的联系人
	*/
	delContact = (emplId) => {

	}
    render() {
		const { getFieldProps } = this.props.form;
		const { approver , copyPerson} = this.state; 
		/*let data = {"users":[{"name":"田帅","avatar":"","emplId":"0125056400954069"},{"name":"曹鹏伟","avatar":"","emplId":"042827545726609513"}],"departments":[{"id":111712572,"name":"部门1","number":1},{"id":111012582,"name":"＆","number":1}],"selectedCount":4};
		this.addContact(data);*/

		dd.device.notification.alert({
			message: "选取联系人返回的信息:--- " + JSON.stringify(approver),
			title: "联系人返回信息",
			buttonName: "确定"
		});
		let data1 = [{"name":"田帅","avatar":"","emplId":"0125056400954069"}];
		let approverCom = approver.map(v=>{
		    return <div key={v.emplId}>
						<div className="manArr">
							<div className="box_b">
								<p className="color_b">{v.name}</p>
								<img src={`${IMGCOMMONURI}delete.png`} onClick={()=>this.delContact(v.emplId)} />
							</div>
						</div>
			        </div>

		});
		let copyPersonCom = data1.map(v=>{
		    return <div key={v.emplId}>
						<div className="manArr">
							<div className="box_b">
								<p className="color_b">{v.name}</p>
								<img src={`${IMGCOMMONURI}delete.png`} onClick={()=>this.delContact(v.emplId)} />
							</div>
						</div>
			        </div>

		})
	
        return (
            <div className="addTendering">
				{/* <form onSubmit={this.submit}> */}
					
					

					<div>uidufudof---{JSON.stringify(approver)}</div>



					<p className="title">基本信息</p>
					<div className="name">
						<InputItem
							{...getFieldProps('name',{
								rules:[{required: true,message:'请输入招投标名称！'}]
							})}
							placeholder="请输入招投标名称"
						></InputItem>
					</div>
					<div className="line_gray"></div>
					<div className="biddingName">
						<TextareaItem 
							className="textArea"
							rows={5}
							placeholder="请输入招投标内容"
							{...getFieldProps('content',{
								rules:[{required: true,message:'请输入招投标内容！'}]
							})}
						></TextareaItem> 
					</div>
					<p className="title">上传附件</p>
					<div className="fileBox">
						<div className="file">
							{/* 正式环境图片的路径 */}
							<img className="fileIcon" src={`${IMGCOMMONURI}unknown.png`} />
							<p className="textOverflow_1">文件名称文件名称文件名称</p>
							<div className="closeBtn">
								<img src={`${IMGCOMMONURI}delete.png`} />
							</div>
						</div>
						<div className="file" onClick={() => this.toDdJsApi('uploadFile')}>
							<img className="fileIcon selectedBtn" src={`${IMGCOMMONURI}z z.png`} />
							<p>上传附件</p>
						</div>
					</div>
					<div className="selectedMan">
						<p>审批人</p>
						{approverCom}
						{/*<div className="manArr">
													<div className="box_b">
														<p className="color_b">人名一</p>
														<img src={`${IMGCOMMONURI}delete.png`} />
													</div>
												</div>*/}
						<img className="fileIcon selectedBtn" src={`${IMGCOMMONURI}add_small.png`} onClick={() => this.toDdJsApi('approver')} />
					</div>
					<div className="line_gray"></div>
					<div className="selectedMan">
						<p>抄送人</p>
						{copyPersonCom}
						<img className="fileIcon selectedBtn" src={`${IMGCOMMONURI}add_small.png`} onClick={() => this.toDdJsApi('copyPerson')} />
					</div>
					<div className="line_gray"></div>
					<button className="btnBlueLong" type="submit" onClick={this.submit}>提交</button>
				{/* </form> */}
            </div>
        );
    }

}
const Addtendering = createForm()(AddtenderingForm);
export default Addtendering ;
