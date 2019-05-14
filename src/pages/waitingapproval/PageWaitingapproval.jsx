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
    * 接口路径 /summary/
    */
    getTenderingList = ({state ,searchWord }) => {
        let userId = mydingready.globalData.userId ? mydingready.globalData.userId 
                                                   : localStorage.getItem('userId');
        let url = searchWord ? `${AUTH_URL}internal/audit/gain/type?state=${state}&userId=${userId}&searchWord=${searchWord}&pageNum=1&pageSize=1000`
                             : `${AUTH_URL}internal/audit/gain/type?state=${state}&userId=${userId}&pageNum=1&pageSize=1000`
        fetch(url)
        .then(res => res.json())
        .then(data => {
            dd.device.notification.alert({
                message: "数据加载成功" + JSON.stringify(data),
                title: "警告",
                buttonName: "确定"
            });
            if (data.state == 'SUCCESS') {
                this.dispatchFn({listData: data.values.biddings.list});
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
        const { tabs , listData ,searchVal} = this.state;
        let data1 = [{"name":"田ert帅","avatar":"","emplId":"0125056400964069"},{"name":"田帅2","avatar":"","emplId":"0121156400954069"}];
        let approverCom = data1.map(v=>{
        // let approverCom = approver.map(v=>{
            return <div key={v.emplId}>
                        <div className="box_b manBox">
                            <div className="color_b">{v.name}</div>
                        </div>
                    </div>
        });
        const tabNode = tabs.forEach( (v,inx) => {
            return <span>{v.title}</span>
        })
        let listCom = listData.map(v => {
            return  <Link to={`/detailauditapprove/${v.innerAuditId}`} className="listBox">
                        <div className="list">
                            <div className="tenderingTitle flex">
                                <span>标题</span>
                                <p>{v.title}</p>
                            </div>
                        </div>
                        <div className="line"></div>    
                        <div className="list">
                            <div className="tenderingTitle flex">
                                <span>说明</span>
                                <p>{v.content}</p>
                            </div>
                        </div>
                        <div className="line"></div>    
                        <div className="list">
                            <div className="tenderingTitle flex">
                                <span>审批人</span>
                                <div className="manArr">
                                    {approverCom}
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

                        {/*<Link to={`/detailauditapprove/11`} className="listBox">
                            <div className="list">
                              <div className="tenderingTitle flex">
                                  <span>标题</span>
                                  <p>测试标题哦</p>
                              </div>
                            </div>
                            <div className="line"></div>    
                            <div className="list">
                              <div className="tenderingTitle flex">
                                  <span>说明</span>
                                  <p>20天</p>
                              </div>
                            </div>
                            <div className="line"></div>    
                            <div className="list">
                              <div className="tenderingTitle flex">
                                  <span>审批人</span>
                                  <div className="manArr">
                                      {approverCom}
                                  </div>
                              </div>
                            </div>
                            <div className="line"></div>    
                            <div className="list">
                              <div className="tenderingTitle flex">
                                  <span>提交时间</span>
                                  <p>2019-0101-1</p>
                              </div>
                            </div>
                        </Link>*/}
                        {listCom}
                    </div>
                    <div className="tabBody">
                        <SearchBar className="searchBox" placeholder="审批人/投标名称" 
                            value={searchVal}
                            onSubmit={this.goSearch} 
                            onBlur={this.searchBlur}
                            onChange={this.searchChange}
                        /> 
                        <div>
                            {listCom}
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
                            {listCom}
                        </div>
                    </div>
                </Tabs>
                <Link type='img' src={`${IMGCOMMONURI}add_big.png`} className='addTenderingBtn' to={ '/addauditapprove' } />
            </div>
        );
    }

}

export default Waitingapproval ;
