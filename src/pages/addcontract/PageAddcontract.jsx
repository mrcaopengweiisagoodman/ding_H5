// 添加合同
require('./PageAddcontract.less');
import logic from './PageLogic';
import { Component, LogicRender } from 'refast';  


class Addcontract extends Component {
    constructor(props) { 
        super(props, logic);        
        
    }

    render() {
        return (
            <div>
				添加合同
            </div>
        );
    }

}

export default Addcontract ;
