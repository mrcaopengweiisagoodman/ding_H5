// 合同详情
require('./PageDetailauditapprove.less');
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
import contractJson from './../../test_json/contract';
import moment from 'moment';
import {
    Control,
    Link
} from 'react-keeper';
const { AUTH_URL, IMGCOMMONURI ,CONFIG_APP_URL} = require(`config/develop.json`);


class DetailcontractForm extends Component {
    constructor(props) { 
        super(props, logic);        
        mydingready.ddReady({pageTitle: '内审详情'});
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
        fetch(`${AUTH_URL}internal/audit/info/${id}`)
        .then(res => res.json())
        .then(data => {
            /*dd.device.notification.alert({
                message: "合同详情数据" + JSON.stringify(data),
                title: "提示",
                buttonName: "确定"
            })*/
            if (data.state == 'SUCCESS') {
                this.dispatchFn({
                    id: id,
                    detailData: data.values.info
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
        let { messageBoard, emplIds, writeMsg} = this.state;
        let inx = e.indexOf('@');
        let isDel = true;// 联系人名称是否被回撤掉


        // 有1个@，messageBoard值为0;且最后一个字符为@；被删除掉的时候不调取联系人
        if (e.charAt(e.length - 1) == '@' && isDel) {
            mydingready.ddReady({
                context: this,
                ddApiState: 'userIds',
                setFn: this.dispatchFn,
                otherData: {
                    isChooseContact: true,
                    writeMsg: e
                }
            });
        }
        // 留言板清空时
        if (!e) {
            this.dispatchFn({
                messageBoard: [],
                emplIds: [],
                isChooseContact: false,
                writeMsg: ''
            })
        }
    }
    /**
    * 提交留言
    */
    submit = () => {
        let { id,emplIds,messageBoard ,userIds,writeMsg} = this.state;

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
                 // 选择之后再次删除，对应的玩家名称和玩家id删除
                for (let ele_ of messageBoard) {
                    let i = value.content.indexOf(ele_);
                    if (i == -1) {
                        messageBoard.splice(i);
                        emplIds.splice(i);
                    }
                }
                dd.device.notification.showPreloader({
                    text: "提交中...", //loading显示的字符，空表示不显示文字
                    showIcon: true, //是否显示icon，默认true
                })
                var params , 
                    url = encodeURIComponent(`${CONFIG_APP_URL}#/detailtendering/${id}`);
                    userIds.join(',');
                emplIds.length ? params = {
                                    id: id,
                                    content: value.content,
                                    redirectUrl: url,
                                    type: 3,
                                    notified: emplIds.join(','),
                                    userId: localStorage.getItem('userId'),
                                    userName: localStorage.getItem('userName')
                               }: params = {
                                    id: id,
                                    content: value.content,
                                    redirectUrl: url,
                                    type: 3,
                                    userId: localStorage.getItem('userId'),
                                    userName: localStorage.getItem('userName')
                               };

                fetch(`${AUTH_URL}bidding/leave/message`,{
                    method: 'POST',
                    headers: {
                        'Content-Type': "application/json",
                        'Access-Control-Allow-Origin':'*'
                    },
                    body: JSON.stringify(params)
                })
                .then(res => res.json())
                .then(data => {
                    if (data.state == 'SUCCESS') {
                        this.dispatchFn({ 
                            messageBoard: [],
                            emplIds: [], 
                            isChooseContact: false,
                            writeMsg: ''
                        });
                        dd.device.notification.hidePreloader({});
                        dd.device.notification.toast({
                            icon: 'success', 
                            text: '提交成功！', 
                            duration: 2, 
                        });
                        Control.go(-1);
                    }
                })
            }
        });
    }  
    /**
    * 去往搜索关联合同页面
    */
    goSearch = () => {
        Control.go(`/contractsearch/audit/${this.props.params.id}`);
    }
     /*
    * 合同的操作（同意、驳回）
    * @param reason 驳回原因
    */ 
    operationFn = (state,reason) => {
        let url = encodeURIComponent(`${CONFIG_APP_URL}#/detailcontract/${this.props.params.id}`),
            type = 2,// 2是合同，3是内审
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
        let url = encodeURIComponent(`${CONFIG_APP_URL}#/detailcontract/${this.props.params.id}`),
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
        let administrators = [],
            myUserId = localStorage.getItem('userId');
        const { getFieldProps } = this.props.form;

        let { messageBoardMsgs, isLimitMsg,styleInfo,contractType ,eventType ,approver ,enclosure ,detailData,searchVal,checking_type,isRebut} = this.state;
        
        // 测试数据开始
        // detailData = contractJson.detail.contract;
     
        // 测试数据结束

        if (detailData) {
          /*  let a = [
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
            let enclosureCom = JSON.parse(detailData.enclosure).map(v => {
                let fileTypeImg, 
                    fileTypeImgArr = ['ppt.png','ppt.png','excel.png','excel.png','word.png','word.png'];
                let i = ['ppt','pptx','xls','xlsx','doc','docx'].indexOf(v.fileType);
                i != -1 ? fileTypeImg = fileTypeImgArr[i] : fileTypeImg = 'unknown.png';
                return <div className="file" onClick={() => this.previewFile(v)}>
                            <img className="fileIcon" src={`${IMGCOMMONURI}${fileTypeImg}`} />
                            <p className="textOverflow_1">{v.fileName}</p>
                        </div>
            });
            let messageBoardMsgsCom = messageBoardMsgs.map((v,i) => {
                return  <div style={{background: '#fff'}}>
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
                            <div className={i < messageBoardMsgs.length - 1 ? 'line_box' : "isHide"}></div>
                        </div>
            })
            return (
                <div className="addcontract detailcontract">
                    <div className="name flex" style={{padding: '0 3vw'}}>
                        <span className="f_14 color_gray leftText">标题</span>
                        <p className="maxW">{detailData.title}</p>
                    </div>
                    <div className="line_gray"></div>
                    <p className="title">内审主要内容或说明(选填)</p>
                    <p className="textBox">{detailData.content}</p>
                    <p className="title">相关附件</p>
                    <div className="fileBox">
                        {enclosureCom}
                    </div>
                    <div className="listHeight flex">
                        <span className="leftText f_14 color_gray">提交时间</span>
                        <div>{moment(detailData.createTime).format('YYYY.MM.DD HH:mm')}</div>
                    </div>
                    <div className="line_gray"></div>
                    <div className="selectedMan lineTime" style={{background: '#FFF'}}>
                        <p className="leftText f_14 color_gray">状态</p>
                        <div className="manArr detailManArr flex">
                            <span className={detailData.approvalState ? styleInfo[detailData.approvalState].color : ''}>{styleInfo[detailData.approvalState].str}</span>
                        </div>
                    </div>
                    <div className="line_gray"></div>
                    <div className={detailData.approvalState == 'REBUT' ? "listHeight flex" : 'isHide'}>
                        <span className="leftText f_14 color_gray">驳回原因</span>
                        <div>{detailData.reason}</div>
                    </div>
                      {/* 留言板 --- 只有抄送人和审批人进行操作 */}
                    <div className={detailData.messageBoard ? "showMsgs" : 'isHide'}>
                        <p className="title">留言历史</p>
                        {messageBoardMsgsCom}
                    </div>
                       {/* 留言板 --- 只有抄送人和审批人进行操作 */}
                    <div className={detailData.approvalState == 'REBUT' ? 'line_gray' : 'isHide'}></div>
                    
                    <div className={isLimitMsg ? 'biddingName' : "isHide"}> 
                        <p className="title">留言板</p>
                        <TextareaItem 
                            className="textArea"
                            rows={5}
                            onBlur={(e) => {console.log(e)}}
                            placeholder="可以备注、补充审批等信息"
                            {...getFieldProps('content',{
                                onChange: this.getRemindContacts,
                                rules:[{required: false,message:'此处输入备注、补充审批等信息！'}]
                            })}
                        ></TextareaItem> 
                        <button className="btnBlueLong" type="submit" onClick={this.submit} style={{marginBottom: '1vh'}}>提交</button>
                    </div>
                      {/* 待我审批进入之后，合同操作按钮 */}
                    <div className={checking_type == '内审审批' && isRebut ? "operationBtns flex_ac" : 'isHide'}>
                        <div className="btn btn_b" onClick={() => this.conveyFn()}>转交</div>
                        {/*<div className="btn btn_b" onClick={() => this.conveyFn2()}>转交</div>*/}
                        <div className="btn btn_g" onClick={() => this.operationFn('PASS')}>同意</div>
                        <div className="btn btn_r" onClick={() => {Control.go(`/rebutinfo/${this.props.params.id}`);}}>驳回</div>
                    </div>
                </div>
            )
        } else {
            return (<div></div>)
        }
    }

}
const Detailcontract = createForm()(DetailcontractForm);
export default Detailcontract ;
