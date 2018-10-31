<template>
    <div class="column">
      <h2 class="title">
        {{ type }}
        <button @click="addCard(id)" class="button is-pulled-right">Add a card</button>
      </h2>
      <slot></slot>
    </div>
</template>

<script>
export default {
    name: 'GoalieColumn',
    props: {
        id: Number,
        type: String,
    },
    methods: {
        addCard(id) {
            console.log(id);
            // TODO: Keep adding card here in in app?
            // this.$emit('addCard', event)
        }
    }
}
</script>