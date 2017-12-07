<template>
    <div id="cartlistapp">
        <shop-header></shop-header>
        <products></products>
        <cart-list></cart-list>
    </div>
</template>

<script>
import ShopHeader from './ShopHeader.vue';
import Products from './Products.vue';
import CartList from './CartList.vue';

export default {
    name : 'shop',
    components : { ShopHeader, Products, CartList }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Roboto');
* { margin: 0; padding: 0; }
li { list-style: none; }
body { font-family: 'Roboto', sans-serif; }

.wrapper {
    width: 1080px;
    margin: 0 auto;
}

.alert {
    color: crimson;
}

.success {
    color: forestgreen;
}
</style>