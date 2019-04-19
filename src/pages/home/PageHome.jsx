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
		mydingready.ddReady({pageTitle: '风控'});
    }
    render() {
        const { state: { menu, tabbarIndex, badge, },  } = this;
		mydingready.ddReady({ddApiState: 'getUser'});
      	
        return (
            <div className="home">
			{/* <div onClick={this.contacts} style={{height: "100px"}}>选择内部联系人</div> */}

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
