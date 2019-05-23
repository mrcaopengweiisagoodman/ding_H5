import PageConst from './PageConst';
import { apiSync } from 'utils';

export default {
    defaults(props) {
        //初始的state
        return {  
        	detailData: null,
        	approver: [],
        	enclosure: []
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
