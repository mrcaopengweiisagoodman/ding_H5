// 内审
require('./PageAudit.less');
import logic from './PageLogic';
import { Component, LogicRender } from 'refast';  


class Audit extends Component {
    constructor(props) { 
        super(props, logic);        
        dd.ready(()=>{
        	dd.biz.navigation.setTitle({ 
        		title:'内审' ,
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
				内审页面
            </div>
        );
    }

}

export default Audit ;
