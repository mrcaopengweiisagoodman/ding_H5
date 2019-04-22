// addtendering
import { apiSync } from 'utils'
import PageConst from './PageConst';

export default {
    defaults(props) {
        //初始的state
        return {  
        	approver: [], // 审批人
        	copyPerson: [], // 抄送人  
        }
    },
    /**
	 * 修改state
	 * @param ctx
	 * @param val 
	 */
	setStateData (ctx,val) {
		console.log(ctx,val)
		dd.device.notification.alert({
			message: "更改state的值:" + JSON.stringify(val),
			title: "警告",
			buttonName: "确定"
		});
		ctx.setState(val);
	},
};
