<template>
    <section class="column">
        <h1 class="column__title">{{ title }} <button @click="handleClick(id)" class="button float-right">{{ buttonText }}</button></h1>
        <slot></slot>
    </section>
</template>

<script>
export default {
    name: 'GoalieColumn',
    props: {
        id: String,
        title: String,
        buttonText: String,
    },
    methods: {
        handleClick(id) {
            this.$emit('add-card', id)
        },
    }
}
</script>

<style>
.columns {
    display: flex;
}

.column {
    position: relative;
    height: 100vh;
    flex-basis: 0;
    flex-grow: 1;
    flex-shrink: 1;
    overflow: auto;
}

.column__title {
    position: sticky;
    z-index: 1;
    top: 0;
    margin: 0 -2px 2px;
    padding: 10px 10px 5px;
    background-color: #fff;
}
</style>