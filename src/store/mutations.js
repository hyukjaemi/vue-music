import * as types from './mutation-type'
const matutations ={
    [types.SET_SINGER](state,singer) {
        state.singer = singer;
    }
}
export default matutations; 