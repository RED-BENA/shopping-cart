export default {
    LOAD_POKEMON : "loadPokemon", // 포켓몬 조회
    SEARCH_POKEMON : "searchPokemon", // 포켓몬 검색
    ADD_TO_CART : "addToCart", // 장바구니에 아이템 추가 (최초 한 번만)
    CHANGE_QUANTITY : "changeQuantity",
    DELETE_AT_CART : "deleteAtCart", // 장바구니에 아이템 제거
    CHECKOUT : "checkout", // 체크아웃
    TOO_MUCH_QUANTITY : "tooMuchQuantity", // 수량 초과 입력  
    TOO_LOW_QUANTITY : "tooLowQuantity", // 수량 미달 입력
    RIGHT_QUANTITY : "rightQuantity", // 올바른 수량 입력
    TOGGLE_POSE : "togglePose" // 포즈 변화 (front, back)
}