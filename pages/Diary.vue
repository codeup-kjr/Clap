<template>
    <v-ons-page>
        <v-ons-toolbar>
            <div class="left" :style="gColor" @click="gTap()">
                グループ
            </div>
            <div class="center" :style="tColor" @click="tTap()">
                タイムライン
            </div>
            <div class="right">
            </div>
        </v-ons-toolbar>
        <div class="container">
        <div v-show="gIsTapped" class="gl">
            <!-- 日誌の提出順に並び替える必要がない場合。 -->
            <!-- <div class="gl-wrap" v-for="item in $store.state.groupList" :key="item.userId" @click="showDetail(groupUDiary(item.userId))"> -->
            <div class="gl-wrap" v-for="item in gl" :key="item.userId" @click="showDetail(groupUDiary(item.userId))">
                <div class="gl-notif" v-if="groupUDiary(item.userId) == null ? false : groupUDiary(item.userId).update_at > item.lastOpenDiary"></div>
                <div class="gl-notif" v-else :style="{backgroundColor: 'transparent'}"></div>
                <img class="gl-img" v-lazy="groupUImg(item.userId)" alt="img">
                <p class="gl-title">{{groupUDiary(item.userId) == null ? '提出履歴なし' : groupUDiary(item.userId).title}}</p>
            </div>
            <div class="gl-add" @click="glEdit()">
                <div class="gl-b">
                    <div class="gl-b-p">+</div>
                </div>
                <div class="gl-add-t">メンバー追加</div>
            </div>
        </div>

        <v-ons-list class="list" v-show="!gIsTapped">
            <v-ons-lazy-repeat
                :render-item="renderItem"
                :length="renderLength"
                :calculate-item-height="calculateItemHeight"
            >
            </v-ons-lazy-repeat>
        </v-ons-list>

        </div>

        <v-ons-fab class="add-b btn-sticky" @click="add">
            <v-ons-icon icon="fa-pencil"></v-ons-icon>
        </v-ons-fab>
    </v-ons-page>
</template>

<script>
import png from '../assets/dUsrImg.jpg';
import Vue from 'vue';
import DiaryWrite from './DiaryWrite';
import DiaryDetail from './DiaryDetail';
import GlEdit from './GlEdit';

export default {
  data () {
    return {
        gIsTapped: true,
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
                                    date =  createElement('p', {class: 'd-date'}, this.dispDate(target.date));
                                }
                                
                                const uData = target.userId == this.$store.state.uid ? this.$store.state.myData
                                             : this.$store.state.usersData.filter(data => data.id == target.userId)[0];
                                const uDataImage = uData.image == null ? png : uData.image;
                                const dispTime = this.displayTime(target.update_at)

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
                                                    createElement('p', {class: 'd-time', style:{marginRight:'-16vw'}}, dispTime)
                                                    : window.innerWidth > 1000 ?
                                                        createElement('p', {class: 'd-time', style:{marginRight:'-14.7vw'}}, dispTime) 
                                                        : window.innerWidth > 730 ?
                                                            createElement('p', {class: 'd-time', style:{marginRight:'-13.5vw'}}, dispTime) 
                                                            : window.innerWidth > 530 ?
                                                                createElement('p', {class: 'd-time', style:{marginRight:'-11vw'}}, dispTime) 
                                                                : window.innerWidth > 430 ?
                                                                    createElement('p', {class: 'd-time', style:{marginRight:'-10vw'}}, dispTime)
                                                                    : createElement('p', {class: 'd-time', style:{marginRight:'calc(-20px - 2.5vw)'}}, dispTime)),
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
      gTap() {
          this.gIsTapped = true;

      },
      
      tTap() {
          this.gIsTapped = false;
      },

      add() {
          this.$store.commit('push', {extends: DiaryWrite,
                                        onsNavigatorOptions: {
                                            animation: 'lift',
                                            animationOptions: { duration: 0.5 }
                            }});
      },

    showDetail(data) {
        if(!data) {
            // グループリストから提出履歴なしのメンバーをタップした場合の処理
            this.$ons.notification.alert({messageHTML:`表示できる日誌がありません。`, title:''});
            return;
        }
        this.$store.dispatch('showDetail', {data: data, page: DiaryDetail});
    },

    glEdit() {
       this.$store.commit('push', {extends: GlEdit,
                            onsNavigatorOptions: {
                                animation: 'fade',
                                animationOptions: { duration: 0.16 }
                                }
                        });
    }

  },

  computed: {
    dispDate() {
        return(date) => {
            return date.substr(0, 6) == '月' ? date.substr(5, 8) : date.substr(5, 9);
        }
    },

    gColor() {
        return this.gIsTapped==true ? {color: '#f0be42', borderBottom: 'solid 3px #ffbd00', paddingBottom: '3px'} : {color: '#dbd9d9'};
    },

    tColor() {
        return this.gIsTapped==false ? {color: '#f0be42', borderBottom: 'solid 3px #ffbd00', paddingBottom: '3px'} : {color: '#dbd9d9'};
    },

    gl() {
        // groupListと最新の日誌情報を紐づけて、日誌の提出降順に並び替える。
        const list = this.$store.state.groupList;
        const len = list.length;
        let dispList = [];
        const diaries = this.$store.state.diaries;
        
        for(let i=0; i<len; i++) {
            const diary = this.groupUDiary(list[i].userId);
            dispList.push({
                userId:         list[i].userId,
                lastOpenDiary:  list[i].lastOpenDiary,
                // 提出履歴がない場合は、1900年1月1日を指定する。
                update_at:       diary == null ? '-2208988800' : this.groupUDiary(list[i].userId).update_at
            });
        }
        return dispList.sort(function(a,b){
                        if(a.update_at>b.update_at) return -1;
                        if(a.update_at < b.update_at) return 1;
                        return 0;
                    });
    },

    groupUImg() {
        return(userId) => {
            const uImage = this.$store.state.usersData.filter(data => data.id == userId)[0].image;
            return uImage == null ? png : uImage;
        }
    },

    groupUDiary() {
        return(userId) => {
            return this.$store.state.diaries.filter(diary => diary.userId == userId && diary.submit == true)[0];
        }
    },

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
        return this.timeline != '' ? this.timeline.length : 0;
        // switch (this.selectedType) {
        //     case 'タイムライン':
        //         return this.timeline != '' ? this.timeline.length : 0;
        //         break;
        //     case '下書き':
        //         return this.draft != '' ? this.draft.length : 0;
        //         break;
        //     case '提出済み':
        //         return this.up != '' ? this.up.length : 0;
        //         break;
        //     default:
        //         break;
        // }
    },

    list() {
        return this.timeline;
        // switch (this.selectedType) {
            // case 'タイムライン':
            //     return this.timeline;
            //     break;
            // case '下書き':
            //     return this.draft;
            //     break;
            // case '提出済み':
            //     return this.up;
            //     break;
            // default:
            //     break;
        // }
    },

    clickFunc() {
        return(data) => {
            return this.showDetail(data);
            // switch (this.selectedType) {
            //     case 'タイムライン':
            //         return this.showDetail(data);
            //         break;
            //     case '下書き':
            //         return this.edit(data);
            //         break;
            //     case '提出済み':
            //         return this.showDetail(data);
            //         break;
            //     default:
            //         break;
            // }
        }
    },

    displayTime() {
            return(time) => {
                if(!time) {
                    //自身の画面からの登録直後はnullになるため。
                    return 'たった今';
                }
                const timestamp = time.seconds * 1000;
                const date = new Date(timestamp);
                const diff = new Date().getTime() - date.getTime()
                const d = new Date(diff);

                if (d.getUTCFullYear() - 1970) {
                    return d.getUTCFullYear() - 1970 + '年前';
                } else if (d.getUTCMonth()) {
                    return d.getUTCMonth() + 'ヶ月前';
                } else if (d.getUTCDate() - 1) {
                    return d.getUTCDate() - 1 + '日前';
                } else if (d.getUTCHours()) {
                    return d.getUTCHours() + '時間前';
                } else if (d.getUTCMinutes()) {
                    return d.getUTCMinutes() + '分前';
                } else {
                    return 'たった今';
                    // return d.getUTCSeconds() + '秒前'
                }
            }
        }
  }
};
</script>

