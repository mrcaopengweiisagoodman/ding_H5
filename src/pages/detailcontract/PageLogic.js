import { apiSync } from 'utils'
import PageConst from './PageConst';

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
            beTransfer: [],
            checking_type: localStorage.getItem('checking_type'),
            isRebut: localStorage.getItem('REBUT') == 'REBUT' ? true : false,
            isLimitMsg: false,
            // 已经留言过的信息
            messageBoardMsgs: [],
            // 留言板中书写的内容
            writeMsg: '',
            // 被@的联系人的id
            emplIds: [],
            // 留言板中@的人员name
            messageBoard: [],

        }
    },
    /**
	 * 修改state
	 * @param ctx
	 * @param val 
	 */
	setStateData (ctx,val) {
		ctx.setState(val);
	}
};
