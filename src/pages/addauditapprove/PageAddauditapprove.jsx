// 添加招标
require('./PageAddauditapprove.less');
import logic from './PageLogic';
import { Component, LogicRender } from 'refast';  
import {
    InputItem,
    TextareaItem,
    Toast
} from 'antd-mobile';
import { createForm } from 'rc-form';
import mydingready from './../../dings/mydingready';
const { AUTH_URL, IMGCOMMONURI,CONFIG_APP_URL } = require(`config/develop.json`);


class AddauditapproveForm extends Component {
    constructor(props) { 
        super(props, logic);     
        mydingready.ddReady({pageTitle: '内审新增'});
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
        console.log(e,fileId);
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
            let { approver ,copyPerson , enclosure} = this.state;
            if (!approver.length || !enclosure.length || error) {
                dd.device.notification.alert({
                    message: "您有未填写项！",
                    title: "温馨提示",
                    buttonName: "确定"
                });
                return
            }
            if (!error) {
                if (!value.title) {
                    dd.device.notification.alert({
                        message: "标题为必填项！",
                        title: "警告",
                        buttonName: "确定"
                    });
                    return
                }
              /*  dd.device.notification.showPreloader({
                    text: "提交中...", //loading显示的字符，空表示不显示文字
                    showIcon: true, //是否显示icon，默认true
                })*/
                let originatorName = localStorage.getItem('userName'),
                    originatorId = localStorage.getItem('userId'),
                    url = encodeURIComponent(`${CONFIG_APP_URL}#/detailauditapprove/`);
                fetch(`${AUTH_URL}internal/audit/approval/create`,{
                    method: 'POST',
                    headers: {
                        'Content-Type': "application/json"
                    },
                    body: JSON.stringify({
                        title: value.title,
                        content: value.content,
                        approver: approver,
                        copyPerson: copyPerson,
                        enclosure: enclosure,
                        creatorId: originatorId,
                        creatorName: originatorName,
                        redirectUrl: url
                    })
                })
                .then(res => res.json())
                .then(data => {
                    if (data.state == 'SUCCESS') {
                        dd.device.notification.toast({
                            icon: 'success', //icon样式，有success和error，默认为空
                            text: '添加成功！', //提示信息
                            duration: 3, //显示持续时间，单位秒，默认按系统规范[android只有两种(<=2s >2s)]
                            onSuccess : function(result) {
                                // 回列表展示页
                                window.location.href = '#/auditapprove';
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
        });
    }
    render() {
        const { getFieldProps } = this.props.form;
        const { approver , copyPerson , enclosure ,testStr} = this.state; 
        
        /*let data1 = [{"name":"田ert帅","avatar":"","emplId":"0125056400964069"},{"name":"田帅2","avatar":"","emplId":"0121156400954069"}];
        let approverCom = data1.map(v=>{*/
        let approverCom = approver.map(v=>{
            return <div key={v.emplId} style={{margin: '5px 1.5vw'}}>
                        <div className="box_b manBox">
                            <p className="color_b">{v.name}</p>
                            <img src={`${IMGCOMMONURI}delete.png`} onClick={()=>this.delContact('approver',v.emplId)} />
                        </div>
                    </div>
        });
        let copyPersonCom = copyPerson.map(v=>{
            return  <div key={v.emplId} style={{margin: '5px 1.5vw'}}>
                        <div className="box_b manBox">
                            <p className="color_b">{v.name}</p>
                            <img src={`${IMGCOMMONURI}delete.png`} onClick={()=>this.delContact('copyPerson',v.emplId)} />
                        </div>
                    </div>
        });
        /*let a = [
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
            <div className="addauditapprove">
                {/* <form onSubmit={this.submit}> */}
                    <p className="title">基本信息</p>
                    <div className="name">
                        <InputItem
                            {...getFieldProps('title',{
                                rules:[{required: false,message:'请输入标题！'}]
                            })}
                            placeholder="请输入内审标题"
                        ></InputItem>
                    </div>
                    <div className="line_gray"></div>
                    <p className="title">内审主要内容或说明(选填)</p>
                    <div className="biddingName" style={{padding: '0 3vw'}}>
                        <TextareaItem 
                            className="textArea"
                            rows={5}
                            placeholder="请填写合同主要内容"
                            {...getFieldProps('content',{
                                rules:[{required: false,message:'请填写合同主要内容'}]
                            })}
                        ></TextareaItem> 
                    </div>
                    <p className="title">上传附件</p>
                    <div className="fileBox">
                        {enclosureCom}
                        <div className="file" onClick={() => this.toDdJsApi('uploadFile')}>
                            <img className="fileIcon selectedBtn" src={`${IMGCOMMONURI}z z.png`} />
                            <p>上传附件</p>
                        </div>
                    </div>
                    <div className="selectedMan">
                        <p>审批人</p>
                        <div className="manArr">
                            {approverCom}
                        </div>
                        <img className="fileIcon selectedBtn" src={`${IMGCOMMONURI}add_small.png`} onClick={() => this.toDdJsApi('approver')} />
                    </div>
                    <div className="line_gray"></div>
                    <div className="selectedMan">
                        <p>抄送人</p>
                        <div className="manArr">
                            {copyPersonCom}
                        </div>
                        <img className="fileIcon selectedBtn" src={`${IMGCOMMONURI}add_small.png`} onClick={() => this.toDdJsApi('copyPerson')} />
                    </div>
                    <div className="line_gray"></div>
                    <button className="btnBlueLong" type="submit" onClick={this.submit}>提交</button>
                {/* </form> */}
            </div>
        );
    }

}
const Addauditapprove = createForm()(AddauditapproveForm);
export default Addauditapprove ;
