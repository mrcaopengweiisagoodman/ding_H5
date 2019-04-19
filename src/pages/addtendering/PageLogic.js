import { apiSync } from 'utils'
import PageConst from './PageConst';

export default {
    defaults(props) {
        //初始的state
        return {  
        	data_lianxiren: 'null'
        }
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
