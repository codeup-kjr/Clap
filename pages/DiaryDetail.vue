<template>
   <!-- <no-ssr> -->
    <v-ons-page>
        <v-ons-toolbar>
            <div class="left" @click="close">
                <v-ons-icon icon='ion-ios-arrow-back' class="close-icon"/>
            </div>
            <div class="center">
                {{writerName}}
            </div>
            <div class="right">
                <div v-if="$store.state.diaryData.userId == $store.state.uid" class="control">
                    <v-ons-icon icon="fa-pencil" class="pen" @click="editDiary()"></v-ons-icon>
                    <v-ons-icon icon="ion-ios-trash-outline" class="trash" @click="deleteDiary()"></v-ons-icon>
                </div>
            </div>
        </v-ons-toolbar>

        <div class="diary-header">
            <img :src="writerImage" alt="image" class="list-item__thumbnail writer-image">
            <div class="title-date">
                <div class="diary-title">{{answers.title}}</div>
                <div class="diary-date">{{date}}</div>
            </div>
        </div>
        <div class="diary-contents">
                <div class="qTitle" v-html="$sanitize('1. ' + questions.q1)"></div>
                <div class="qAnswer" v-html="$sanitize(answers.q1)"></div>
                <div class="qTitle" v-html="$sanitize('2. ' + questions.q2)"></div>
                <div class="qAnswer" v-html="$sanitize(answers.q2)"></div>
                <div class="qTitle" v-html="$sanitize('3. ' + questions.q3)"></div>
                <div class="qAnswer" v-html="$sanitize(answers.q3)"></div>
                <div class="qTitle" v-html="$sanitize('4. ' + questions.q4)"></div>
                <div class="qAnswer" v-html="$sanitize(answers.q4)"></div>
                <div class="qTitle" v-html="$sanitize('5. ' + questions.q5)"></div>
                <div class="qAnswer" v-html="$sanitize(answers.q5)"></div>
        </div>

        <p class="comment-count">{{this.commentSync.length}}件のコメント</p>
        <div class="img-comment">
            <img :src="$store.state.myData.image!=null ? $store.state.myData.image : defaultImg" alt="image" class="list-item__thumbnail my-image">
            <div class="border underline" :class="commentFocus == true ? 'underline2' : ''">
                <!-- v-composition-modelはカスタムディレクティブ。plugins/plugins.jsに記載。 -->
                <textarea cols="30" :style="{height: areaHeight(comment, 'commentEdit')}" class="comment-input" placeholder="コメントを入力" v-composition-model="comment" @focus="focus" @blur="blur"></textarea>
            </div>
        </div>

        <div class="comment-btns">
            <v-ons-button modifier="quiet" class="comment-add-c" @click="commentAddC" v-show="comment.length > 0">キャンセル</v-ons-button>
            <v-ons-button modifier="quiet" class="comment-add" @click="commentAdd" v-show="comment.length > 0">コメント</v-ons-button>
        </div>

        <v-ons-list class="list list--noborder">
            <v-ons-lazy-repeat
                :render-item="commentItem"
                :length="commentLength"
                :calculate-item-height="commentItemHeight"
            >
            </v-ons-lazy-repeat>
        </v-ons-list>
        <footer class="footer"></footer>
        <v-ons-toast :visible.sync="toastVisible" :animation="md ? 'ascend' : 'lift'">
            <span>新しいコメントがあります。</span>
            <v-ons-icon icon="ion-android-close" @click="toastVisible=false;" class="toast-close"/>
            <button @click="load()">ロード</button>
        </v-ons-toast>
    </v-ons-page>
    <!-- </no-ssr> -->
</template>

<script>
let unwatch;
import Vue from 'vue';
import png from '../assets/dUsrImg.jpg';
import DiaryWrite from './DiaryWrite';

