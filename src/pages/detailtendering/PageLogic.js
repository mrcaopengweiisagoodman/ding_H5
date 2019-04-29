import PageConst from './PageConst';

export default {
    defaults(props) {
        //初始的state
        return {  
        	test: '',
        	...PageConst,
        	// 招投标id
        	id: '',
        	// 详情数据
        	detailData: null,
        	// 被@的联系人集合
        	userIds: [],
        	// 被@的联系人的id
            emplIds: [],
        	// 留言板信息
        	messageBoard: [],
        	// 是否已经选择@人
        	isChooseContact: false
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
