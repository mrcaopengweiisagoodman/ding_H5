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
const { AUTH_URL ,IMGCOMMONURI } = require(`config/develop.json`);


class Home extends Component {
    constructor(props) {
		super(props, logic);        
		mydingready.ddReady({pageTitle: '风控'});
    }
    componentDidMount () {
    	this.getCount();
    }
      /**
    * 发送自定义事件（设置state）
    */
    dispatchFn = (val) => {
        this.dispatch('setStateData2',val)
    }
    /*
    * 获取待审核文件的数量
    */
    getCount = () => {
	   	fetch(`${AUTH_URL}summary/count/need_me_approval?userId=${localStorage.getItem('userId')}`)
        .then(res => res.json())
        .then(data => {
            if (data.state == 'SUCCESS') {
              	this.dispatchFn({count: data.values.pageInfos.total});
            }
        })
    }
    render() {
        const { state: { menu, tabbarIndex, badge, count}  } = this;
		mydingready.ddReady({ddApiState: 'getUser'});
		console.log(count)
      	
        return (
            <div className="home">
			{/* <div onClick={this.contacts} style={{height: "100px"}}>选择内部联系人</div> */}

				<Link className="navList approvalNav" to="/waitingapproval">
					{/* 正式环境图片的路径 */}
					<img src={`${IMGCOMMONURI}dsp.png`} />
					<p>待我审批</p>
					<div className={count ? '' : 'isHide'}>{count}</div>	
				</Link>
				<div className="rectangle"></div>
				<Flex wrap="wrap">
					<Link className="navList" to="/tendering">
						<img src={`${IMGCOMMONURI}ztb.png`} />
						<p>招投标</p>
					</Link>
					<Link className="navList" to="/contract">
						<img src={`${IMGCOMMONURI}ht.png`} />
						<p>合同</p>
					</Link>
					<Link className="navList" to="/audit">
						<img src={`${IMGCOMMONURI}ns.png`} />
						<p>内审</p>
					</Link>
					<Link className="navList" to="/apply">
						<img src={`${IMGCOMMONURI}ns.png`} />
						<p>风控进场申请</p>
					</Link>
				</Flex>
				
                {/*中间嵌套的页面*/}
                {/* {this.props.children} */}
               {/* <TabBar menu={menu} tabbarIndex={tabbarIndex} badge={badge} onChange={this.handleChange} /> */}
				
            </div>
        );
    }
}

export default Home ;
