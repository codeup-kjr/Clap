<template>
    <v-ons-button class="NormalB" @click.prevent="pushPage(nextP)">{{text}}</v-ons-button>
</template>

<script>
import Vue from 'vue'
export default {
    methods: {
        pushPage(page) {
            this.$store.commit('push', page)
        }
    }
}
</script>

<style scoped>
    .NormalB {
        text-align: center;
        margin: 6px 0;
        width: 200px;
    }
</style>
