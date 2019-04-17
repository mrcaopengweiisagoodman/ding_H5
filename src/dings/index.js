
import jsapi from './jsapi.json';

const { CORP_ID, AUTH_URL, APP_URL } = require(`config/${ENV}.json`);

class DingClient {

    sync( dingtalkFunciton, parameter ){
        return new Promise( (resolve, reject) => {
            parameter={ ...parameter, ...CORP_ID, 
                onSuccess: res => { resolve(res) },
                onFail: err => { reject(err) } 
            };
            
            dingtalkFunciton( parameter );
        })
    }

    ddConfig(){
        return new Promise( (resolve, reject) => {
            let jsapiArr= new Array();
            for (var i in jsapi ) { jsapi[i]
                ? jsapiArr.push(i)  
                : ""  
            };      

           /* ( async () => { 

                const res = await fetch( AUTH_URL+"ding/sign",  {   
                    method:"get", 
                    headers: {  
                        'Accept': 'application/json', 
                        'Content-Type': 'application/json'
                    }
                });

                const text= await res.text();
                const data= JSON.parse(text);

                dd.config({            
                    agentId: data.agentId,
                    corpId: data.corpId,
                    timeStamp:data.timeStamp,
                    nonceStr: data.nonceStr,
                    signature: data.signature,
                    jsApiList: jsapiArr
                })

                dd.error( function (error) { 
                    reject("DingTalk jsApi concent : ",JSON.stringify(error)) 
                });

                dd.ready( function () { 
                    resolve('DingTalk jsApi concent  ok: ') 
                });

            })();*/
        }); 
    };
};

export default new DingClient();
   