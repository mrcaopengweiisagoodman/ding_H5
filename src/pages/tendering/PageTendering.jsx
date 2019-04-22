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
		/*this.dispatch('setStateData',{
			pageInfo: {
				pageNum: 1,
				pageSize: 10,
				searchWord: '',
				// CHECKING-待审核;PASS-通过;REBUT-驳回;
				state: 'CHECKING',
				userId: mydingready.globalData.userId
			},
		};*/
		this.getTenderingList({state: 'CHECKING'});
		
    }
	componentDidMount () {

		// this.autoFocusInst.focus();
	}
	/**
	* 获取招投标列表
	*/
	getTenderingList = ({state ,searchWord }) => {
		let userId = mydingready.globalData.userId;
		fetch(`${AUTH_URL}bidding/gain/type?state=${state}&userId=${userId}&searchWord=${searchWord}&pageNum=1&pageSize=1000`)
		.then(res => res.json())
		.then(data => {
			dd.device.notification.alert({
				message: "列表请求成功！" + JSON.stringify(data),
				title: "提示信息",
				buttonName: "确定"
			});
		})
	}
	/**
	 * 搜索
	 */
	goSearch = (val) => {
		console.log('文本框内容',val)
	}
	/*
	* 离焦
	 */
	searchBlur = () => {
		this.dispatch('setSearchVal','');
		console.log('离开焦点')

	}
	/**
	 * 文本输入变化
	 */
	searchChange = (e) => {
		this.dispatch('setSearchVal',e);
	}

    render() {
		const { tabs,searchVal } = this.state;
		const tabNode = tabs.forEach( (v,inx) => {
			return <span>{v.title}</span>
		})
        return (
            <div className="tendering">
				{/* 招投标页面 */}
				<Tabs tabs={tabs}
					initialPage={0}
					onChange={(tab, index) => { console.log('onChange', index, tab); }}
					onTabClick={(tab, index) => { console.log('onTabClick', index, tab); }}
				>
					<div className="tabBody">
						{/* <SearchBar className="searchBox" placeholder="审批人/投标名称" onSubmit={this.goSearch} onFocus={this.searchFocus} /> */}
						<SearchBar className="searchBox" placeholder="审批人/投标名称" 
							value={searchVal}
							onSubmit={this.goSearch} 
							onBlur={this.searchBlur}
							onChange={this.searchChange}
						/> 
						<Link to="/detailtendering/111" className="listBox">
							<div className="list">
								<div className="tenderingTitle">
									<div>招投标名称</div>
									<span className="h2">我是招投标的名称:杭州拱墅区哇哈哈团队招投标了</span>
								</div>
								<p>
									内容：国王湖(Königssee)位于德奥边境，四周被阿78787a78787a78787a绕，被认为是最干净和最美丽
									内容：国王湖(Königssee)位于德奥边境，四周被阿尔卑斯山脉围绕，被认为是最干净和最美
								</p>
								<div className="line"></div>	
								<div className="tenderingDetail">
									<span>审批人</span>	
									<div className="flex">
										<div className="blueBox_">销量牛</div>	
										{/* <span style={{fontSize: "2rem"}}>></span> */}
										<img src={`${IMGCOMMONURI}common_level2_icon_bg_color.png`} />
									</div>
								</div>
							</div>
						</Link>
						<Link to="/detailtendering" className="listBox">
							<div className="list">
								<div className="tenderingTitle">
									<div>招投标名称</div>
									<span className="h2">我是招投标的名称:杭州拱墅区哇哈哈团队招投标了</span>
								</div>
								<p>
									内容：国王湖(Königssee)位于德奥边境，四周被阿78787a78787a78787a绕，被认为是最干净和最美丽
									内容：国王湖(Königssee)位于德奥边境，四周被阿尔卑斯山脉围绕，被认为是最干净和最美
								</p>
								<div className="line"></div>	
								<div className="tenderingDetail">
									<span>审批人</span>	
									<div className="flex">
										<div className="blueBox_">销量牛</div>	
										{/* <span style={{fontSize: "2rem"}}>></span> */}
										<img src={`${IMGCOMMONURI}common_level2_icon_bg_color.png`} />
									</div>
								</div>
							</div>
						</Link>
					</div>
					<div className="tabBody">
						<SearchBar className="searchBox" placeholder="审批人/投标名称" 
							value={searchVal}
							onSubmit={this.goSearch} 
							onBlur={this.searchBlur}
							onChange={this.searchChange}
						/> 
						<div>
							222222
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
							333333
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
   