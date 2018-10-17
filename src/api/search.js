import jsonp from '../../jsonp';
import {commonParams, options} from './config';
export function getHotKey(){
    const url = "https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg";
    const data = Object.assign({},commonParams,{
        g_tk: 1351448404,
        platform: 'h5',
        needNewCode: 1
    })
    return jsonp(url,data,options);
}