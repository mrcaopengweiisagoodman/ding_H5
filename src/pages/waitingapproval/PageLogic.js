import PageConst from './PageConst';
import { apiSync } from 'utils';

export default {
    defaults(props) {
        //初始的state
        return {  
        	searchVal: '',
			...PageConst,
        	listData: [], // 招投标数据列表
			pageInfo: {
				pageNum: 1,
				pageSize: 1000,
				searchWord: '',
				// CHECKING-待审核;PASS-通过;REBUT-驳回;
				state: 'CHECKING',
				userId: null
			},
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
