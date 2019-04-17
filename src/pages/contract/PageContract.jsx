// 合同
require('./PageContract.less');
import logic from './PageLogic';
import { Component, LogicRender } from 'refast';  


class Contract extends Component {
    constructor(props) { 
        super(props, logic);        
        dd.ready(()=>{
        	dd.biz.navigation.setTitle({ 
        		title:'合同' ,
        		onSuccess: res => {
        		},
        		onFail: res => {
        		}
        	});
        })
    }

    render() {
        return (
            <div>
				合同页面
            </div>
        );
    }

}

export default Contract ;
