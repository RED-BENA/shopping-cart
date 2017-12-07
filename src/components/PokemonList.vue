<template>
    <ul class="products__list">
        <li v-for="(p, index) in this.pokemonlist">
            <h3 class="products__name">No.{{p.no}} {{p.name}}</h3>
            <img class="products__img" :src="getImgName(p)" /><br>
            <button :class="{ 'products__img--front' : p.isFront, 'products__img--back' : !p.isFront }" @click="togglePose(index)">
                {{ p.isFront | pose }}
            </button><br>
            키 : {{p.height/10}}m 몸무게 : {{p.weight/10}}kg<br>
            타입 : {{p.type}}<br><br>
            {{numberWithCommas(p.price)}}<br>
            남은 수량 : {{p.inventory}}마리<br>
            <span v-show="p.isSoldOut" class="alert">품절</span>
            <button class="products__btn" @click="addToCart(index)">장바구니</button>
        </li>

        <li class="loading--inline" v-show="isPokemonLoaded">
            <div class="lds-css ng-scope">
                <div style="width:100%;height:100%" class="lds-ball">
                    <div></div>
                </div>
            </div>
        </li>
    </ul>
</template>

<script>
import Constant from '../constant'
import { mapState } from 'vuex'
import CONF from '../Config.js'

export default {
    computed : {
        ... mapState([
            'pokemonlist',
            'cartlist',
            'offset'
        ])
    },
    data() {
        return {
            pokemon_url : [],
            pokemon_info : [], // 포켓몬의 번호/이름
            pokemons : [], // api에서 로딩된 포켓몬들
            isPokemonLoaded : false,
            pose : "",
        }
    },
    filters : {
        pose : function(isFront) {
            if (isFront) {
                return "Front";
            }

            return "Back";
        }
    },
    methods : {
        addToCart : function(index) { // 장바구니에 아이템 추가
            this.$store.dispatch(Constant.ADD_TO_CART, { pokemon : this.pokemonlist[index], index : index })
        },
        numberWithCommas : function(x) { // 숫자에 콤마(,) 찍어서 리턴
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+"원";
        },
        getImgName : function(p) { // 이미지 url 리턴

            if (p.isFront) {
                return p.sprite.front_default;
            }

            return p.sprite.back_default;
        }, 
        togglePose : function(index) {
            this.$store.dispatch(Constant.TOGGLE_POSE, { index : index });
        },
    }
}
</script>

<style>

</style>