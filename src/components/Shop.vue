<template>
    <div id="cartlistapp">
        <shop-header></shop-header>
        <pokemon-list></pokemon-list>
        <cart-list></cart-list>
    </div>
</template>

<script>
import ShopHeader from './ShopHeader.vue';
import PokemonList from './PokemonList.vue';
import CartList from './CartList.vue';

export default {
    name : 'shop',
    components : { ShopHeader, PokemonList, CartList }
}
</script>

<style>
* { margin: 0; padding: 0; }
li { list-style: none; }

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