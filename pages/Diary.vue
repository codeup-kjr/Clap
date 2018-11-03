<template>
   <!-- <no-ssr> -->
    <v-ons-page>
        <div class="container">
        <div class="header">
            <div class="type-center">
                <v-ons-select class="type" v-model="selectedType">
                    <option v-for="item in type" :key="item.id">
                        {{ item }}
                    </option>
                </v-ons-select>
            </div>
            <!-- <div class="icon-script">
                <v-ons-icon icon='ion-ios-checkmark' class="checked-icon"/>
                <p class="checked-script">監督確認済み</p>
            </div> -->
        </div>
        <v-ons-list class="list">
            <v-ons-lazy-repeat
                :render-item="renderItem"
                :length="renderLength"
                :calculate-item-height="calculateItemHeight"
            >
            </v-ons-lazy-repeat>
        </v-ons-list>
            <v-ons-fab class="add-b btn-sticky" @click="add">
                <v-ons-icon icon="md-plus"></v-ons-icon>
            </v-ons-fab>
        </div>
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
            return new Vue({
            render: createElement => {
                if(this.list) {
                return createElement(
                    "div",
                    {class: 'list-container'},
                    [
                        (()=> {
                                let date = '';
                                const target = this.list[i];
                                
                                if(i==0 || (i>0 && target.date!=this.list[i-1].date)){
                                    date =  createElement('p', {class: 'd-date'}, target.date);
                                }
                                
                                const uData = target.userId == this.$store.state.uid ? this.$store.state.myData
                                             : this.$store.state.usersData.filter(data => data.id == target.userId)[0];
                                const uDataImage = uData.image == null ? png : uData.image;

                                // cardはonsenuiのcss
                                const card = createElement('div', {on: {click: ()=>{this.clickFunc(target)}}, class: 'card'},[
                                    createElement('v-ons-ripple', {attrs: {'light-gray' : true},}),
                                    (target.hcChecked == true ?
                                    createElement('v-ons-icon', {attrs: {icon: 'ion-ios-checkmark'}, class: 'd-hc-check', style: {color: '#69ce04'}})
                                    : createElement('v-ons-icon', {attrs: {icon: 'ion-ios-checkmark'}, class: 'd-hc-check', style: {color:'transparent'}})),
                                    createElement('div', {class: 'd-img-div'},[
                                        createElement('img', {attrs: { src: uDataImage}, class: 'd-img'},),
                                        createElement('div', {class: 'd-t-div'},[
                                            createElement('p', {class: 'd-title'}, target.title),
                                            createElement('div', {class: 'd-n-t'},[
                                                createElement('p', {class: 'd-name'}, uData.name),
                                                (window.innerWidth > 1350 ?
                                                    createElement('p', {class: 'd-time', style:{marginRight:'-16vw'}}, target.time) 
                                                    : window.innerWidth > 1000 ?
                                                        createElement('p', {class: 'd-time', style:{marginRight:'-14.7vw'}}, target.time) 
                                                        : window.innerWidth > 730 ?
                                                            createElement('p', {class: 'd-time', style:{marginRight:'-13.5vw'}}, target.time) 
                                                            : window.innerWidth > 530 ?
                                                                createElement('p', {class: 'd-time', style:{marginRight:'-11vw'}}, target.time) 
                                                                : window.innerWidth > 430 ?
                                                                    createElement('p', {class: 'd-time', style:{marginRight:'-10vw'}}, target.time)
                                                                    : createElement('p', {class: 'd-time', style:{marginRight:'calc(-20px - 2.5vw)'}}, target.time)),
                                            ])
                                        ])
                                    ])
                                ]);
                                if(date) {
                                    return [date, card];
                                } else {
                                    return [card];
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
                                    };
                            },
                            onsNavigatorOptions: {
                                animation: 'lift',
                                animationOptions: { duration: 0.5 }
                    }});
                },

    showDetail(data) {
        this.$store.dispatch('showDetail', {data: data, page: DiaryDetail});
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
        return(data) => {
            switch (this.selectedType) {
                case 'タイムライン':
                    return this.showDetail(data);
                    break;
                case '下書き':
                    return this.edit(data);
                    break;
                case '提出済み':
                    return this.showDetail(data);
                    break;
                default:
                    break;
            }
        }
    }
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
        min-height: 69vh;
        background-size: 100% 0px, 100% 0px;
    }

    .btn-sticky {
        position: sticky;
        bottom: 6vh;
        display: block;
    }

    .add-b {
        background-color: rgb(125, 146, 238);
        color: #fffefe;
        margin-left: 79%;
    }

    .add-b:active {
        transition: none;
        background-color: #d9d9d9;
    }
</style>

<style>
/* DiaryDetail.vueのcreateElementに適用するclass。事前に定義する必要があるため。 */
    .comment-inputD {
        min-height:25.7px;
        line-height: 25.7px;
        width: 235px;
        resize: none;
        padding: 0;
        border: none;
        background-color: #fcfcfc;
        font-size: 1rem;
    }

    .reply-inputD {
        min-height:25.7px;
        line-height: 25.7px;
        width: 204px;
        resize: none;
        padding: 0;
        border: none;
        background-color: #fcfcfc;
        font-size: 1rem;
    }

    .borderD {
        border-bottom: solid 1px #c5c3c3;
    }

    .underlineDCom {
        width: 235px;
        position: relative;
    }

    .underlineDCom:hover,
    .underlineDCom:focus,	
    .underlineDCom:active {
        cursor: pointer;
    }

    .underlineDCom:after {
        /*疑似要素とアニメーション設定を加えてwidthを0にしておく*/
        content: '';
        position: absolute;
        left: 0;
        bottom: -2px;/*自由変更*/
        height: 3px;/*自由変更*/
        background-color: rgb(72, 126, 152);/*自由変更*/
        width: 0;
        transition: width .4s;/*自由変更*/
    }
    
    .underline2DCom:hover:after,
    .underline2DCom:focus:after,
    .underline2DCom:active:after {
        /*ホバーしたら100%の位置まで伸びる*/
        width: 235px;
    }

    .underlineDRep {
        width: 204px;
        position: relative;
    }

    .underlineDRep:hover,
    .underlineDRep:focus,	
    .underlineDRep:active {
        cursor: pointer;
    }

    .underlineDRep:after {
        /*疑似要素とアニメーション設定を加えてwidthを0にしておく*/
        content: '';
        position: absolute;
        left: 0;
        bottom: -2px;/*自由変更*/
        height: 3px;/*自由変更*/
        background-color: rgb(72, 126, 152);/*自由変更*/
        width: 0;
        transition: width .4s;/*自由変更*/
    }
    
    .underline2DRep:hover:after,
    .underline2DRep:focus:after,
    .underline2DRep:active:after {
        /*ホバーしたら100%の位置まで伸びる*/
        width: 204px;
    }

    .dd-card {
        display: flex;
        justify-content: flex-start;
        margin-bottom: 8px;
    }

    .dd-cimg {
        height: 6vh;
        max-height: 56px;
        width: 6vh;
        max-width: 56px;
        border-radius: 3vh;
        margin-right: 8px;
    }

    .dd-column {
        display: flex;
        flex-direction: column;
    }

    .dd-edit-flex {
        display: flex;
        justify-content: space-between;
    }

    .dd-gray {
        font-size: 0.9rem;
        color: #8e8e8e;
    }

    .dd-replyctrl {
        margin-bottom: 8px;
        margin-top: 8px;
    }

    .dd-replyb {
        font-size: 1rem;
        margin-bottom: 8px;
        color: #8e8e8e;
    }

    .dd-rimg {
        height: 4vh;
        max-height: 38px;
        width: 4vh;
        max-width: 38px;
        border-radius: 2vh;
        margin-right: 8px;
    }

</style>