// 连接view 和 state的进行业务处理的Page组件
// 待审批
require('./PendingApproval.less');
import pendingLogic from './PendingLogic';
import { 
	Control,
	Route,
	Link
} from 'react-keeper';
import { Component, LogicRender } from 'refast';

import TabBar, { activeTabbar } from 'components/card-tabbar';
import { NavBar } from 'antd-mobile';


class PendingApproval extends Component {
    constructor(props) {
		dd.ready(()=>{
			dd.biz.navigation.setTitle({ 
				title:'待审批' ,
				onSuccess: res => {
				},
				onFail: res => {
				}
			});
		})
		super(props, pendingLogic);        
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(key){
        this.dispatch('setTabbarIndex',key);
		// state在PageLogic.js中定义
        Control.go(this.state.menu[key].path, ); // keeper的跳转
    }

    render() {
        const { state: { menu, tabbarIndex, badge, },  } = this;
        const activeIndex=activeTabbar( menu );
        
        if (tabbarIndex != activeIndex  ){ // 对比url索引和当前选中的值,如不对应则纠正.
            this.dispatch('setTabbarIndex',activeIndex);
        }

        return (
            <div className="home">
				<div>待审批页面</div>
				
            </div>
        );
    }

    componentDidMount() {
	
    }

}

export default PendingApproval ;
