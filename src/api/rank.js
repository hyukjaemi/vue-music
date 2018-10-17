import jsonp from '../../jsonp';
import {commonParams, options} from './config'

export function getTopList(){
    const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg';
    const data = Object.assign({},commonParams,{
        platform:'h5',
        needNewCode: 1,
        uin:0,
        g_tk: 1447388385
    })
    return jsonp(url,data,options)
}
export function getMusicList(topid){
    const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg';
    const data = Object.assign({},commonParams,{
        topid,
        platform:'h5',
        needNewCode: 1,
        page:'detail',
        type:'top',
        tpl:3
    })
    return jsonp(url,data,options);
}