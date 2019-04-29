// 合同
require('./PageContract.less');
import logic from './PageLogic';
import { Component, LogicRender } from 'refast';  
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
    Link
} from 'react-keeper';
import mydingready from './../../dings/mydingready';
const { AUTH_URL , IMGCOMMONURI } = require(`config/develop.json`);

const TabPane = Tabs.TabPane;
const Item = List.Item;


class Contract extends Component {
    constructor(props) { 
        super(props, logic);        
        mydingready.ddReady({pageTitle: '合同'})
    }
    goRelation = (e) => {
        e.stopPropagation();
        console.log('阻止了冒泡')
    }
    render() {
        const { tabs} = this.state;
        const tabNode = tabs.forEach( (v,inx) => {
            return <span>{v.title}</span>
        })
        return (
            <div className="contract">
                <Tabs tabs={tabs}
                    initialPage={0}
                    onChange={(tab, index) => { console.log('onChange', index, tab); }}
                    onTabClick={(tab, index) => { console.log('onTabClick', index, tab); }}
                >
                    <div className="standard">
                        <div className="listBox">
                            <Link to={`/detailcontract/${'id'}`}>
                                <div className="list">
                                    <div className="tenderingTitle flex">
                                        <span>当事人</span>
                                        <p>张三、李四、王五、赵六、冯七、曹八</p>
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
                            </Link>
                            <div className="box_b color_b" onClick={this.goRelation}>关联合同审批</div>
                        </div>

                    </div>
                    <div className="no_standard">
                        非标准化合同
                    </div>
                </Tabs>
                <Link type='img' src={`${IMGCOMMONURI}add_big.png`} className='addTenderingBtn' to={ '/addcontract' } />
            </div>
        );
    }

}

export default Contract ;
