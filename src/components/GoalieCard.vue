<template>
    <div class="card"
        :id="id"
        @mouseenter="handleHover({id: id, dimensions: dimensions})"
        @mouseleave="handleHover">
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
    },
    components: {
        Drag,
        Drop
    },
    data() {
        return {
            over: false
        }
    },
    computed: {
        dimensions: function() {
            return {
                width: this.$el.offsetWidth,
                height: this.$el.offsetHeight,
                top: this.$el.offsetTop,
                left: this.$el.offsetLeft,
            }
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
        handleHover(data) {
            this.$emit('hoverCard', data)
        },
        update(event) {
            this.$emit('update', event.target.innerText)
        },
        deleteCard(id) {
            this.$emit('deleteCard', id)
        },
    }  
}
</script>

<style>
.card {
    background: rgba(245, 245, 245, 0.75)
}

.drop.over {
    background: rgba(255, 255, 235, 0.75)
}
</style>