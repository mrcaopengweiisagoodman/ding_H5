// React状态的逻辑处理
import { apiSync } from 'utils'
import PageConst from './PageConst';

export default {
	// 初始状态
    defaults(props) {
        return {  
			empty: true, 
			loading: false, 
			...PageConst, 
            tabbarIndex: 0,
			team: {
				corpId: '',
				appId: 0,
			},
			// 根据该值来判断执行哪一个api
			ddApiState: '',
			ddIds: {
				agentId: '', // 必填，微应用ID
				corpId: 0,//必填，企
			},
			approver: null
        }
    },

    setTabbarIndex( ctx, data ) {
        ctx.setState({ tabbarIndex:data });
    },
	/**
	 * 修改state
	 * @param ctx
	 * @param key 需要更改的state 的key值
	 * @param val 
	 */
	setStateData (ctx,key,val) {
		let key_ = {};
		key_[key] = val;
		ctx.setState(key_);
	},
	/**
	 * 修改状态值来使用钉钉API
	 */
	setDdApiState (ctx,str) {
		ctx.setState({ddApiState: str});
	},
	/**
	 * 保存企业id和微应用id
	 */
	setDdIds (ctx,val) {
		console.log(val)
		ctx.setState(val);
	}
};
