// 驳回原因
require('./PageRebutinfo.less');
import logic from './PageLogic';
import { Component, LogicRender } from 'refast';  
import {
    Checkbox,
    InputItem,
    TextareaItem,
    SearchBar
} from 'antd-mobile';
import { createForm } from 'rc-form';
import mydingready from './../../dings/mydingready';
import moment from 'moment';
import {
    Control,
    Link
} from 'react-keeper';
import contractJson from './../../test_json/contract';

const { AUTH_URL, IMGCOMMONURI } = require(`config/develop.json`);


class RebutInfoCom extends Component {
    constructor(props) { 
        super(props, logic);        
        mydingready.ddReady({pageTitle: '驳回'});
    }
     /**
    * 发送自定义事件（设置state）
    */
    dispatchFn = (val) => {
        this.dispatch('setStateData',val);
    }
    /**
     * 搜索
     */
    goSearch = (val) => {
        console.log('文本框内容',val,this.state.searchVal)
        this.getSearchResult({
            searchWord: val
        })
    }
    /*
    * 离焦
     */
    searchBlur = (e) => {
        this.dispatch('setStateData',{searchVal: ''});
    }
    /**
     * 文本输入变化
     */
    searchChange = (e) => {
        this.dispatch('setStateData',{searchVal: e});
    }
   	submit = () => {
        this.props.form.validateFields((error, value) => {
            if (!error) {
            	console.log(value)
                if (!value.reason) {
                    dd.device.notification.alert({
                        message: "请填写驳回原因！",
                        title: "警告",
                        buttonName: "确定"
                    });
                    return
                }
                function checking_type () {
                    let type = localStorage.getItem('checking_type');
                    if (type == '招投标') { return 1; }
                    if (type == '合同') { return 2; }
                    if (type == '内审审批') { return 3; }
                }
             	let url = encodeURIComponent(`${AUTH_URL}#/detailcontract/${this.props.params.id}`),
			            type = checking_type(),// 1是招投标 2是合同，3是内审
			            userId = localStorage.getItem('userId'),
			            state = 'REBUT',
			            reason = value.reason,
			            params = `redirectUrl=${url}&stateEnum=${state}&type=${type}&userId=${userId}&reason=${reason}`;
			        fetch(`${AUTH_URL}bidding/approval/pass/${this.props.params.id}?${params}`,{
			            method: 'POST'
			        })
			        .then(res => res.json())
			        .then(data => {
			            /*dd.device.notification.alert({
			                message: "合同详情数据" + JSON.stringify(data),
			                title: "提示",
		                buttonName: "确定"
		            })*/
		            if (data.state == 'SUCCESS') {
		                dd.device.notification.alert({
		                    message: "操作成功！",
		                    title: "提示",
		                    buttonName: "确定",
		                    onSuccess: () => {
		                        Control.go(-2);
                                localStorage.removeItem('checking_type');
		                    }
		                })
                        return
		            }
                    dd.device.notification.alert({
                        message: data.info,
                        title: "温馨提示",
                        buttonName: "确定"
                    });
                    Control.go(-1);
        		})
            }
        });
    }
    render() {
        const { getFieldProps } = this.props.form;
        let { searchVal } = this.state;
       
       
        return (
            <div className="contractSearch">
                <p className="title">驳回原因或说明(必填)</p>
            	<TextareaItem 
                    className="textArea"
                    rows={7}
                    placeholder="请填写驳回原因"
                    {...getFieldProps('reason',{
                        rules:[{required: false,message:'请填写驳回原因'}]
                    })}
                ></TextareaItem> 
               	<div className="btnRedLong" onClick={this.submit}>确定驳回</div>
            </div>
        );
    }

}
const RebutInfo = createForm()(RebutInfoCom);
export default RebutInfo ;
