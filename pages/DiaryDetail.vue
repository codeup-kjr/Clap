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

        <p class="comment-count">{{this.$store.state.diaryData.commentCount}}件のコメント</p>
        <div class="img-comment">
            <img :src="$store.state.myData.image" alt="image" class="list-item__thumbnail my-image">
            <div class="border underline" :class="commentFocus == true ? 'underline2' : ''">
                <textarea cols="30" :style="commentHeight" class="comment-input" placeholder="コメントを入力" v-model="comment" @focus="focus" @blur="blur"></textarea>
            </div>
        </div>

        <v-ons-list class="list list--noborder">
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
            replyShow: {},
            replyControl: {},
            replyLength: {},
            unbindTarget: [],

        commentItemHeight:
        i => {
                return 204;
             },

        commentItem:
        i => {
            const diaryData = this.$store.state.diaryData
            const commentF = 'comment' + (i + 1);
            const userIdF = commentF + 'UserId';
            const timeF = commentF + 'Time';

            const uData = this.$store.state.usersData.filter(data => data.id == diaryData[userIdF])[0];
            const uDataImage = uData.image == null ? png : uData.image;

            this.replyShow[i+1] = false;
            this.replyControl[i+1] = '返信を表示';

            return new Vue({

                render: createElement => {
                    if(diaryData.commentCount > 0) {
                    return createElement(
                        "div",
                        {style:{width: '90vw'}},
                        [
                            (()=> {
                                    return createElement('div', {style:{display: 'flex', justifyContent: 'flex-start', width: '90vw', marginBottom: '8px'}},[
                                        createElement('img', {attrs: { src: uDataImage}, style:{height: '6vh', maxHeight: '56px', width: '6vh', maxWidth: '56px', borderRadius: '3vh', marginRight: '2vw'}},),
                                        createElement('div', {style:{display: 'flex', flexDirection:'column', width: '60vw'}},[
                                            createElement('div', {style:{display: 'flex'}},[
                                                createElement('p', {style:{fontSize: 'calc(0.8rem + 0.4vw)', marginRight: '8px'}}, uData.name),
                                                createElement('p', {style:{fontSize: 'calc(0.8rem + 0.4vw)'}}, this.displayTime(diaryData[timeF]))]),
                                            createElement('p', {style:{fontSize: 'calc(0.8rem + 0.4vw)', marginBottom: '8px'}}, diaryData[commentF]),
                                            
                                            this.$store.state.diaryData[`comment${i+1}ReplyCount`] > 0 &&
                                            createElement('div', {style:{display: 'flex', marginBottom: '8px'}},[
                                                // createElementは、最後の引数にbindしたstateを指定しないと、dbの変更をリアルタイムに反映することができないため、このように切り替える内容と分離させる。
                                                this.replyShow[i+1] == false ?
                                                    createElement('span', {on: {click: ()=>{this.controlReply(i);}}}, this.$store.state.diaryData[`comment${i+1}ReplyCount`] + '件の')
                                                : '',
                                                createElement('p', {on: {click: ()=>{this.controlReply(i);}}}, this.replyControl[i+1])
                                            ]),
                                                    this.$store.state.diaryCommentReply[i+1] !=null &&
                                                    this.replyShow[i+1] == true ?
                                                    //createElementを使用する場合のv-forの代替手段がarray.prototype.map()
                                                    // bindの後にcommitして作成した多次元配列diaryCommentReplyをmapする。多次元配列とすることで、事前にstateを定義することができ、リアクティブにできる。
                                                        createElement('div', {style:{display: 'flex', flexDirection:'column'}}, this.$store.state.diaryCommentReply[i+1].map((item, index) => [
                                                            createElement('div', {style:{display: 'flex', justifyContent: 'flex-start', width: '70vw', marginBottom: '8px'}},[
                                                                createElement('img', {attrs: { src: this.$store.state.usersData.filter(data => data.id == item.userId)[0].image == null ? png : this.$store.state.usersData.filter(data => data.id == item.userId)[0].image}, style:{height: '4vh', maxHeight: '56px', width: '4vh', maxWidth: '56px', borderRadius: '2vh', marginRight: '2vw'}},),
                                                                createElement('div', {style:{display: 'flex', flexDirection:'column'}},[
                                                                    createElement('div', {style:{display: 'flex'}},[
                                                                        createElement('p', {style:{fontSize: 'calc(0.8rem + 0.4vw)', marginRight: '8px'}}, this.$store.state.usersData.filter(data => data.id == item.userId)[0].name),
                                                                        createElement('p', {style:{fontSize: 'calc(0.8rem + 0.4vw)'}}, this.displayTime(item.time))
                                                                    ]),
                                                                    createElement('p', {style:{fontSize: 'calc(0.8rem + 0.4vw)'}}, item.text)
                                                                ])
                                                            ])
                                                        ]))
                                                    : ''
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

        }

    },

    destroyed() {
        const len = this.unbindTarget.length;
        for(let i=0; i<len; i++) {
            this.$store.dispatch('unBindDiaryCommentReply', {index: this.unbindTarget[i]});
        }

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

        displayTime() {
            return(time) => {
                let timestamp = time.seconds * 1000;
                var date = new Date(timestamp)
                console.log('timestamp: ' + timestamp, 'date: ' + date);
                var diff = new Date().getTime() - date.getTime()
                var d = new Date(diff);

                if (d.getUTCFullYear() - 1970) {
                    return d.getUTCFullYear() - 1970 + '年前'
                } else if (d.getUTCMonth()) {
                    return d.getUTCMonth() + 'ヶ月前'
                } else if (d.getUTCDate() - 1) {
                    return d.getUTCDate() - 1 + '日前'
                } else if (d.getUTCHours()) {
                    return d.getUTCHours() + '時間前'
                } else if (d.getUTCMinutes()) {
                    return d.getUTCMinutes() + '分前'
                } else {
                    return 'たった今'
                    // return d.getUTCSeconds() + '秒前'
                }
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

        async controlReply(i) {
            // bindの後にcommitして多次元配列diaryCommentReplyを作成する。多次元配列とすることで、抽出する際にmapを適用できる。また、事前にstateを定義することができ、リアクティブにできる。
            await this.$store.dispatch('bindDiaryCommentReply', {index: (i+1), id: this.$store.state.diaryData.id});
            await this.$store.commit('setDiaryCommentReply', {data: this.$store.state[`diaryComment${i+1}Reply`], index: i+1});
            this.replyShow[i+1] = !this.replyShow[i+1];
            //リアクティブにするため、Object.assignを使用。
            this.replyControl = Object.assign({}, this.replyControl, { [i]: this.replyShow[i+1] == true ? '返信を非表示' : '返信を表示'});
            //destoryed()時にunbindする`bindDiaryComment${i}Reply`を保持する。
            this.unbindTarget.push(i+1);
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

    .comment-count {
        font-size: 1.1rem;
        margin-bottom: 16px;
        margin-left: 16px;
    }

    .img-comment {
        display: flex;
        align-items: flex-start;
        margin-bottom: 24px;
        margin-left: 16px;
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
        width: 264px;
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

    .list {
        border: none;
        background-color: #fcfcfc;
        margin-left: 16px;
    }
</style>
