<template>
    <!-- section class="column" :scroll="handleScroll" -->
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
        // handleScroll() {
        //     app.drawLinesTo = []
        // }
    },
    // mounted () {
    //     this.$el.addEventListener('scroll', this.handleScroll);
    // },
    // destroyed () {
    //     this.$el.removeEventListener('scroll', this.handleScroll);
    // }
}
</script>

<style>
.columns {
    display: flex;
}

.column {
    position: relative;
    flex-basis: 0;
    flex-grow: 1;
    flex-shrink: 1;
    overflow: auto;
    height: 100vh;
}

.column__title {
    position: sticky;
    z-index: 1;
    top: 0;
    margin: 10px 10px 5px;
}
</style>