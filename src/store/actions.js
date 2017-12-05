import Constant from '../constant';

export default {
    [Constant.LOAD_POKEMON] : (store, payload) => {
        store.commit(Constant.LOAD_POKEMON, payload);
    },
    [Constant.ADD_TO_CART] : (store, payload) => {
        // console.log(store);
        // console.log(payload);
        store.commit(Constant.ADD_TO_CART, payload);
    },
    [Constant.DELETE_AT_CART] : (store, payload) => {
        store.commit(Constant.DELETE_AT_CART, payload);
    },
    [Constant.CHECKOUT] : (store, payload) => {
        store.commit(Constant.CHECKOUT, payload);
    },
    [Constant.TOO_MUCH_QUANTITY] : (store, payload) => {
        store.commit(Constant.TOO_MUCH_QUANTITY, payload);
    },
    [Constant.TOO_LOW_QUANTITY] : (store, payload) => {
        store.commit(Constant.TOO_LOW_QUANTITY, payload);
    },
    [Constant.RIGHT_QUANTITY] : (store, payload) => {
        store.commit(Constant.RIGHT_QUANTITY, payload);
    }
}