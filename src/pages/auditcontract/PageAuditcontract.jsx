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
import testJson from './../../test_json/contract';

const { AUTH_URL , IMGCOMMONURI } = require(`config/develop.json`);


class Auditcontract extends Component {
    constructor(props) { 
        super(props, logic);        
        mydingready.ddReady({pageTitle: '内审合同'});
        
    }
    componentDidMount () {
        this.getDeptInfo();
    }
    /**
    * 发送自定义事件（设置state）
    */
    dispatchFn = (val) => {
        this.dispatch('setStateData',val)
    }
    /**
    * 获取部门名称和id
    */
    getDeptInfo = () => {
        fetch(`${AUTH_URL}ding/dept/info`)
        .then(res => res.json())
        .then(data => {
            if (data.state == 'SUCCESS') {
                let info = [];
                dd.device.notification.alert({
                    message: "部门信息---" + JSON.stringify(data),
                    title: "提示信息",
                    buttonName: "确定"
                });
                for (let e in data.values.info) {
                    let ele = {};
                    ele.id = e;
                    ele.name = data.values.info[e];
                    info.push(ele);
                }
                this.dispatchFn({
                    listData: info
                })
            }
        })
    }
    checkedChange2 = (e,deptId) => {
        e.stopPropagation();
        if (e.target.checked) {
            let {deptIds} = this.state;
            deptIds.push(deptId);
            console.log([...new Set(deptIds)])
            this.dispatchFn({
                deptIds: [...new Set(deptIds)]
            });
        }
    }
    downloadfile = (blobUrl) => {
        const a = document.createElement('a');
        a.style.display = 'none';
        // blobUrl.type = "application/excel";
        a.download = '合同文本.xls';
        console.log('url---',blobUrl)
        a.href = blobUrl;
        a.click();
        window.URL.revokeObjectURL(blobUrl);
        // document.body.removeChild(a);
    }
    /**
    * 批量导出文件 
    */
    exportFilesFn = () => {
        let { deptIds } = this.state;
        dd.device.notification.alert({
            message: "-------选中的部门id----" + JSON.stringify(deptIds),
            title: "提示信息",
            buttonName: "确定"
        });
        if (!deptIds.length) {
            dd.device.notification.alert({
                message: "您未选择任何部门",
                title: "提示信息",
                buttonName: "确定"
            });
            return
        }
        let params = {
            deptId: deptIds.join(','),
            contracts: []
        };
        fetch(`${AUTH_URL}internal/audit/excel/export?deptId=${deptIds.join(',')}`,{
            method: 'POST',
            headers: {
                'Content-Type': "application/json",
                'Access-Control-Allow-Origin':'*'
            },
            // body: JSON.stringify(params)
        })
        .then( res => res.blob())
        .then(data => {
            if (!data) {
                dd.device.notification.alert({
                    message: '所选部门还没有文件',
                    title: "温馨提示",
                    buttonName: "确定"
                });
                return
            }
            console.log(data,'headers---',data.headers)
            let blobUrl = window.URL.createObjectURL(data);
            this.downloadfile(blobUrl);
        })
        /*function request () {
            const req = new XMLHttpRequest();
            req.open('POST', `${AUTH_URL}internal/audit/excel/export?deptId=${deptIds.join(',')}`, true);
            req.responseType = 'blob';
            req.setRequestHeader('Content-Type', 'application/json');
            req.onload = function() {
              const data = req.response;
              const a = document.createElement('a');
              const blob = new Blob([data],{type: 'application/x-xls'});
              const blobUrl = window.URL.createObjectURL(blob);
              download(blobUrl) ;
            };
            req.send(JSON.stringify([]));
        };

        function download(blobUrl) {
            const a = document.createElement('a');
            a.style.display = 'none';
            a.download = '<文件名>.xls';
            a.href = blobUrl;
            a.click();
            document.body.removeChild(a);
        }
        request();*/
    }
    render() {
        const { listData } = this.state;
        console.log(listData)
        let deptCom = listData.map(v=>{
            return  <div className="deptlist flex_bc">
                        <div className="flex">
                            <div className="checkeBox flex">
                                <Checkbox className="checkeList" onChange={(e) => this.checkedChange2(e,v.id)} />
                                <span className="deptName">{v.name}</span>
                            </div>
                        </div>
                        <Link to={`/deptcontractlists/${v.id}`} className="goDept flex_ec">
                            <img src={`${IMGCOMMONURI}common_level2_icon_bg_color.png`} />
                        </Link>
                    </div>
        })
        return (
            <div className="auditcontract">
                <p className="title">选中部门(多选)</p>
                <div className="deptBox">
                   {/* <div className="deptlist flex_bc">
                                           <div className="flex">
                                               <div className="checkeBox flex">
                                                   <Checkbox className="checkeList" onChange={(e) => this.checkedChange2(e,0)} />
                                                   <span className="deptName">部门A</span>
                                               </div>
                                           </div>
                                           <Link to={`/`} className="goDept flex_ec">
                                               <img src={`${IMGCOMMONURI}common_level2_icon_bg_color.png`} />
                                           </Link>
                                       </div>*/}
                    
                    {deptCom}
                
                </div>
                <div className="exportFiles" onClick={this.exportFilesFn}>导出</div>
            </div>
        );
    }

}

export default Auditcontract ;
