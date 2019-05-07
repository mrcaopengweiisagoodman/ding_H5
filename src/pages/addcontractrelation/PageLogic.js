import PageConst from './PageConst';

export default {
    defaults(props) {
        //初始的state
        return {  
            reminderTime_0: '',
            reminderTime_1: '',
            reminderTime_2: '',
            reminderTime_3: '',
            reminderTime_4: '',
            reminderTime_5: '',
            reminderTime_6: '',
            reminderTime_7: '',
            reminderTime_8: '',
            reminderTime_9: '',
            reminderTime_10: '',
            payTime_0: '',
            payTime_1: '',
            payTime_2: '',
            payTime_3: '',
            payTime_4: '',
            payTime_5: '',
            payTime_6: '',
            payTime_7: '',
            payTime_8: '',
            payTime_9: '',
            payTime_10: '',

            // 父合同id
            pid: '',
            // 父合同标题
            pTitle: '',
            // 动态添加款项内容
            addMoneyList: [1],
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
            // 款项设置的内容
            paymentSettings: [
                {
                    payTime: new Date(),
                    reminderTime: new Date(),
                    payCondition: ''
                }
            ]
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