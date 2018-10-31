<template>
    <div class="card">
      <div class="card-content">
        <button class="delete is-pulled-right" @click="deleteCard(id)"></button>
        <p class="subtitle" contenteditable="true" @input="update"></p>
      </div>
    </div>
</template>

<script>
export default {
    name: 'GoalieCard',
    props: {
        id: Number,
        content: String,
    },
    mounted() {
        this.$el.querySelector('.subtitle').innerText = this.card.content
    },
    methods: {
        update(event) {
            this.$emit('update', event.target.innerText)
        },
        deleteCard(card) {
            var idx = this.cards.indexOf(card)
            this.cards.splice(idx,1)
        }
    }  
}
</script>