export default {
    
    data() {
        return {
            toastVisible: false,
            commentSync: [],
            defaultImg: png,//templateで読み込むため。
            diaryDiv: '', 
            questions: this.$store.state.questions,
            answers: {
                q1: '',
                q2: '',
                q3: '',
                q4: '',
                q5: '',
                title: ''
            },
            id:     '',
            date:   '',
            userId: '',
            comment: '',
            commentFocus: false,
            commentEditFocus: {},
            commentEditText: {},
            replyShow: {},
            replyControl: {},
            replyLength: {},
            unbindTarget: [],
            commentEdit: {},
            replyEdit: {},
            replyEditText: {},
            replyAddFlg: {},
            replyAddText: {},
            replyAddFocus: {},

            commentItemHeight:
            i => {
                    return 204;
                },

            commentItem:
            i => {
                this.replyShow[i] = false;
                this.replyControl[i] = '返信を表示';
                this.commentEdit[i] = '編集';
                this.commentEditFocus[i] = false;
                this.replyAddFlg[i] = false;
                this.replyAddText[i] = '';
                this.replyAddFocus[i] = false;
                
                //ページを開く時点で登録されている返信について、編集ボタンとフォーカス判定の初期化。
                // ページ起動後に追加される返信については、renderの中で初期化している。

                // 【注意】eplyData.filterは頻出するが、変数化してはならない。replyに関してはrenderの中でmapをしているため、変数化してしまうと、変更を検知できずリアクティブにならないため。
                if(this.commentSync.length > 0) {
                    const len = this.$store.state.replyData.filter(data => data.commentId == this.commentSync[i].id).length;
                    if(len > 0) {
                        for(let j=0; j<len; j++) {
                            this.replyEdit[this.$store.state.replyData.filter(data => data.commentId == this.commentSync[i].id)[j].id] = '編集';
                        }
                    }
                }
                return new Vue({
                    render: createElement => {
                        if(this.commentSync.length > 0) {
                            return createElement(
                                "div",
                                [
                                    (()=> {
                                            const userD = this.commentSync[i].userId == this.$store.state.uid ? this.$store.state.myData : this.$store.state.usersData.filter(data => data.id == this.commentSync[i].userId)[0];
                                            const commentCard = createElement('div', {class: 'dd-card'},[
                                                createElement('img', {attrs: { src: userD.image == null ? png : userD.image}, 
                                                    class: 'dd-cimg'}),
                                                createElement('div', {class: 'dd-column'},[
                                                    createElement('p', {class: 'dd-com-name', style:{marginBottom: '4px'}}, userD.name),
                                                    this.commentEdit[i] == '編集' ?
                                                        createElement('textarea', {attrs: {readonly: true}, style:{marginBottom: '6px',
                                                            height: this.areaHeight(this.commentSync[i].text, 'commentEdit')}, 'class': {'comment-inputD': true}
                                                        }, this.commentSync[i].text)
                                                    : createElement('div', {'class': {borderD: true, underlineDCom: true, underline2DCom: this.commentEditFocus[i]==true ? true : false}, style:{marginBottom: '4px'}},[
                                                        createElement('textarea', {domProps: {value: this.commentEditText[i], cols: '28', placeholder: 'コメントを入力'},
                                                            on: {input: e => {this.commentEditText = Object.assign({}, this.commentEditText, { [i]: e.target.value });},
                                                                    focus: ()=>{this.commentEditFocus = Object.assign({}, this.commentEditFocus, { [i]: true });},
                                                                    blur: ()=>{this.commentEditFocus = Object.assign({}, this.commentEditFocus, { [i]: false });}},
                                                            style:{height: this.areaHeight(this.commentEditText[i], 'commentEdit'), marginBottom: '-2px'}, 'class': {'comment-inputD': true}}, this.commentEditText[i])
                                                        ]),
                                                    createElement('div', {class: 'dd-edit-flex', style:{width: '235px'}},[
                                                        createElement('div', {style:{display: 'flex'}},[
                                                            createElement('p', {class: 'dd-gray'}, this.displayTime(this.commentSync[i].input_at)),
                                                            this.commentSync[i].edited == true ?
                                                                createElement('p', {class: 'dd-gray'}, '（編集済）')
                                                            : ''
                                                        ]),
                                                        createElement('div', {class: 'dd-gray', style:{display: 'flex'}},[
                                                            this.commentEdit[i] == '保存'  && this.commentSync[i].userId == this.$store.state.uid?
                                                            createElement('v-ons-icon', {attrs: {icon: 'ion-android-close'}, on: {click: ()=>{this.commentEditCancel(i);}}, style:{paddingTop: '2px', marginRight: this.commentSync[i].userId == this.$store.state.uid && this.commentSync[i].text != this.commentEditText[i] ? '24px' : '8px'}})
                                                            : '',
                                                            this.commentSync[i].userId == this.$store.state.uid && this.commentSync[i].text != this.commentEditText[i] ?
                                                            createElement('p', {on: {click: ()=>{this.commentEditChange(i);}}}, this.commentEdit[i])
                                                            : ''
                                                        ])  
                                                    ]),
                                                    this.$store.state.replyData.filter(data => data.commentId == this.commentSync[i].id).length > 0 &&
                                                    createElement('div', {class: 'dd-replyctrl'},[
                                                        // createElementは、最後の引数にbindしたstateを指定しないと、dbの変更をリアルタイムに反映することができないため、このように切り替える内容と分離させる。
                                                        this.replyShow[i] == false ?
                                                            createElement('span', {on: {click: ()=>{this.controlReply(i);}}}, this.$store.state.replyData.filter(data => data.commentId == this.commentSync[i].id).length + '件の')
                                                        : '',
                                                        createElement('span', {on: {click: ()=>{this.controlReply(i);}}}, this.replyControl[i])
                                                    ])
                                                ])
                                            ]); 
                                            // ページ起動後に追加される返信について、renderの中で初期化。こうすることで、リアクティブにできる。
                                            // lenの最後だけを確かめているのは、replyDataはinput_atでorderByされていて、最新は最後であることがわかっているため。
                                            if(this.commentSync.length > 0) {
                                                const len = this.$store.state.replyData.filter(data => data.commentId == this.commentSync[i].id).length;
                                                if(len > 0) {
                                                    this.replyEdit[this.$store.state.replyData.filter(data => data.commentId == this.commentSync[i].id)[len-1].id] == null ? this.replyEdit[this.$store.state.replyData.filter(data => data.commentId == this.commentSync[i].id)[len-1].id] = '編集' : '';
                                                }
                                            }
                                            const replyList = this.$store.state.replyData.filter(data => data.commentId == this.commentSync[i].id).length > 0 &&
                                                    this.replyShow[i] == true ?
                                                    //createElementを使用する場合のv-forの代替手段がarray.prototype.map()
                                                        createElement('div', {class: 'dd-column', style:{marginLeft: 'calc(6vh + 8px)'}}, this.$store.state.replyData.filter(data => data.commentId == this.commentSync[i].id).map((item, index) => [
                                                            createElement('div', {class: 'dd-card'},[
                                                                createElement('img', {attrs: { src: this.$store.state.usersData.filter(data => data.id == item.userId)[0].image == null ? png : this.$store.state.usersData.filter(data => data.id == item.userId)[0].image}, class: 'dd-rimg'},),
                                                                createElement('div', {class: 'dd-column'},[
                                                                    createElement('p', {class: 'dd-rep-name'}, this.$store.state.usersData.filter(data => data.id == item.userId)[0].name),
                                                                    this.replyEdit[item.id] == '編集' ?
                                                                        createElement('textarea', {domProps: {value: item.text}, attrs: {readonly: true}, style:{marginBottom: '6px',
                                                                            height: this.areaHeight(item.text, 'replyEdit')}, 'class': {'reply-inputD': true}
                                                                        })
                                                                        : createElement('div', {attrs:{id: item.id}, 'class': {borderD: true, underlineDRep: true}, style:{marginBottom: '4px'}},[
                                                                            createElement('textarea', {domProps: {value: this.replyEditText[item.id], cols: '26', placeholder: 'コメントを入力'},
                                                                                on: {input: e => {this.replyEditText = Object.assign({}, this.replyEditText, { [item.id]: e.target.value });},
                                                                                    //replyListはmapにより作成されているため、booleanによるclassの動的な切り替えができない。
                                                                                        focus: ()=>{document.getElementById(item.id).classList.add("underline2DRep");},
                                                                                        blur: ()=>{document.getElementById(item.id).classList.remove("underline2DRep");}},
                                                                                style:{height: this.areaHeight(this.replyEditText[item.id], 'replyEdit'), marginBottom: '-2px'}, 'class': {'reply-inputD': true}}, this.replyEditText[item.id])
                                                                        ]),
                                                                        createElement('div', {class: 'dd-edit-flex', style:{width: '204px'}},[
                                                                            createElement('div', {style:{display: 'flex'}},[
                                                                                createElement('p', {class: 'dd-gray'}, this.displayTime(item.input_at)),
                                                                                item.edited == true ?
                                                                                    createElement('p', {class: 'dd-gray'}, '（編集済）')
                                                                                : ''
                                                                            ]),
                                                                            createElement('div', {class: 'dd-gray', style:{display: 'flex', marginBottom: '8px'}},[
                                                                                    this.replyEdit[item.id] == '保存' && item.userId == this.$store.state.uid ?
                                                                                        createElement('v-ons-icon', {attrs: {icon: 'ion-android-close'}, on: {click: ()=>{this.replyEditCancel(item.id);}}, style:{paddingTop: '2px', marginRight: item.userId == this.$store.state.uid && item.text != this.replyEditText[item.id] ? '24px' : '6px'}})
                                                                                    : '',
                                                                                    item.userId == this.$store.state.uid && item.text != this.replyEditText[item.id] ?
                                                                                    createElement('p', {on: {click: ()=>{this.replyEditChange(item.id);}}}, this.replyEdit[item.id])
                                                                                    : ''
                                                                                ])
                                                                        ])
                                                                ])
                                                            ])
                                                        ]))
                                                    : '';
                                            const replyButton = createElement('div', {style:{marginLeft: 'calc(6vh + 8px)'}},[
                                                                this.replyAddFlg[i] == false ?
                                                                    createElement('p', {on: {click: ()=>{this.replyAdd(i)}}, class: 'dd-replyb'}, '返信')
                                                                    : createElement('v-ons-icon', {attrs: {icon: 'ion-android-close'}, on: {click: ()=>{this.replyAdd(i);}}, class: 'dd-replyb', style:{marginLeft: '10px'}}),
                                                                this.replyAddFlg[i] == true ?
                                                                    createElement('div', {class: 'dd-card'},[
                                                                        createElement('img', {attrs: { src: this.$store.state.myData.image == null ? png : this.$store.state.myData.image}, class: 'dd-rimg'},),
                                                                        createElement('div', {class: 'dd-column'},[
                                                                        createElement('div', {'class': {borderD: true, underlineDRep: true, underline2DRep: this.replyAddFocus[i]==true ? true : false}, style:{marginBottom: '4px'}},[
                                                                            createElement('textarea', {domProps: {value: this.replyAddText[i], cols: '26', placeholder: 'コメントを入力'},
                                                                                on: {input: e => {this.replyAddText = Object.assign({}, this.replyAddText, { [i]: e.target.value });},
                                                                                        focus: ()=>{this.replyAddFocus = Object.assign({}, this.replyAddFocus, { [i]: true });},
                                                                                        blur: ()=>{this.replyAddFocus = Object.assign({}, this.replyAddFocus, { [i]: false });}},
                                                                                style:{height: this.areaHeight(this.replyAddText[i], 'replyEdit'), marginBottom: '-2px'}, 'class': {'reply-inputD': true}}, this.replyAddText[i])
                                                                        ]),
                                                                            createElement('div', {style:{height: '40px'}},[
                                                                                this.replyAddText[i] != '' ?
                                                                                    createElement('div', {class: 'dd-edit-flex'},[
                                                                                        createElement('v-ons-button', {attrs: {modifier: 'quiet'}, on: {click: ()=>{this.replyAddC(i);}}, 
                                                                                            style:{color: '#575757'}}, 'キャンセル'),
                                                                                        createElement('v-ons-button', {attrs: {modifier: 'quiet'}, on: {click: ()=>{this.replyAddS(i);}}, 
                                                                                            }, '返信')
                                                                                    ])
                                                                                : ''
                                                                            ])
                                                                        ])
                                                                    ])
                                                                : ''
                                                ]);

                                        if(commentCard) {
                                            if(replyList){
                                                return [commentCard, replyList, replyButton];
                                            }
                                                return [commentCard, replyButton];
                                        } else {
                                            return null;
                                        }
                                    })()
                                ]
                            );
                        } else {
                            return null;
                        }
                    }
                })
            }
        }
    },

    beforeMount() {
        //コメント・返信内容の編集中に、新しいコメントが投稿されても、編集内容が失われないようにするため、commentSyncをまたぐ。
        // concatではなく、=やdataに直接commentDataを指定すると、その時点から同期されてしまいコントロールできない。
      this.commentSync = [].concat(this.$store.state.commentData);
    },

    mounted() {
        //コメント・返信内容の編集中に、新しいコメントが投稿されても、編集内容が失われないようにするため、commentSyncをまたぐ。
        // concatではなく、=やdataに直接commentDataを指定すると、その時点から同期されてしまいコントロールできない。
        unwatch = this.$store.watch(
        state => state.commentData,
        commentData => {
            const comEditFlgL = Object.values(this.commentEdit);
            const repEditFlgL = Object.values(this.replyEdit);
            
            if(comEditFlgL.indexOf('保存') == -1 && repEditFlgL.indexOf('保存') == -1) {
                this.commentSync = [].concat(this.$store.state.commentData);
                this.toastVisible = false;
            } else {
                //コメント・返信内容の編集中に、新しいコメントが投稿された場合、自動ロードはせず、toastでヒアリングする。
                this.toastVisible = true;
            }
        });

        const latestId = this.$store.state.diaries.filter(diary => diary.userId == this.userId && diary.submit == true)[0].id;
        if(this.id == latestId) {
            this.$store.dispatch('updateOpenTime', {userId: this.userId});
        }
    },

    destroyed() {
        unwatch();
        this.$store.dispatch('unBindDiaryData');
        this.$store.dispatch('unBindCommentData');
        this.$store.dispatch('unBindReplyData');
    },


    computed: {
        writerImage() {
            const myImage   = this.$store.state.myData.image;
            const onesImage = this.$store.state.usersData.filter(data => data.id == this.userId)[0].image;
            
            return this.userId == this.$store.state.uid ?
                                    myImage == null ? png : myImage
                                    : onesImage == null ? png : onesImage;
        },

        writerName() {
            return this.userId == this.$store.state.uid ? this.$store.state.myData.name
                                                        : this.$store.state.usersData.filter(data => data.id == this.userId)[0].name;
        },

        areaHeight() {
            return(target, type) => {
                if(!target) {
                    return '26px';
                }
            // 半角と全角の規格統一のため、lengthではなく、bytesを用いる。
            let cols = 0;
            switch (type) {
                case 'commentEdit':
                    cols = 28;
                    break;
                case 'replyEdit':
                    cols = 24;
                    break;
                default:
                    break;
            }
            let kaigyou = 0;
                String.prototype.bytes = function () {
                        let nl = false;
                        let zenkaku = 0;
                        let hankaku = 0;
                        let special = false;
                        let special2 = false;

                        for (let i = 0; i < this.length; i++) {
                            const c = this.charCodeAt(i);
                            if(nl) {
                                //全角でcols分埋められて、かつhankakuが1文字入ってきたときには改行しない。
                                if(c != 0x0a && !(hankaku == 0 && zenkaku != 0 && zenkaku*2 == cols &&
                                    (c >= 0x0 && c < 0x81) || (c === 0xf8f0) || (c >= 0xff61 && c < 0xffa0) || (c >= 0xf8f1 && c < 0xf8f4))) {
                                    nl = true;
                                    kaigyou ++;
                                    zenkaku = 0;
                                    hankaku = 0;
                                    nl = false;
                                }   
                            }

                            if ((c >= 0x0 && c < 0x81) || (c === 0xf8f0) || (c >= 0xff61 && c < 0xffa0) || (c >= 0xf8f1 && c < 0xf8f4)) {
                                // '半角'
                                if(hankaku == 0 && zenkaku != 0 && zenkaku*2 == cols) {
                                    //全角でcols分埋められて、かつhankakuが1文字入ってきたとき。次の文字で改行するようにする。
                                    hankaku ++;
                                    nl = true;
                                    special2 = true;
                                } else {
                                    if(c == 0x0a) {
                                        // 改行のカウント
                                        kaigyou ++;
                                        zenkaku = 0;
                                        hankaku = 0;
                                        nl = false;
                                    } else {
                                        hankaku ++;

                                        if(zenkaku == 0 ?
                                            special2 == false ?
                                                hankaku != 0 && (hankaku) % (cols + 4) == 0
                                                : hankaku != 0 && (hankaku) % (cols + 3) == 0
                                            : hankaku % 2 == 0 ?
                                                (zenkaku * 2 + hankaku) % (cols + 4) == 0
                                                : hankaku != 5 && (zenkaku * 2 + hankaku) % (cols + 1) == 0) {
                                                    nl = true;
                                        }
                                    }
                                }  
                            } else {
                                // 全角が入力されたら、解除する。
                                special2 = false;
                                // '全角'
                                if (hankaku == 31) {
                                    // hankakuで1行全ての文字が埋められた場合、次の全角文字で即改行する。
                                    kaigyou ++;
                                    zenkaku = 0;
                                    hankaku = 0;
                                    nl = false;
                                    special = true;
                                } else {
                                if(special) {
                                    zenkaku += 2;
                                    special = false;
                                } else {
                                    zenkaku ++;
                                }

                                    if(hankaku == 0 ?
                                        zenkaku * 2 != 0 && (zenkaku * 2) % (cols) == 0
                                        : hankaku % 2 == 0 ?
                                            hankaku == 30 ?
                                                (zenkaku * 2 + hankaku) % (cols + 4) == 0
                                                : (zenkaku * 2 + hankaku) % (cols) == 0
                                            : hankaku == 1 ? //式で描く場合、||を使用してはいけない。
                                                (zenkaku * 2 + hankaku) % (cols + 1) == 0:
                                                (zenkaku * 2 + hankaku) % (cols + 1) == 0) {
                                        //句読点が先頭に来ないように自動的に調整されるため、その対応。12289は「、」 12290は「。」
                                        if(c == 12289 | c == 12290) {
                                            zenkaku ++;
                                        }
                                            // 改行を次の文字が始まるときに予約する
                                            nl = true;
                                    }
                                }
                            }    
                        }
                    };
                    const lineHeight = 25.7;
                    target.bytes();
                    let lineCount = 1 + kaigyou;
                return `${lineHeight * lineCount}px`;
            }
        },

        commentLength() {
            return this.commentSync.length;
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
    },

    methods: {
        editDiary() {
            const data = this.$store.state.diaryData;
            this.$store.commit('pop');
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
                                editDate: data.date,
                                submitted: data.submit
                            };
                    },
                    onsNavigatorOptions: {
                        animation: 'lift',
                        animationOptions: { duration: 0.5 }
                        }
            });
        },

        deleteDiary() {
            const vm = this;
            this.$ons.notification.confirm({messageHTML:'削除します。よろしいですか。',
                                                title:'',
                                                callback: function(idx) {
                                                                if (idx == 0) {
                                                                    return
                                                                } else {
                                                                    vm.$store.commit('pop');
                                                                    vm.$store.dispatch('deleteDiary', {id: vm.$store.state.diaryData.id});
                                                                    vm.$ons.notification.alert('削除しました。', {title:''});
                                                                }
                                                }});
        },

        load() {
            this.commentSync = [].concat(this.$store.state.commentData);
            this.toastVisible = false;
        },

        commentAddC() {
            this.comment = '';
        },

        commentAdd() {
            if(this.comment.length > 200) {
                this.$ons.notification.alert('200字以内に納めてください。', {title:''});
                return
            }

            // 生成する文字列の長さ
            const l = 20;
            // 生成する文字列に含める文字セット
            const c = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            const cl = c.length;
            let id = "";
            for(var i=0; i<l; i++){
                id += c[Math.floor(Math.random()*cl)];
            }
            
            this.$store.dispatch('diaryCommentAdd', {id: id, text: this.comment});
            if (!navigator.onLine) {
                this.$ons.notification.alert({messageHTML:'オンラインになるとコメントが追加されます。<br>オンラインになる前に画面を更新すると追加されません。', title:''});
            } else {
                this.$ons.notification.alert('コメントを追加しました', {title:''});
            }

            this.comment = '';
        },

        controlReply(i) {
            this.replyShow[i] = !this.replyShow[i];
            //リアクティブにするため、Object.assignを使用。
            this.replyControl = Object.assign({}, this.replyControl, { [i]: this.replyShow[i] == true ? '返信を非表示' : '返信を表示'});
        },

        commentEditChange(i) {
            if(this.commentEdit[i] == '保存') {
                this.$store.dispatch('diaryCommentUpdate', {id: this.commentSync[i].id, text: this.commentEditText[i]});
            }
            //リアクティブにするため、Object.assignを使用。
            this.commentEdit = Object.assign({}, this.commentEdit, { [i]: this.commentEdit[i] == '編集' ? '保存' : '編集'});
            this.commentEditText = Object.assign({}, this.commentEditText, { [i]: this.commentEdit[i] == '編集' ? '' : this.commentSync[i].text});
        },

        commentEditCancel(i) {
            //リアクティブにするため、Object.assignを使用。
            this.commentEdit = Object.assign({}, this.commentEdit, { [i]: '編集'});
            this.commentEditText = Object.assign({}, this.commentEditText, { [i]: ''});
        },

        replyEditChange(id) {
            if(this.replyEdit[id] == '保存') {
                this.$store.dispatch('diaryReplyUpdate', {id: id, text: this.replyEditText[id]});
            }
            //リアクティブにするため、Object.assignを使用。
            this.replyEdit = Object.assign({}, this.replyEdit, { [id]: this.replyEdit[id] == '編集' | '' ? '保存' : '編集'});
            this.replyEditText = Object.assign({}, this.replyEditText, { [id]: this.replyEdit[id] == '編集' | '' ? '' : this.$store.state.replyData.filter(data => data.id == id)[0].text});
        },

        replyEditCancel(id) {
            //リアクティブにするため、Object.assignを使用。
            this.replyEdit = Object.assign({}, this.replyEdit, { [id]: '編集'});
            this.replyEditText = Object.assign({}, this.replyEditText, { [id]: ''});
        },

        replyAdd(i) {
            this.replyAddFlg = Object.assign({}, this.replyAddFlg, { [i]: this.replyAddFlg[i] == true ? false : true});
            this.replyAddText = Object.assign({}, this.replyAddText, { [i]: ''});
        },

        replyAddS(i) {
            if(this.replyAddText.length > 200) {
                this.$ons.notification.alert('200字以内に納めてください。', {title:''});
                return
            }

            // 生成する文字列の長さ
            const l = 20;
            // 生成する文字列に含める文字セット
            const c = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            const cl = c.length;
            let id = "";
            for(let j=0; j<l; j++){
                id += c[Math.floor(Math.random()*cl)];
            }
            
            this.$store.dispatch('diaryReplyAdd', {id: id, commentId: this.commentSync[i].id, text: this.replyAddText[i]});
            if (!navigator.onLine) {
                this.$ons.notification.alert({messageHTML:'オンラインになると返信が追加されます。<br>オンラインになる前に画面を更新すると追加されません。', title:''});
            } else {
                this.$ons.notification.alert('返信を追加しました', {title:''});
            }

            this.replyAddFlg = Object.assign({}, this.replyAddFlg, { [i]: false});
            this.replyAddText = Object.assign({}, this.replyAddText, { [i]: ''});
            this.replyShow = Object.assign({}, this.replyShow, { [i]: true});
        },

        replyAddC(i) {
            this.replyAddFlg = Object.assign({}, this.replyAddFlg, { [i]: false});
            this.replyAddText = Object.assign({}, this.replyAddText, { [i]: ''});
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
    .center {
        overflow-x: auto;
        font-size: 0.95rem;
    }

    .save {
        font-size: 1rem;
        padding-right: 12px;
        transform: translateY(-2px);
    }

    .pen {
        font-size: 1.2rem;
        margin-right: 24px;
        transform: translateY(-2px);
    }

    .trash {
        font-size: 1.7rem;
        margin-right: 16px;
        transform: translateY(-2px);
    }

    .diary-header {
        width: 100vw;
        padding: 16px 16px;
        margin-bottom: 8px;
        border-bottom: solid 1px #e2e1e1;
        display: flex;
        align-items: center;
    }

    /* index.vueに記載。Mypage.vue、DiaryDrafts.vueと共同利用のため。 */


    .writer-image{
        height: 8vh;
        width: 8vh;
        border-radius: 4vh;
        margin-right: 12px;
    }

    .comment-count {
        font-size: 1.1rem;
        margin-bottom: 16px;
        margin-left: 16px;
        padding-top: 16px;
    }

    .img-comment {
        display: flex;
        align-items: flex-start;
        margin-bottom: 8px;
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
        font-size: 1rem;
        min-height:25.7px;
        line-height: 25.7px;
        width: 235px;
        resize: none;
        padding: 0;
        margin-top: 2vh;
        border: none;
        background-color: #fcfcfc;
    }

    .underline {
        width: 235px;
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
        width: 235px;
    }

    .comment-btns {
        display: flex;
        justify-content: flex-end;
        height: 40px;
        width: 235px;
        margin-left: calc(6vh + 16px + 8px);
        margin-bottom: 24px;
    }

    .comment-add-c {
        margin-right: 24px;
        color: #575757;
    }

    .list {
        border: none;
        background-color: #fcfcfc;
        margin-left: 16px;
    }

    .toast-close {
        position: relative;
        top: -1px;
        left: 12px;
        font-size: 1.1rem;
    }

    .footer {
        padding: 24px;
    }
</style>
