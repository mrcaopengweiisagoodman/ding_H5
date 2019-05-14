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
const { AUTH_URL, IMGCOMMONURI } = require(`config/develop.json`);


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
        let { id,emplIds ,userIds} = this.state;

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
                    url = encodeURI(`${AUTH_URL}#/detailtendering/${id}`);
                    userIds.join(',');
                emplIds.length ? params = {
                                    id: id,
                                    content: value.content,
                                    redirectUrl: url,
                                    type: 3,
                                    notified: emplIds.join(',')
                               }: params = {
                                    id: id,
                                    content: value.content,
                                    redirectUrl: url,
                                    type: 3,
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
                            isChooseContact: false
                        });
                        dd.device.notification.hidePreloader({
                          
                        })
                        dd.device.notification.toast({
                            icon: 'success', 
                            text: '提交成功！', 
                            duration: 2, 
                        });
                        let timer = setTimeout(function () {
                            window.location.href = '#/contract';
                            clearTimeout(timer);
                        },2000);
                    }
                })
            }
        });
    }  
    /**
    * 去往搜索关联合同页面
    */
    goSearch = () => {
        Control.go(`/contractsearch/audit`);
    }
    render() {
        let administrators = [],
            myUserId = localStorage.getItem('userId');
        const { getFieldProps } = this.props.form;

        let { styleInfo,contractType ,eventType ,approver ,enclosure ,detailData,searchVal} = this.state;
        console.log(contractJson)
        
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
            let enclosureCom = enclosure.map(v => {
                let fileTypeImg, 
                    fileTypeImgArr = ['ppt.png','ppt.png','excel.png','excel.png','word.png','word.png'];
                let i = ['ppt','pptx','xls','xlsx','doc','docx'].indexOf(v.fileType);
                i != -1 ? fileTypeImg = fileTypeImgArr[i] : fileTypeImg = 'unknown.png';
                return <div className="file" onClick={() => this.previewFile('previewFile',v)}>
                            <img className="fileIcon" src={`${IMGCOMMONURI}${fileTypeImg}`} />
                            <p className="textOverflow_1">{v.fileName}</p>
                        </div>
            });
        
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
                    <div className={detailData.approvalState == 'REBUT'? 'line_gray' : 'isHide'}></div>
                    <div className={detailData.approvalState == 'REBUT' && administrators.indexOf(myUserId) != -1 ? 'biddingName' : 'isHide'} style={{padding: '0 3vw'}}>
                    {/*<div className="biddingName"> */}
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

                </div>
            )
        } else {
            return (<div></div>)
        }
    }

}
const Detailcontract = createForm()(DetailcontractForm);
export default Detailcontract ;
