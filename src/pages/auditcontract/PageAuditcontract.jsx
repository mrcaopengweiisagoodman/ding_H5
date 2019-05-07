// 内审合同
require('./PageAuditcontract.less');
import logic from './PageLogic';
import { Component, LogicRender } from 'refast';  
import { 
    Tabs, 
    WhiteSpace ,
    WingBlank,
    Badge,
    SearchBar,
    List,
    Checkbox
} from 'antd-mobile';
// import logic from './PageLogic';
import {
    Link
} from 'react-keeper';
import mydingready from './../../dings/mydingready';
const { AUTH_URL , IMGCOMMONURI } = require(`config/develop.json`);


class Auditcontract extends Component {
    constructor(props) { 
        super(props, logic);        
        mydingready.ddReady({pageTitle: '内审合同'});
        
    }
    /**
    * 发送自定义事件（设置state）
    */
    dispatchFn = (val) => {
        this.dispatch('setStateData',val)
    }
    checkedChange2 = (e,deptId) => {
        console.log(e)
        e.stopPropagation();
        this.dispatchFn({});
    }
    /**
    * 批量导出文件
    */
    exportFilesFn = () => {
        
    }
    render() {
        const { eventType } = this.state;
        return (
            <div className="auditcontract">
                <p className="title">选中部门(多选)</p>
                <div className="deptBox">
                    <div className="deptlist flex_bc">
                        <div className="flex">
                            <div className="checkeBox flex">
                                <Checkbox className="checkeList" checked={eventType == 0 ? true : false} onChange={(e) => this.checkedChange2(e,0)} />
                                <span className="deptName">部门A</span>
                            </div>
                        </div>
                        <Link to={`/`} className="goDept flex_ec">
                            <img src={`${IMGCOMMONURI}common_level2_icon_bg_color.png`} />
                        </Link>
                    </div>
                    <div className="deptlist flex_bc">
                        <div className="flex">
                            <div className="checkeBox flex">
                                <Checkbox className="checkeList" checked={eventType == 0 ? true : false} onChange={(e) => this.checkedChange2(e,0)} />
                                <span className="deptName">部门A</span>
                            </div>
                        </div>
                        <Link to={`/`} className="goDept flex_ec">
                            <img src={`${IMGCOMMONURI}common_level2_icon_bg_color.png`} />
                        </Link>
                    </div>

                
                </div>
                <div className="exportFiles" onClick={this.exportFilesFn}>导出</div>
            </div>
        );
    }

}

export default Auditcontract ;
