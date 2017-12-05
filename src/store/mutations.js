import Constant from '../constant';

export default {
    [Constant.LOAD_POKEMON] : (state, payload) => {
        for (let p of payload.pokemons) {
            let cal_stats = 0;
            let types = "";

            for (let s of p.stats) {
                cal_stats += s.base_stat;
            }

            if (p.types.length == 2) {
                types = p.types[0].type.name + ", " +p.types[1].type.name;
            } else {
                types = p.types[0].type.name
            }

            state.pokemonlist.push({
                no : p.id, 
                name : p.name, 
                height : p.height, 
                weight : p.weight,
                sprite : p.sprites,
                type : types,
                price : cal_stats * 10000,
                inventory : Math.floor((Math.random()*10)+1),
                isSoldOut : false
            })
        } 
    },
    [Constant.ADD_TO_CART] : (state, payload) => {
        let overlap = state.cartlist.find((c) => { // 장바구니에 이미 상품을 추가했는지 검사
            return c.no == payload.pokemon.no;
        });

        if (!overlap) { // 처음 추가한다면
            let index = payload.pokemon.no-1;

            if (state.pokemonlist[index].inventory > 0) { // 재고가 남아있을 경우
                state.cartlist.push({ no : payload.pokemon.no, name : payload.pokemon.name, price : payload.pokemon.price, quantity : 1, quantityStatus : "" });
            } else { // 재고가 없을 경우
                state.pokemonlist[index].isSoldOut = true; // sold out으로 변경
            }
        }
    },
    [Constant.DELETE_AT_CART] : (state, payload) => {
        state.cartlist.splice(payload.index, 1); // 해당 배열을 삭제
    },
    [Constant.CHECKOUT] : (state, payload) => {
        let isValid = true; // 장바구니의 상품이 전부 재고가 존재하는지 여부
        let index = 0;

        for (let c of payload.cartlist) {
            index = c.no-1;

            if ((state.pokemonlist[index].inventory-c.quantity) < 0 || c.quantity <= 0) { // 재고에서 구매개수를 뺐을 때 구매개수가 더 많을 경우 (초과구매)
                isValid = false; // 반복문 수행 중 한 품목이라도 품절이 될 경우 false로 변경
                break;
            }
        }

        if (isValid) {
            for (let c of payload.cartlist) {
                index = c.no-1; // 포켓몬 번호(no)-1는 인덱스 넘버와 같음

                if (state.pokemonlist[index].inventory >= 0) { // 재고가 남았을 때 / 재고만큼 구매했을 때
                    state.pokemonlist[index].inventory -= c.quantity; // 개수만큼 삭감
                    state.checkoutResult = payload.result; // 결제내역에 전달

                    if (state.pokemonlist[index].inventory == 0) { // 재고만큼 구매했을 때
                        state.pokemonlist[index].isSoldOut = true; // 품절
                    }
                }
            }

            state.cartlist = []; // 체크아웃 성공시 장바구니 배열을 비운다
        } 
    },
    [Constant.TOO_MUCH_QUANTITY] : (state, payload) => {
        state.cartlist[payload.index].quantityStatus = "재고수량보다 더 큰 숫자를 입력할 수 없습니다.";
    },
    [Constant.TOO_LOW_QUANTITY] : (state, payload) => {
        state.cartlist[payload.index].quantityStatus = "1보다 작은 숫자를 입력할 수 없습니다.";
    },
    [Constant.RIGHT_QUANTITY] : (state, payload) => {
        state.cartlist[payload.index].quantityStatus = "올바른 수량을 입력하셨습니다.";
    },
}