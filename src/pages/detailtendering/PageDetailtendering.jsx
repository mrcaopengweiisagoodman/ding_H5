require('./PageDetailtendering.less');
import logic from './PageLogic';
import { Component, LogicRender } from 'refast';  
import moment from 'moment';
const { AUTH_URL,IMGCOMMONURI } = require(`config/develop.json`);



class Detailtendering extends Component {
    constructor(props) { 
        super(props, logic);        
        console.log(props.params)
        // this.dispatchFn({id: props.params});
        this.getDetail(props.params.id);
    }
    componentDidMount () {

    }
    /**
    * 发送自定义事件（设置state）
    */
    dispatchFn = (val) => {
        this.dispatch('setStateData',val)
    }
    /**
    * 获取详情
    */
    getDetail = (id) => {
        fetch(`${AUTH_URL}bidding/info/${id}`)
        .then(res => res.json())
        .then(data => {
            if (data.state == 'SUCCESS') {
                this.dispatchFn({
                    id: id,
                    detailData: data.values.info
                })
            }
        })
    }
    /**
    * 预览文件 (钉钉api)
    */
    previewFile = (fileId) => {

    }
    render() {
        const { id ,detailData , styleInfo } = this.state;

        console.log(styleInfo)

        if (detailData) {
            const  enclosure = detailData.enclosure ? JSON.parse(detailData.enclosure) : [],
                approver = detailData.approver ? JSON.parse(detailData.approver) : [],
                copyPerson = detailData.copyPerson ? JSON.parse(detailData.copyPerson) : [];
            console.log(approver,copyPerson)
            let enclosureCom = enclosure.map(v=>{
                let fileTypeImg, 
                    fileTypeImgArr = ['ppt.png','ppt.png','excel.png','excel.png','word.png','word.png'];
                    let i = ['ppt','pptx','xls','xlsx','doc','docx'].indexOf(v.fileType);
                    i != -1 ? fileTypeImg = fileTypeImgArr[i] : fileTypeImg = 'unknown.png';
                // return  <div className="file" key={v.fileId}>
                return  <div className="file" key={v.fileId} onClick={() => this.previewFile(v.fileId)}>
                            <img className="fileIcon" src={`${IMGCOMMONURI}${fileTypeImg}`} />
                            <p className="textOverflow_1">{v.fileName}</p>
                        </div>
            });
            let approverCom = approver.map(v=>{
                return <div key={v.emplId} style={{margin: '5px 1.5vw'}}>
                            <div className="box_b manBox">
                                <p className="color_b">{v.name}</p>
                            </div>
                        </div>
            });
            let copyPersonCom = copyPerson.map(v=>{
                return  <div key={v.emplId} style={{margin: '5px 1.5vw'}}>
                            <div className="box_b manBox">
                                <p className="color_b">{v.name}</p>
                            </div>
                        </div>
            });
            return (
               <div className="addTendering detailtendering">
                    <p className="title">基本信息</p>
                    <div className="name">
                        {detailData ? detailData.biddingName : ''}
                    </div>
                    <div className="line_gray"></div>
                    <div className="name color_gray">
                        {detailData ? detailData.content : ''}
                    </div>
                    <p className="title">投标附件</p>
                    <div className="fileBox">
                        {enclosureCom}
                    </div>
                    <div className="selectedMan">
                        <p className="color_gray">审批人</p>
                        <div className="manArr detailManArr">
                            {approverCom}
                        </div>
                    </div>
                    <div className="line_gray"></div>
                    <div className="selectedMan">
                        <p className="color_gray">抄送人</p>
                        <div className="manArr detailManArr">
                           {copyPersonCom}
                        </div>
                    </div>
                    <div className="line_gray"></div>
                    <div className="selectedMan">
                        <p className="color_gray">提交时间</p>
                        <div className="manArr detailManArr">
                            {moment(detailData.createTime).format('YYYY.MM.DD HH:mm')}
                        </div>
                    </div>
                    <div className="line_gray"></div>
                    <div className="selectedMan">
                        <p className="color_gray">状态</p>
                        <div className="manArr detailManArr">
                            <span className={styleInfo ? styleInfo[detailData.approvalState].color : ''}>{styleInfo[detailData.approvalState].str}</span>
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

}

export default Detailtendering ;
