import PageConst from './PageConst';

export default {
    defaults(props) {
        //初始的state
        return {  
        	deptIds: []
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
