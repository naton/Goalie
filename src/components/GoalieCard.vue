<template>
    <div class="card" :title="id">
        <drop class="drop"
            :class="{ over }"
            @dragenter="to = id; handleEnter(to)"
            @dragover="over = true"
            @dragleave="over = false"
            @drop="handleDrop(to)">
            <div class="card-content">
                <button class="delete is-pulled-right" @click="deleteCard(id)"></button>
                <p class="subtitle" contenteditable="true" @input="update"></p>
            </div>
            <drag class="drag"
                :effect-allowed="['link']"
                @dragstart="handleStart(id);"
            >🔗</drag>
        </drop>
    </div>
</template>

<script>
import { Drag, Drop } from 'vue-drag-drop';

export default {
    name: 'GoalieCard',
    props: {
        id: String,
        column: Number,
        content: String,
        weight: Number,
        connectsTo: Array,
    },
    components: {
        Drag,
        Drop
    },
    data() {
        return {
            over: false,
            from: null,
            to: null
        }
    },
    mounted() {
        this.$el.querySelector('.subtitle').innerText = this.content
    },
    methods: {
        handleStart(id) {
            this.$emit('prepareConnectCard', {from: id})
        },
        handleEnter(id) {
            this.$emit('prepareConnectCard', {to: id})
        },
        handleDrop(id) {
            this.over = false
            this.$emit('connectCards')
        },
        update(event) {
            this.$emit('update', event.target.innerText)
        },
        deleteCard(id) {
            this.$emit('deleteCard', id)
        }
    }  
}
</script>

<style>
.drop.over {
    border-color: #aaa;
    background: #ccc;
}
</style>