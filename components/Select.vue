<template>
    <v-ons-select modifier="material">
        <option disabled selected>{{ph}}</option>
        <option v-for="item in items" :key="item.id" :value="item.value">
            {{ item.text }}
        </option>
    </v-ons-select>
</template>

<script>
export default {

}
</script>

<style scoped>

</style>
