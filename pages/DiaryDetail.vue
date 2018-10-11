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
                <div v-if="diaryDiv=='下書き'" class="save" :style="md ? 'position: relative; top: 3px;' : ''" @click="addDiary(false)">保存</div>
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

        <p class="comment-count">{{this.commentSync.length}}件のコメント</p>
        <div class="img-comment">
            <img :src="$store.state.myData.image!=null ? $store.state.myData.image : defaultImg" alt="image" class="list-item__thumbnail my-image">
            <div class="border underline" :class="commentFocus == true ? 'underline2' : ''">
                <textarea cols="30" :style="{height: areaHeight(comment, 'comment')}" class="comment-input" placeholder="コメントを入力" v-model="comment" @focus="focus" @blur="blur"></textarea>
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
import Vue from 'vue'
import png from '../assets/dUsrImg.jpg'
export default {
    
    data() {
        return {
            toastVisible: false,
            commentSync: [],
            defaultImg: png,//templateで読み込むため。
            diaryDiv: '', 
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
            commentEditFocus: {},
            commentEditText: {},
            replyShow: {},
            replyControl: {},
            replyLength: {},
            unbindTarget: [],
            commentEdit: {},
            replyEdit: {},
            replyEditFocus: {},
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
            if(this.commentSync.length > 0) {
                                            const len = this.$store.state.replyData.filter(data => data.commentId == this.commentSync[i].id).length
                                            if(len > 0) {
                                                for(let j=0; j<len; j++) {
                                                    this.replyEdit[this.$store.state.replyData.filter(data => data.commentId == this.commentSync[i].id)[j].id] = '編集';
                                                    this.replyEditFocus[this.$store.state.replyData.filter(data => data.commentId == this.commentSync[i].id)[j].id] = false;
                                                }
                                            }
                                        }
            return new Vue({

                render: createElement => {
                    if(this.commentSync.length > 0) {

                    return createElement(
                        "div",
                        {style:{width: '90vw'}},
                        [
                            (()=> {
                                    const commentCard = createElement('div', {style:{display: 'flex', justifyContent: 'flex-start', width: '90vw', marginBottom: '8px'}},[
                                        createElement('img', {attrs: { src: this.$store.state.usersData.filter(data => data.id == this.commentSync[i].userId)[0].image == null ? png : this.$store.state.usersData.filter(data => data.id == this.commentSync[i].userId)[0].image}, 
                                            style:{height: '6vh', maxHeight: '56px', width: '6vh', maxWidth: '56px', borderRadius: '3vh', marginRight: '8px'}},),
                                        createElement('div', {style:{display: 'flex', flexDirection:'column', width: '80vw'}},[
                                            createElement('p', {style:{fontSize: '1rem', marginRight: '8px', marginBottom: '4px'}}, this.$store.state.usersData.filter(data => data.id == this.commentSync[i].userId)[0].name),
                                            this.commentEdit[i] == '編集' ?
                                                createElement('textarea', {attrs: {readonly: true}, style:{fontSize: '1rem', marginBottom: '6px',
                                                    height: this.areaHeight(this.commentSync[i].text, 'commentEdit')}, 'class': {'comment-inputD': true}
                                                }, this.commentSync[i].text)
                                            : createElement('div', {'class': {borderD: true, underlineDCom: true, underline2DCom: this.commentEditFocus[i]==true ? true : false}, style:{marginBottom: '4px'}},[
                                                createElement('textarea', {domProps: {value: this.commentEditText[i], cols: '28', placeholder: 'コメントを入力'},
                                                    on: {input: e => {this.commentEditText = Object.assign({}, this.commentEditText, { [i]: e.target.value });},
                                                            focus: ()=>{this.commentEditFocus = Object.assign({}, this.commentEditFocus, { [i]: true });},
                                                            blur: ()=>{this.commentEditFocus = Object.assign({}, this.commentEditFocus, { [i]: false });}},
                                                    style:{height: this.areaHeight(this.commentEditText[i], 'commentEdit'), fontSize:'1rem', marginBottom: '-2px'}, 'class': {'comment-inputD': true}}, this.commentEditText[i])
                                                ]),
                                            createElement('div', {style:{display: 'flex', justifyContent: 'space-between', width: 'calc(90vw - (6vh + 8px)'}},[
                                                createElement('div', {style:{display: 'flex'}},[
                                                    createElement('p', {style:{fontSize: '0.9rem', color: '#8e8e8e'}}, this.displayTime(this.commentSync[i].input_at)),
                                                    this.commentSync[i].edited == true ?
                                                        createElement('p', {style:{fontSize: '0.9rem', color: '#8e8e8e'}}, '（編集済）')
                                                    : ''
                                                ]),
                                                createElement('div', {style:{display: 'flex', color: '#8e8e8e', fontSize: '0.9rem'}},[
                                                    this.commentEdit[i] == '保存'  && this.commentSync[i].userId == this.$store.state.uid?
                                                    createElement('v-ons-icon', {attrs: {icon: 'ion-android-close'}, on: {click: ()=>{this.commentEditCancel(i);}}, style:{paddingTop: '2px', marginRight: this.commentSync[i].userId == this.$store.state.uid && this.commentSync[i].text != this.commentEditText[i] ? '24px' : '8px'}})
                                                    : '',
                                                    this.commentSync[i].userId == this.$store.state.uid && this.commentSync[i].text != this.commentEditText[i] ?
                                                    createElement('p', {on: {click: ()=>{this.commentEditChange(i);}}, style:{}}, this.commentEdit[i])
                                                    : ''
                                                ])
                                                
                                            ]),
                                            this.$store.state.replyData.filter(data => data.commentId == this.commentSync[i].id).length > 0 &&
                                            createElement('div', {style:{display: 'flex', marginBottom: '8px', marginTop: '8px',}},[
                                                // createElementは、最後の引数にbindしたstateを指定しないと、dbの変更をリアルタイムに反映することができないため、このように切り替える内容と分離させる。
                                                this.replyShow[i] == false ?
                                                    createElement('span', {on: {click: ()=>{this.controlReply(i);}}}, this.$store.state.replyData.filter(data => data.commentId == this.commentSync[i].id).length + '件の')
                                                : '',
                                                createElement('p', {on: {click: ()=>{this.controlReply(i);}}}, this.replyControl[i])
                                            ]),
                                            ])
                                            ])
                                            
                                    // ページ起動後に追加される返信について、renderの中で初期化。こうすることで、リアクティブにできる。
                                    // lenの最後だけを確かめているのは、replyDataはinput_atでorderByされていて、最新が最後であることがわかっているため。
                                    if(this.commentSync.length > 0) {
                                        const len = this.$store.state.replyData.filter(data => data.commentId == this.commentSync[i].id).length
                                        if(len > 0) {
                                            this.replyEdit[this.$store.state.replyData.filter(data => data.commentId == this.commentSync[i].id)[len-1].id] == null ? this.replyEdit[this.$store.state.replyData.filter(data => data.commentId == this.commentSync[i].id)[len-1].id] = '編集' : '';
                                            this.replyEditFocus[this.$store.state.replyData.filter(data => data.commentId == this.commentSync[i].id)[len-1].id] = false;
                                        }
                                    }

                                    const replyList =    this.$store.state.replyData.filter(data => data.commentId == this.commentSync[i].id).length > 0 &&
                                            this.replyShow[i] == true ?
                                            //createElementを使用する場合のv-forの代替手段がarray.prototype.map()
                                                createElement('div', {style:{display: 'flex', flexDirection:'column', marginLeft: 'calc(6vh + 8px)'}}, this.$store.state.replyData.filter(data => data.commentId == this.commentSync[i].id).map((item, index) => [
                                                    createElement('div', {style:{display: 'flex', justifyContent: 'flex-start', marginBottom: '8px'}},[
                                                        createElement('img', {attrs: { src: this.$store.state.usersData.filter(data => data.id == item.userId)[0].image == null ? png : this.$store.state.usersData.filter(data => data.id == item.userId)[0].image}, style:{height: '4vh', maxHeight: '56px', width: '4vh', maxWidth: '56px', borderRadius: '2vh', marginRight: '8px'}},),
                                                        createElement('div', {style:{display: 'flex', flexDirection:'column'}},[
                                                            createElement('p', {style:{fontSize: '1rem', marginRight: '8px'}}, this.$store.state.usersData.filter(data => data.id == item.userId)[0].name),
                                                            this.replyEdit[item.id] == '編集' ?
                                                                // createElement('p', {style:{minHeight: '28px', fontSize: '1rem', marginBottom: '4px', paddingLeft: '0px', paddingTop: '1px'}}, item.text)
                                                                createElement('textarea', {domProps: {value: item.text}, attrs: {readonly: true}, style:{fontSize: '1rem', marginBottom: '6px',
                                                                    height: this.areaHeight(item.text, 'replyEdit')}, 'class': {'reply-inputD': true}
                                                                }, )
                                                                : createElement('div', {'class': {borderD: true, underlineDRep: true, underline2DRep: this.replyEditFocus[item.id]==true ? true : false}, style:{marginBottom: '4px'}},[
                                                                    createElement('textarea', {domProps: {value: this.replyEditText[item.id], cols: '26', placeholder: 'コメントを入力'},
                                                                        on: {input: e => {this.replyEditText = Object.assign({}, this.replyEditText, { [item.id]: e.target.value });},
                                                                                focus: ()=>{this.replyEditFocus = Object.assign({}, this.replyEditFocus, { [item.id]: true });console.log(this.replyEditFocus[item.id]);},
                                                                                blur: ()=>{this.replyEditFocus = Object.assign({}, this.replyEditFocus, { [item.id]: false });}},
                                                                        style:{height: this.areaHeight(this.replyEditText[item.id], 'replyEdit'), fontSize:'1rem', marginBottom: '-2px'}, 'class': {'reply-inputD': true}}, this.replyEditText[item.id])
                                                                ]),
                                                                createElement('div', {style:{display: 'flex', justifyContent: 'space-between', width: 'calc(90vw - ((6vh + 8px) + (4vh + 8px))'}},[
                                                                    createElement('div', {style:{display: 'flex'}},[
                                                                        createElement('p', {style:{fontSize: '0.9rem', color: '#8e8e8e'}}, this.displayTime(item.input_at)),
                                                                        item.edited == true ?
                                                                            createElement('p', {style:{fontSize: '0.9rem', color: '#8e8e8e'}}, '（編集済）')
                                                                        : '',
                                                                    ]),
                                                                    createElement('div', {style:{display: 'flex', marginBottom: '8px',  color: '#8e8e8e', fontSize: '0.9rem'}},[
                                                                            this.replyEdit[item.id] == '保存' && item.userId == this.$store.state.uid ?
                                                                                createElement('v-ons-icon', {attrs: {icon: 'ion-android-close'}, on: {click: ()=>{this.replyEditCancel(item.id);}}, style:{paddingTop: '2px', marginRight: item.userId == this.$store.state.uid && item.text != this.replyEditText[item.id] ? '24px' : '6px'}})
                                                                            : '',
                                                                            item.userId == this.$store.state.uid && item.text != this.replyEditText[item.id] ?
                                                                            createElement('p', {on: {click: ()=>{this.replyEditChange(item.id);}}, style:{}}, this.replyEdit[item.id])
                                                                            : '',
                                                                        ])
                                                                ]),
                                                        ])
                                                    ])
                                                ]))
                                            : ''
                                    const replyButton = createElement('div', {style:{marginLeft: 'calc(6vh + 8px)'}},[
                                                        this.replyAddFlg[i] == false ?
                                                            createElement('p', {on: {click: ()=>{this.replyAdd(i)}}, style:{fontSize: '1rem', marginBottom: '8px', color: '#8e8e8e'}}, '返信')
                                                            : createElement('v-ons-icon', {attrs: {icon: 'ion-android-close'}, on: {click: ()=>{this.replyAdd(i);}}, style:{fontSize: '1rem', marginBottom: '8px', color: '#8e8e8e', marginLeft: '10px'}}),
                                                        this.replyAddFlg[i] == true ?
                                                            createElement('div', {style: {display: 'flex', justifyContent: 'flex-start', marginBottom: '8px'}},[
                                                                createElement('img', {attrs: { src: this.$store.state.myData.image == null ? png : this.$store.state.myData.image}, style:{height: '4vh', maxHeight: '56px', width: '4vh', maxWidth: '56px', borderRadius: '2vh', marginRight: '8px'}},),
                                                                createElement('div', {style: {display: 'flex', flexDirection: 'column'}},[
                                                                createElement('div', {'class': {borderD: true, underlineDRep: true, underline2DRep: this.replyAddFocus[i]==true ? true : false}, style:{marginBottom: '4px'}},[
                                                                    createElement('textarea', {domProps: {value: this.replyAddText[i], cols: '26', placeholder: 'コメントを入力'},
                                                                        on: {input: e => {this.replyAddText = Object.assign({}, this.replyAddText, { [i]: e.target.value });},
                                                                                focus: ()=>{this.replyAddFocus = Object.assign({}, this.replyAddFocus, { [i]: true });},
                                                                                blur: ()=>{this.replyAddFocus = Object.assign({}, this.replyAddFocus, { [i]: false });}},
                                                                        style:{height: this.areaHeight(this.replyAddText[i], 'replyEdit'), fontSize:'1rem', marginBottom: '-2px'}, 'class': {'reply-inputD': true}}, this.replyAddText[i])
                                                                ]),
                                                                    createElement('div', {style:{height: '40px'}},[
                                                                        this.replyAddText[i] != '' ?
                                                                            createElement('div', {style:{display: 'flex', justifyContent: 'space-between'}},[
                                                                                createElement('v-ons-button', {attrs: {modifier: 'quiet'}, on: {click: ()=>{this.replyAddC(i);}}, 
                                                                                    style:{fontSize: '1rem', color: '#575757'}}, 'キャンセル'),
                                                                                createElement('v-ons-button', {attrs: {modifier: 'quiet'}, on: {click: ()=>{this.replyAddS(i);}}, 
                                                                                    style:{fontSize: '1rem'}}, '返信')
                                                                            ])
                                                                        : ''
                                                                    ])
                                                                ])
                                                            ])
                                                        : ''
                                        ])

                                if(commentCard) {
                                    if(replyList){
                                        return [commentCard, replyList, replyButton]
                                        }
                                        return [commentCard, replyButton]
                                        } else {
                                            return null
                                        }
                            })(),

                        ]
                    );
                    } else {
                        return null;
                    }
                },
            
        })
        },

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
        this.$store.watch(
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
            })
    },

    destroyed() {
        this.$store.dispatch('unBindDiaryData');
        this.$store.dispatch('unBindCommentData');
        this.$store.dispatch('unBindReplyData');
    },


    computed: {
        areaHeight() {
            return(target, type) => {
                if(!target) {
                    return '26px';
                }
            // 半角と全角の規格統一のため、lengthではなく、bytesを用いる。
            let cols = 0;
            switch (type) {
                case 'comment':
                    cols = 28;
                    break;
                case 'commentEdit':
                    cols = 28;
                    break;
                case 'replyEdit':
                    cols = 26;
                    break;
                default:
                    break;
            }
                String.prototype.bytes = function () {
                        var length = 0;
                        for (var i = 0; i < this.length; i++) {
                            var c = this.charCodeAt(i);
                            if ((c >= 0x0 && c < 0x81) || (c === 0xf8f0) || (c >= 0xff61 && c < 0xffa0) || (c >= 0xf8f1 && c < 0xf8f4)) {
                                length += 1;
                            } else {
                                length += 2;
                            }
                        }
                        return length;
                    };
                    // const lineHeight = 24;
                    const lineHeight = 26;
                    const kaigyou = target.split(/\n/).length - 1;
                    const lineCount = ((target.bytes() - kaigyou) == 0 ? 1 : 0) + Math.ceil((target.bytes() - kaigyou) / cols) + kaigyou;
                // return `height: ${lineHeight * lineCount}px`;
                return `${lineHeight * lineCount}px`;
            }
        },

        commentLength() {
            // return this.$store.state.diaryData.commentCount
            return this.commentSync.length;
        },

        displayTime() {
            return(time) => {
                if(!time) {
                    //自身の画面からの登録直後はnullになるため。
                    return 'たった今';
                }
                let timestamp = time.seconds * 1000;
                var date = new Date(timestamp)
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
        load() {
            this.commentSync = [].concat(this.$store.state.commentData);
            this.toastVisible = false;
        },

        commentAddC() {
            this.comment = '';
        },

        async commentAdd() {
            if(this.comment.length > 200) {
                this.$ons.notification.alert('200字以内に納めてください。', {title:''})
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
            
            await this.$store.dispatch('diaryCommentAdd', {id: id, text: this.comment})
            if (!navigator.onLine) {
                this.$ons.notification.alert({messageHTML:'オンラインになるとコメントが追加されます。<br>オンラインになる前に画面を更新すると追加されません。', title:''})
            } else {
                this.$ons.notification.alert('コメントを追加しました', {title:''})
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

        async replyAddS(i) {
            if(this.replyAddText.length > 200) {
                this.$ons.notification.alert('200字以内に納めてください。', {title:''})
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
            
            await this.$store.dispatch('diaryReplyAdd', {id: id, commentId: this.commentSync[i].id, text: this.replyAddText[i]})
            if (!navigator.onLine) {
                this.$ons.notification.alert({messageHTML:'オンラインになると返信が追加されます。<br>オンラインになる前に画面を更新すると追加されません。', title:''})
            } else {
                this.$ons.notification.alert('返信を追加しました', {title:''})
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
        font-size: 1.2rem;
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
        min-height:24px;
        line-height: 24px;
        width: 245px;
        resize: none;
        padding: 0;
        margin-top: 2vh;
        border: none;
        background-color: #fcfcfc;
    }

    .underline {
        width: 245px;
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
        width: 245px;
    }

    .comment-btns {
        display: flex;
        justify-content: flex-end;
        height: 40px;
        width: 245px;
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
