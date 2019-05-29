// 添加合同
require('./PageAddapply.less');
import logic from './PageLogic';
import { Component, LogicRender } from 'refast';  
import {
    Checkbox,
    InputItem,
    TextareaItem,
    DatePicker,
    List 
} from 'antd-mobile';
import { createForm } from 'rc-form';
import { Control } from 'react-keeper';
import mydingready from './../../dings/mydingready';
const { AUTH_URL, IMGCOMMONURI } = require(`config/develop.json`);

class AddcontractForm extends Component {
    constructor(props) { 
        super(props, logic);        
        mydingready.ddReady({pageTitle: '申请'});
        
    }
    /**
    * 发送自定义事件（设置state）
    */
    dispatchFn = (val) => {
        this.dispatch('setStateData',val)
    }
    /**
    * 调用钉钉api
    * 选择联系人、附件等
    * @param addApiState 要执行的api
    *
    */
    toDdJsApi = (ddApiState) => {
        if (ddApiState == 'uploadFile') {
            if (!mydingready.globalData.userId) {
                mydingready.globalData.userId = localStorage.getItem('userId');
            }
            this.getSpaceGrant({
                type: 'add',
                userId: mydingready.globalData.userId,
                ddApiState: ddApiState
            });
            return
        }
        mydingready.ddReady({
            context: this,
            ddApiState: ddApiState,
            setFn: this.dispatchFn
        });
    }
    /*
    * 删除选中的联系人
    * @param [String] manState 要删除的是审批人的还是抄送人
    * @param [String] emplId   用户id（即该员工的工号）
    */
    delContact = (manState,emplId) => {
        let data = {};
            data[manState] = this.state[manState];
        for (let i = 0;i < data[manState].length;i++) {
            if (emplId == data[manState][i].emplId) {
                data[manState].splice(i,1);
                break;
            }
        }   
        this.dispatchFn(data);
    }
    /*
    * 获取存储空间权限（next：企业自定义空间）
    * @param [String] type       文件操作方式（add/download）
    * @param [String] userId     用户id
    * @param [String] ddApiState
    */
    getSpaceGrant = ({type,userId,ddApiState}) => {
        fetch(`${AUTH_URL}ding/grant/role?type=${type}&userId=${userId}`,{
            method: 'POST'
        })
        .then( res => res.json())
        .then(data => {
            if (data.state == 'SUCCESS') {
                fetch(`${AUTH_URL}ding/gain/space`)
                .then( res => res.json())
                .then( result => {
                    if (result.state == 'SUCCESS') {
                        mydingready.ddReady({
                            context: this,
                            ddApiState: ddApiState,
                            setFn: this.dispatchFn,
                            otherData: {spaceId: result.values.spaceId}
                        });
                    }
                })
            }
        })
    }
    /*
    * 删除文件
    * @param [String] fileId 文件Id
    *
    */
    delFile = (e,fileId) => {
        e.stopPropagation();
        let data = {},
            { enclosure } = this.state;
        for (let i = 0;i < enclosure.length;i++) {
            if (fileId == enclosure[i].fileId) {
                enclosure.splice(i,1);
                break;
            }
        }   
        this.dispatchFn(data);
    }
    /**
    * 预览文件
    * @param [String] ddApiState  钉钉状态值
    * @param [Object] fileInfo    要预览文件的信息
    */
    previewFile = (ddApiState,fileInfo) => {
        mydingready.ddReady({
            context: this,
            ddApiState: ddApiState,
            setFn: this.dispatchFn,
            otherData: fileInfo
        });
    }
    submit = () => {
        this.props.form.validateFields((error, value) => {
            console.log('表单值---',value)
            let originatorId = localStorage.getItem('userId'),
                originatorName = localStorage.getItem('userName');
            let { approver , enclosure} = this.state;
            if (!approver.length || !enclosure.length || error) {
                dd.device.notification.alert({
                    message: "您有未填写项！",
                    title: "温馨提示",
                    buttonName: "确定"
                });
                return
            }
            if (!error) {
                // this.checkVal('title',value.title) ?  : '';
                if (!value.applyEvent) {
                    dd.device.notification.toast({
                        icon: 'error',
                        text: `申请事项为必填！`, //提示信息
                        duration: 2, 
                    });
                    return
                }
            
                dd.device.notification.showPreloader({
                    text: "提交中...", //loading显示的字符，空表示不显示文字
                    showIcon: true, //是否显示icon，默认true
                })
                let url = encodeURIComponent(`${AUTH_URL}#/detailapply/`),
                    params = {
	                    applyEvent: value.applyEvent,
	                    enclosure: enclosure,
	                    approver: approver,
	                    originatorId: originatorId,
	                    originatorName: originatorName,
	                    redirectUrl: url
	                };

              /*  dd.device.notification.alert({
                    message: JSON.stringify(params),
                    title: '新增合同参数',
                    buttonName: "确定"
                });*/

                fetch(`${AUTH_URL}wind_control/create`,{
                    method: 'POST',
                    headers: {
                        'Content-Type': "application/json"
                    },
                    body: JSON.stringify(params)
                })
                .then(res => res.json())
                .then(data => {
                    if (data.state == 'SUCCESS') {
                        dd.device.notification.hidePreloader({});
                        dd.device.notification.toast({
                            icon: 'success', //icon样式，有success和error，默认为空
                            text: '添加成功！', //提示信息
                            duration: 3, //显示持续时间，单位秒，默认按系统规范[android只有两种(<=2s >2s)]
                            onSuccess : function(result) {
                                // 回列表展示页
                               	window.location.href = `#/apply`
                            },
                            onFail : function(err) {}
                        });
                        return
                    }
                    dd.device.notification.alert({
                        message: data.values.msg,
                        title: '温馨提示',
                        buttonName: "确定"
                    });
                })
            }
        })
    }
    render() {
        let dept = JSON.parse(localStorage.getItem('dept'));
        const { approver ,enclosure} = this.state;
        const { getFieldProps } = this.props.form;
        let approverCom = approver.map(v=>{
            return <div key={v.emplId} style={{margin: '5px 1.5vw'}}>
                        <div className="box_b manBox">
                            <p className="color_b">{v.name}</p>
                            <img src={`${IMGCOMMONURI}delete.png`} onClick={()=>this.delContact('approver',v.emplId)} />
                        </div>
                    </div>
        });
       /* let a = [
             {
               spaceId: "232323",
               fileId: "DzzzzzzNqZY",
               fileName: "审批流程.docx",
               fileSize: 1024,
               fileType: "docx"
            },
            {
               spaceId: "232323",
               fileId: "DzzzzzzNqZY",
               fileName: "审批流程1.pdf",
               fileSize: 1024,
               fileType: "pdf"
            }];
        let enclosureCom = a.map(v => {*/
        let enclosureCom = enclosure.map(v => {
            let fileTypeImg, 
                fileTypeImgArr = ['ppt.png','ppt.png','excel.png','excel.png','word.png','word.png'];
            let i = ['ppt','pptx','xls','xlsx','doc','docx'].indexOf(v.fileType);
            i != -1 ? fileTypeImg = fileTypeImgArr[i] : fileTypeImg = 'unknown.png';
            return <div className="file" onClick={() => this.previewFile('previewFile',v)}>
                        <img className="fileIcon" src={`${IMGCOMMONURI}${fileTypeImg}`} />
                        <p className="textOverflow_1">{v.fileName}</p>
                        <div className="closeBtn" onClick={(e) => {this.delFile(e,v.fileId)}}>
                            <img src={`${IMGCOMMONURI}delete.png`} />
                        </div>
                    </div>
        })
       
        return (
            <div className="addcontract">
                <p className="title">申请事项(必填)</p>
                <TextareaItem 
                    className="textArea"
                    rows={5}
                    onBlur={(e) => {console.log(e)}}
                    placeholder="请填写申请事项(必填)"
                    {...getFieldProps('applyEvent',{
                        rules:[{required: false,message:'此处输入备注、补充审批等信息！'}]
                    })}
                ></TextareaItem> 
                <div className="line_box"></div>
			 	<p className="title">上传附件</p>
                <div className="fileBox">
                    {enclosureCom}
                    <div className="file" onClick={() => this.toDdJsApi('uploadFile')}>
                        <img className="fileIcon selectedBtn" src={`${IMGCOMMONURI}z z.png`} />
                        <p>上传附件</p>
                    </div>
                </div>
                <div className="selectedMan selectedMan_addCon">
                    <p>审批人</p>
                    <div className="manArr">
                        {approverCom}
            			<div style={{margin: '5px 1.5vw'}}>
	                      	<div className="box_b manBox">
	                            <p className="color_b">黄乐</p>
	                        </div>
                        </div>
                    </div>
                    <img className="fileIcon selectedBtn" src={`${IMGCOMMONURI}add_small.png`} onClick={() => this.toDdJsApi('approver')} />
                </div>
                <button className="btnBlueLong" type="submit" onClick={this.submit}>提交</button>
               
            </div>
        );
    }

}
const Addcontract = createForm()(AddcontractForm);
export default Addcontract ;
