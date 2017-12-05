<template>
    <div class="app">
        <div class="wrapper">
            <div class="products">
                <ul class="products__list">
                    <li v-for="(p, index) in this.pokemonlist">
                        <h3 class="products__name">No.{{p.no}} {{p.name}}</h3>
                        <img class="products__img" :src="getImgName(p)" /><br>
                        키 : {{p.height}}m 몸무게 : {{p.weight}}kg<br>
                        타입 : {{p.type}}<br><br>
                        {{numberWithCommas(p.price)}}<br>
                        남은 수량 : {{p.inventory}}개<br>
                        <span v-show="p.isSoldOut" class="alert">품절</span>
                        <button class="products__btn" @click="addToCart(index)">장바구니</button>
                    </li>
                </ul>
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

export default {
    computed : mapState(['pokemonlist', 'cartlist']),
    data() {
        return {
            pokemon_url : [],
            pokemons : [],
            isLoaded : false
        }
    },
    created() {
        this.isLoaded = true;

        this.$axios.get(CONF.ALL_POKEMON, {
            params : { limit : 10 } // 1세대 포켓몬만
        })
        .then((response) => {
            // console.log(response.data);
            // for (let p of response.data.results) {
            //     this.$axios.get(p.url, { })
            //     .then((response) => {
            //         this.pokemons.push(response.data);
            //     })
            //     .catch((ex) => {
            //         console.log("Error : ", ex);
            //     })
            // }
            
            // this.url = response.data.results.map(function(cur) {
            //     console.log('axios')
            //     console.log(this.$axios)
            //     return this.$axios.get(cur.url);
            // });

            this.pokemon_url = response.data.results.map((cur) => {
                return this.$axios.get(cur.url);
            });

            this.$axios.all(this.pokemon_url)
            .then((response) => {
                // console.log(response);
                for (let r of response) {
                    this.pokemons.push(r.data);
                }

                // console.log(this.pokemons);

                this.$store.dispatch(Constant.LOAD_POKEMON, { pokemons : this.pokemons });
                this.isLoaded = false;
            });
        })
        .catch((ex) => {
            console.log("Error : ", ex);
        })
    },
    methods : {
        addToCart : function(index) {
            this.$store.dispatch(Constant.ADD_TO_CART, { pokemon : this.pokemonlist[index] })
        },
        numberWithCommas : function(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+"원";
        },
        getImgName : function(p) {
            return p.sprite.front_default;
        },
    }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Roboto');
* { margin: 0; padding: 0; }
li { list-style: none; }
body { font-family: 'Roboto', sans-serif; }

.header { 
    width: 100%; height: 70px;
    line-height: 70px;
    color: #fff;
    text-align: center;
    background-color: #4fc08d;
    position: fixed;
    top: 0;
}

.wrapper {
    width: 1080px;
    margin: 0 auto;
}

.products {
    margin-top: 70px;
}

.products__list {
    padding: 20px;
    padding-right: 0;
}

.products__img {
    width: 80%;
}

.products__list:after {
    content: '';
    display: block;
    clear: both;
}

.products__list li {
    width: 245px;
    text-align: center;
    border: 1px solid #4fc08d;
    box-sizing: border-box;
    margin-right: 20px;
    margin-bottom: 20px;
    padding: 5px;
    /* position: relative; */
    float: left;
}

.products__btn {
    margin-top: 10px;
    color: #fff;
    background-color: #4fc08d;
    border: 0;
    border-radius: 5px;
    padding: 10px;
    cursor: pointer;
}

.loading {
    width: 100%; height: 100%;
    position: absolute;
    top: 0; left: 0;
    background: #fff;
    z-index: 1;
}

.products__name {
    color: #4fc08d;
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
}
.lds-ball div {
  position: absolute;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: #4fc08d;
  left: 74px;
  top: 20px;
  -webkit-animation: lds-ball 1s linear infinite;
  animation: lds-ball 1s linear infinite;
}
.lds-ball {
  width: 200px !important;
  height: 200px !important;
  margin: 0 auto;
  -webkit-transform: translate(-100px, -100px) scale(1) translate(100px, 100px);
  transform: translate(-100px, -100px) scale(1) translate(100px, 100px);
}
</style>