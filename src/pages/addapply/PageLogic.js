// 添加风控申请
import PageConst from './PageConst';

export default {
    defaults(props) {
        //初始的state
        return {  
        	// 审批人
        	approver: [],
        	// 上传文件之后返回的数据数组
        	enclosure: [],
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
