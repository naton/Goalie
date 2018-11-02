<template>
    <div id="app" class="columns">
        <svg id="canvas">
            <g v-for="card in hoveredConnectsTo" :key="card.card">
              <line :x1="card.x1" :y1="card.y1" :x2="card.x2" :y2="card.y2" stroke="black" stroke-width="2" />
            </g>
        </svg>
        <div class="column">
            <h2 class="title">Goals <button @click="addCard(1)" class="button is-pulled-right">Add Goal</button></h2>
            <GoalieCard
                v-for="card in goals"
                :key="card.id"
                :id="card.id"
                :content="card.content"
                @update="card.content = $event"
                @hoverCard="hoverCard"
                @connectCards="connectCards"
                @prepareConnectCard="prepareConnectCard"
                @deleteCard="deleteCard"
            ></GoalieCard>
        </div>
        <div class="column">
            <h2 class="title">Users <button @click="addCard(2)" class="button is-pulled-right">Add User</button></h2>
            <GoalieCard
                v-for="card in users"
                :key="card.id"
                :id="card.id"
                :content="card.content"
                @update="card.content = $event"
                @hoverCard="hoverCard"
                @connectCards="connectCards"
                @prepareConnectCard="prepareConnectCard"
                @deleteCard="deleteCard"
            ></GoalieCard>
        </div>
        <div class="column">
            <h2 class="title">User goals <button @click="addCard(3)" class="button is-pulled-right">Add User goal</button></h2>
            <GoalieCard
                v-for="card in user_goals"
                :key="card.id"
                :id="card.id"
                :content="card.content"
                @update="card.content = $event"
                @hoverCard="hoverCard"
                @connectCards="connectCards"
                @prepareConnectCard="prepareConnectCard"
                @deleteCard="deleteCard"
            ></GoalieCard>
        </div>
        <div class="column">
            <h2 class="title">Actions <button @click="addCard(4)" class="button is-pulled-right">Add Action</button></h2>
            <GoalieCard
                v-for="card in actions"
                :key="card.id"
                :id="card.id"
                :content="card.content"
                @update="card.content = $event"
                @hoverCard="hoverCard"
                @connectCards="connectCards"
                @prepareConnectCard="prepareConnectCard"
                @deleteCard="deleteCard"
            ></GoalieCard>
        </div>
    </div>
</template>

<script>
import GoalieCard from './components/GoalieCard.vue'

export default {
    name: 'app',
    components: {
        GoalieCard
    },
    data() {
        return {
            cards: [],
            from: null,
            to: null,
            hoveredConnectsTo: [],
            x1: null,
            x2: null,
            y1: null,
            y2: null
        }
    },
    computed: {
        goals() {
            return this.cards.filter(card => card.column === 1)
        },
        users() {
            return this.cards.filter(card => card.column === 2)
        },
        user_goals() {
            return this.cards.filter(card => card.column === 3)
        },
        actions() {
            return this.cards.filter(card => card.column === 4)
        },
        isValidConnection() {
            return (this.from && this.to && (this.from !== this.to))
        },
        // TODO:
        // calculateWeight() {
        //     return this.connectsTo.length
        // }
    },
    mounted() {
        if (localStorage.getItem('goalie_cards')) {
            this.cards = JSON.parse(localStorage.getItem('goalie_cards'));
        }
    },
    methods: {
        guidGenerator() {
            var S4 = function() {
                return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
            };
            return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
        },
        addCard(id) {
            this.cards.push({
                id: this.guidGenerator(),
                column: id,
                content: 'Edit me…',
                weight: 0, // TODO: this.calculateWeight,
                connectsTo: [],
            })
        },
        getCardConnections(id) {
            return this.cards.filter(card => card.id === id)[0].connectsTo
        },
        prepareConnectCard(data) {
            if (data.from) {
                this.from = data.from
            } else if (data.to) {
                this.to = data.to
            }
        },
        connectCards() {
            if (this.isValidConnection) {
                // TODO: Fix connectsTo array..
                let existingFromCardConnections = this.cards.filter(card => card.id === this.from)[0].connectsTo
                let existingToCardConnections = this.cards.filter(card => card.id === this.to)[0].connectsTo

                let indexInFromCardArr = existingFromCardConnections.findIndex(card => card === this.to)
                let indexInToCardArr = existingToCardConnections.findIndex(card => card === this.from)

                if (indexInFromCardArr > -1) {
                    existingToCardConnections.splice(indexInFromCardArr, 1)
                } else {
                    existingFromCardConnections.push(this.to)
                }

                if (indexInToCardArr > -1) {
                    existingFromCardConnections.splice(indexInToCardArr, 1)
                } else {
                    existingToCardConnections.push(this.from)
                }

                this.cards.filter(card => card.id === this.from)[0].connectsTo = existingFromCardConnections
                this.cards.filter(card => card.id === this.to)[0].connectsTo = existingToCardConnections
            }
        },
        deleteCard(id) {
            let thisIndex = this.cards.findIndex(card => card.id === id)
            this.cards.splice(thisIndex, 1)

            this.getCardConnections(id).forEach((id) => {
                console.log(id)
                thisIndex = this.cards.findIndex(card => card.id === id)
                // TODO: Remove all connections before deleting card
                // this.connectsTo(thisIndex, 1)
            })

        },
        hoverCard(data) {
            if (data.id) {
                let refs = this.getCardConnections(data.id)
                let x1 = data.left + (data.width / 2)
                let y1 = data.top + (data.height / 2)
                let x2 = null
                let y2 = null
                let arr = []
                // TODO: Store original card/hovered card dimensions first, then draw from here to destinations
                refs.forEach((id) => {
                    var cardId = this.cards.filter(card => card.id === id)[0] ? this.cards.filter(card => card.id === id)[0].id : null
                    var card
                    if (cardId) {
                        card = document.getElementById(this.cards.filter(card => card.id === id)[0].id)
                        arr.push({
                            x1: x1,
                            y1: y1,
                            x2: card.offsetLeft + (card.offsetWidth / 2),
                            y2: card.offsetTop + (card.offsetHeight / 2)
                        })
                    }
                })
                this.hoveredConnectsTo = arr
            } else {
                this.hoveredConnectsTo = []
            }
        }
    },
    watch: {
        cards: {
            handler() {
                localStorage.setItem('goalie_cards', JSON.stringify(this.cards));
            },
            deep: true
        }
    }
}
</script>

<style>
#app {
    padding: 20px;
}

#canvas {
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
    width: 100%;
    height: 100%;
    z-index: 1;
}

.card + .card {
	margin-top: 20px  
}

.drag, .drop {
    position: relative;
}

.drag {
    position: absolute;
    top: 0;
    padding: 3px;
    cursor: move;
}

.drop {
    background: #eee;
}
</style>
