<template>
    <div class="app">
        <div class="wrapper">
            <div class="products">
                <v-select :on-change="search" class="products__search" :value.sync="selectedPokemon" :options="pokemon_info"></v-select>
                <pokemon-list :is-pokemon-loaded="isPokemonLoaded"></pokemon-list>
                
                <button class="products__btn--big" @click="getPokemons(false)">10마리 더보기</button>
            </div>
        </div>

        <div class="loading" v-show="isLoaded">
            <div class="lds-css ng-scope">
                <div style="width:100%;height:100%" class="lds-ball">
                    <div></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Constant from '../constant'
import { mapState } from 'vuex'
import CONF from '../Config.js'
import vSelect from "vue-select"
import PokemonList from "./PokemonList.vue"

export default {
    components : { vSelect, PokemonList },
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
            isLoaded : false,
            isPokemonLoaded : false,
            pose : "",
            selectedPokemon : null,
        }
    },
    created() {
        this.getPokemons(true); // 초기 목록
        this.getPokemonInfo().then((value) => { // 포켓몬 서치 목록 세팅
            this.pokemon_info = value;
        });
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
        search : function(pokemon) {
            this.$axios.get(CONF.SEARCH_POKEMON_BY_NUM.replace("${no}", pokemon.value))
            .then((response) => {
                this.$store.dispatch(Constant.CHANGE_OFFSET, { offset : response.data.id - 10 }); // 더보기 버튼을 누를 시 offset이 +10이 되기 때문에 -10을 해준다
                this.$store.dispatch(Constant.SEARCH_POKEMON, { pokemon : response.data });
            })
            .catch((ex) => {

            })
        },
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
        getPokemons : function(isFirst) { // 포켓몬 조회 (isFirst : 페이지 로딩 후 첫 조회인지 더보기 버튼을 이용한 조회인지 )
            if (isFirst) { // 처음이 아니라면
                this.isLoaded = true;
            } else {
                this.pokemons = [];
                this.$store.dispatch(Constant.CHANGE_OFFSET, { offset : this.offset+10 });
                this.isPokemonLoaded = true;
            }

            this.$axios.get(CONF.ALL_POKEMON, {
                params : { limit : 10, offset : this.offset }, // 불러올 포켓몬 수, 불러오기 시작할 도감번호
            })
            .then((response) => {
                this.pokemon_url = response.data.results.map((cur) => { // 포켓몬 배열 (각자의 url, 이름)에서 각자의 url로 배열 생성 (pokemon_url)
                    return this.$axios.get(cur.url);
                });

                this.$axios.all(this.pokemon_url) // API의 모든 로딩이 끝나면 실행됨
                .then((response) => {
                    for (let r of response) {
                        this.pokemons.push(r.data);
                    }

                    if (isFirst) {
                        this.isLoaded = false;
                    } else {
                        this.isPokemonLoaded = false;
                    }

                    this.$store.dispatch(Constant.LOAD_POKEMON, { pokemons : this.pokemons });
                });
            })
            .catch((ex) => {
                console.log("Error : ", ex);
            })
        }, 
        getPokemonInfo : function() {
            let pokemon_info = [];
            let index = 0;

            return this.$axios.get(CONF.ALL_POKEMON, {
                params : { limit : 802, offset : 0 }
            })
            .then((response) => {
                pokemon_info = response.data.results.map((cur) => { // 포켓몬 배열 (각자의 url, 이름)에서 각자의 url로 배열 생성 (pokemon_url)
                    index++;
                    return { label : "No."+index+" "+cur.name, value : cur.name };
                });

                return pokemon_info;
            })
            .catch((ex) => {
                console.log("Error : ", ex);
            })
        },
    }
}
</script>

<style lang="scss">
$green: #4fc08d;

.header { 
    width: 100%; height: 70px;
    line-height: 70px;
    color: #fff;
    text-align: center;
    background-color: $green;
    position: fixed;
    top: 0;
}

.wrapper {
    width: 1080px;
    margin: 0 auto;
}

.products {
    margin-top: 70px;
    text-align: center;

    @mixin btn-base {
        display: inline-block;
        margin-top: 10px;
        color: #fff;
        background-color: $green;
        border: 0;
        border-radius: 5px;
        padding: 10px;
        cursor: pointer;
    }

    &__search {
        display: block;
        width: calc(100% - 40px);
        // border: 1px solid $green;
        // border-radius: 5px;
        box-sizing: border-box;
        font-size: 15px;
        margin: 90px auto 0;
    }

    &__list {
        padding: 20px;
        padding-right: 0;
    }
    &__list:after {
        content: '';
        display: block;
        clear: both;
    }
    &__img {
        width: 80%;

        &--front {
            @include btn-base();
            background-color: $green;
        }

        &--back {
            @include btn-base();
            background-color: crimson;
        }
    }
    &__list li {
        width: 245px;
        text-align: center;
        border: 1px solid $green;
        box-sizing: border-box;
        margin-right: 20px;
        margin-bottom: 20px;
        padding: 5px;
        float: left;
    }
    &__btn {
        @include btn-base();
    }
    &__btn--big {
        @include btn-base();
        padding: 15px;
        font-size: 20px;
    }
    &__name {
        color: $green;
        font-size: 16px;
    }
}

@mixin loading-base {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0; left: 0;
    background: #fff;
    z-index: 1;
}

.loading{
    @include loading-base();

    &--inline {
        position: static;
        border: 0 !important;
    }
}

.v-select .dropdown-toggle {
    border: 1px solid $green !important;
}

@keyframes lds-ball {
  0%, 100% {
    animation-timing-function: cubic-bezier(0.45, 0, 0.9, 0.55);
  }
  0% {
    -webkit-transform: translate(0, 0);
    transform: translate(0, 0);
  }
  50% {
    -webkit-transform: translate(0, 108px);
    transform: translate(0, 108px);
    animation-timing-function: cubic-bezier(0, 0.45, 0.55, 0.9);
  }
  100% {
    -webkit-transform: translate(0, 0);
    transform: translate(0, 0);
  }
}
@-webkit-keyframes lds-ball {
  0%, 100% {
    animation-timing-function: cubic-bezier(0.45, 0, 0.9, 0.55);
  }
  0% {
    -webkit-transform: translate(0, 0);
    transform: translate(0, 0);
  }
  50% {
    -webkit-transform: translate(0, 108px);
    transform: translate(0, 108px);
    animation-timing-function: cubic-bezier(0, 0.45, 0.55, 0.9);
  }
  100% {
    -webkit-transform: translate(0, 0);
    transform: translate(0, 0);
  }
}
.lds-ball {
    position: relative;
    width: 200px !important;
    height: 200px !important;
    margin: 0 auto;
    -webkit-transform: translate(-100px, -100px) scale(1) translate(100px, 100px);
    transform: translate(-100px, -100px) scale(1) translate(100px, 100px);

    div {
        position: absolute;
        width: 52px;
        height: 52px;
        border-radius: 50%;
        background: $green;
        left: 74px;
        top: 20px;
        -webkit-animation: lds-ball 1s linear infinite;
        animation: lds-ball 1s linear infinite;
    }
}
</style>