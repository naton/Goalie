<template>
    <div id="app" class="columns">
        <h1>Board {{ $route.params.id }}</h1>
        <svg id="canvas">
            <path stroke="black" stroke-width="2" fill="transparent"
                v-for="pos in drawLinesTo"
                :key="pos.pos"
                :d="'M' + pos.x1 + ' ' + pos.y1 + ' C ' + (pos.x1 + 10) + ' ' + (pos.y1 + 10) + ', ' + (pos.x2 - 10) + ' ' + (pos.y2 - 10) + ', ' +  pos.x2 + ' ' + pos.y2" />
        </svg>
        <goalie-column id="1" title="Goals" button-text="Add goal"
            @add-card="addCard(1)">
            <transition-group name="card" tag="div">
                <goalie-card
                    v-for="card in goals"
                    :key="card.id"
                    :id="card.id"
                    :content="card.content"
                    @update-content="card.content = $event"
                    @hover-card="hoverCard"
                    @connect-cards="connectCards(card)"
                    @prepare-connect-card="prepareConnectCard"
                    @delete-card="deleteCard"></goalie-card>
            </transition-group>
        </goalie-column>
        <goalie-column id="2" title="Users" button-text="Add user"
            @add-card="addCard(2)">
            <transition-group name="card" tag="div">
                <goalie-card
                    v-for="card in users"
                    :key="card.id"
                    :id="card.id"
                    :content="card.content"
                    @update-content="card.content = $event"
                    @hover-card="hoverCard"
                    @connect-cards="connectCards(card)"
                    @prepare-connect-card="prepareConnectCard"
                    @delete-card="deleteCard"></goalie-card>
            </transition-group>
        </goalie-column>
        <goalie-column id="3" title="User goals" button-text="Add user goal"
            @add-card="addCard(3)">
            <transition-group name="card" tag="div">
                <goalie-card
                    v-for="card in user_goals"
                    :key="card.id"
                    :id="card.id"
                    :content="card.content"
                    @update-content="card.content = $event"
                    @hover-card="hoverCard"
                    @connect-cards="connectCards(card)"
                    @prepare-connect-card="prepareConnectCard"
                    @delete-card="deleteCard"></goalie-card>
            </transition-group>
        </goalie-column>
        <goalie-column id="4" title="Actions" button-text="Add action"
            @add-card="addCard(4)">
            <transition-group name="card" tag="div">
                <goalie-card
                    v-for="card in actions"
                    :key="card.id"
                    :id="card.id"
                    :content="card.content"
                    @update-content="card.content = $event"
                    @hover-card="hoverCard"
                    @connect-cards="connectCards(card)"
                    @prepare-connect-card="prepareConnectCard"
                    @delete-card="deleteCard"></goalie-card>
            </transition-group>
        </goalie-column>
        <goalie-login title="Log in using your Google account" button-text="Log in" 
            :initial-login-status="false"
            @update-login-status="updateStatus"></goalie-login>
    </div>
</template>

<script>
import GoalieLogin from './components/GoalieLogin.vue'
import GoalieColumn from './components/GoalieColumn.vue'
import GoalieCard from './components/GoalieCard.vue'
import { db, auth, usersRef, cardsRef, relationsRef } from './firebaseConfig.js'

