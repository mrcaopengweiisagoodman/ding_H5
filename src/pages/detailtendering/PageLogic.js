import PageConst from './PageConst';

export default {
    defaults(props) {
        //初始的state
        return {  
        	...PageConst,
        	// 招投标id
        	id: '',
        	// 详情数据
        	detailData: null
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
