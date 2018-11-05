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
            @drop="handleDrop()">
            <drag class="drag"
                :effect-allowed="['link']"
                @dragstart="handleStart(id);">
                <div class="card__content">
                    <button class="button button--delete float-right" @click="deleteCard(id)"></button>
                    <h3 class="card__title" contenteditable="true" @input="updateContent"></h3>
                </div>
            </drag>
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
                top: this.$el.getBoundingClientRect().top,
                left: this.$el.getBoundingClientRect().left,
            }
        }
    },
    mounted() {
        this.$el.querySelector('h3').innerText = this.content
    },
    methods: {
        handleStart(id) {
            this.$emit('prepare-connect-card', {from: id})
        },
        handleEnter(id) {
            this.$emit('prepare-connect-card', {to: id})
        },
        handleDrop() {
            this.over = false
            this.$emit('connect-cards')
        },
        handleHover(data) {
            this.$emit('hover-card', data)
        },
        updateContent(event) {
            this.$emit('update-content', event.target.innerText)
        },
        deleteCard(id) {
            this.$emit('delete-card', id)
        },
    }  
}
</script>

<style>
.card {
    width: 100%;
    margin: 20px 0 0;
    color: #4a4a4a;
    transition: all 0.5s ease-in-out;
}

.card__title {
    color: #4a4a4a;
    font-size: 1.25rem;
    font-weight: 400;
    line-height: 1.25;
}

.card__content {
    margin: 0 10px;
    background: rgba(245, 245, 245, 0.75);
    box-shadow: 0 2px 3px rgba(10,10,10,.1), 0 0 0 1px rgba(10,10,10,.1);
    padding: 1.5rem;
}

.button {
    -moz-appearance: none;
    -webkit-appearance: none;
    border: none;
}

.button--delete {
    background-color: rgba(10,10,10,.2);
    border-radius: 50%;
    cursor: pointer;
    pointer-events: auto;
    display: inline-block;
    flex-grow: 0;
    flex-shrink: 0;
    font-size: 0;
    height: 20px;
    max-height: 20px;
    max-width: 20px;
    min-height: 20px;
    min-width: 20px;
    outline: 0;
    position: relative;
    vertical-align: top;
    width: 20px
}

.button--delete::after,
.button--delete::before {
    background-color: #fff;
    content: "";
    display: block;
    left: 50%;
    position: absolute;
    top: 50%;
    -webkit-transform: translateX(-50%) translateY(-50%) rotate(45deg);
    transform: translateX(-50%) translateY(-50%) rotate(45deg);
    -webkit-transform-origin: center center;
    transform-origin: center center
}

.button--delete::before {
    height: 2px;
    width: 50%
}

.button--delete::after {
    height: 50%;
    width: 2px
}

.button--delete:focus,
.button--delete:hover {
    background-color: rgba(10,10,10,.3)
}

.button--delete:active {
    background-color: rgba(10,10,10,.4)
}

.float-right {
    float: right;
}

.drop.over {
    background: rgba(255, 255, 235, 1)
}
</style>