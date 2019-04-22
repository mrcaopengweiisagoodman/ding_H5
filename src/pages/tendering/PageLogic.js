// React状态的逻辑处理
import { apiSync } from 'utils'
import PageConst from './PageConst';

export default {
	// state默认值
    defaults(props) {
		console.log(props,PageConst)
        return {  
			...PageConst,
			listData: [],
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
		console.log(ctx,val)
		alert('更改state',JSON.stringify(val));
		ctx.setState(val);
	},
};
