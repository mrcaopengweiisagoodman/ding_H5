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
    Link,
    Control
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
        localStorage.setItem('dateStyleChange','true');
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
        dd.device.notification.showPreloader({
            text: "部门加载中...", //loading显示的字符，空表示不显示文字
            showIcon: true, //是否显示icon，默认true
        })
        fetch(`${AUTH_URL}ding/dept/info`)
        .then(res => res.json())
        .then(data => {
            if (data.state == 'SUCCESS') {
                let info = [];
               /* dd.device.notification.alert({
                    message: "部门信息---" + JSON.stringify(data),
                    title: "提示信息",
                    buttonName: "确定"
                });*/
                for (let e in data.values.info) {
                    let ele = {};
                    ele.id = e;
                    ele.name = data.values.info[e];
                    info.push(ele);
                }
                dd.device.notification.hidePreloader({});
                this.dispatchFn({
                    listData: info
                })
            }
        })
    }
    checkedChange2 = (e,deptId) => {
        e.stopPropagation();
        let {deptIds} = this.state;
        if (e.target.checked) {
            deptIds.push(deptId);
            console.log([...new Set(deptIds)])
            this.dispatchFn({
                deptIds: [...new Set(deptIds)]
            });
            return
        } 
        deptIds.pop();
        this.dispatchFn({
            deptIds: deptIds
        });
    }
    downloadfile = (blobUrl) => {
        //返回的二进制流
        // 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
        const a = document.createElement('a');
        a.style.display = 'none';
        // blobUrl.type = "application/excel";
        a.download = '合同文本.xls';
        console.log('url---',blobUrl)
        a.href = blobUrl;
        a.click();
        window.URL.revokeObjectURL(blobUrl);
        /*dd.biz.util.downloadFile({
            url: blobUrl, //要下载的文件的url
            name: '一个图片.jpg', //定义下载文件名字
            onProgress: function(msg){
              // 文件下载进度回调
              
            },
            onSuccess : function(result) {
               
              alert('成功！')
            },
            onFail : function() {
                alert('失败！')
            }
        })*/
        // document.body.removeChild(a);
    }
    /**
    * 批量导出文件 
    */
    exportFilesFn = () => {
      
        let { deptIds } = this.state;
        let params = {
            deptId: deptIds.join(','),
            contracts: []
        };
        fetch(`${AUTH_URL}internal/audit/excel/export?deptId=${deptIds.join(',')}&userId=${localStorage.getItem('userId')}`,{
            method: 'POST',
        })
        .then( res => res.json())
        .then(data => {
            dd.device.notification.hidePreloader({});
            if (data.state == 'SUCCESS') {
                dd.device.notification.alert({
                    message: '文件已经发送，请查看消息！',
                    title: "温馨提示",
                    buttonName: "确定",
                    success: () => {
                        Control.go(-1);
                    }
                });
                return
            }
            dd.device.notification.alert({
                message: '文件导出失败！',
                title: "温馨提示",
                buttonName: "确定"
            });
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
        }
        request();*/
    }
    /* test */
    exportTest = () => {
        fetch(`${AUTH_URL}test/download`,{
            method: 'POST',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'mode': 'no-cors'
            }
        })
        .then( res => res.blob())
        .then(data => {
           /* if (JSON.stringify(data).length == 2) {
                dd.device.notification.alert({
                    message: '所选部门还没有文件',
                    title: "温馨提示",
                    buttonName: "确定"
                });
                return
            }*/
            let blobUrl = window.URL.createObjectURL(data);
            dd.device.notification.alert({
                message: '所选部门还没有文件---' + JSON.stringify(blobUrl),
                title: "温馨提示",
                buttonName: "确定"
            });
            this.downloadfile(blobUrl);
        })
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
                {/*<div className="exportFiles" onClick={this.exportTest}>导出</div>*/}
            </div>
        );
    }

}

export default Auditcontract ;
