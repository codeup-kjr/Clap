<template>
   <!-- <no-ssr> -->
    <v-ons-page>
        <v-ons-toolbar>
            <div class="left" @click="close">
                <v-ons-icon icon='ion-android-close' class="close-icon"/>
            </div>
            <div class="center">
                {{userId==$store.state.uid ? '自分の日誌' : 'メンバーの日誌'}}
            </div>
            <div class="right">
                <div class="save" :style="md ? 'position: relative; top: 3px;' : ''" @click="addDiary(false)">保存</div>
            </div>
        </v-ons-toolbar>

        <div class="header">
            <div class="title-date">
                <div class="title">{{answers.title}}</div>
                <div class="date">{{date}}</div>
            </div>
            <div class="img-name">
                <img :src="image" alt="image" class="list-item__thumbnail writer-image">
                <div class="name">{{name}}</div>
            </div>
        </div>
        <div class="contents">
                <div class="qTitle">1. {{questions.q1}}</div>
                <div class="qAnswer">{{answers.q1}}</div>
                <div class="qTitle">2. {{questions.q2}}</div>
                <div class="qAnswer">{{answers.q2}}</div>
                <div class="qTitle">3. {{questions.q3}}</div>
                <div class="qAnswer">{{answers.q3}}</div>
                <div class="qTitle">4. {{questions.q4}}</div>
                <div class="qAnswer">{{answers.q4}}</div>
                <div class="qTitle">5. {{questions.q5}}</div>
                <div class="qAnswer">{{answers.q5}}</div>
        </div>
        <div class="img-comment">
            <img :src="$store.state.myData.image" alt="image" class="list-item__thumbnail my-image">
            <div class="border underline" :class="commentFocus == true ? 'underline2' : ''">
                <textarea cols="30" :style="commentHeight" class="comment-input" placeholder="コメントを入力" v-model="comment" @focus="focus" @blur="blur"></textarea>
            </div>
        </div>
        <v-ons-list class="list">
            <v-ons-lazy-repeat
                :render-item="commentItem"
                :length="commentLength"
                :calculate-item-height="commentItemHeight"
            >
            </v-ons-lazy-repeat>
        </v-ons-list>
        <v-ons-button modifier="quiet" class="logout-b" @click="test">ログアウト</v-ons-button>

    </v-ons-page>
    <!-- </no-ssr> -->
</template>

