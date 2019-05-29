import PageConst from './PageConst';
import { apiSync } from 'utils'

export default {
    defaults(props) {
        //初始的state
        return {  
        	...PageConst,
            id: '',
            detailData: null,
            // 0:标准合同；1：非
            contractType: 0,
            // 款项状态：无0 收款1 付款2
            eventType: 0,
            // 收付款时间
            payTime: '',
            // 提醒时间（2029-04-11 11:00:00）
            reminderTime: '',
            // 审批人
            approver: [],
            // 上传文件之后返回的数据数组
            enclosure: [],
            // 待审批入口进入的
            checking_type: localStorage.getItem('checking_type'),
            // 留言板信息是否已经提交
            msgIsSubmit: false,
            isRebut: localStorage.getItem('REBUT') == 'REBUT' ? true : false,
            isLimitMsg: false,
             // 被@的联系人的id
            emplIds: [],
            // 留言板中@的人员name
            messageBoard: [],
            // 留言板中书写的内容
            writeMsg: '',
            // 已经留言过的信息
            messageBoardMsgs: [],
        }
    },
    /**
	 * 修改state
	 * @param ctx
	 * @param val 
	 */
	setStateData (ctx,val) {
		ctx.setState(val);
	},
};