export default {
    name: 'app',
    components: {
        GoalieLogin,
        GoalieColumn,
        GoalieCard,
    },
    data() {
        return {
            cards: [],
            relations: [],
            currentUser: {},
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
        }
    },
    created() {
        let self = this
        auth.onAuthStateChanged(function(user) {
            if (user) {
                self.currentUser = {
                    uid: user.uid,
                    isLoggedIn: true,
                    isAnonymous: user.isAnonymous,
                    token: localStorage.getItem('goalie_usertoken') || ''
                }
            } else {
                self.currentUser.isLoggedIn = false
                console.log('User is signed out.')
            }
        })
    },
    mounted() {
        if (localStorage.getItem('goalie_cards')) {
            this.cards = JSON.parse(localStorage.getItem('goalie_cards'));
        } else {
            this.cards = []
        }

        if (localStorage.getItem('goalie_relations')) {
            this.relations = JSON.parse(localStorage.getItem('goalie_relations'));
        } else {
            this.relations = []
        }
    },
    methods: {
        guidGenerator() {
            let S4 = function() {
                return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
            };
            return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
        },
        updateStatus(user) {
        },
        addCard(columnId) {
            let newCard = {
                column: columnId,
                createdOn: new Date(),
                content: 'Edit me…'
            }
            let localCards = this.cards

            cardsRef.child(this.currentUser.uid + '/').push(newCard)

            cardsRef.on('child_added', function(data) {
               localCards.push(newCard)
            })
        },
        getCardConnections(cardId) {
            return this.relations ? this.relations.filter(connection => connection.from === cardId) : []
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
            let matches = this.relations.findIndex(connection => ((connection.from === thisCard) && (connection.to === targetCard)))
            let matches2 = this.relations.findIndex(connection => ((connection.to === thisCard) && (connection.from === targetCard)))

            if (this.isValidConnection) {
                if ((matches > -1) && (matches2 > -1)) {
                    // Connection exists already, exclude from-to pair from (new) relations array
                    this.relations.splice(matches, 1);
                    this.relations.splice(matches2, 1);
                } else {
                    // Wasn't there, add connection both ways
                    this.relations.push({from: thisCard, to: targetCard})
                    this.relations.push({from: targetCard, to: thisCard})
                }
            }
        },
        deleteCard(id) {
            let thisCard = id

            // Remove this card
            let thisIndex = this.cards.findIndex(card => card.id === id)
            this.cards.splice(thisIndex, 1)

            // Remove all its relations
            let matches = this.relations.findIndex(connection => connection.from === thisCard)
            let matches2 = this.relations.findIndex(connection => connection.to === thisCard)
            if ((matches > -1) && (matches2 > -1)) {
                this.relations.splice(matches, 1);
                this.relations.splice(matches2, 1);
            }
        },
        hoverCard(data) {
            // Check if data is real data (contains an id) or not (otherwise it's an [e.g. mouseleave] event)
            if (data.id) {
                let hoveredCardId = data.id
                let hoveredCardColumnDOM = document.getElementById(hoveredCardId).closest('.column')
                let refs = this.getCardConnections(hoveredCardId)
                let x1 = data.dimensions.left + (data.dimensions.width / 2)
                let y1 = data.dimensions.top - hoveredCardColumnDOM.scrollTop + (data.dimensions.height / 2)
                let arr = []

                refs.forEach(targetCard => {
                    let targetCardId = targetCard.to
                    let x2
                    let y2

                    if (targetCardId) {
                        // TODO: Get rid of DOM sniffing here? Lookup card dimensions of each target card?
                        let targetCardDOM = document.getElementById(this.cards.filter(card => card.id === targetCardId)[0].id) || app

                        arr.push({
                            x1: x1,
                            y1: y1,
                            x2: targetCardDOM.getBoundingClientRect().left + (targetCardDOM.offsetWidth / 2),
                            y2: targetCardDOM.getBoundingClientRect().top - targetCardDOM.scrollTop + (targetCardDOM.offsetHeight / 2)
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
        relations: {
            handler() {
                localStorage.setItem('goalie_relations', JSON.stringify(this.relations));
            }
        }
    }
}
</script>

<style>
@import "https://fonts.googleapis.com/css?family=Vesper+Libre";

html {
    background-color: #cce1ff;
    font-size: 16px;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
    overflow-y: scroll;
    text-rendering: optimizeLegibility;
    -webkit-text-size-adjust: 100%;
    -moz-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
    text-size-adjust: 100%;
}

body {
    padding: 0;
    color: #4a4a4a;
    font-weight: 400;
    font-size: 1rem;
    line-height: 1.5;
    font-family: 'Vesper Libre', Georgia, serif;
}

h1, h2, h3 {
    margin: 0;
    outline: none;
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

#canvas path {
    opacity: 0;
    animation: fade-in 0.6s forwards 0.2s;
}

@-webkit-keyframes fade-in {
    0% {opacity: 0;}
    100% {opacity:1;}
}

.card-move {
    transition: transform 0.5s ease-in-out;
}

.card-leave {
    transition: transform 0.5s ease-out;
}

.card-enter,
.card-leave-to {
}
    opacity: 0;
    transform: translateX(30px);

.card-leave-active {
    position: absolute;
}
</style>
