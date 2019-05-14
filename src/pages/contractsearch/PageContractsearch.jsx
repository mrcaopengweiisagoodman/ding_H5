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
    getSearchResult = ({searchWord}) => {
        let url_str;
        this.props.params.ori == 'audit' ? url_str = 'internal/audit/search' : url_str = 'contract/search';
         fetch(`${AUTH_URL}${url_str}?pageNum=1&pageSize=1000&searchWord=${searchWord}`)
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
    render() {
        const { getFieldProps } = this.props.form;
        let { searchVal , listData} = this.state;
        // 测试数据开始
        // listData = contractJson.search.values.search.list;
        // 测试数据结束
        let searchResultCom = listData.map((v,i) => {
            return  <Link to={`/detailcontract/${v.contractId}`} className="listHeight flex_bc">
                        <span className="leftName textOverflow_1">{v.title}</span>
                        <div className="flex_ec paySelect">
                            <img className="fileIcon" src={`${IMGCOMMONURI}common_level2_icon_bg_color.png`} />
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
