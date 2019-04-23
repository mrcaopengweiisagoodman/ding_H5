// React状态的逻辑处理
import PageConst from './PageConst';
import { apiSync } from 'utils'

export default {
    defaults(props) {
        //初始的state
        return {  
			...PageConst,
        	
        }
    }

};
