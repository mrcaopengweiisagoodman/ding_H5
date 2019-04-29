// 合同详情
require('./PageDetailcontract.less');
import logic from './PageLogic';
import { Component, LogicRender } from 'refast';  
import {
    Checkbox,
    InputItem,
    TextareaItem,
    SearchBar
} from 'antd-mobile';
import { createForm } from 'rc-form';
import mydingready from './../../dings/mydingready';
const { AUTH_URL, IMGCOMMONURI } = require(`config/develop.json`);


class Detailcontract extends Component {
    constructor(props) { 
        super(props, logic);        
        
    }
    /**
    * 发送自定义事件（设置state）
    */
    dispatchFn = (val) => {
        this.dispatch('setStateData',val)
    }
      /**
    * 单选框
    */
    checkedChange = (e) => {
        console.log(e)
        e.target.checked = !e.target.checked;
        this.dispatchFn({
            contractType: this.state.contractType ? 0 : 1
        })
    }

    render() {
        const { contractType ,eventType ,approver ,enclosure ,detailData,searchVal} = this.state;
        // if (detailData) {

            let a = [
                 {
                   spaceId: "232323",
                   fileId: "DzzzzzzNqZY",
                   fileName: "审批流程.docx",
                   fileSize: 1024,
                   fileType: "docx"
                },
                {
                   spaceId: "232323",
                   fileId: "DzzzzzzNqZY",
                   fileName: "审批流程1.pdf",
                   fileSize: 1024,
                   fileType: "pdf"
                }];
            let enclosureCom = a.map(v => {
            // let enclosureCom = enclosure.map(v => {
                let fileTypeImg, 
                    fileTypeImgArr = ['ppt.png','ppt.png','excel.png','excel.png','word.png','word.png'];
                let i = ['ppt','pptx','xls','xlsx','doc','docx'].indexOf(v.fileType);
                i != -1 ? fileTypeImg = fileTypeImgArr[i] : fileTypeImg = 'unknown.png';
                return <div className="file" onClick={() => this.previewFile('previewFile',v)}>
                            <img className="fileIcon" src={`${IMGCOMMONURI}${fileTypeImg}`} />
                            <p className="textOverflow_1">{v.fileName}</p>
                        </div>
            });
            let approverCom = approver.map(v=>{
                administrators.push(v.emplId);
                return <div key={v.emplId} style={{margin: '5px 1.5vw'}}>
                            <div className="box_b manBox">
                                <p className="color_b">{v.name}</p>
                            </div>
                        </div>
            });

            return (
                <div className="addcontract detailcontract">
                    <p className="title">合同类型</p>
                    <div className="listHeight flex">
                        <div className="checkeBox flex">
                            <Checkbox className="checkeList" checked={!contractType} onChange={this.checkedChange} />
                            <span className="f_14 color_gray">标准化</span>
                        </div>
                        <div className="checkeBox flex">
                            <Checkbox className="checkeList" checked={contractType} onChange={this.checkedChange} />
                            <span>非标准化</span>
                        </div>
                    </div>
                    <p className="title">基本信息</p>
                    <div className="listHeight flex">
                        <span className="leftText f_14 color_gray">部门部门部</span>
                        <div>市场部</div>
                    </div>
                    <div className="name flex" style={{padding: '0 3vw'}}>
                        <span className="f_14 color_gray leftText">标题</span>
                        <p className="maxW">我是标题我是标题我是标题我是标题我是标题我是标题</p>
                    </div>
                    <div className="line_gray"></div>
                    <div className="listHeight flex">
                        <span className="leftText f_14 color_gray">当事人</span>
                        <div>找老歌</div>
                    </div>
                    <div className="line_gray"></div>
                    <div className="name flex" style={{padding: '0 3vw'}}>
                        <span className="leftText f_14 color_gray">类型</span>
                        <p className="maxW">收款</p>
                    </div>
                    <p className="title">款项信息</p>
                    {/* 收款时间 */}
                    <div>
                        <div className="listHeight flex">
                            <span className="leftText f_14 color_gray">收款时间</span>
                            <div>2019-05-05</div>
                        </div>
                        <div className="line_gray"></div>
                        <div className="listHeight flex">
                            <span className="leftText f_14 color_gray">收款条件</span>
                            <div className="maxW">这里是收款条件这里是收款条件这里是收款条件</div>
                        </div>
                        <div className="line_gray"></div>
                        <div className="listHeight flex">
                            <span className="leftText f_14 color_gray">提醒时间</span>
                            <div>2019-09-09</div>
                        </div>
                        <div className="line_box"></div>
                    </div>
                    <div className="listHeight flex">
                        <span className="leftText f_14 color_gray">合同金额</span>
                        <div className="color_orange">￥99999999</div>
                    </div>
                    <div className="listHeight flex">
                        <span className="leftText f_14 color_gray">租期</span>
                        <div>50天</div>
                    </div>
                    <p className="title">相关附件</p>
                    <div className="fileBox">
                        {enclosureCom}
                    </div>
                    <p className="title">合同主要内容或说明(选填)</p>
                    <p className="textBox">合同内容好多好多的哟</p>
                    <p className="title">关联合同</p>
                    {/* 有关联合同时 */}
                    <div>
                        <div className="listHeight flex_bc">
                            <span className="leftName textOverflow_1">江干区市民中心顶部合同防水工程采购合同呀呀呀呀呀</span>
                            <div className="flex_ec paySelect" onClick={() => this.selectedDate('payTime')}>
                                <img className="fileIcon" src={`${IMGCOMMONURI}common_level2_icon_bg_color.png`} />
                            </div>
                        </div>
                    </div>
                    {/* 没有有关联合同时，去查找合同以关联 */}
                    <div>
                        <SearchBar className="searchBox" placeholder="审批人/投标名称" 
                            value={searchVal}
                            onSubmit={this.goSearch} 
                            onBlur={this.searchBlur}
                            onChange={this.searchChange}
                        /> 
                    </div>
                    <div className="line_box"></div>
                    <div className="selectedMan bg_ff">
                        <p className="color_gray">审批人</p>
                        <div className="manArr detailManArr">
                            {approverCom}
                        </div>
                    </div>
                    <div className="line_gray"></div>
                    <div className="listHeight flex">
                        <span className="leftText f_14 color_gray">提交时间</span>
                        <div>2019.05.05 15:05</div>
                    </div>
                    <div className="line_gray"></div>
                    <div className="selectedMan lineTime">
                        <p className="color_gray">状态</p>
                        {/*<div className="manArr detailManArr flex">
                                                    <span className={detailData.approvalState ? styleInfo[detailData.approvalState].color : ''}>{styleInfo[detailData.approvalState].str}</span>
                                                </div>*/}
                    </div>
                       {/* 留言板 --- 只有抄送人和审批人进行操作 */}
                    {/*<div className={detailData.approvalState == 'REBUT' ? 'line_gray' : 'isHide'}></div>*/}
                    {/*<div className={detailData.approvalState == 'REBUT' && administrators.indexOf(myUserId) != -1 ? 'biddingName' : 'isHide'} style={{padding: '0 3vw'}}>*/} 
                   {/* <div className="biddingName"> 
                                           <p className="title">留言板</p>
                                           <TextareaItem 
                                               className="textArea"
                                               rows={5}
                                               onBlur={(e) => {console.log(e)}}
                                               placeholder="可以备注、补充审批等信息"
                                               {...getFieldProps('content',{
                                                   onChange: this.getRemindContacts,
                                                   rules:[{required: false,message:'此处输入备注、补充审批等信息！'}]
                                               })}
                                           ></TextareaItem> 
                                           <button className="btnBlueLong" type="submit" onClick={this.submit} style={{marginBottom: '1vh'}}>提交</button>
                                       </div>*/}

                </div>
            );
      /*  } else {
            return (<div></div>)
        }*/
    }

}

export default Detailcontract ;
