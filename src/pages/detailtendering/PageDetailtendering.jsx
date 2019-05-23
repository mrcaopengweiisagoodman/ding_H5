require('./PageDetailtendering.less');
import logic from './PageLogic';
import { Component, LogicRender } from 'refast';  
import moment from 'moment';
import { TextareaItem } from 'antd-mobile';
import { createForm } from 'rc-form';
import mydingready from './../../dings/mydingready';
import {
    Control,
    Link
} from 'react-keeper';

const { AUTH_URL,IMGCOMMONURI } = require(`config/develop.json`);



class DetailtenderingForm extends Component {
    constructor(props) { 
        super(props, logic);        
        mydingready.ddReady({pageTitle: '招投标详情'});
    }
    componentDidMount () {
        this.getDetail(this.props.params.id);
    }
    /**
    * 发送自定义事件（设置state）
    */
    dispatchFn = (val) => {
        this.dispatch('setStateData',val)
    }
    /**
    * 获取详情
    */
    getDetail = (id) => {
        fetch(`${AUTH_URL}bidding/info/${id}`)
        .then(res => res.json())
        .then(data => {
            if (data.state == 'SUCCESS') {
                let {messageBoardMsgs , isLimitMsg} = this.state;
                let messageBoardArr, messageBoardObj;
                let inx_a = data.values.info.approver.indexOf(localStorage.getItem('userId'));
                let inx_c = data.values.info.copyPerson.indexOf(localStorage.getItem('userId'));
                if (inx_a > -1 || inx_c > -1) isLimitMsg = true;
                if (data.values.info.messageBoard) {
                    messageBoardArr = data.values.info.messageBoard.split(',');
                    messageBoardArr.pop();

                    for (let ele of messageBoardArr) {
                        ele = ele.split('-');
                        messageBoardObj = {
                            userName: ele[0],
                            content: ele[1],
                            createTime: ele[2]
                        };
                        messageBoardMsgs.push(messageBoardObj);
                    }
                }
                this.dispatchFn({
                    id: id,
                    detailData: data.values.info,
                    messageBoardMsgs: messageBoardMsgs,
                    isLimitMsg: isLimitMsg
                })
            }
        })
    }
    /**
    * 预览文件 (钉钉api)
    */
    previewFile = (fileInfo) => {
        console.log(fileInfo)
        mydingready.ddReady({
            context: this,
            ddApiState: 'previewFile',
            otherData: fileInfo
        })
    }
    /**
    * 获取被@的联系人
    */
    getRemindContacts = (e) => {
        let inx = e.indexOf('@');
        if (inx != -1 && !this.state.isChooseContact) {
            mydingready.ddReady({
                context: this,
                ddApiState: 'userIds',
                setFn: this.dispatchFn,
                otherData: {
                    isChooseContact: true
                }
            });
        }
        if (!e) {
            this.dispatchFn({
                messageBoard: [],
                emplIds: [],
                isChooseContact: false
            })
        }
    }
    /**
    * 提交留言
    */
    submit = () => {
        let { id,emplIds ,userIds,checking_type} = this.state;

        dd.device.notification.alert({
            message: "userIds的值为---" + JSON.stringify(userIds),
            title: "温馨提示",
            buttonName: "确定"
        });

        this.props.form.validateFields((error,value) => {
            console.log(value);
            if (!error) {
                if (!value.content) {
                    dd.device.notification.alert({
                        message: "请填写内容！",
                        title: "温馨提示",
                        buttonName: "确定"
                    });
                    return
                }

                dd.device.notification.showPreloader({
                    text: "提交中...", //loading显示的字符，空表示不显示文字
                    showIcon: true, //是否显示icon，默认true
                })
                var params , 
                    url = encodeURIComponent(`${AUTH_URL}#/detailtendering/${id}`);
                    userIds ? userIds.join(',') : '';
                emplIds && emplIds.length ? params = {
                                    id: id,
                                    content: value.content,
                                    redirectUrl: url,
                                    type: 1,
                                    notified: emplIds.join(','),
                                    userId: localStorage.getItem('userId'),
                                    userName: localStorage.getItem('userName')
                               }: params = {
                                    id: id,
                                    content: value.content,
                                    redirectUrl: url,
                                    type: 1,
                                    userId: localStorage.getItem('userId'),
                                    userName: localStorage.getItem('userName')
                               };

                fetch(`${AUTH_URL}bidding/leave/message`,{
                    method: 'POST',
                    headers: {
                        'Content-Type': "application/json",
                        // 'Access-Control-Allow-Origin':'*'
                    },
                    body: JSON.stringify(params)
                })
                .then(res => res.json())
                .then(data => {
                    if (data.state == 'SUCCESS') {
                        this.dispatchFn({ 
                            messageBoard: [],
                            emplIds: [], 
                            isChooseContact: false
                        });
                        dd.device.notification.hidePreloader({});
                        if (checking_type == '招投标') {
                            this.dispatchFn({
                                msgIsSubmit: true
                            });
                            dd.device.notification.toast({
                                icon: 'success', 
                                text: '留言提交成功！', 
                                duration: 2, 
                            });
                            return
                        };
                        dd.device.notification.toast({
                            icon: 'success', 
                            text: '提交成功！', 
                            duration: 2, 
                        });
                        let timer = setTimeout(function () {
                            window.location.href = '#/tendering';
                            clearTimeout(timer);
                        },2000);
                        return
                    }
                    dd.device.notification.alert({
                        message: data.info,
                        title: "温馨提示",
                        buttonName: "确定"
                    });
                })
            }
        });
    }  
     /*
    * 合同的操作（同意、驳回）
    * @param reason 驳回原因
    */ 
    operationFn = (state,reason) => {
        let url = encodeURIComponent(`${AUTH_URL}#/detailcontract/${this.props.params.id}`),
            type = 1,// 2是合同，3是内审
            userId = localStorage.getItem('userId'),
            params = `redirectUrl=${url}&stateEnum=${state}&type=${type}&userId=${userId}`;
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
                        Control.go(-1);
                        localStorage.removeItem('checking_type');
                    }
                })
                return
            }
            dd.device.notification.alert({
                message: data.info,
                title: "提示",
                buttonName: "确定",
            })

        })
    }
    /**
    * 合同转交---1、获取联系人
    */
    conveyFn = () => {
        mydingready.ddReady({
            context: this,
            setFn: this.dispatchFn,
            ddApiState: 'lianxiren',
            stateDataStr: 'beTransfer'
        })
    }
    /**
    * 合同转交---1、接口 
    * @param beTransfer  转交者信息
    */
    conveyFn2 = (beTransfer) => {
        // 测试数据开始
       /* beTransfer = {
            name: '曹鹏伟',
            emplId: '042827545726609513'
        }*/
        // 测试数据结束

        function checking_type () {
            let type = localStorage.getItem('checking_type');
            if (type == '招投标') { return 1; }
            if (type == '合同') { return 2; }
            if (type == '内审审批') { return 3; }
        }
        let url = encodeURIComponent(`${AUTH_URL}#/detailcontract/${this.props.params.id}`),
            userId = localStorage.getItem('userId'),
            params = `beTransferId=${beTransfer.emplId}&beTransferName=${beTransfer.name}&redirectUrl=${url}&type=${checking_type()}&userId=${userId}`;
        fetch(`${AUTH_URL}bidding/approval/transfer/${this.props.params.id}?${params}`,{
            method: 'POST'
        })
        .then(res => res.json())
        .then(data => {
            if (data.state == 'SUCCESS') {
                dd.device.notification.alert({
                    message: "已转交！",
                    title: "提示",
                    buttonName: "确定",
                    onSuccess: () => {
                        localStorage.removeItem('checking_type');
                        Control.go(-1);
                    }
                })
                return
            }
            dd.device.notification.alert({
                message: data.info,
                title: "温馨提示",
                buttonName: "确定"
            })
        })
    } 
    componentWillUnmount () {
        localStorage.removeItem('REBUT');
    }
    render() {
        let myUserId = localStorage.getItem('userId'),
            { id ,detailData ,isLimitMsg, styleInfo ,userIds ,messageBoardMsgs, messageBoard ,checking_type,isRebut, emplIds,msgIsSubmit} = this.state;
        const { getFieldProps } = this.props.form;
        if (detailData) {
            const  enclosure = detailData.enclosure ? JSON.parse(detailData.enclosure) : [],
                approver = detailData.approver ? JSON.parse(detailData.approver) : [],
                copyPerson = detailData.copyPerson ? JSON.parse(detailData.copyPerson) : [];
            let enclosureCom = enclosure.map(v=>{
                let fileTypeImg, 
                    fileTypeImgArr = ['ppt.png','ppt.png','excel.png','excel.png','word.png','word.png'];
                    let i = ['ppt','pptx','xls','xlsx','doc','docx'].indexOf(v.fileType);
                    i != -1 ? fileTypeImg = fileTypeImgArr[i] : fileTypeImg = 'unknown.png';
                // return  <div className="file" key={v.fileId}>
                return  <div className="file" key={v.fileId} onClick={() => this.previewFile(v)}>
                            <img className="fileIcon" src={`${IMGCOMMONURI}${fileTypeImg}`} />
                            <p className="textOverflow_1">{v.fileName}</p>
                        </div>
            });
            let approverCom = approver.map(v=>{
                return <div key={v.emplId} style={{margin: '5px 1.5vw'}}>
                            <div className="box_b manBox">
                                <p className="color_b">{v.name}</p>
                            </div>
                        </div>
            });
            let copyPersonCom = copyPerson.map(v=>{
                return  <div key={v.emplId} style={{margin: '5px 1.5vw'}}>
                            <div className="box_g manBox">
                                <p className="color_g">{v.name}</p>
                            </div>
                        </div>
            });
            let messageBoardMsgsCom = messageBoardMsgs.map((v,i) => {
                return  <div>
                            <div className="selectedMan" key={v.userName}>
                                <p className="color_gray">用户名</p>
                                <div className="manArr detailManArr flex">
                                    <span>{v.userName}</span> 
                                </div>
                            </div>
                            <div className="line_gray"></div>
                            <div className="selectedMan">
                                <p className="color_gray">留言内容</p>
                                <div className="manArr detailManArr flex">
                                    {v.content} 
                                </div>
                            </div>
                            <div className="line_gray"></div>
                            <div className="selectedMan">
                                <p className="color_gray">留言时间</p>
                                <div className="manArr detailManArr flex" style={{}}>
                                    <span>
                                        {v.createTime}
                                    </span>
                                </div>
                            </div>
                            <div className={!i ? 'line_box' : "isHide"}></div>
                        </div>
            })
            return (
               <div className="addTendering detailtendering">
                    <p className="title">基本信息</p>
                    <div className="name titleStr">
                        {detailData ? detailData.biddingName : ''}
                    </div>
                    <div className="line_gray"></div>
                    <div className="name color_gray">
                        {detailData ? detailData.content : ''}
                    </div>
                    <p className="title">投标附件</p>
                    <div className="fileBox">
                        {enclosureCom}
                    </div>
                    <div className="selectedMan">
                        <p className="color_gray">审批人</p>
                        <div className="manArr detailManArr">
                            {approverCom}
                        </div>
                    </div>
                    <div className="line_gray"></div>
                    <div className="selectedMan">
                        <p className="color_gray">抄送人</p>
                        <div className="manArr detailManArr">
                           {copyPersonCom}
                        </div>
                    </div>
                    <div className="line_gray"></div>
                    <div className="selectedMan lineTime">
                        <p className="color_gray">提交时间</p>
                        <div className="manArr detailManArr flex">
                            <span>
                                {moment(detailData.createTime).format('YYYY.MM.DD HH:mm')}
                            </span>
                        </div>
                    </div>
                    <div className="line_gray"></div>
                    <div className="selectedMan lineTime">
                        <p className="color_gray">状态</p>
                        <div className="manArr detailManArr flex">
                            <span className={detailData.approvalState ? styleInfo[detailData.approvalState].color : ''}>{styleInfo[detailData.approvalState].str}</span>
                        </div>
                    </div>
                    <div className="line_gray"></div>
                    <div className={detailData.approvalState == 'REBUT' ? 'isFlex selectedMan lineTime' : 'isHide'}>
                        <p className="color_gray">驳回原因</p>
                        <div className="manArr detailManArr">
                            {detailData.reason}
                        </div>
                    </div>
                    {/* 留言板 --- 只有抄送人和审批人进行操作 */}
                    <div className={detailData.messageBoard ? "showMsgs" : 'isHide'}>
                        <p className="title">留言历史</p>
                        {messageBoardMsgsCom}
                    </div>
                    <div className={detailData.approvalState == 'REBUT' || msgIsSubmit ? 'line_gray' : 'isHide'}></div>
                    {/*<div className={detailData.approvalState == 'REBUT' || msgIsSubmit && administrators.indexOf(myUserId) != -1 ? 'biddingName' : 'isHide'} style={{padding: '0 3vw'}}>*/} 
                    {/*<div className={msgIsSubmit ? 'isHide' : "biddingName"}> */}
                    <div className={isLimitMsg ? 'biddingName' : "isHide"}> 
                        <p className="title">留言板</p>
                        <TextareaItem 
                            className="textArea"
                            rows={5}
                            style={{padding: '0 3vw'}}
                            onBlur={(e) => {console.log(e)}}
                            placeholder="可以备注、补充审批等信息"
                            {...getFieldProps('content',{
                                onChange: this.getRemindContacts,
                                rules:[{required: false,message:'此处输入备注、补充审批等信息！'}]
                            })}
                        ></TextareaItem> 
                        <button className="btnBlueLong" type="submit" onClick={this.submit} style={{marginBottom: '1vh'}}>提交留言</button>
                    </div>
                      {/* 待我审批进入之后，合同操作按钮 */}
                    <div className={checking_type == '招投标' && isRebut ? "operationBtns flex_ac" : 'isHide'}>
                        <div className="btn btn_b" onClick={() => this.conveyFn()}>转交</div>
                        {/*<div className="btn btn_b" onClick={() => this.conveyFn2()}>转交</div>*/}
                        <div className="btn btn_g" onClick={() => this.operationFn('PASS')}>同意</div>
                        <div className="btn btn_r" onClick={() => {Control.go(`/rebutinfo/${this.props.params.id}`);}}>驳回</div>
                    </div>
                </div>
            );
        } else {
            return <div></div>
        }
    }

}
const Detailtendering = createForm()(DetailtenderingForm);
export default Detailtendering ;
