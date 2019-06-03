// 合同详情
require('./PageDetailcontract.less');
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
import mydingconfig from './../../dings/mydingconfig';
import contractJson from './../../test_json/contract';
import moment from 'moment';
import {
    Control,
    Link
} from 'react-keeper';
const { AUTH_URL, IMGCOMMONURI,CONFIG_APP_URL } = require(`config/develop.json`);


class DetailcontractForm extends Component {
    constructor(props) { 
        super(props, logic);        
        let url = window.location.href;
        if (url.indexOf('ismessage=true') != -1) {
            let timer = setTimeout(function(){
                mydingready.ddReady({ddApiState: 'getUser',pageTitle: '合同详情'});
                clearTimeout(timer);
            },1000);
        } else {
            mydingready.ddReady({pageTitle: '合同详情'});
        }
        /*dd.device.notification.alert({
            message: "合同页面拿到的数据---" + JSON.stringify(props) + '-------' + window.location.href,
            title: "提示",
            buttonName: "确定"
        })*/
    }
    componentDidMount () {
        this.getDetail(this.props.params.id);   
        console.log(this.props.params)
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
            console.log('获取详情接口！')
            /*dd.device.notification.alert({
                message: "合同详情数据" + JSON.stringify(data),
                title: "提示",
                buttonName: "确定"
            })*/
            if (data.state == 'SUCCESS') {
                let contractSettings = data.values.contract.contractSettings;
                // 测试数据开始
               /* data.values.contract.approvalState = 'PASS';
                let contractSettings = JSON.stringify([
                    {
                        "contractSettingId": 5,
                        "contractId": 44,
                        "description": "步骤一",
                        "enclosure": null,
                        "reminderTime": null,
                        "myStatus": 1,
                        "myComment": "asfasfas",
                        "otherStatus": 2,
                        "otherComment": "zdfasd",
                        "isReminder": false,
                        "createTime": "2019-05-21T17:38:22",
                        "updateTime": "2019-05-27T18:01:11"
                    }, {
                        "contractSettingId": 6,
                        "contractId": 44,
                        "description": "步骤二",
                        "enclosure": null,
                        "reminderTime": "2019-05-21T17:38:22",
                        "myStatus": 1,
                        "myComment": "asfasfas",
                        "otherStatus": 2,
                        "otherComment": "zdfasd",
                        "isReminder": false,
                        "createTime": "2019-05-21T17:38:22",
                        "updateTime": "2019-05-27T18:01:11"
                    },
                ]);*/
                // 测试数据结束
                let {messageBoardMsgs , isLimitMsg , buzhou_now} = this.state;
                let messageBoardArr, messageBoardObj;
                let inx_a = data.values.contract.approver.indexOf(localStorage.getItem('userId'));
                if (inx_a > -1) isLimitMsg = true;
                if (data.values.contract.messageBoard) {
                    messageBoardArr = data.values.contract.messageBoard.split(',');
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
                    detailData: data.values.contract,
                    messageBoardMsgs: messageBoardMsgs,
                    isLimitMsg: isLimitMsg,
                    contractSettingId: contractSettings && contractSettings.length ? contractSettings[0].contractSettingId : '',
                    contractSettings: contractSettings && contractSettings ? contractSettings : [],
                    buzhou_now: contractSettings && contractSettings.length ? contractSettings[0] : buzhou_now
                })
            }
        })
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
    * 预览文件 (钉钉api)
    */
    previewFile = (fileInfo) => {
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
                    userIds ? userIds.join(',') : '';
                emplIds && emplIds.length ? params = {
                                    id: id,
                                    content: value.content,
                                    redirectUrl: url,
                                    type: 2,
                                    notified: emplIds.join(','),
                                    userId: localStorage.getItem('userId'),
                                    userName: localStorage.getItem('userName')
                               }: params = {
                                    id: id,
                                    content: value.content,
                                    redirectUrl: url,
                                    type: 2,
                                    userId: localStorage.getItem('userId'),
                                    userName: localStorage.getItem('userName')
                               };

                fetch(`${AUTH_URL}bidding/leave/message`,{
                    method: 'POST',
                    headers: {
                        'Content-Type': "application/json",
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
        Control.go(`/contractsearch/contract/${this.props.params.id}`);
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
    componentWillUnmount () {
        localStorage.removeItem('REBUT');
    }
    /* 
    * 合同步骤tab切换
    */
    hetongTab = (id ,inx) => {
        let { buzhou_now ,contractSettings } = this.state;
        this.dispatchFn({
            buzhou_now: contractSettings[inx],
            contractSettingId: id
        });
    }
    /*
    * 审批人
    */
    myStatusChange = (status_str, status) => {
        this.dispatchFn({
            [status_str]: status
        });
    }

    /* 
     * 风控选择是否未完成
     */
    checkedChange2 = (e,val) => {
        e.target.checked = !e.target.checked;
        this.dispatchFn({
            status_fengkong: val
        });
    }
    /* */
    buzhouFn = () => {
        let userId = localStorage.getItem('userId');
        let { buzhou_now , isWind} = this.state;
        this.props.form.validateFields((error,value) => {
            console.log('步骤按钮',value);
            if (!error) {
                // 审批人
                this.ownMiaoshu(userId,value);
                // 风控人员
                if (isWind) {
                    this.fenkongMiaoshu(userId,value);
                }
            }   
        });
    }
    /* 只提交描述总结 */
    ownMiaoshu = (userId,val) => {
        let { buzhou_now , status_geren,enclosure ,isWind} = this.state,
            params = {
                content: val.content_miaoshu,
                status: status_geren,
                enclosure: enclosure,
                userId: userId
            };
        fetch(`${AUTH_URL}contract/modify/my/step/${buzhou_now.contractSettingId}`,{
            method: 'POST',
            headers: {
                "Content-Type": "application/json" 
            },
            body: JSON.stringify(params)
        })
        .then(res => res.json())
        .then(data => {
            if (data.state == "SUCCESS" && !isWind) {
                this.getDetail(this.props.params.id);
                return
            }
            dd.device.notification.alert({
                message: data.info,
                title: "温馨提示",
                buttonName: "确定"
            })
        })
    }
    /* 风控人员提交 */
    fenkongMiaoshu = (userId,val) => {
        let { buzhou_now ,status_fengkong} = this.state,
            params = {
                content: val.content_miaoshu,
                status: status_fengkong,
                userId: userId
            };;
        fetch(`${AUTH_URL}/contract/modify/wind/step/${buzhou_now.contractSettingId}`,{
            method: 'POST',
            headers: {
                "Content-Type": "application/json" 
            },
            body: JSON.stringify(params)
        })
        .then(res => res.json())
        .then(data => {
            if(data.state == "SUCCESS") {
                this.getDetail(this.props.params.id);
                return
            }
            dd.device.notification.alert({
                message: data.info,
                title: "温馨提示",
                buttonName: "确定"
            });
        })
    }
    render() {
        let administrators = [],
            myUserId = localStorage.getItem('userId');
        const { getFieldProps } = this.props.form;

        let { 
            status_geren,
            contractSettingId ,
            buzhou_now,
            contractSettings,
            isWind,
            messageBoardMsgs,
            styleInfo,
            contractType ,
            isLimitMsg,
            checking_type,
            eventType ,
            status_fengkong,
            approver ,
            enclosure ,
            isRebut,
            detailData,
            searchVal
        } = this.state;

        // 测试数据开始
        // detailData = contractJson.detail.contract;
     
        // 测试数据结束

        if (detailData) {
            let enclosure_upload_com = enclosure.map(v => {
                let fileTypeImg, 
                    fileTypeImgArr = ['ppt.png','ppt.png','excel.png','excel.png','word.png','word.png'];
                let i = ['ppt','pptx','xls','xlsx','doc','docx'].indexOf(v.fileType);
                i != -1 ? fileTypeImg = fileTypeImgArr[i] : fileTypeImg = 'unknown.png';
                return <div className="file" onClick={() => this.previewFile(v)}>
                            <img className="fileIcon" src={`${IMGCOMMONURI}${fileTypeImg}`} />
                            <p className="textOverflow_1">{v.fileName}</p>
                            <div className="closeBtn" onClick={(e) => {this.delFile(e,v.fileId)}}>
                                <img src={`${IMGCOMMONURI}delete.png`} />
                            </div>
                        </div>
            })
            
            let contractSettingsCom = contractSettings.map((v,i) => {
                return  <div className={v.contractSettingId == contractSettingId ? "tab color_b" : "tab"} onClick={() => this.hetongTab(v.contractSettingId,i)}>步骤 {i + 1}</div>
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
            let enclosureCom = JSON.parse(detailData.enclosure ? detailData.enclosure : []).map(v => {
                let fileTypeImg, 
                    fileTypeImgArr = ['ppt.png','ppt.png','excel.png','excel.png','word.png','word.png'];
                let i = ['ppt','pptx','xls','xlsx','doc','docx'].indexOf(v.fileType);
                i != -1 ? fileTypeImg = fileTypeImgArr[i] : fileTypeImg = 'unknown.png';
                return <div className="file" onClick={() => this.previewFile(v)}>
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
            let childNamesCom = detailData.childNames.map((v,i) => {
                return  <Link to={`/detailcontractsub/${childIds[i]}`} className="listHeight flex_bc">
                            <span className="leftName textOverflow_1">{v}</span>
                            <div className="flex_ec paySelect">
                                <img className="fileIcon" src={`${IMGCOMMONURI}common_level2_icon_bg_color.png`} />
                            </div>
                        </Link>
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
                    {/*<p className="title">合同类型</p>
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
                        <span className="leftText f_14 color_gray">合同编号</span>
                        <div>{detailData.code}</div>
                    </div>
                    <div className="line_gray"></div>
                    <div className="listHeight flex">
                        <span className="leftText f_14 color_gray">部门</span>
                        <div>{detailData.deptName}</div>
                    </div>
                    <div className="line_gray"></div>
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
                    <div className="line_gray"></div>
                    <div className="listHeight flex">
                        <span className="leftText f_14 color_gray">合同金额</span>
                        <div className="color_orange">￥{detailData.amount}</div>
                    </div>
                    <div className="line_gray"></div>
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
                    <p className={detailData.childNames.length ? 'title' : 'isHide'}>关联合同</p>
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
                        <SearchBar className="searchBox" placeholder="查找相关合同" 
                            value={searchVal}
                            onFocus={this.goSearch}
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
                    <div className='line_box'></div>
                    {/* 合同步骤 --- 审批完成之后 */}
                    <div className={detailData.approvalState == "PASS" && contractSettings.length && detailData.originatorId == myUserId ? "buzhou" : "isHide"}>
                        <div className="bz_left">
                            {/*<div className="tab" onClick={this.hetongTab}>步骤一</div>*/}
                            {contractSettingsCom}
                        </div>
                        <div className="bz_right">
                            <div className="miaoshu">
                                <div className="listHeight">
                                    <span className="leftText f_14 color_gray">步骤描述</span>
                                    <div>{buzhou_now.description ? buzhou_now.description : '暂无描述'}</div>
                                </div>
                                <div className="listHeight">
                                    <span className="leftText f_14 color_gray">提醒时间</span>
                                    <div>{buzhou_now.reminderTime ? moment(buzhou_now.reminderTime).format('YYYY.MM.DD HH:mm') : '暂无'}</div>
                                </div>
                                <div className="listHeight flex">
                                    <span className="leftText f_14 color_gray">状态</span>
                                    <div className="flex">
                                        <div className={status_geren == 1 ? "color_g_d dui" : 'color_gray dui'} onClick={() => this.myStatusChange('status_geren',1)}>√</div>
                                        <div className={status_geren == 0 ? "color_r_c cuo" : 'color_gray cuo'} onClick={() => this.myStatusChange('status_geren',0)}>×</div>
                                    </div>
                                </div>
                                <p className="title">上传附件</p>
                                <div className="fileBox">
                                    {enclosure_upload_com}
                                    <div className="file" onClick={() => this.toDdJsApi('uploadFile')}>
                                        <img className="fileIcon selectedBtn" src={`${IMGCOMMONURI}z z.png`} />
                                        <p>上传附件</p>
                                    </div>
                                </div>
                                <div className='biddingName'> 
                                    <p className="title">完成内容</p>
                                    <TextareaItem 
                                        className="textArea"
                                        rows={5}
                                        onBlur={(e) => {console.log(e)}}
                                        placeholder="完成内容等信息"
                                        {...getFieldProps('content_wancheng',{
                                            
                                            rules:[{required: false,message:'此处输入备注、补充审批等信息！'}]
                                        })}
                                    ></TextareaItem> 
                                </div>
                                {/* 风控权限在获取用户名接口中 ding/gain/dept/info */}
                                <div className={isWind ? "listHeight flex" : 'isHide'}>
                                    <div className="checkeBox flex">
                                        <Checkbox className="checkeList" checked={status_fengkong == 2 ? true : false} onChange={(e) => this.checkedChange2(e,2)} />
                                        <span>已完成</span>
                                    </div>
                                    <div className="checkeBox flex">
                                        <Checkbox className="checkeList" checked={status_fengkong == 1 ? true : false} onChange={(e) => this.checkedChange2(e,1)} />
                                        <span>未完成</span>
                                    </div>
                                    <div className="checkeBox flex">
                                        <Checkbox className="checkeList" checked={status_fengkong == 0 ? true : false} onChange={(e) => this.checkedChange2(e,0)} />
                                        <span>待确认</span>
                                    </div>
                                </div>
                                <div className={isWind ? 'biddingName' : 'isHide'}> 
                                    <p className="title">描述</p>
                                    <TextareaItem 
                                        className="textArea"
                                        rows={5}
                                        onBlur={(e) => {console.log(e)}}
                                        placeholder=""
                                        {...getFieldProps('content_miaoshu',{
                                            
                                            rules:[{required: false,message:'此处输入备注、补充审批等信息！'}]
                                        })}
                                    ></TextareaItem> 
                                </div>
                                <button className="btnBlueLong" type="submit" onClick={this.buzhouFn} style={{marginBottom: '1vh'}}>提交合同步骤</button>
                            </div>
                        </div>
                    </div>






                       {/* 留言板 --- 只有抄送人和审批人进行操作 */}
                    <div className={detailData.messageBoard ? "showMsgs" : 'isHide'}>
                        <p className="title">留言历史</p>
                        {messageBoardMsgsCom}
                    </div>
                    <div className={detailData.approvalState == 'REBUT' ? 'line_gray' : 'isHide'}></div>
                    {/*<div className={detailData.approvalState == 'REBUT' && administrators.indexOf(myUserId) != -1 ? 'biddingName' : 'isHide'} style={{padding: '0 3vw'}}>*/}
                    {/*<div className="biddingName"> */}
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
                    <div className={checking_type == '合同' && isRebut ? "operationBtns flex_ac" : 'isHide'}>
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
