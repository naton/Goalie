<template>
    <div id="app" class="columns">
        <div class="column">
            <h2 class="title">Goal <button @click="addCard(1)" class="button is-pulled-right">Add Goal</button></h2>
            <GoalieCard
                v-for="card in goals"
                :key="card.id"
                :id="card.id"
                :content="card.content"
                @update="card.content = $event"
                @connectCards="connectCards"
                @prepareConnectCard="prepareConnectCard"
                @deleteCard="deleteCard"
            ></GoalieCard>
        </div>
        <div class="column">
            <h2 class="title">Target group <button @click="addCard(2)" class="button is-pulled-right">Add Target group</button></h2>
            <GoalieCard
                v-for="card in target_groups"
                :key="card.id"
                :id="card.id"
                :content="card.content"
                @update="card.content = $event"
                @connectCards="connectCards"
                @prepareConnectCard="prepareConnectCard"
                @deleteCard="deleteCard"
            ></GoalieCard>
        </div>
        <div class="column">
            <h2 class="title">User goal <button @click="addCard(3)" class="button is-pulled-right">Add User goal</button></h2>
            <GoalieCard
                v-for="card in user_goals"
                :key="card.id"
                :id="card.id"
                :content="card.content"
                @update="card.content = $event"
                @connectCards="connectCards"
                @prepareConnectCard="prepareConnectCard"
                @deleteCard="deleteCard"
            ></GoalieCard>
        </div>
        <div class="column">
            <h2 class="title">Action <button @click="addCard(4)" class="button is-pulled-right">Add Action</button></h2>
            <GoalieCard
                v-for="card in actions"
                :key="card.id"
                :id="card.id"
                :content="card.content"
                @update="card.content = $event"
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
            to: null
        }
    },
    computed: {
        goals() {
            return this.cards.filter(card => card.column == 1)
        },
        target_groups() {
            return this.cards.filter(card => card.column == 2)
        },
        user_goals() {
            return this.cards.filter(card => card.column == 3)
        },
        actions() {
            return this.cards.filter(card => card.column == 4)
        },
        isValidConnection() {
            return (this.from && this.to && (this.from !== this.to))
        }
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
                content: 'Change me',
                weight: 0,
                connectsTo: [],
            })
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
            // TODO: Remove all connections before deleting card
            var idx = this.cards.findIndex(card => card.id === id)
            this.cards.splice(idx, 1)
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
