// addtendering
import { apiSync } from 'utils'
import PageConst from './PageConst';

export default {
    defaults(props) {
        //初始的state
        return {  
        	testStr: '',
        	approver: [], // 审批人
        	copyPerson: [], // 抄送人  
        	enclosure: [], // 上传文件之后返回的数据数组
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
