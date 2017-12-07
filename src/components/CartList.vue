<template>
<div class="wrapper">
    <div class="like-list">
        <h1>장바구니</h1>
        <form @submit.prevent>
            <table class="like-list__table">
                <tr>
                    <td>이름</td>
                    <td>개수</td>
                    <td>가격</td>
                    <td>삭제</td>
                </tr>

                <tr v-for="(c, index) in this.cartlist">
                    <td>{{c.name}}</td>

                    <td>
                        <input type="number" v-model="c.quantity" min="1" :max="getInventory(c.no)" @input="changeQuantity(getInventory(c.no), index)" /><br>
                        <span :class="{ 
                            alert : c.quantity <= 0 || c.quantity > getInventory(c.no), 
                            success : 0 < c.quantity && c.quantity <= getInventory(c.no) 
                        }">
                            {{c.quantityStatus}}
                        </span>
                    </td>

                    <td>
                        {{numberWithCommas(c.price*c.quantity)}}
                    </td>
                        
                    <td>
                        <button class="product__btn" @click="deleteAtCart(index)">삭제</button>
                    </td>
                </tr>

                <tr>
                    <td colspan="4">
                        합계금액 : {{ numberWithCommas(getSum(this.cartlist)) }}
                        <button type="submit" class="product__btn" @click="checkout">Checkout</button>
                    </td>
                </tr>
            </table>
        </form>

        <div v-show="isCheckout" class="checkout">
            <h1>결제내역</h1>
            <table class="checkout__table">
                <tr>
                    <td>이름</td>
                    <td>개수</td>
                    <td>가격</td>
                </tr>

                <tr v-for="(c, index) of this.checkoutResult">
                    <td>{{c.name}}</td>
                    <td>
                        {{c.quantity}}<br>
                    </td>
                    <td>{{numberWithCommas(c.price*c.quantity)}}</td>
                </tr>

                <tr>
                    <td colspan="4">
                        합계금액 : {{ numberWithCommas(getSum(this.checkoutResult)) }}
                    </td>
                </tr>
            </table>
        </div>
    </div>
</div>
</template>

<script>
import Constant from '../constant'
import { mapState, mapGetters } from 'vuex'

export default {
    data() {
        return {
            isCheckout : false
        }
    },
    computed : {
        ... mapState([
            'pokemonlist',
            'cartlist',
            'checkoutResult'
        ]),
    },
    methods : {
        changeQuantity(inventory, index) {
            if (this.cartlist[index].quantity > inventory) { // 수량 초과
                this.$store.dispatch(Constant.TOO_MUCH_QUANTITY, { index, quantityStatus : this.cartlist[index].quantityStatus });
                this.validQuantity = false;
            } else if (this.cartlist[index].quantity < 1) { // 수량 미달
                this.$store.dispatch(Constant.TOO_LOW_QUANTITY, { index, quantityStatus : this.cartlist[index].quantityStatus });
                this.validQuantity = false;
            } else { // 올바른 값
                this.$store.dispatch(Constant.RIGHT_QUANTITY, { index, quantityStatus : this.cartlist[index].quantityStatus });
                this.validQuantity = true;
            }
        },
        getQuantityStatus() {
            return this.quantityStatus;
        },
        deleteAtCart : function(index) {
            this.$store.dispatch(Constant.DELETE_AT_CART, { pokemon : this.cartlist[index], index : index });
        },
        getInventory : function(no) {
            for (let p of this.pokemonlist) {
                if (no == p.no) {
                    return p.inventory;
                }
            }
        },
        numberWithCommas : function(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+"원";
        },
        getSum : function(arr) {
            let sum = 0;

            for (let c of arr) {
                sum += c.price * c.quantity;
            }

            return sum;
        },
        checkout() {
            let result = JSON.parse(JSON.stringify(this.cartlist));
            this.$store.dispatch(Constant.CHECKOUT, { result : result, cartlist : this.cartlist });
            this.isCheckout = true;
        }
    }
}
</script>

<style scoped lang="scss">
$green: #4fc08d;

.like-list {
    padding: 20px;

    h1 {
        color: $green;
        margin-bottom: 20px;
    }

    &__table, tr, td {
        border: 1px solid $green;
        border-collapse: collapse;
    }

    &__table {
        width: 100%;
        text-align: center;
        margin-bottom: 20px;
    }

    &__table td {
        padding: 5px;
    }

    &__table td input[type=number] {
        width: 70px;
        text-align: center;
    }
}

.checkout__table  {
    border: 1px solid $green;
    border-collapse: collapse;
    width: 100%;
    text-align: center;
    margin-bottom: 20px;
}

.checkout__table td {
    padding: 5px;
}

.product__btn {
    display: inline-block;
    margin-top: 10px;
    color: #fff;
    background-color: $green;
    border: 0;
    border-radius: 5px;
    padding: 10px;
    cursor: pointer;
}
</style>