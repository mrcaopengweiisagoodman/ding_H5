// React状态的逻辑处理
import { apiSync } from 'utils'
import PendingConst from './PendingConst';

export default {
    defaults(props) {
        return {  empty: true, loading: false, ...PendingConst, 
            tabbarIndex: 0,
        }
    },

    setTabbarIndex( ctx, data ) {
        ctx.setState({ tabbarIndex:data });
    },

};
