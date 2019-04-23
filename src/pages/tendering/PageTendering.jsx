// 招投标
require('./PageTendering.less');

import { 
	Component, LogicRender 
} from 'refast';  
import { 
	Tabs, 
	WhiteSpace ,
	WingBlank,
	Badge,
	SearchBar,
	List
} from 'antd-mobile';
import logic from './PageLogic';
import {
	Link
} from 'react-keeper';
// import SearchBarMine from '../../components/searchBar/searchbar';
import mydingready from './../../dings/mydingready';
const { AUTH_URL , IMGCOMMONURI } = require(`config/develop.json`);

const TabPane = Tabs.TabPane;
const Item = List.Item;

class Tendering extends Component {
    constructor(props) { 
        super(props, logic);    
		mydingready.ddReady({pageTitle: '招投标'});
		this.getTenderingList({state: 'CHECKING'});
    }
	componentDidMount () {

		// this.autoFocusInst.focus();
	}
	/**
	* 发送自定义事件（设置state）
	*/
	dispatchFn = (val) => {
		this.dispatch('setStateData',val)
	}
	/**
	* 获取招投标列表
	*/
	getTenderingList = ({state ,searchWord }) => {
		let userId = mydingready.globalData.userId ? mydingready.globalData.userId 
												   : localStorage.getItem('userId');
		let url = searchWord ? `${AUTH_URL}bidding/gain/type?state=${state}&userId=${userId}&searchWord=${searchWord}&pageNum=1&pageSize=1000`
							 : `${AUTH_URL}bidding/gain/type?state=${state}&userId=${userId}&pageNum=1&pageSize=1000`
		fetch(url)
		.then(res => res.json())
		.then(data => {
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
				
				dd.device.notification.toast({
				    icon: 'success', //icon样式，有success和error，默认为空
				    text: '数据加载成功', //提示信息
				    duration: 3, //显示持续时间，单位秒，默认按系统规范[android只有两种(<=2s >2s)]
				});
				return
			}

		})
	}
	/**
	 * 搜索
	 */
	goSearch = (val) => {
		console.log('文本框内容',val,this.state.searchVal)
		let { pageInfo , } = this.state;
		this.getTenderingList({
			state: pageInfo.state,
			searchWord: val
		})
	}
	/*
	* 离焦
	 */
	searchBlur = (e) => {
		this.dispatch('setSearchVal','');
	}
	/**
	 * 文本输入变化
	 */
	searchChange = (e) => {
		this.dispatch('setSearchVal',e);
	}
    render() {
		const { tabs, searchVal ,listData} = this.state;
		const tabNode = tabs.forEach( (v,inx) => {
			return <span>{v.title}</span>
		})
		let listCom = listData.map(v => {
			return 	<Link to={`/detailtendering/${v.biddingId}`} className="listBox">
						<div className="list">
							<div className="tenderingTitle">
								<div>招投标名称</div>
								<span className="h2">{v.biddingName}</span>
							</div>
							<p>{v.content}</p>
							<div className="line"></div>	
							<div className="tenderingDetail">
								<span>审批人</span>	
								<div className="flex">
									<div className="blueBox_">{JSON.parse(v.approver)[0].name}</div>	
									<img src={`${IMGCOMMONURI}common_level2_icon_bg_color.png`} />
								</div>
							</div>
						</div>
					</Link>
		})
        return (
            <div className="tendering">
				{/* 招投标页面 */}
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
						<Link to={`/detailtendering/72`} className="listBox">
							<div className="list">
								<div className="tenderingTitle">
									<div>招投标名称</div>
									<span className="h2">v.biddingName</span>
								</div>
								<p>v.content</p>
								<div className="line"></div>	
								<div className="tenderingDetail">
									<span>审批人</span>	
									<div className="flex">
										<div className="blueBox_">JSON.parse(v.approver)[0].name</div>	
										<img src={`${IMGCOMMONURI}common_level2_icon_bg_color.png`} />
									</div>
								</div>
							</div>
						</Link>
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
				{/* 新增页面按钮 */}
				<Link type='img' src={`${IMGCOMMONURI}add_big.png`} className='addTendering' to={ '/addtendering' } />
            </div>
        );
    }
	componentDidMount () {
		
		
	}
}

export default Tendering ;
   