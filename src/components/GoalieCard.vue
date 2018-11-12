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
        createdOn: Date,
        content: String,
        userId: String,
        userName: String
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
    margin: 1.5em 0 0;
    color: #223;
    font-size: 1rem;
    transition: all 0.5s ease-in-out;
}

.card__title {
    font-weight: 400;
    line-height: 1.25;
}

.card__content {
    margin: 0 1em;
    padding: 1.25em;
    border-radius: 10px;
    background: rgba(250, 250, 250, 0.9);
    box-shadow: 0 1px 2px rgba(10, 10, 10, .2);
}

.button {
    -moz-appearance: none;
    -webkit-appearance: none;
    border: none;
}

.button--add {
    padding: 0.6em 0.8em;
    font-size: 1rem;
    border-radius: 8px;
    box-shadow: 0 1px 2px rgba(10, 10, 10, .2);
}

.button__icon--add,
.button--delete {
    background-color: rgba(10, 10, 10, .2);
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

.button__icon--add {
    margin-right: 10px;
}

.button__icon--add::after,
.button__icon--add::before,
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

.button__icon--add::after,
.button__icon--add::before {
    -webkit-transform: translateX(-50%) translateY(-50%) rotate(0);
    transform: translateX(-50%) translateY(-50%) rotate(0);
}


.button__icon--add::before,
.button--delete::before {
    height: 2px;
    width: 50%
}

.button__icon--add::after,
.button--delete::after {
    height: 50%;
    width: 2px
}

.button__icon--add:focus,
.button__icon--add:hover {
    background-color: rgba(10, 150, 10, .3)
}

.button--delete:focus,
.button--delete:hover {
    background-color: rgba(150, 10, 10, .3)
}

.button--delete:active {
    background-color: rgba(10,10,10,.4)
}

.float-right {
    float: right;
}

.drop.over .card__content {
    background: rgba(255, 255, 235, 1)
}
</style>