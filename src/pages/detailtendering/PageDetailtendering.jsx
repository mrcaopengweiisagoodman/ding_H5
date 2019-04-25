require('./PageDetailtendering.less');
import logic from './PageLogic';
import { Component, LogicRender } from 'refast';  
import moment from 'moment';
import { TextareaItem } from 'antd-mobile';
import { createForm } from 'rc-form';
import mydingready from './../../dings/mydingready';

const { AUTH_URL,IMGCOMMONURI } = require(`config/develop.json`);



class DetailtenderingForm extends Component {
    constructor(props) { 
        super(props, logic);        
        mydingready.ddReady({pageTitle: '招投标详情'});
        this.getDetail(props.params.id);
    }
    componentDidMount () {

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
                                    type: 1,
                                    userIds: emplIds.join(',')
                               }: params = {
                                    id: id,
                                    content: value.content,
                                    redirectUrl: url,
                                    type: 1,
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
                            window.location.href = '#/tendering';
                            clearTimeout(timer);
                        },2000);
                    }
                })
            }
        });
    }   
    render() {
        let administrators = [],
            myUserId = localStorage.getItem('userId'),
            { id ,detailData , styleInfo ,userIds , messageBoard , emplIds} = this.state;
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
                administrators.push(v.emplId);
                return <div key={v.emplId} style={{margin: '5px 1.5vw'}}>
                            <div className="box_b manBox">
                                <p className="color_b">{v.name}</p>
                            </div>
                        </div>
            });
            let copyPersonCom = copyPerson.map(v=>{
                administrators.push(v.emplId);
                return  <div key={v.emplId} style={{margin: '5px 1.5vw'}}>
                            <div className="box_g manBox">
                                <p className="color_g">{v.name}</p>
                            </div>
                        </div>
            });
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
                    <div className={detailData.approvalState == 'REBUT' ? 'line_gray' : 'isHide'}></div>
                    <div className={detailData.approvalState == 'REBUT' && administrators.indexOf(myUserId) != -1 ? 'selectedMan biddingName' : 'isHide'} style={{padding: '0 3vw'}}> 
                    {/*<div className="biddingName selectedMan"> */}
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
            );
        } else {
            return <div></div>
        }
    }

}
const Detailtendering = createForm()(DetailtenderingForm);
export default Detailtendering ;
