// 风控进入申请
require('./PageApply.less');
import logic from './PageLogic';
import { Component, LogicRender } from 'refast';  
import moment from 'moment';
import { 
    Tabs, 
    WhiteSpace ,
    WingBlank,
    Badge,
    SearchBar,
    List
} from 'antd-mobile';
// import logic from './PageLogic';
import {
    Link,
    Control
} from 'react-keeper';
import mydingready from './../../dings/mydingready';
import testJson from './../../test_json/contract';
const { AUTH_URL , IMGCOMMONURI } = require(`config/develop.json`);

const TabPane = Tabs.TabPane;
const Item = List.Item;


class Apply extends Component {
    constructor(props) { 
        super(props, logic);        
        mydingready.ddReady({pageTitle: '风控申请'});
    }
    componentDidMount () {
        this.getApply(this.state.type);
    }
    /**
    * 发送自定义事件（设置state）
    */
    dispatchFn = (val) => {
        this.dispatch('setStateData',val)
    }
    /**
    * 获取合同列表
    */
    getApply = (type) => {
        console.log(type)
        let userId = localStorage.getItem('userId'),
            { listData, pageInfo } = this.state;
        fetch(`${AUTH_URL}wind_control/gain?pageNum=${pageInfo.pageNum}&pageSize=${pageInfo.pageSize}&userId=${userId}`,{
        	method: 'GET'
        })
        .then(res => res.json())
        .then(data => {
           /* dd.device.notification.alert({
                message: "合同列表获取！" + JSON.stringify(data),
                title: "提示",
                buttonName: "确定"
            });*/
            if (data.state == 'SUCCESS') {
                this.dispatchFn({ listData: data.values.list.list });
                return
            };
            dd.device.notification.toast({
                icon: 'error', //icon样式，有success和error，默认为空
                text: '获取信息失败！', //提示信息
                duration: 2, //显示持续时间，单位秒，默认按系统规范[android只有两种(<=2s >2s)]
            })
        })

    }
    /**
    * 添加关联合同
    * @param [String] pid 父合同id
    * @param [String] pTitle 父合同标题
    */
    goRelation = (e,pid,pTitle) => {
        e.stopPropagation();
        Control.go(`/addcontractrelation/${pid}/${encodeURI(pTitle)}`);
    }
    render() {
        const { listData} = this.state;
        let listCom = listData.map(v => {
	          
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
	            }, {
	               spaceId: "232323",
	               fileId: "DzzzzzzNqZY",
	               fileName: "审批流程1.pdf",
	               fileSize: 1024,
	               fileType: "pdf"
	            },];
	        let enclosureCom = a.map(v => {*/
	        let enclosureCom = JSON.parse(v.enclosure).map(v => {
	            let fileTypeImg, 
	                fileTypeImgArr = ['ppt.png','ppt.png','excel.png','excel.png','word.png','word.png'];
	            let i = ['ppt','pptx','xls','xlsx','doc','docx'].indexOf(v.fileType);
	            i != -1 ? fileTypeImg = fileTypeImgArr[i] : fileTypeImg = 'unknown.png';
	            return <div className="file">
	                        <img className="fileIcon" src={`${IMGCOMMONURI}${fileTypeImg}`} />
	                        <span className="textOverflow_1">{v.fileName}</span>
	                    </div>
	        })
            return  <div className="listBox">
                        <Link to={`/detailapply/${v.windControlApplicationId}`}>
                            <div className="list">
                                <div className="tenderingTitle flex">
                                    <span>发起人</span>
                                    <p>{v.originatorName}</p>
                                </div>
                            </div>
                            <div className="line"></div> 
                            <div className="list">
                                <div className="tenderingTitle flex">
                                    <span>附件</span>
                                    <div className="fileBox">{JSON.parse(v.enclosure).length ? enclosureCom : '暂无附件'}</div>
                                </div>
                            </div>
                            <div className="line"></div> 
                           	<div className="list">
                                <div className="tenderingTitle flex">
                                    <span>申请事项</span>
                                    <p>{v.type}</p>
                                </div>
                            </div>
                        </Link>
                    </div>
        })
        return (
            <div className="contract">
               {/* <Tabs tabs={tabs}
                    initialPage={0}
                    onChange={(tab, index) => this.getApply(tab.state)}
                    onTabClick={(tab, index) => this.getApply(tab.state)}
                >
                </Tabs>*/}
                    <div className="standard">
                        {listCom}
                    </div>
                   
                <Link type='img' src={`${IMGCOMMONURI}add_big.png`} className='addTenderingBtn' to={ '/addapply' } />
            </div>
        );
    }

}

export default Apply ;
