// 部门合同列表页面
require('./PageDeptcontractlists.less');
import logic from './PageLogic';
import { Component, LogicRender } from 'refast';  
import { 
    Tabs, 
  	DatePicker,
    SearchBar,
    List,
    Checkbox
} from 'antd-mobile';
// import logic from './PageLogic';
import {
    Link,
    Control
} from 'react-keeper';
import mydingready from './../../dings/mydingready';
import testJson from './../../test_json/contract';
import { createForm } from 'rc-form';
import moment from 'moment';

const { AUTH_URL , IMGCOMMONURI } = require(`config/develop.json`);



class DeptcontractlistsForm extends Component {
    constructor(props) { 
        super(props, logic);        
        mydingready.ddReady({pageTitle: '合同列表'});
    }
      /**
    * 发送自定义事件（设置state）
    */
    dispatchFn = (val) => {
        this.dispatch('setStateData',val)
    }
    componentDidMount () {
    	this.getDeptContractList({isFirst: true});
    }
   	timeChangeMoment = (str) => {
    	return moment(str).format('YYYY-MM-DD HH:mm:ss');
    }
    /**
    * 获取部门数据列表
    * @param [Boolean] isFirst 是否是刚进入该页面
    * @param [Object]  dataSet 需要设置的数据
    */
    getDeptContractList = ({isFirst, startTime ,endTime,searchWord}) => {
    	let startTime1 ,endTime1;
    	let { deptId } = this.state,
    		params = `deptId=${this.props.params.deptId}&pageNum=1&pageSize=1000`;
		if (this.timeChangeMoment(this.state.startTime) > this.timeChangeMoment(this.state.endTime)) {
			startTime = this.state.endTime;
			endTime = this.state.startTime;
		} 
		if (this.timeChangeMoment(startTime) > this.timeChangeMoment(endTime)) {
			startTime1 = startTime;
			endTime1 = endTime;
			startTime = endTime1;
			endTime = startTime1;
		} 
    	if (searchWord) {params += `&searchWord=${searchWord}`};
    	if (startTime) {params += `&startTime=${this.timeChangeMoment(startTime)}`};
    	if (this.state.startTime && !startTime) {params += `&startTime=${this.timeChangeMoment(this.state.startTime)}`};
    	if (endTime) {params += `&endTime=${this.timeChangeMoment(endTime)}`};
    	if (this.state.endTime && !endTime) {params += `&startTime=${this.timeChangeMoment(this.state.endTime)}`};
    	fetch(`${AUTH_URL}internal/audit/search?${params}`)
        .then(res => res.json())
        .then(data => {
            /*dd.device.notification.alert({
                message: "合同详情数据" + JSON.stringify(data),
                title: "提示",
                buttonName: "确定"
            })*/
            if (data.state == 'SUCCESS') {
            	params = `deptId=${this.props.params.deptId}&pageNum=1&pageSize=1000`;
                this.dispatchFn({
                    searchVal: searchWord ? searchWord : '',
                    listData: data.values.list.list,
                  /*  startTime: startTime ? startTime : this.state.startTime,
                    endTime: endTime ? endTime : this.state.endTime*/
                });

            }
        })
    }
     /**
     * 搜索
     */
    goSearch = (val) => {
        console.log('文本框内容',val,this.state.searchVal)
        this.getDeptContractList({
            searchWord: val
        })
    }
    /*
    * 离焦
     */
    searchBlur = (e) => {
        // this.dispatch('setStateData',{searchVal: ''});
    }
    /**
     * 文本输入变化
     */
    searchChange = (e) => {
        this.dispatch('setStateData',{searchVal: e});
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
      /**
    * 选择开始时间/结束时间
    * @param [String] date    选择的日期
    * @param [String] timeStr 选择的时间是开始时间还是结束时间 
    */
    timeChange = (date, timeStr) => {
    	let { isTimeBox, startTime ,endTime } = this.state;
    	console.log(date,timeStr)
    	// if (startTime && timeStr == 'endTime') {
    	// 	startTime > date ? 
    	// }
    	this.dispatchFn({
    		[timeStr]: date
    	})
    	this.getDeptContractList({
    		[timeStr]: date
    	});
    }

    render() {
    	const { searchVal,listData ,isTimeBox ,startTime ,endTime} = this.state;
	   	let listCom = listData.map(v => {
            let paymentTimeCom = JSON.parse(v.paymentSettings).map(a => {
                return  <div className="list">
                            <div className="tenderingTitle flex">
                                <span>付款期限</span>
                                <p>{moment(a.payTime).format('YYYY.MM.DD HH:mm')}</p>
                            </div>
                        </div>
            });
            return  <div className="listBox">
                        <Link to={`/detailcontract/${v.contractId}`}>
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
         // <div onClick={(e)=>{this.goRelation(e,v.contractId,v.title)}}>关联合同审批</div>
        return (
            <div className="deptcontract">
            	<div className="top">
	         	 	<SearchBar className="searchBox" placeholder="合同标题等信息" 
	                    value={searchVal}
	                    onSubmit={this.goSearch} 
	                    onBlur={this.searchBlur}
	                    onChange={this.searchChange}
	                /> 
	                {/* 时间选择器 */}
	                <div style={{positon: 'relative',padding: '2vw 0',background: '#F6F6F6',zIndex: 10000}}>
		                <div className="timeBox timeBox2"></div>
		                <div className="flex timeBox">
							<DatePicker
								className="picker"
								mode="date"
					         	value={this.state.startTime}
					          	onOk={date => {this.timeChange(date,'startTime')}}
					        >
								<p className={startTime ? "color_b2 startTime" : 'color_gray2 startTime'}>{startTime ? moment(startTime).format('YYYY-MM-DD') : '开始时间'}</p>
					        </DatePicker>
							<span>至</span>
							<DatePicker
								className="picker"
								classNames="selectTimeEnd"
								mode="date"
					         	value={this.state.date}
					          	onOk={date => {this.timeChange(date,'endTime')}}
					        >
								<p className={endTime ? "color_b2" : 'color_gray2'}>{endTime ? moment(endTime).format('YYYY-MM-DD') : '结束时间'}</p>
					        </DatePicker>
		                </div>
	                </div>
            	</div>
                <div className="bottom">
                	<div className="listBox">
                       {/* <Link to={`/detailcontract/5`}>
                            <div className="list">
                                <div className="tenderingTitle flex">
                                    <span>当事人</span>
                                    <p>sdfhskjdfhdfk张三、李四、王五、赵六、冯七、曹八</p>
                                </div>
                            </div>
                            <div className="line"></div>    
                            <div className="list">
                                <div className="tenderingTitle flex">
                                    <span>付款期限</span>
                                    <p>2019.05.01 10:10</p>
                                </div>
                            </div>
                            <div className="line"></div>    
                            <div className="list">
                                <div className="tenderingTitle flex">
                                    <span>租期</span>
                                    <p>20天</p>
                                </div>
                            </div>
                            <div className="line"></div>    
                            <div className="list">
                                <div className="tenderingTitle flex">
                                    <span>付款金额</span>
                                    <p>10000元</p>
                                </div>
                            </div>
                        </Link>*/}
                        <div className="box_b color_b" onClick={(e) => {this.goRelation(e,30,'父合同标题')}}>关联合同审批</div>
                	</div>          
                	{listCom}
                </div>
            </div>
        );
    }
}
const Deptcontractlists = createForm()(DeptcontractlistsForm);
export default Deptcontractlists ;
