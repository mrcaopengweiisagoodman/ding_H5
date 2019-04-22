require('./PageDetailtendering.less');
import logic from './PageLogic';
import { Component, LogicRender } from 'refast';  
const { IMGCOMMONURI } = require(`config/develop.json`);


class Detailtendering extends Component {
    constructor(props) { 
        super(props, logic);        
        console.log(props.params)
    }

    render() {
        return (
           <div className="addTendering detailtendering">
                <p className="title">基本信息</p>
                <div className="name">
                    投标名称
                </div>
                <div className="line_gray"></div>
                <div className="name color_gray">
                    投标内容
                </div>
                <p className="title">投标附件</p>
                <div className="fileBox">
                    <div className="file">
                        <img className="fileIcon" src={`${IMGCOMMONURI}unknown.png`} />
                        <p className="textOverflow_1">文件名称文件名称文件名称</p>
                    </div>
                    <div className="file">
                        <img className="fileIcon" src={`${IMGCOMMONURI}unknown.png`} />
                        <p className="textOverflow_1">文件名称文件名称文件名称</p>
                    </div>
                </div>
                <div className="selectedMan">
                    <p className="color_gray">审批人</p>
                    <div className="manArr detailManArr">
                        <div className="box_b">
                            <p className="color_b">人名一</p>
                        </div>
                    </div>
                </div>
                <div className="line_gray"></div>
                <div className="selectedMan">
                    <p className="color_gray">抄送人</p>
                    <div className="manArr detailManArr">
                        <div className="box_g">
                            <p className="color_g">人名一</p>
                        </div>
                    </div>
                </div>
                <div className="line_gray"></div>
                <div className="selectedMan">
                    <p className="color_gray">提交时间</p>
                    <div className="manArr detailManArr">
                        2019-04-19 15:55
                    </div>
                </div>
                <div className="line_gray"></div>
                <div className="selectedMan">
                    <p className="color_gray">状态</p>
                    <div className="manArr detailManArr color_r">
                        被驳回
                        <span className="color_b">/待审批</span>
                    </div>
                </div>
                <div className="line_gray"></div>
                <div className="selectedMan">
                    <p className="color_gray">驳回原因</p>
                    <div className="manArr detailManArr">
                        正在审批中
                    </div>
                </div>
            </div>
        );
    }

}

export default Detailtendering ;
