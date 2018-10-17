import jsonp from '../../jsonp';
import {commonParams, options} from './config'
import axios from 'axios'

export function getRecommend() {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'

  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  })

  return jsonp(url, data, options)
}

export function getPlaylist(){
  const url = "/api/getDiscList";
  const data = Object.assign({},commonParams,{
    platform:'yqq',
    hostUin:0,
    sin:0,
    ein:29,
    sortId:5,
    needNewCode:0,
    categoryId:10000000,
    rnd:Math.random(),
    format:'json'
  })
  return axios.get(url,{
    params:data
  }).then((res)=>{
    return Promise.resolve(res.data)
  })
}

export function getSongList(dissid){
  const url='/api/getSongList';
  const data = Object.assign({},commonParams,{
    disstid:dissid,
    type:1,
    json:1,
    utf8:1,
    onlysong: 0,
    hostUin: 0,
    platform:'yqq',
    needNewCode: 0,
    g_tk: 1447388385,
    format:'json',
    notice:0
  })
  return axios.get(url, {
      params: data
  }).then((res) => {
      return Promise.resolve(res.data)
  })
}