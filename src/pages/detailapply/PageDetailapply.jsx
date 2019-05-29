// 合同详情
require('./PageDetailapply.less');
import logic from './PageLogic';
import { Component, LogicRender } from 'refast';  
import mydingready from './../../dings/mydingready';
import moment from 'moment';
import {
    Control,
    Link
} from 'react-keeper';
const { AUTH_URL, IMGCOMMONURI } = require(`config/develop.json`);


class Detailapply extends Component {
    constructor(props) { 
        super(props, logic);        
        mydingready.ddReady({pageTitle: '风控进场详情'});
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
        fetch(`${AUTH_URL}wind_control/info/${id}`)
        .then(res => res.json())
        .then(data => {
            if (data.state == 'SUCCESS') {
                this.dispatchFn({
                    detailData: data.values.info,
                    enclosure: JSON.parse(data.values.info.enclosure),
                    approver: JSON.parse(data.values.info.approver)
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
  	
    render() {
        let administrators = [],
            myUserId = localStorage.getItem('userId');

        let { detailData ,enclosure ,approver} = this.state;
          
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
            console.log(detailData)
        let enclosureCom = a.map(v => {*/
        let enclosureCom = enclosure.map(v => {
            let fileTypeImg, 
                fileTypeImgArr = ['ppt.png','ppt.png','excel.png','excel.png','word.png','word.png'];
            let i = ['ppt','pptx','xls','xlsx','doc','docx'].indexOf(v.fileType);
            i != -1 ? fileTypeImg = fileTypeImgArr[i] : fileTypeImg = 'unknown.png';
            return <div className="file" onClick={() => this.previewFile(v)}>
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
        if (detailData) {
            return (
                <div className="addcontract detailcontract">
                    <div className="listHeight flex">
                        <span className="leftText f_14 color_gray">申请事项</span>
                        <div>{detailData.applyEvent}</div>
                    </div>
                    <div className="line_gray"></div>
                    <div className="selectedMan bg_ff">
                        <p className="color_gray">审批人</p>
                        <div className="manArr detailManArr">
                            {approverCom}
                        </div>
                    </div>
                    <div className="line_gray"></div>
                    <p className="title">相关附件</p>
                    <div className="fileBox">
                        {enclosureCom}
                    </div>
                    <div className="line_gray"></div>
                    <div className="listHeight flex">
                        <span className="leftText f_14 color_gray">提交时间</span>
                        <div>{moment(detailData.createTime).format('YYYY.MM.DD HH:mm')}</div>
                    </div>
                </div>
            )
        } else {
            return (
                <div></div>
            )
        }
    }

}
export default Detailapply ;
