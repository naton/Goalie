<template>
    <div id="app" class="columns">
        <GoalieColumn
            v-for="column in columns"
            :key="column.id"
            :id="column.id"
            :type="column.type">
            <GoalieCard
                v-for="card in cards"
                v-if="card.column == column.id"
                :key="card.id"
                :id="card.id"
                :content="card.content"
                @update="card.content = $event"
            ></GoalieCard>
        </GoalieColumn>
    </div>
</template>

<script>
import GoalieColumn from './components/GoalieColumn.vue'
import GoalieCard from './components/GoalieCard.vue'

export default {
    name: 'app',
    components: {
        GoalieColumn,
        GoalieCard
    },
    data() {
        return {
            columns: [
                { id: 1, type: 'Goal' },
                { id: 2, type: 'Target group' },
                { id: 3, type: 'User goal' },
                { id: 4, type: 'Action' }
            ],
            cards: []
        }
    },
    mounted() {
        if (localStorage.getItem('goalie_cards')) {
            this.cards = JSON.parse(localStorage.getItem('goalie_cards'));
            this.cardsTotal = this.cards.length;
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
</style>
