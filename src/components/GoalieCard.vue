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
        id: String,
        content: String,
    },
    mounted() {
        this.$el.querySelector('.subtitle').innerText = this.content
    },
    methods: {
        update(event) {
            this.$emit('update', event.target.innerText)
        },
        deleteCard(id) {
            this.$emit('deleteCard', id)
        }
    }  
}
</script>