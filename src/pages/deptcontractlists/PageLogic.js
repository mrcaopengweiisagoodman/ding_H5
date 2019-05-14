import PageConst from './PageConst';
import { apiSync } from 'utils'

export default {
    defaults(props) {
        //初始的state
        return {  
        	deptId: '',
        	searchVal: '',
        	startTime: '',
        	endTime: '',
        	listData: [],
        	// 选择时间框是否显示
        	isTimeBox: false
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