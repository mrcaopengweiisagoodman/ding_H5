const contract_gain_type = {
	"contractId":30,
	"contractType":0,
	"deptId":"1",
	"deptName":"Jack的幻想乡",
	"title":"聚聚吕剧吕",
	"eventType":1,
	"amount":55633886,
	"leaseTerm":6,
	"approver":"[]",
	"enclosure":"[{\"spaceId\":\"1422820568\",\"fileId\":\"5855056398\",\"fileName\":\"mmexport1557050065419.jpg\",\"fileSize\":33853,\"fileType\":\"jpg\"}]",
	"pid":null,
	"cids":null,
	"content":"哦吼吼工程款",
	"approvalState":null,
	"originatorId":"042827545726609513",
	"originatorName":"曹鹏伟",
	"messageBoard":null,
	"notified":null,
	"partyId":null,
	"partyName":null,
	"paymentSettings":"[{\"payTime\":\"2019-05-06T09:42:35.711Z\",\"reminderTime\":\"2019-05-06T09:42:38.062Z\",\"payCondition\":\"v卡罗拉\"},{\"payTime\":\"2019-04-06T09:42:42.320Z\",\"reminderTime\":\"2019-05-10T09:42:44.737Z\",\"payCondition\":\"你咯\"}]",
	"createTime":"2019-05-06T17:43:26",
	"updateTime":"2019-05-06T17:43:26"
};
const contract_info = { 
	"contract":{
		"contractId":33,
		"contractType":1,
		"deptId":"1",
		"deptName":"Jack的幻想乡",
		"title":"VB呢",
		"eventType":1,
		"amount":9,
		"leaseTerm":6,
		"approver":"[{\"name\":\"田帅\",\"avatar\":\"\",\"emplId\":\"0125056400954069\"},{\"name\":\"徐培杰\",\"avatar\":\"https://static.dingtalk.com/media/lADOmc3TUM0BsM0Brw_431_432.jpg\",\"emplId\":\"manager4140\"},{\"name\":\"曹鹏伟\",\"avatar\":\"\",\"emplId\":\"042827545726609513\"}]",
		"enclosure":"[]",
		"pid":null,
		"cids": '30,',
		"content":'内容哟哈德漏发了丰厚的浪费了',
		"approvalState": 'REBUT',
		"originatorId":"042827545726609513",
		"originatorName":"曹鹏伟",
		"messageBoard":null,
		"notified":null,
		"partyId":null,
		"partyName": '田帅帅',
		"paymentSettings":"[{\"payTime\":\"2019-08-07T02:21:35.686Z\",\"reminderTime\":\"2019-05-10T02:21:38.322Z\",\"payCondition\":\"吧\"}]",
		"createTime":"2019-05-07T10:21:50",
		"updateTime":"2019-05-07T10:21:50",
		"childNames": ['哇哈哈id是5']
	}
}
const contract_search = {
	values: {
		search: {
			list: [{
				"contractId":34,
				"contractType":0,
				"deptId":"1",
				"deptName":"Jack的幻想乡",
				"title":"股海护航还好还好哈",
				"eventType":2,
				"amount":666,
				"leaseTerm":9,
				"approver":"[{\"name\":\"田帅\",\"avatar\":\"\",\"emplId\":\"0125056400954069\"},{\"name\":\"徐培杰\",\"avatar\":\"https://static.dingtalk.com/media/lADOmc3TUM0BsM0Brw_431_432.jpg\",\"emplId\":\"manager4140\"},{\"name\":\"曹鹏伟\",\"avatar\":\"\",\"emplId\":\"042827545726609513\"}]",
				"enclosure":"[]",
				"pid":null,
				"cids":"37,",
				"content":"66469496646就是觉得快上课了周六上课",
				"approvalState":null,
				"originatorId":"042827545726609513",
				"originatorName":"曹鹏伟",
				"messageBoard":null,
				"notified":null,
				"partyId":null,
				"partyName":"人民",
				"paymentSettings":"[{\"payTime\":\"2019-05-07T02:50:08.450Z\",\"reminderTime\":\"2019-05-15T02:50:10.205Z\",\"payCondition\":\"你怎么真快\"},{\"payTime\":\"2019-12-07T02:50:15.871Z\",\"reminderTime\":\"2019-12-07T02:50:18.786Z\",\"payCondition\":\"看着你夸我呢新希望\"}]",
				"createTime":"2019-05-07T02:50:51",
				"updateTime":"2019-05-07T02:50:51",
				"childNames":["股海航还好的标题"]
			},
			]
		}
	}
}
const ding_dept_info = {
	values: {
		info: {
			"111012582": '&',
			"111712572": '部门1'
		}
	}
}
const Json = {
	// 合同列表数据
	type: contract_gain_type,
	// 合同详情
	detail: contract_info,
	// 关联合同搜索结果
	search: contract_search,
	// 合同内审获取部门信息
	dept: ding_dept_info

}
export default Json;

