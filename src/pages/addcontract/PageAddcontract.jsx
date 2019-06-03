// 添加合同
require('./PageAddcontract.less');
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
import mydingready from './../../dings/mydingready';
const { AUTH_URL, IMGCOMMONURI,CONFIG_APP_URL } = require(`config/develop.json`);

class AddcontractForm extends Component {
    constructor(props) { 
        super(props, logic);        
        mydingready.ddReady({pageTitle: '添加合同'});
        
    }
    /**
    * 发送自定义事件（设置state）
    */
    dispatchFn = (val) => {
        this.dispatch('setStateData',val)
    }
    /**
    * 单选框
    */
    checkedChange = (e) => {
        console.log(e)
        e.target.checked = !e.target.checked;
        this.dispatchFn({
            contractType: this.state.contractType ? 0 : 1
        })
    }
    // 款项切换
    checkedChange2 = (e,val) => {
        e.target.checked = !e.target.checked;
        this.dispatchFn({
            eventType: val,
            paymentSettings: [
                {
                    // payTime: new Date(),
                    reminderTime: new Date(),
                    // payCondition: '',
                    description: ''
                }
            ]
        })
    }
    /**
    * 添加款项组件
    */
    addPayment = () => {
        console.log('添加选项！')
        let obj = {
                    // payTime: new Date(),
                    reminderTime: new Date(),
                    // payCondition: '',
                    description: ''
                },
            { paymentSettings } = this.state;
            paymentSettings.push(obj);
        this.dispatchFn({paymentSettings: paymentSettings});

    }
    // 时间
    dateChange = (date,str) => {
        console.log(date,str)
        this.dispatchFn({
            [str]: date
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
            let { departments ,contractType, eventType ,approver ,payTime,reminderTime , enclosure,paymentSettings} = this.state;
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
                if (!value.title) {
                    dd.device.notification.toast({
                        icon: 'error',
                        text: `合同标题为必填项`, //提示信息
                        duration: 2, 
                    });
                    console.log('标题')

                    return
                } else if (!value.partyName) {

                    dd.device.notification.toast({
                        icon: 'error',
                        text: `当事人为必填项！`, 
                        duration: 2, 
                    });
                    console.log('当事人')
                    return
                } else if (!value.amount || !Number(value.amount)) {
                    dd.device.notification.toast({
                        icon: 'error',
                        text: `请填写正确的合同金额！`, 
                        duration: 2, 
                    });
                    console.log('合同金额')

                    return
                } else if (!value.leaseTerm || !Number(value.leaseTerm)) {
                    dd.device.notification.toast({
                        icon: 'error',
                        text: `请填写正确的租期天数！`, 
                        duration: 2, 
                    });
                    console.log('租期')

                    return
                } else if (!departments.length) {
                    dd.device.notification.toast({
                        icon: 'error',
                        text: `请填写正确的租期天数！`, 
                        duration: 2, 
                    });
                    return
                }
                for (let j = 0;j < paymentSettings.length;j++) {
                    // paymentSettings[j].payTime = this.state[`payTime_${j}`];
                    paymentSettings[j].reminderTime = this.state[`reminderTime_${j}`];
                    // paymentSettings[j].payCondition = value[`payCondition_${j}`];
                    paymentSettings[j].description = value[`description_${j}`];
                }
                // let dept = JSON.parse(localStorage.getItem('dept'));
                dd.device.notification.showPreloader({
                    text: "提交中...", //loading显示的字符，空表示不显示文字
                    showIcon: true, //是否显示icon，默认true
                })
                let url = encodeURIComponent(`${CONFIG_APP_URL}#/detailcontract/`),
                    params = {
                        contractType: contractType,
                        deptId: departments[0].id,
                        deptName: departments[0].name,
                        title: value.title,
                        partyName: value.partyName,
                        eventType: eventType,
                        paymentSettings: paymentSettings,
                        amount: Number(value.amount),
                        leaseTerm: value.leaseTerm,
                        enclosure: enclosure,
                        content: value.content,
                        approver: approver,
                        originatorId: originatorId,
                        originatorName: originatorName,
                        redirectUrl: url
                    }

                /*dd.device.notification.alert({
                    message: JSON.stringify(params) + '---'+JSON.stringify(departments),
                    title: '新增合同参数',
                    buttonName: "确定"
                });
*/



                fetch(`${AUTH_URL}contract/create`,{
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
                                window.location.href = '#/contract';
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
    /* 选取部门 */
    selectionDept = () => {
        mydingready.ddReady({
            context: this,
            setFn: this.dispatchFn,
            ddApiState: 'departments'
        });
    }
    render() {
        let dept = JSON.parse(localStorage.getItem('dept'));
        const { departments,contractType ,eventType ,approver ,enclosure ,addMoneyList,payTime,reminderTime,paymentSettings} = this.state;
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
        // 款项设置
        let paymentSettingsCom = paymentSettings.map((v,inx) => {
            return  <div className="paymentBox">
                        {/* 日期选择器（antd-m） */}
                        {/*<DatePicker
                            mode="date"
                            extra="请选择"
                            value={this.state[`payTime_${inx}`]}
                            onChange={(date) => {this.dateChange(date,`payTime_${inx}`)}}
                        >
                            <List.Item arrow="horizontal" className="f_16">收款时间</List.Item>
                        </DatePicker>*/}
                        {/* 步骤描述 */}
                        <div className="name flex" style={{padding: '0 3vw'}}>
                            <span className="leftText">步骤描述</span>
                            <InputItem 
                               className="inputItem"
                               rows={2}
                               placeholder="步骤简述"
                               {...getFieldProps(`description_${inx}`,{
                                   rules:[{required: false,message:'备注付款条件'}]
                               })}
                            ></InputItem> 
                        </div>
                        <div className="line_gray"></div>
                        <DatePicker
                            mode="date"
                            extra="请选择"
                            value={this.state[`reminderTime_${inx}`]}
                            onChange={(date) => {this.dateChange(date,`reminderTime_${inx}`)}}
                        >
                            <List.Item arrow="horizontal" className="f_16">提醒时间</List.Item>
                        </DatePicker>
                        {/*<div className="line_gray"></div>
                        <div className="name flex" style={{padding: '0 3vw'}}>
                            <span className="leftText">付款条件</span>
                            <InputItem 
                               className="inputItem"
                               rows={2}
                               placeholder="备注付款条件"
                               {...getFieldProps(`payCondition_${inx}`,{
                                   rules:[{required: false,message:'备注付款条件'}]
                               })}
                            ></InputItem> 
                        </div>*/}
                        <div className="line_box"></div>
                    </div>
        })
        return (
            <div className="addcontract">
                {/*<p className="title">合同类型</p>
                <div className="listHeight flex">
                    <div className="checkeBox flex">
                        <Checkbox className="checkeList" checked={!contractType} onChange={this.checkedChange} />
                        <span>标准化</span>
                    </div>
                    <div className="checkeBox flex">
                        <Checkbox className="checkeList" checked={contractType} onChange={this.checkedChange} />
                        <span>非标准化</span>
                    </div>
                </div>*/}
                <p className="title">基本信息</p>
                <div className="listHeight flex" onClick={this.selectionDept}>
                    <span className="leftText f_14 color_gray">部门</span>
                    {/*<div className="f_14">{dept ? dept.deptName : ''}</div>*/}
                    <div className="f_14">{departments.length ?  departments[0].name : ''}</div>
                </div>
                <div className="line_gray"></div>
                <div className="name">
                    <TextareaItem 
                        style={{height: 'auto',background: '#fff'}}
                        rows={2}
                        placeholder="合同标题（必填）"
                        {...getFieldProps('title',{
                            rules:[{required: false,message:'请输入合同标题！'}]
                        })}
                    ></TextareaItem> 
                </div>
                <div className="line_gray"></div>
                <div className="name flex" style={{padding: '0 3vw'}}>
                    <span className="leftText f_16">当事人</span>
                    <InputItem 
                        className="inputItem"
                        rows={2}
                        placeholder="合同当事人（必填）"
                        {...getFieldProps('partyName',{
                            rules:[{required: false,message:'请输入合同当事人！'}]
                        })}
                    ></InputItem> 
                </div>
                <div className="line_gray"></div>
                <div className="listHeight flex">
                    <div className="checkeBox flex">
                        <Checkbox className="checkeList" checked={eventType == 0 ? true : false} onChange={(e) => this.checkedChange2(e,0)} />
                        <span>无</span>
                    </div>
                    <div className="checkeBox flex">
                        <Checkbox className="checkeList" checked={eventType == 1 ? true : false} onChange={(e) => this.checkedChange2(e,1)} />
                        <span>收款</span>
                    </div>
                    <div className="checkeBox flex">
                        <Checkbox className="checkeList" checked={eventType == 2 ? true : false} onChange={(e) => this.checkedChange2(e,2)} />
                        <span>付款</span>
                    </div>
                    <div className="checkeBox flex">
                        <Checkbox className="checkeList" checked={eventType == 3 ? true : false} onChange={(e) => this.checkedChange2(e,3)} />
                        <span>收付款</span>
                    </div>
                </div>
                <div className={!eventType ? 'paymentSetting isHide' : 'paymentSetting'}>
                    <p className="title">合同步骤</p>
                    <img className="fileIcon selectedBtn" src={`${IMGCOMMONURI}add_small.png`} onClick={this.addPayment} />
                    {/* 付款和收款时 paymentBox */}
                    {/*<div className="paymentBox">
                        <div className="payMentList">
                           <div className="listHeight flex_bc">
                               <span className="leftText">付款时间</span>
                               <div className="flex_ec paySelect" onClick={() => this.selectedDate('payTime')}>
                                   <span className="color_gray">请选择</span>
                                   <img className="fileIcon" src={`${IMGCOMMONURI}common_level2_icon_bg_color.png`} />
                               </div>
                           </div>
                           <div className="line_gray"></div>
                           <div className="listHeight flex_bc">
                               <span className="leftText">提醒时间</span>
                               <div className="flex_ec paySelect" onClick={() => this.selectedDate('reminderTime')}>
                                   <span className="color_gray">请选择</span>
                                   <img className="fileIcon" src={`${IMGCOMMONURI}common_level2_icon_bg_color.png`} />
                               </div>
                           </div>
                           <div className="line_gray"></div>
                           <div className="name flex" style={{padding: '0 3vw'}}>
                               <span className="leftText f_16">付款条件</span>
                               <InputItem 
                                   className="inputItem"
                                   rows={2}
                                   placeholder="备注付款条件"
                                   {...getFieldProps('payCondition',{
                                       rules:[{required: false,message:'备注付款条件'}]
                                   })}
                               ></InputItem> 
                           </div>
                        </div>
                    </div>*/}
                    {paymentSettingsCom}
                </div>
                <div className="name flex" style={{padding: '0 3vw'}}>
                    <span className="leftText f_16">合同金额</span>
                    <InputItem 
                        className="inputItem"
                        rows={2}
                        placeholder="请填写合同金额（必填）"
                        {...getFieldProps('amount',{
                            rules:[{required: false,message:'请填写合同金额'}]
                        })}
                    ></InputItem> 
                </div>
                <div className="line_gray"></div>
                <div className="name flex" style={{padding: '0 3vw'}}>
                    <span className="leftText f_16">租期</span>
                    <InputItem 
                        className="inputItem"
                        rows={2}
                        placeholder="请填写租期天数（非必填）"
                        {...getFieldProps('leaseTerm',{
                            rules:[{required: false,message:'请填写租期天数（非必填）'}]
                        })}
                    ></InputItem> 
                </div>
                <div className="line_gray"></div>
                <p className="title">上传附件</p>
                <div className="fileBox">
                    {enclosureCom}
                    <div className="file" onClick={() => this.toDdJsApi('uploadFile')}>
                        <img className="fileIcon selectedBtn" src={`${IMGCOMMONURI}z z.png`} />
                        <p>上传附件</p>
                    </div>
                </div>
                <p className="title">合同主要内容或说明(选填)</p>
                <TextareaItem 
                    className="textArea"
                    rows={5}
                    onBlur={(e) => {console.log(e)}}
                    placeholder="请填写合同主要内容"
                    {...getFieldProps('content',{
                        rules:[{required: false,message:'此处输入备注、补充审批等信息！'}]
                    })}
                ></TextareaItem> 
                <div className="line_box"></div>
                <div className="selectedMan selectedMan_addCon">
                    <p>审批人</p>
                    <div className="manArr">
                        {approverCom}
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
