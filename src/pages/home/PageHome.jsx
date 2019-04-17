// 连接view 和 state的进行业务处理的Page组件
require('./PageHome.less');
// import jsapi from './../../dings/jsapi.json';
import logic from './PageLogic';
import $ from "jquery";



import mydingready from './../../dings/mydingready';




import { 
	Control,
	Route,
	Link
} from 'react-keeper';
import { Component, LogicRender } from 'refast';

import TabBar, { activeTabbar } from 'components/card-tabbar';
import { 
	Flex ,
	WhiteSpace ,
	NavBar ,
	Toast
} from 'antd-mobile';


class Home extends Component {
    constructor(props) {
		super(props, logic);        
        this.handleChange = this.handleChange.bind(this);
		// this.ddFn();
		mydingready.ddReady({pageTitle: '风控'});
    }
	componentDidMount () {
		console.log('component周期函数---')
	}
    handleChange(key){
        this.dispatch('setTabbarIndex',key);
		// state在PageLogic.js中定义
        Control.go(this.state.menu[key].path, ); // keeper的跳转
    }
	stateLocation = () => {
		let res = mydingready.ddReady({
			context: this,
			ddApiState: 'weizhi'
		});
		// let res = mydingready.ddReady(this,'weizhi');
		console.log(res)
		dd.device.notification.alert({
			message: "位置啊: " + JSON.stringify(res),
			title: "点击获取位置",
			buttonName: "OK"
		});
	}
	stateContact = () => {
		let res = mydingready.ddReady({
			context: this,
			ddApiState: 'lianxiren'
		});
		dd.device.notification.alert({
			message: "点击选取联系人: " + JSON.stringify(res),
			title: "点击选取联系人Huooo",
			buttonName: "OK"
		});
	}
    render() {
        const { state: { menu, tabbarIndex, badge, },  } = this;
      
        return (
            <div className="home">
			{/* <div onClick={this.contacts} style={{height: "100px"}}>选择内部联系人</div> */}
				<div onClick={this.stateContact} style={{height: "100px"}}>选择内部联系人</div>
				<div onClick={this.stateLocation} style={{height: "100px"}}>获取位置</div>

				<Link className="navList approvalNav" to="/pageApproval">
					{/* 正式环境图片的路径 */}
					{/*<img src="imgs/dsp.png" />*/}
					<img src="src/assets/imgs/dsp.png" />
					<p>待我审批</p>
					<div>12</div>	
				</Link>
				<div className="rectangle"></div>
				<Flex wrap="wrap">
					<Link className="navList" to="/tendering">
						{/*<img src="imgs/ztb.png" /> */}
						<img src="src/assets/imgs/ztb.png" />
						<p>招投标</p>
						<div>12</div>	
					</Link>
					<Link className="navList" to="/contract">
						{/* <img src="imgs/ht.png" /> */}
						<img src="src/assets/imgs/ht.png" />
						<p>合同</p>
						<div>12</div>	
					</Link>
					<Link className="navList" to="/audit">
						{/* <img src="imgs/ns.png" /> */}
						<img src="src/assets/imgs/ns.png" /> 
						<p>年审</p>
						<div>12</div>	
					</Link>
				</Flex>
				
				{/* 选择联系人测试 */}
				
				
                {/*中间嵌套的页面*/}
                {/* {this.props.children} */}
               {/* <TabBar menu={menu} tabbarIndex={tabbarIndex} badge={badge} onChange={this.handleChange} /> */}
				
            </div>
        );
    }

    componentDidMount() {
		console.log(this.state)
    }
}

export default Home ;
