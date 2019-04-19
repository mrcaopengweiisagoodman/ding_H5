// React状态的逻辑处理
import { apiSync } from 'utils'
import PageConst from './PageConst';

export default {
	// state默认值
    defaults(props) {
		console.log(props,PageConst)
        return {  
			...PageConst,
			searchVal: '',
			data_lianxiren: null

        }
    },
	// 更改状态
	setSearchVal (ctx,data) {	
		ctx.setState({
			searchVal: data
		})
	},
	
};