<style scoped>
    .left {
        font-size: 1rem;
    }

    .center {
        font-size: 1rem;
    }

    .container {
        min-height: calc(100vh - 44px);
        overflow: auto;
    }

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

    .gl {
        height: fit-content;
        padding: 16px 0 96px;
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        width: 98vw;
        margin: 0 auto;
    }

    .gl-wrap {
        width: 30vw;
        height: 32vw;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    
    @media (max-width: 699px){
        .gl-wrap:not(:nth-child(3n)) {
            margin-right: 4vw;
        }
    }


    .gl-notif {
        width: 3vw;
        height: 3vw;
        border-radius: 2vw;
        background-color: #ec407a;
        transform: translate(10.5vw, 5vw);
    }

    .gl-img {
        width: 20vw;
        height: 20vw;
        border-radius: 10vw;
        margin-bottom: 8px;
    }

    .gl-title {
        font-size: 0.9rem;
        width: 100%;
        height: 1.1rem;
        text-align: center;
        overflow: hidden;
        color: #828080;
    }

    .gl-add {
        width: 30vw;
        height: 32vw;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        transform: translateY(1vw);
    }

    .gl-b {
        width: 16vw;
        height: 16vw;
        border-radius: 4vw;
        margin-bottom: 8px;
        background-color: #bababa;
        display: flex;
        justify-content: center;
        align-items: center;
    }   

    .gl-b-p {
        color: #fefefe;
        font-size: 2.3rem;
        transform: translateY(-1vw);
    }

    .gl-add-t {
        font-size: 0.8rem;
        color: #bababa;
    }

    @media (min-width: 700px){
        .left {
            padding-left: 8.5vw;
        }

        .gl-wrap {
            width: 20vw;
            height: 23vw;
        }
        
        .gl-wrap:not(:nth-child(4n)) {
            margin-right: 2.7vw;
        }

        .gl-notif {
            width: 1.8vw;
            height: 1.8vw;
            border-radius: 0.9vw;
            transform: translate(7.2vw, 3.6vw);
        }

        .gl-img {
            width: 13.5vw;
            height: 13.5vw;
            border-radius: 7.2vw;
            margin-bottom: 10px;
        }

        .gl-title {
            font-size: 1.1rem;
            height: 1.3rem;
        }

        .gl-add {
            width: 20vw;
            height: 23vw;
            transform: translateY(-1.3vw);
        }

        .gl-b {
            width: 10.8vw;
            height: 10.8vw;
            border-radius: 2.7vw;
            margin-bottom: 4px;
        }

        .gl-b-p {
            font-size: 4.5rem;
        }

        .gl-add-t {
            font-size: 1.1rem;
        }
    }

    @media (min-width: 1000px){
        .gl-b-p {
            font-size: 6rem;
        }
    }

    @media (min-width: 1300px){
        .gl-b-p {
            font-size: 7rem;
        }
    }

    .list {
        overflow: auto;
        min-height: 69vh;
        background-size: 100% 0px, 100% 0px;
        margin-top: 16px;
    }

    .btn-sticky {
        position: sticky;
        bottom: 6vh;
        display: block;
    }

    .add-b {
        background-color: #ffbd00;
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