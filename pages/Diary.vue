<template>
   <!-- <no-ssr> -->
    <v-ons-page>
        <div class="header">
            <div class="type-center">
                <v-ons-select class="type" v-model="selectedType">
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
        <v-ons-list class="list">
            <v-ons-lazy-repeat
                :render-item="renderItem"
                :length="renderLength"
                :calculate-item-height="calculateItemHeight"
            >
            </v-ons-lazy-repeat>
        </v-ons-list>
        <v-ons-fab class="add-b" @click="add">
            <v-ons-icon icon="md-plus"></v-ons-icon>
        </v-ons-fab>
    </v-ons-page>
    <!-- </no-ssr> -->
</template>

<script>
import png from '../assets/dUsrImg.jpg'
import Vue from 'vue'
import DiaryWrite from './DiaryWrite';
import DiaryDetail from './DiaryDetail';

export default {
  data () {
    return {
        type: ['タイムライン', '下書き', '提出済み'],
        selectedType: 'タイムライン',
        // 正確な値を渡すと、計算を早くでき、スクロールにプラスに働く。指定しないと、日誌追加後、itemHeight無指定のエラーが発生する。
        // calculateItemHeight(index) {
        calculateItemHeight:
        i=> {
                return 114;
            },

        renderItem:
        i => {
            const vm = this

            return new Vue({
            render: createElement => {
                if(this.list) {
                return createElement(
                    "div",
                    {class: 'list-container'},
                    [
                        (()=> {
                                let date = '';
                                const target = vm.list[i];
                                
                                if(i==0 || (i>0 && target.date!=vm.list[i-1].date)){
                                    date =  createElement('p', {style:{marginLeft: '16px', fontWeight:'bold', color: '#444444'}}, target.date)
                                }
                                
                                const uData = vm.$store.state.usersData.filter(data => data.id == target.userId)[0];
                                const uDataImage = uData.image == '' ? png : uData.image;
                                
                                // cardはonsenuiのcss
                                const card = createElement('div', {on: {click: ()=>{vm.clickFunc(target, uData, uDataImage)}}, class: 'card'},[
                                    createElement('v-ons-ripple', {attrs: {'light-gray' : true},}),
                                    (target.hcChecked == true ?
                                    createElement('v-ons-icon', {attrs: {icon: 'ion-ios-checkmark'}, style:{fontSize: '2.2rem', float:'right', marginRight:'-8px', marginTop:'-24px', color:'#69ce04'}})
                                    : createElement('v-ons-icon', {attrs: {icon: 'ion-ios-checkmark'}, style:{fontSize: '2.2rem', float:'right', marginRight:'-8px', marginTop:'-24px', color:'transparent'}})),
                                    createElement('div', {style:{display: 'flex', justifyContent: 'flex-start'}},[
                                        createElement('img', {attrs: { src: uDataImage}, style:{height: '14vw', maxHeight: '56px', width: '14vw', maxWidth: '56px', borderRadius: '8vw', marginRight: '3vw'}},),
                                        createElement('div', {style:{display: 'flex', flexDirection:'column', justifyContent: 'flex-end', height: '14vw', maxHeight: '56px', width:'78%'}},[
                                            createElement('p', {style:{fontSize: 'calc(0.8rem + 0.4vw)'}}, target.title),
                                            createElement('div', {style:{display: 'flex', justifyContent: 'space-between'}},[
                                                createElement('p', {style:{color: '#8e8e8e', fontSize: 'calc(0.6rem + 0.5vw)'}}, uData.name),
                                                (window.innerWidth > 1350 ?
                                                    createElement('p', {style:{color: '#8e8e8e', marginRight:'-16vw', fontSize: 'calc(0.6rem + 0.5vw)'}}, target.time) 
                                                    : window.innerWidth > 1000 ?
                                                        createElement('p', {style:{color: '#8e8e8e', marginRight:'-14.7vw', fontSize: 'calc(0.6rem + 0.5vw)'}}, target.time) 
                                                        : window.innerWidth > 730 ?
                                                            createElement('p', {style:{color: '#8e8e8e', marginRight:'-13.5vw', fontSize: 'calc(0.6rem + 0.5vw)'}}, target.time) 
                                                            : window.innerWidth > 530 ?
                                                                createElement('p', {style:{color: '#8e8e8e', marginRight:'-11vw', fontSize: 'calc(0.6rem + 0.5vw)'}}, target.time) 
                                                                : window.innerWidth > 430 ?
                                                                    createElement('p', {style:{color: '#8e8e8e', marginRight:'-10vw', fontSize: 'calc(0.6rem + 0.5vw)'}}, target.time)
                                                                    : createElement('p', {style:{color: '#8e8e8e', marginRight:'calc(-20px - 2.5vw)', fontSize: 'calc(0.6rem + 0.5vw)'}}, target.time)),
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
                } else {
                    return '';
                }
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
                            }});
      },

      edit(data) {
                    this.$store.commit('push', {extends: DiaryWrite,
                            data() {return {
                                        answers: {
                                            q1: data.content1,
                                            q2: data.content2,
                                            q3: data.content3,
                                            q4: data.content4,
                                            q5: data.content5,
                                            title: data.title
                                        },
                                        id: data.id,
                                        editDate: data.date
                            }},
                            onsNavigatorOptions: {
                                animation: 'lift',
                                animationOptions: { duration: 0.5 }
                    }});
                },

    showDetail(data, uData, uDataImage) {
        this.$store.dispatch('showDetail', {data: data, uData: uData, uDataImage: uDataImage, page: DiaryDetail});
    }

  },

  computed: {
    timeline() {
        return this.$store.state.diaries.filter(diary => diary.submit == true);
    },

    draft() {
        return this.$store.state.diaries.filter(diary => diary.userId == this.$store.state.uid && diary.submit == false);
    },

    up() { 
        return this.$store.state.diaries.filter(diary => diary.userId == this.$store.state.uid && diary.submit == true);
    },
    renderLength() {
        switch (this.selectedType) {
            case 'タイムライン':
                return this.timeline != '' ? this.timeline.length : 0;
                break;
            case '下書き':
                return this.draft != '' ? this.draft.length : 0;
                break;
            case '提出済み':
                return this.up != '' ? this.up.length : 0;
                break;
            default:
                break;
        }
    },

    list() {
        switch (this.selectedType) {
            case 'タイムライン':
                return this.timeline;
                break;
            case '下書き':
                return this.draft;
                break;
            case '提出済み':
                return this.up;
                break;
            default:
                break;
        }
    },

    clickFunc() {
        return(data, uData, uDataImage) => {
        switch (this.selectedType) {
            case 'タイムライン':
                return this.showDetail(data, uData, uDataImage);
                break;
            case '下書き':
                return this.edit(data);
                break;
            case '提出済み':
                return this.showDetail(data, uData, uDataImage);
                break;
            default:
                break;
        }
        }
    }
  },

  asyncComputed: {//npm installした非同期処理を行えるcomputed
        // async groups() {
        //     return this.$store.state.groupList
        // }
    }
};
</script>

<style scoped>
    .header {
        position: sticky;
        top: 0;
        background-color: #ffffff;
        z-index: 1;
        padding-bottom: 8px;
    }

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

    .list {
        overflow: auto;
    }

    .add-b {
        background-color: rgb(125, 146, 238);
        color: #fffefe;
        position: fixed;
        bottom: 6%;
        left: 179%;
    }

    .add-b:active {
        transition: none;
        background-color: #d9d9d9;
    }
</style>
