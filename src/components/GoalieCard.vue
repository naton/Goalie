<template>
    <div class="card"
        :id="id"
        @mouseenter="handleHover({id: id, top: top, left: left, width: width, height: height})"
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
            over: false,
            width: null,
            height: null,
            top: null,
            left: null,
        }
    },
    mounted() {
        this.$el.querySelector('.subtitle').innerText = this.content
        this.width = this.$el.offsetWidth
        this.height = this.$el.offsetHeight
        this.top = this.$el.offsetTop
        this.left = this.$el.offsetLeft
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
.drop.over {
    border-color: #aaa;
    background: #ccc;
}
</style>