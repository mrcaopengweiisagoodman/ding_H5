// 合同
require('./PageContract.less');
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


class Contract extends Component {
    constructor(props) { 
        super(props, logic);        
        mydingready.ddReady({pageTitle: '合同'});
        this.getContract(this.state.type);
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
    getContract = (type) => {
        console.log(type)
        let userId = localStorage.getItem('userId'),
            { listData, pageInfo } = this.state;
        fetch(`${AUTH_URL}contract/gain/type/${type}?pageNum=${pageInfo.pageNum}&pageSize=${pageInfo.pageSize}&userId=${userId}`)
        .then(res => res.json())
        .then(data => {
           /* dd.device.notification.alert({
                message: "合同列表获取！" + JSON.stringify(data),
                title: "提示",
                buttonName: "确定"
            });*/
            if (data.state == 'SUCCESS') {
                this.dispatchFn({ listData: data.values.contractList.list });
                return
            };
            dd.device.notification.toast({
                icon: 'error', //icon样式，有success和error，默认为空
                text: '获取合同列表失败！', //提示信息
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
        const { tabs , listData} = this.state;
        const tabNode = tabs.forEach( (v,inx) => {
            return <span>{v.title}</span>
        })
        let listCom = listData.map(v => {
          
            let paymentTimeCom = JSON.parse(v.paymentSettings).map(a => {
                return  <div className="list">
                            <div className="tenderingTitle flex">
                                <span>提醒时间</span>
                                <p>{moment(a.reminderTime).format('YYYY.MM.DD HH:mm')}</p>
                            </div>
                            <div className="tenderingTitle flex">
                                <span>步骤描述</span>
                                <p className="textOverflow_1">{a.description}</p>
                            </div>
                        </div>
            });
            return  <div className="listBox">
                        <Link to={`/detailcontract/${v.contractId}`}>
                            <div className="list">
                                <div className="tenderingTitle flex">
                                    <span>合同编号</span>
                                    <p>{v.code}</p>
                                </div>
                            </div>
                            <div className="line"></div> 
                            <div className="list">
                                <div className="tenderingTitle flex">
                                    <span>当事人</span>
                                    <p>{v.partyName}</p>
                                </div>
                            </div>
                            <div className="line"></div> 

                            {paymentTimeCom}

                            <div className="line"></div>    
                            <div className="list">
                                <div className="tenderingTitle flex">
                                    <span>租期</span>
                                    <p>{v.leaseTerm}天</p>
                                </div>
                            </div>
                            <div className="line"></div>    
                            <div className="list">
                                <div className="tenderingTitle flex">
                                    <span>付款金额</span>
                                    <p>{v.amount}元</p>
                                </div>
                            </div>
                        </Link>
                        <div className="box_b color_b" onClick={(e)=>{this.goRelation(e,v.contractId,v.title)}}>关联合同审批</div>
                    </div>
        })
        return (
            <div className="contract">
               {/* <Tabs tabs={tabs}
                    initialPage={0}
                    onChange={(tab, index) => this.getContract(tab.state)}
                    onTabClick={(tab, index) => this.getContract(tab.state)}
                >
                </Tabs>*/}
                    <div className="standard">
                        {listData.length ? listCom : ''}
                    </div>
                   
                <Link type='img' src={`${IMGCOMMONURI}add_big.png`} className='addTenderingBtn' to={ '/addcontract' } />
            </div>
        );
    }

}

export default Contract ;
