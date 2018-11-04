<template>
    <div id="app" class="columns">
        <svg id="canvas">
            <path stroke="black" stroke-width="2" fill="transparent"
                v-for="pos in drawLinesTo"
                :key="pos.pos"
                :d="'M' + pos.x1 + ' ' + pos.y1 + ' C ' + (pos.x1 + 10) + ' ' + (pos.y1 + 10) + ', ' + (pos.x2 - 10) + ' ' + (pos.y2 - 10) + ', ' +  pos.x2 + ' ' + pos.y2" />
        </svg>
        <div class="column">
            <h2 class="title">Goals <button @click="addCard(1)" class="button is-pulled-right">Add Goal</button></h2>
            <goalie-card
                v-for="card in goals"
                :key="card.id"
                :id="card.id"
                :content="card.content"
                @update-content="card.content = $event"
                @hover-card="hoverCard"
                @connect-cards="connectCards(card)"
                @prepare-connect-card="prepareConnectCard"
                @delete-card="deleteCard"
            ></goalie-card>
        </div>
        <div class="column">
            <h2 class="title">Users <button @click="addCard(2)" class="button is-pulled-right">Add User</button></h2>
            <goalie-card
                v-for="card in users"
                :key="card.id"
                :id="card.id"
                :content="card.content"
                @update-content="card.content = $event"
                @hover-card="hoverCard"
                @connect-cards="connectCards(card)"
                @prepare-connect-card="prepareConnectCard"
                @delete-card="deleteCard"
            ></goalie-card>
        </div>
        <div class="column">
            <h2 class="title">User goals <button @click="addCard(3)" class="button is-pulled-right">Add User goal</button></h2>
            <goalie-card
                v-for="card in user_goals"
                :key="card.id"
                :id="card.id"
                :content="card.content"
                @update-content="card.content = $event"
                @hover-card="hoverCard"
                @connect-cards="connectCards(card)"
                @prepare-connect-card="prepareConnectCard"
                @delete-card="deleteCard"
            ></goalie-card>
        </div>
        <div class="column">
            <h2 class="title">Actions <button @click="addCard(4)" class="button is-pulled-right">Add Action</button></h2>
            <goalie-card
                v-for="card in actions"
                :key="card.id"
                :id="card.id"
                :content="card.content"
                @update-content="card.content = $event"
                @hover-card="hoverCard"
                @connect-cards="connectCards(card)"
                @prepare-connect-card="prepareConnectCard"
                @delete-card="deleteCard"
            ></goalie-card>
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
            connections: [],
            from: null,
            to: null,
            drawLinesTo: [],
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
    },
    mounted() {
        if (localStorage.getItem('goalie_cards') && localStorage.getItem('goalie_connections')) {
            this.cards = JSON.parse(localStorage.getItem('goalie_cards'));
            this.connections = JSON.parse(localStorage.getItem('goalie_connections'));
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
                // TODO: weight: 0 - how to calculate and sort byt this?
            })
        },
        getCardConnections(id) {
            return this.connections ? this.connections.filter(connection => connection.from === id) : []
        },
        prepareConnectCard(data) {
            if (data.from) {
                this.from = data.from
            } else if (data.to) {
                this.to = data.to
            }
        },
        connectCards(card) {
            let thisCard = this.from
            let targetCard = this.to
            let matches = this.connections.findIndex(connection => ((connection.from === thisCard) && (connection.to === targetCard)))
            let matches2 = this.connections.findIndex(connection => ((connection.to === thisCard) && (connection.from === targetCard)))

            if (this.isValidConnection) {
                    console.log("connection before", this.connections)
                if ((matches > -1) && (matches2 > -1)) {
                    // Connection exists already, exclude from-to pair from (new) connections array
                    this.connections.splice(matches, 1);
                    this.connections.splice(matches2, 1);
                } else {
                    // Wasn't there, add connection both ways
                    this.connections.push({from: thisCard, to: targetCard})
                    this.connections.push({from: targetCard, to: thisCard})
                }
                    console.log("connection after", this.connections)
            }
        },
        deleteCard(id) {
            // Remove this card
            let thisIndex = this.cards.findIndex(card => card.id === id)
            this.cards.splice(thisIndex, 1)

            // Remove all its connections
            this.connections = this.connections.filter(cardPair => (cardPair.from !== id || cardPair.to !== id))
        },
        hoverCard(data) {
            // Check if data is real data (contains an id) or not (otherwise it's an [e.g. mouseleave] event)
            if (data.id) {
                let hoveredCardId = data.id
                let refs = this.getCardConnections(hoveredCardId)
                let x1 = data.dimensions.left + (data.dimensions.width / 2)
                let y1 = data.dimensions.top + (data.dimensions.height / 2)
                let x2 = null
                let y2 = null
                let arr = []

                refs.forEach(targetCard => {
                    var targetCardId = targetCard.to

                    if (targetCardId) {
                        var cardDOM = document.getElementById(this.cards.filter(card => card.id === targetCardId)[0].id)

                        arr.push({
                            x1: x1,
                            y1: y1,
                            x2: cardDOM.offsetLeft + (cardDOM.offsetWidth / 2),
                            y2: cardDOM.offsetTop + (cardDOM.offsetHeight / 2)
                        })
                    }
                })

                this.drawLinesTo = arr
            } else {
                this.drawLinesTo = []
            }
        }
    },
    watch: {
        cards: {
            handler() {
                localStorage.setItem('goalie_cards', JSON.stringify(this.cards));
            },
            deep: true
        },
        connections: {
            handler() {
                localStorage.setItem('goalie_connections', JSON.stringify(this.connections));
            }
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
    opacity: 0.5;
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
</style>
