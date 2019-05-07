// React状态的逻辑处理
import PageConst from './PageConst';
import { apiSync } from 'utils'

export default {
    defaults(props) {
        //初始的state
        return {  
			...PageConst,
        	listData: [], // 招投标数据列表
        	type: 0,
			pageInfo: {
				pageNum: 1,
				pageSize: 1000,
				searchWord: '',
				// CHECKING-待审核;PASS-通过;REBUT-驳回;
				state: 0,
				userId: null
			},
        }
    },
    // 更改状态
	setSearchVal (ctx,data) {	
		ctx.setState({
			searchVal: data
		})
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
