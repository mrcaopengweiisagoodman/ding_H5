// 合同详情
require('./PageDetailcontractsub.less');
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
        mydingready.ddReady({pageTitle: '关联合同详情'});
        this.getDetail(props.params.id);   
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
        fetch(`${AUTH_URL}contract/info/${id}`)
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
                    detailData: data.values.contract
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
                    url = encodeURIComponent(`${AUTH_URL}#/detailtendering/${id}`);
                    userIds.join(',');
                emplIds.length ? params = {
                                    id: id,
                                    content: value.content,
                                    redirectUrl: url,
                                    type: 2,
                                    notified: emplIds.join(','),
                                    userId: localStorage.getItem('userId')
                               }: params = {
                                    id: id,
                                    content: value.content,
                                    redirectUrl: url,
                                    type: 2,
                                    userId: localStorage.getItem('userId')
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
    render() {
        let administrators = [],
            myUserId = localStorage.getItem('userId');
        const { getFieldProps } = this.props.form;

        let { messageBoardMsgs,isLimitMsg,styleInfo,contractType ,eventType ,approver ,enclosure ,detailData,searchVal} = this.state;
        console.log(contractJson)
        
        // 测试数据开始
        // detailData = contractJson.detail.contract;
     
        // 测试数据结束

        if (detailData) {
            // 测试数据
            let paymentSettingsCom = JSON.parse(detailData.paymentSettings).map(v => {
                if (detailData.eventType == 0) return;
                return  <div>  
                            <div className='listHeight flex'>
                                <span className="leftText f_14 color_gray">{detailData.eventType == 1 ? '收款时间' : '付款时间'}</span>
                                <div>{moment(v.payTime).format('YYYY.MM.DD HH:mm')}</div>
                            </div>
                            <div className="line_gray"></div>
                            <div className="listHeight flex">
                                <span className="leftText f_14 color_gray">{detailData.eventType == 1 ? '收款条件' : '付款条件'}</span>
                                <div className="maxW">{v.payCondition}</div>
                            </div>
                            <div className="line_gray"></div>
                            <div className="listHeight flex">
                                <span className="leftText f_14 color_gray">提醒时间</span>
                                <div>{moment(v.reminderTime).format('YYYY.MM.DD HH:mm')}</div>
                            </div>
                            <div className="line_box"></div>
                        </div>

            })
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
                        </div>
            });
            let approverCom = JSON.parse(detailData.approver).map(v=>{
                administrators.push(v.emplId);
                return <div key={v.emplId} style={{margin: '5px 1.5vw'}}>
                            <div className="box_b manBox">
                                <p className="color_b">{v.name}</p>
                            </div>
                        </div>
            });
            let childIds = detailData.cids ? detailData.cids.split(',') : [];
            /*let childNamesCom = detailData.childNames.map((v,i) => {
                return  <div className="listHeight flex_bc" onClick={() => this.goDetailContract(`${childIds[i]}`)}>
                            <span className="leftName textOverflow_1">{v}</span>
                            <div className="flex_ec paySelect">
                                <img className="fileIcon" src={`${IMGCOMMONURI}common_level2_icon_bg_color.png`} />
                            </div>
                        </div>
            })*/
            let childNamesCom = detailData.childNames.map((v,i) => {
                return  <Link to={`/detailcontract/${childIds[i]}`} className="listHeight flex_bc">
                            <span className="leftName textOverflow_1">{v}</span>
                            <div className="flex_ec paySelect">
                                <img className="fileIcon" src={`${IMGCOMMONURI}common_level2_icon_bg_color.png`} />
                            </div>
                        </Link>
            })
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
                  {/*  <p className="title">合同类型</p>
                    <div className="listHeight flex">
                        <div className="checkeBox flex">
                            <Checkbox className="checkeList" checked={detailData.contractType == 0} />
                            <span className="f_14 color_gray">标准化</span>
                        </div>
                        <div className="checkeBox flex">
                            <Checkbox className="checkeList" checked={detailData.contractType == 1} />
                            <span>非标准化</span>
                        </div>
                    </div>*/}
                    <p className="title">基本信息</p>
                    <div className="listHeight flex">
                        <span className="leftText f_14 color_gray">部门</span>
                        <div>{detailData.deptName}</div>
                    </div>
                    <div className="name flex" style={{padding: '0 3vw'}}>
                        <span className="f_14 color_gray leftText">标题</span>
                        <p className="maxW">{detailData.title}</p>
                    </div>
                    <div className="line_gray"></div>
                    <div className="listHeight flex">
                        <span className="leftText f_14 color_gray">当事人</span>
                        <div>{detailData.partyName}</div>
                    </div>
                    <div className="line_gray"></div>
                    <div className={detailData.eventType ? 'name flex' : 'isHide'} style={{padding: '0 3vw'}}>
                        <span className="leftText f_14 color_gray">类型</span>
                        <p className="maxW">{detailData.eventType == 1 ? '收款' : '付款' }</p>
                    </div>
                    <p className={detailData.eventType ? 'title' : 'isHide'}>款项信息</p>
                    {paymentSettingsCom}
                    {/* 收款、付款时间 */}
                   {/* <div className={detailData.eventType ? '' : 'isHide'}>  
                                           <div className="line_gray"></div>
                                           <div className="listHeight flex">
                                               <span className="leftText f_14 color_gray">收款条件</span>
                                               <div className="maxW">这里是收款条件这里是收款条件这里是收款条件</div>
                                           </div>
                                           <div className="line_gray"></div>
                                           <div className="listHeight flex">
                                               <span className="leftText f_14 color_gray">提醒时间</span>
                                               <div>2019-09-09</div>
                                           </div>
                                           <div className="line_box"></div>
                                       </div>*/}
                    <div className="listHeight flex">
                        <span className="leftText f_14 color_gray">合同金额</span>
                        <div className="color_orange">￥{detailData.amount}</div>
                    </div>
                    <div className="listHeight flex">
                        <span className="leftText f_14 color_gray">租期</span>
                        <div>{detailData.leaseTerm}天</div>
                    </div>
                    <p className="title">相关附件</p>
                    <div className="fileBox">
                        {enclosureCom}
                    </div>
                    <p className="title">合同主要内容或说明(选填)</p>
                    <p className="textBox">{detailData.content}</p>
                    <p className="title">关联合同</p>
                    {/* 有关联合同时 */}
                    {childNamesCom}
                    <div className={detailData.childNames.length ? '' : 'isHide'}>
                        {/*<div className="listHeight flex_bc">
                                                    <span className="leftName textOverflow_1">江干区市民中心顶部合同防水工程采购合同呀呀呀呀呀</span>
                                                    <div className="flex_ec paySelect" onClick={() => this.goDetailContract(30)}>
                                                        <img className="fileIcon" src={`${IMGCOMMONURI}common_level2_icon_bg_color.png`} />
                                                    </div>
                                                </div>*/}
                    </div>
                    {/* 没有有关联合同时，去查找合同以关联 */}
                    <div className={detailData.childNames.length ? '' : 'isHide'}>
                        <SearchBar className="searchBox" placeholder="审批人/投标名称" 
                            value={searchVal}
                            onSubmit={this.goSearch} 
                            onBlur={this.searchBlur}
                            onChange={this.searchChange}
                        /> 
                    </div>
                    <div className="line_box"></div>
                    <div className="selectedMan bg_ff">
                        <p className="color_gray">审批人</p>
                        <div className="manArr detailManArr">
                            {approverCom}
                        </div>
                    </div>
                    <div className="line_gray"></div>
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

                </div>
            )
        } else {
            return (<div></div>)
        }
    }

}
const Detailcontract = createForm()(DetailcontractForm);
export default Detailcontract ;
