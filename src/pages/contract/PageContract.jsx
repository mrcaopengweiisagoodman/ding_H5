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
        
    }

    render() {
        const { tabs} = this.state;
        const tabNode = tabs.forEach( (v,inx) => {
            return <span>{v.title}</span>
        })
        return (
            <div>
                <Tabs tabs={tabs}
                    initialPage={0}
                    onChange={(tab, index) => { console.log('onChange', index, tab); }}
                    onTabClick={(tab, index) => { console.log('onTabClick', index, tab); }}
                >
                </Tabs>
            </div>
        );
    }

}

export default Contract ;
