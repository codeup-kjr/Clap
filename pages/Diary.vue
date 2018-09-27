<template>
   <!-- <no-ssr> -->
    <v-ons-page>
        <div>
            <div class="type-center">
                <v-ons-select class="type">
                    <option v-for="item in type" :key="item.id">
                        {{ item }}
                    </option>
                </v-ons-select>
            </div>
            <div class="icon-script">
                <v-ons-icon icon='ion-ios-checkmark' class="checked-icon"/>
                <p class="checked-script">監督確認済み</p>
            </div>
        </div>
        <v-ons-list>
            <v-ons-lazy-repeat
                :render-item="renderItem"
                :length="$store.state.diaries.length"
            >
            </v-ons-lazy-repeat>
            <v-ons-fab class="add-b" @click="add">
                <v-ons-icon icon="md-plus"></v-ons-icon>
            </v-ons-fab>
      </v-ons-list>
    </v-ons-page>
    <!-- </no-ssr> -->
</template>

<script>
import Vue from 'vue'
import DiaryWrite from './DiaryWrite';

export default {
  data () {
    return {
        type: ['タイムライン', '下書き', '提出済み'],
        renderItem:
        i => {
            const vm = this
            return new Vue({
            render: createElement => {
                return createElement(
                    "div",
                    {class: 'list-container'},
                    [
                        (()=> {
                                let date = ''
                                if(i==0 || (i>0 && vm.$store.state.diaries[i].date!=vm.$store.state.diaries[i-1].date)){
                                    date =  createElement('p', {style:{marginLeft: '16px', fontWeight:'bold', color: '#444444'}}, vm.$store.state.diaries[i].date)
                                }
                                // cardはonsenuiのcss
                                const card = createElement('div', {class: 'card'},[
                                    createElement('v-ons-ripple', {attrs: {color:"rgba(229, 237, 249, 0.4)", background:'rgba(229, 237, 249, 0.4)'},}),
                                    createElement('v-ons-icon', {attrs: {icon: 'ion-ios-checkmark'}, style:{fontSize: '2.2rem', float:'right', marginRight:'-8px', marginTop:'-24px', color:'#69ce04'}},),
                                    createElement('div', {style:{display: 'flex', justifyContent: 'flex-start'}},[
                                        createElement('img', {attrs: { src: "http://placekitten.com/g/40/40"}, style:{height: '14vw', maxHeight: '56px', width: '14vw', maxWidth: '56px', borderRadius: '8vw', marginRight: '3vw'}},),
                                        createElement('div', {style:{display: 'flex', flexDirection:'column', justifyContent: 'flex-end', height: '14vw', maxHeight: '56px', width:'78%'}},[
                                            createElement('p', {style:{fontSize: 'calc(0.8rem + 0.4vw)'}}, vm.$store.state.diaries[i].title),
                                            createElement('div', {style:{display: 'flex', justifyContent: 'space-between'}},[
                                                createElement('p', {style:{color: '#8e8e8e', fontSize: 'calc(0.6rem + 0.5vw)'}}, '名前'),
                                                (window.innerWidth > 1350 ?
                                                    createElement('p', {style:{color: '#8e8e8e', marginRight:'-16vw', fontSize: 'calc(0.6rem + 0.5vw)'}}, vm.$store.state.diaries[i].time) 
                                                    : window.innerWidth > 1000 ?
                                                        createElement('p', {style:{color: '#8e8e8e', marginRight:'-14.7vw', fontSize: 'calc(0.6rem + 0.5vw)'}}, vm.$store.state.diaries[i].time) 
                                                        : window.innerWidth > 730 ?
                                                            createElement('p', {style:{color: '#8e8e8e', marginRight:'-13.5vw', fontSize: 'calc(0.6rem + 0.5vw)'}}, vm.$store.state.diaries[i].time) 
                                                            : window.innerWidth > 530 ?
                                                                createElement('p', {style:{color: '#8e8e8e', marginRight:'-11vw', fontSize: 'calc(0.6rem + 0.5vw)'}}, vm.$store.state.diaries[i].time) 
                                                                : window.innerWidth > 430 ?
                                                                    createElement('p', {style:{color: '#8e8e8e', marginRight:'-10vw', fontSize: 'calc(0.6rem + 0.5vw)'}}, vm.$store.state.diaries[i].time)
                                                                    : createElement('p', {style:{color: '#8e8e8e', marginRight:'calc(-20px - 2.5vw)', fontSize: 'calc(0.6rem + 0.5vw)'}}, vm.$store.state.diaries[i].time)),
                                            ])
                                        ])
                                    ])
                                ])
                                if(date) {
                                    return [date, card]
                                } else {
                                    return [card]
                                }
                        })(),

                    ]
                );
            },
        })
        }
    };
  },

  mounted() {

  },

  methods: {
      add() {
          this.$store.commit('push', {extends: DiaryWrite,
                                        onsNavigatorOptions: {
                                            animation: 'lift',
                                            animationOptions: { duration: 0.5 }
                            }})
      },

      
    
  },

  computed: {

  },

  asyncComputed: {//npm installした非同期処理を行えるcomputed
        // async groups() {
        //     return this.$store.state.groupList
        // }
    }
};
</script>

<style scoped>
    .type-center {
        text-align: center;
        padding: 16px 0 8px;
    }

    .type {
        border: solid 1px #a8a6a6;
        border-radius: 6px;
        padding: 0 8px;
        width: 9rem;
    }

    .list-container {
        border: none;
    }

    .icon-script {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        margin-right: 8px;
        margin-bottom: 12px;
    }

    .checked-icon {
        font-size: 1.4rem;
        margin-right: 4px;
        color: #69ce04;
    }

    .checked-script {
        font-size: 0.7rem;
    }

    .add-b {
        background-color: rgb(125, 146, 238);
        top: auto;
        bottom: 20px;
        right: 20px;
        left: auto;
        position: absolute;
    }

    .add-b:active {
        transition: none;
        background-color: #d9d9d9;
    }
</style>
