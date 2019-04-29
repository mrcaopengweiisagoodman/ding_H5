require('./PageAuditapprove.less');
import logic from './PageLogic';
import { Component, LogicRender } from 'refast';  


class Auditapprove extends Component {
    constructor(props) { 
        super(props, logic);        
        
    }

    render() {
        return (
            <div>
            	内审审批
            </div>
        );
    }

}

export default Auditapprove ;
