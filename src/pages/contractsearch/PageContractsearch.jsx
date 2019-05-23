// 关联合同查询
require('./PageContractsearch.less');
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
import moment from 'moment';
import {
    Control,
    Link
} from 'react-keeper';
import contractJson from './../../test_json/contract';

const { AUTH_URL, IMGCOMMONURI } = require(`config/develop.json`);


class ContractsearchForm extends Component {
    constructor(props) { 
        super(props, logic);        
        mydingready.ddReady({pageTitle: '关联合同查询'});
    }
     /**
    * 发送自定义事件（设置state）
    */
    dispatchFn = (val) => {
        this.dispatch('setStateData',val)
    }
    /*
    * 查询合同
    * internal/audit/search    查询内审合同
    * contract/search          查询正常合同
    */
    getSearchResult = ({searchWord}) => {
        let url_str;
        this.props.params.ori == 'audit' ? url_str = 'internal/audit/search' : url_str = 'contract/search';
        fetch(`${AUTH_URL}${url_str}?pageNum=1&pageSize=1000&searchWord=${searchWord}&contractId=${this.props.params.id}`)
        .then(res => res.json())
        .then(data => {
            /*dd.device.notification.alert({
                message: "合同详情数据" + JSON.stringify(data),
                title: "提示",
                buttonName: "确定"
            })*/
            if (data.state == 'SUCCESS') {
                this.dispatchFn({
                    searchVal: searchWord,
                    listData: data.values.search ? data.values.search.list : data.values.list.list
                })
            }
        })
    }
    /**
     * 搜索
     */
    goSearch = (val) => {
        console.log('文本框内容',val,this.state.searchVal)
        this.getSearchResult({
            searchWord: val
        })
    }
    /*
    * 离焦
     */
    searchBlur = (e) => {
        this.dispatch('setStateData',{searchVal: ''});
    }
    /**
     * 文本输入变化
     */
    searchChange = (e) => {
        this.dispatch('setStateData',{searchVal: e});
    }
    /*
    * 绑定合同关系，返回上级页面
    */
    back = (e,id) => {
        e.stopPropagation();
        if (id == this.props.params.id) {
            dd.device.notification.alert({
                message: '',
                title: "温馨提示",
                buttonName: "确定"
            })
            return
        }
        fetch(`${AUTH_URL}contract/mount?cid=${id}&pid=${this.props.params.id}&userId=${localStorage.getItem('userId')}`,{
            method: 'POST'
        })
        .then(res => res.json())
        .then(data => {
            /*dd.device.notification.alert({
                message: "合同详情数据" + JSON.stringify(data),
                title: "提示",
                buttonName: "确定"
            })*/
            if (data.state == 'SUCCESS') {
                dd.device.notification.toast({
                    icon: 'success', //icon样式，有success和error，默认为空
                    text: '添加成功！', //提示信息
                });
                Control.go(-1);
                return
            }
            dd.device.notification.alert({
                message: data.info,
                title: "温馨提示",
                buttonName: "确定"
            })
        })
    }
    render() {
        const { getFieldProps } = this.props.form;
        let { searchVal , listData} = this.state;
        // 测试数据开始
        // listData = contractJson.search.values.search.list;
        // 测试数据结束
        let searchResultCom = listData.map((v,i) => {
            let cid , url;
            if (v.biddingId) {cid = v.biddingId;url = `/detailtendering/${cid}`};
            if (v.innerAuditId){ cid = v.biddingId;url = `/detailauditapprove/${cid}`}
            if (v.contractId){ cid = v.contractId; url = `/detailcontract/${cid}`;};
            return  <Link to={url} className="listHeight flex_bc">
                        <span className="leftName textOverflow_1">{v.title}</span>
                        <div className="flex_ec paySelect">
                            {/*<img className="fileIcon" src={`${IMGCOMMONURI}common_level2_icon_bg_color.png`} />*/}
                            <div className="color_b bangding" onClick={(e) => this.back(e,cid)}>绑定</div>
                        </div>
                    </Link>
        })
        return (
            <div className="contractSearch">
                <SearchBar className="searchBox" placeholder="合同标题等信息" 
                    value={searchVal}
                    onSubmit={this.goSearch} 
                    onBlur={this.searchBlur}
                    onChange={this.searchChange}
                /> 
                <div className={listData.length ? "searchResult" : 'isHide'}>
                    {searchResultCom}
                </div>
                <div className={listData.length ? 'isHide' : 'noReault'}>
                    暂无搜索结果
                </div>
            </div>
        );
    }

}
const Contractsearch = createForm()(ContractsearchForm);
export default Contractsearch ;
