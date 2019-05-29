require('./PageWaitingapproval.less');
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


class Waitingapproval extends Component {
    constructor(props) { 
        super(props, logic);        
        mydingready.ddReady({pageTitle: '待我审批'});
    }
    componentDidMount () {
        this.getTenderingList({state: 'CHECKING'});
    }
    /**
    * 发送自定义事件（设置state）
    */
    dispatchFn = (val) => {
        this.dispatch('setStateData',val)
    }
    /**
    * 获取审批列表
    * 接口路径 /summary/need_me_approval/
    */
    getTenderingList = ({state ,searchWord }) => {
        let userId = mydingready.globalData.userId ? mydingready.globalData.userId 
                                                   : localStorage.getItem('userId');
        let url = searchWord ? `${AUTH_URL}summary/need_me_approval?state=${state}&userId=${userId}&searchWord=${searchWord}&pageNum=1&pageSize=1000`
                             : `${AUTH_URL}summary/need_me_approval?state=${state}&userId=${userId}&pageNum=1&pageSize=1000`
        fetch(url)
        .then(res => res.json())
        .then(data => {
            /*dd.device.notification.alert({
                message: "数据加载成功" + JSON.stringify(data),
                title: "警告",
                buttonName: "确定"
            });*/
            if (data.state == 'SUCCESS') {
                this.dispatchFn({listData: data.values.approvalList});
                this.dispatchFn({
                    pageInfo: {
                        pageNum: 1,
                        pageSize: 1000,
                        searchWord: '',
                        // CHECKING-待审核;PASS-通过;REBUT-驳回;
                        state: state,
                        userId: null
                    },
                });
                
              /*dd.device.notification.toast({
                    icon: 'success', //icon样式，有success和error，默认为空
                    text: '数据加载成功', //提示信息
                    duration: 1, //显示持续时间，单位秒，默认按系统规范[android只有两种(<=2s >2s)]
                });*/
                return
            }

        })
    }

    render() {
        let { tabs , listData ,searchVal ,textType} = this.state;
       
        const tabNode = tabs.forEach( (v,inx) => {
            return <span>{v.title}</span>
        });
        /*listData = [{
        	// contractId: 32,
        	// innerAuditId: 9,
        	biddingId: 77,
			type: "合同",
			title: '合同标题',
			creatorName: '老大爷',
			createTime: '2019-05-14T10:36:39'
        }]*/
        let listCom = listData.map(v => {
            if (!v) return;
        	let url, name, type, title;
        	// 合同详情
        	if (v.contractId) {
				url = `/detailcontract/${v.contractId}`;
                title = v.title;
            }   
            // 内审审批详情
            if (v.innerAuditId) {
                url = `/detailauditapprove/${v.innerAuditId}`;
                title = v.title;
            }
            // 招投标详情
            if (v.biddingId) {
                url = `/detailtendering/${v.biddingId}`;
                title = v.biddingName;
        	}
            if (v.windControlApplicationId) title = v.applyEvent;
        	if (!v.creatorName || !v.originatorName || !v.originatorName) name = '未获取到创建人';
            if (v.creatorName) name = v.createTime;
            if (v.originatorName) name = v.originatorName;
            return  <Link to={url}>
            			<div className="listBox" onClick={()=>{localStorage.setItem('checking_type',v.type);localStorage.setItem('REBUT','REBUT');}}>
	                       	<div className="list">
	                            <div className="tenderingTitle flex">
	                                <span>类型</span>
	                                <p>{v.type}</p>
	                            </div>
	                        </div>
	                        <div className="line"></div> 
	                        <div className="list">
	                            <div className="tenderingTitle flex">
	                                <span>标题</span>
	                                <p className='textOverflow_1'>{title}</p>
	                            </div>
	                        </div>
	                        <div className="line"></div>    
	                        <div className="list">
	                            <div className="tenderingTitle flex">
	                                <span>提交人</span>
	                                <div className="manArr">
	                                 	<div className="box_b manBox">
				                            <div className="color_b textOverflow_1">{name}</div>
				                        </div>
	                                </div>
	                            </div>
	                        </div>
	                        <div className="line"></div>    
	                        <div className="list">
	                            <div className="tenderingTitle flex">
	                                <span>提交时间</span>
	                                <p>{moment(v.createTime).format('YYYY.MM.DD HH:mm')}</p>
	                            </div>
	                        </div>
            			</div>
                    </Link>
                 
        })
        return (
            <div className="auditapprove">
            	<Tabs tabs={tabs}
                    initialPage={0}
                    onChange={(tab, index) => this.getTenderingList({state: tab.state})}
                    onTabClick={(tab, index) => console.log(tab.state)}
                >
                    <div className="tabBody">
                        <SearchBar className="searchBox" placeholder="审批人/投标名称" 
                            value={searchVal}
                            onSubmit={this.goSearch} 
                            onBlur={this.searchBlur}
                            onChange={this.searchChange}
                        /> 
                        {listData.length ? listCom : '暂无数据'}
                    </div>
                    <div className="tabBody">
                        <SearchBar className="searchBox" placeholder="审批人/投标名称" 
                            value={searchVal}
                            onSubmit={this.goSearch} 
                            onBlur={this.searchBlur}
                            onChange={this.searchChange}
                        /> 
                        <div>
                            {listData.length ? listCom : '暂无数据'}
                        </div>
                    </div>
                    <div className="tabBody">
                        <SearchBar className="searchBox" placeholder="审批人/投标名称" 
                            value={searchVal}
                            onSubmit={this.goSearch} 
                            onBlur={this.searchBlur}
                            onChange={this.searchChange}
                        /> 
                        <div>
                            {listData.length ? listCom : '暂无数据'}
                        </div>
                    </div>
                </Tabs>
            </div>
        );
    }

}

export default Waitingapproval ;