<script>
import Vue from 'vue'
import png from '../assets/dUsrImg.jpg'
export default {
    
    data() {
        return {
            questions: {
                q1: '「ここが良かった！」今日の自分。',
                q2: 'メンバーの、ココを褒めたい！',
                q3: '考えました、明日の課題',
                q4: 'こんな練習やってみたい！',
                q5: '監督へのメッセージ',
                title: '今日のタイトルは？'
            },
            answers: {
                q1: '',
                q2: '',
                q3: '',
                q4: '',
                q5: '',
                title: ''
            },
            name:   '',
            image:  '',
            id:     '',
            date:   '',
            userId: '',
            comment: '',
            commentFocus: false,
            replyCF: '',


                    replyItemHeight:
                    index => {
                            return 204;
                        },

                    replyItem:
                    index => {
                        const vm = this
                        // const diaryData = this.$store.state.diaryData

                        return new Vue({
                        render: createElement => {
                            if(diaryData[replyCF] > 0) {
                            return createElement(
                                "div",
                                {class: 'comment-item'},
                                [
                                    (()=> {
                                            vm.replyF = commentF + 'Reply' + (index + 1);
                                            const replyUserIdF = replyF + 'UserId';
                                            const replyTimeF = replyF + 'Time';

                                            const replyUData = vm.$store.state.usersData.filter(data => data.id == diaryData[replyUserIdF])[0];
                                            const replyUDataImage = replyUData.image == '' ? png : replyUData.image;
                                            
                                            // cardはonsenuiのcss
                                            return createElement('div', {style:{display: 'flex', justifyContent: 'flex-start'}},[
                                                createElement('img', {attrs: { src: replyUDataImage}, style:{height: '6vw', maxHeight: '56px', width: '6vw', maxWidth: '56px', borderRadius: '3vw', marginRight: '2vw'}},),
                                                createElement('div', {style:{display: 'flex', flexDirection:'column'}},[
                                                    createElement('div', {style:{display: 'flex'}},[
                                                        createElement('p', {style:{fontSize: 'calc(0.8rem + 0.4vw)'}}, replyUData.name),
                                                        createElement('p', {style:{fontSize: 'calc(0.8rem + 0.4vw)'}}, diaryData[replyTimeF])]),
                                                    createElement('p', {style:{fontSize: 'calc(0.8rem + 0.4vw)'}}, diaryData[replyF]),
                                                ])
                                            ]);
                                    })(),

                                ]
                            );
                            } else {
                                return '';
                            }
                        },
                        
                    })
                    },

        commentItemHeight:
        i => {
                return 204;
             },

        commentItem:
        i => {
            const vm = this
            const diaryData = this.$store.state.diaryData
            const commentF = 'comment' + (i + 1);
            const userIdF = commentF + 'UserId';
            const timeF = commentF + 'Time';
            const replyCF = commentF + 'ReplyCount';

            const uData = vm.$store.state.usersData.filter(data => data.id == diaryData[userIdF])[0];
            const uDataImage = uData.image == '' ? png : uData.image;
            let replyShow = {i: false}
            
            const replyItem = vm.replyItem;
            // const replyLength = vm.replyLength(replyCF);
            const replyLength = vm.$store.state.diaryData[replyCF]
            const replyHeight = vm.replyItemHeight;

            return new Vue({

                render: createElement => {
                    // const ivm = this;
                    if(diaryData.commentCount > 0) {
                    return createElement(
                        "div",
                        {style:{width: '90vw'}},
                        [
                            (()=> {
                                    const comment = createElement('div', {style:{display: 'flex', justifyContent: 'flex-start', width: '90vw'}},[
                                        createElement('img', {attrs: { src: uDataImage}, style:{height: '6vw', maxHeight: '56px', width: '6vw', maxWidth: '56px', borderRadius: '3vw', marginRight: '2vw'}},),
                                        createElement('div', {style:{display: 'flex', flexDirection:'column', width: '60vw'}},[
                                            createElement('div', {style:{display: 'flex', width: '60vw'}},[
                                                createElement('p', {style:{fontSize: 'calc(0.8rem + 0.4vw)'}}, uData.name),
                                                createElement('p', {style:{fontSize: 'calc(0.8rem + 0.4vw)'}}, diaryData[timeF])]),
                                            createElement('p', {style:{fontSize: 'calc(0.8rem + 0.4vw)'}}, diaryData[commentF]),
                                            vm.replyLength(replyCF) > 0 ?
                                            createElement('div', {on: {click: ()=>{replyShow.i = true;}}}, replyShow.i == true ? '返信を非表示' : '返信を表示') : '',
                                        ])
                                    ]);
                                    let reply = ''
                                    // replyShow.i == true ?
                                        reply = createElement('v-ons-list', {}, [ 
                                                createElement('v-ons-lazy-repeat', {attrs: { renderItem: replyItem, length: replyLength, calculateItemHeight: replyHeight}, style:{}},)])
                                        reply.bind('render-item', replyItem);
                                        reply.bind('length', replyLength);
                                        reply.bind('calculate-item-eight', replyHeight);
                                    // : ''
                                    if(reply) {
                                        return [comment, reply]
                                    } else {
                                        return [comment]
                                    }
                            })(),

                        ]
                    );
                    } else {
                        return '';
                    }
                },
            
        })
        },

        }

    },

    destroyed() {
        this.$store.dispatch('unBindDiaryData');
    },


    computed: {
        commentHeight() {
            // 半角と全角の規格統一のため、lengthではなく、bytesを用いる。
            String.prototype.bytes = function () {
                return(encodeURIComponent(this).replace(/%../g,"x").length);
                }
            const lineHeight = 16;
            const kaigyou = this.comment.split(/\n/).length - 1;
            const lineCount = ((this.comment.bytes() - kaigyou) == 0 ? 1 : 0) + Math.ceil((this.comment.bytes() - kaigyou) / 30) + kaigyou;
            return `height: ${lineHeight * lineCount}px`;
        },

        commentLength() {
            return this.$store.state.diaryData.commentCount
        },

        replyLength() {
            return(replyCF) => {
                return this.$store.state.diaryData[replyCF] != '' ? this.$store.state.diaryData[replyCF] : 0
            }
        }

    },

    methods: {
        //todo: croppaにfile-size-limitを設定し、limit超過時にtoastメッセージを表示する。
        editPush() {
            if(this.edit == '編集する') {
                this.edit = '保存する'
            } else {
                if(this.userName == '') {
                    this.$ons.notification.alert('ユーザー名を入力ください。', {title:''})
                    return
                } else {
                    if(this.file) {
                        this.$store.dispatch('updateUser', {name: this.userName, role: this.role, grade: this.grade, img: this.file})
                    } else {
                        this.$store.dispatch('updateUser', {name: this.userName, role: this.role, grade: this.grade})
                    }
                    if (!navigator.onLine) {
                        this.$ons.notification.alert({messageHTML:'オンラインになると保存されます。<br>オンラインになる前に画面を更新すると保存されません。', title:''})
                    } else {
                        this.$ons.notification.alert('保存しました', {title:''})
                    }
                    this.file = ''
                    this.edit = '編集する'
                }
            }
        },

        test() {
            String.prototype.bytes = function () {
                return(encodeURIComponent(this).replace(/%../g,"x").length);
                }
            console.log(this.comment.length);
            console.log(this.comment.bytes());
        },

        close() {
            this.$store.commit('pop');
        },

        focus() {
            this.commentFocus = true;
        },

        blur() {
            this.commentFocus = false;
        }
        

    },
    
}

