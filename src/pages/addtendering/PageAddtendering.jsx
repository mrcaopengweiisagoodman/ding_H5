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

class AddtenderingForm extends Component {
    constructor(props) { 
        super(props, logic);     
		mydingready.ddReady({pageTitle: '添加招投标'});

    }
	submit = () => {
		this.props.form.validateFields((error, value) => {
			console.log(error, value);
		});
	}
	stateContact = () => {
		let res = mydingready.ddReady({
			context: this,
			ddApiState: 'lianxiren'
		});
		dd.device.notification.alert({
			message: "点击选取联系人: " + JSON.stringify(res),
			title: "点击选取联系人Huooo",
			buttonName: "OK"
		});
	}
    render() {
		const { getFieldProps } = this.props.form;
        return (
            <div className="addTendering">
				{/* <form onSubmit={this.submit}> */}
					<p className="title">基本信息</p>
					<div className="name">
						<p className="nameTitle">招投标名称</p>
						<InputItem
							{...getFieldProps('name',{
								rules:[{required: true,message:'请输入招投标名称！'}]
							})}
							placeholder="请输入招投标名称"
						></InputItem>
					</div>
					<div className="name">
						<p className="nameTitle">招投标内容</p>
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
					<div className="goContacts" onClick={this.stateContact}>
						去选择联系人
					</div>
					{/* <div className="fileBox">
						<input {...getFieldProps('fileName',{
							rules:[{required: true,message:'文件内容'}]
						})} type="file" name="pic" id="pic" accept="image/gif, image/jpeg" />
					</div> */}
					<button type="submit" onClick={this.submit}>提交</button>
				{/* </form> */}
            </div>
        );
    }

}
const Addtendering = createForm()(AddtenderingForm);
export default Addtendering ;
