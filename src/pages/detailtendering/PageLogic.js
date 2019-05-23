import PageConst from './PageConst';
import { apiSync } from 'utils'

export default {
    defaults(props) {
        //初始的state
        return {  
        	test: '',
        	...PageConst,
        	// 招投标id
        	id: '',
        	// 详情数据
        	detailData: null,
        	// 被@的联系人集合
        	userIds: [],
        	// 被@的联系人的id
            emplIds: [],
        	// 留言板中@的人员name
        	messageBoard: [],
            // 已经留言过的信息
            messageBoardMsgs: [],
        	// 是否已经选择@人
        	isChooseContact: false,
            checking_type: localStorage.getItem('checking_type'),
            isRebut: localStorage.getItem('REBUT') == 'REBUT' ? true : false,
            // 留言板信息是否已经提交
            msgIsSubmit: false,
            // 是否有权限留言
            isLimitMsg: false
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