</script>

<style scoped>

    .close-icon {
        font-size: 1.3rem;
        padding-left: 12px;
        position: relative;
        top: -2px;
    }

    .save {
        font-size: 1rem;
        padding-right: 12px;
        position: relative;
        top: -2px;
    }

    .header {
        width: 100vw;
        padding: 16px 16px;
        margin-bottom: 8px;
        border-bottom: solid 1px #e2e1e1;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .title-date {
        display: flex;
        flex-direction: column;
    }

    .title {
        font-size: 1.3rem;
    }

    .date {
        padding-left: 8px;
        color: #575757;
    }

    .img-name {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .writer-image{
        height: 8vh;
        width: 8vh;
        border-radius: 4vh;
        margin-bottom: 4px;
    }

    .name {
        font-size: 0.8rem;
        color: #575757;
    }

    .contents {
        width: 96vw;
        word-wrap: break-word;
    }

    .qTitle {
        padding: 0 16px;
        margin-bottom: 8px;
    }

    .qAnswer {
        padding: 0 16px 16px;
        margin-bottom: 8px;
        border-bottom: solid 1px #e2e1e1;
        color: #575757;
    }

    .img-comment {
        display: flex;
        align-items: flex-start;
        margin-bottom: 16px;
    }

    .my-image{
        height: 6vh;
        width: 6vh;
        border-radius: 3vh;
        margin-right: 8px;
    }

    .border {
        border-bottom: solid 1px #c5c3c3; 
    }

    .comment-input {
        min-height: 17px;
        font-size: 1rem;
        line-height: 16px;
        width: 290px;
        resize: none;
        margin-top: 2vh;
        padding: 0;
    }

    .underline {
        position: relative;
    }

    .underline:hover,
    .underline:focus,	
    .underline:active {
        cursor: pointer;
    }

    .underline:after {
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
    
    .underline2:hover:after,
    .underline2:focus:after,
    .underline2:active:after {
        /*ホバーしたら100%の位置まで伸びる*/
        width: 100%;
    }

    .comment-item {

    }

</style>
