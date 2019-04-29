// 内审
require('./PageAudit.less');
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


class Audit extends Component {
    constructor(props) { 
        super(props, logic);        
        mydingready.ddReady({pageTitle: '内审'});
        
    }

    render() {
        return (
            <div className="audit">
                <Link to={`/auditcontract`} className="box flex_cc1 nsht">
                    <div className="flex_cc1">
                        <img src={`${IMGCOMMONURI}nsht.png`} />
                        <p>内审合同</p>
                        <span>12</span>
                    </div>
                </Link>
                <Link to={`/auditapprove`} className="box flex_cc1 nssp">
                    <div className="flex_cc1">
                        <img src={`${IMGCOMMONURI}nssp.png`} />
                        <p>内审审批</p>
                        <span>12</span>
                    </div>
                </Link>
            </div>
        );
    }

}

export default Audit ;
