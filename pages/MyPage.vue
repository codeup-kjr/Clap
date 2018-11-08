<template>
   <!-- <no-ssr> -->
    <v-ons-page>
        <v-ons-toolbar>
            <div class="left" :style="pColor" @click="pTap()">
                プロフィール
            </div>
            <div class="center" :style="tColor" @click="tTap()">
                提出履歴
            </div>
            <div class="right">
            </div>
        </v-ons-toolbar>

        <div class="container">
            <div v-show="pIsTapped">
                <v-ons-modal :visible="croppaVisible">
                <croppa
                    v-model="myCroppa"
                    :width="250"
                    :height="250"
                    :accept="'image/*'"
                    :file-size-limit="0"
                    :placeholder="'タップして写真を選択'"
                    :placeholder-font-size="20"
                    :placeholder-color="'white'"
                    :quality="1"
                    :zoom-speed="9"
                    :prevent-white-space="true"
                    :show-loading="true"
                    @init="onInit"
                    class="croppa"
                    >
                <div class="spinner" v-if="myCroppa && myCroppa.loading"></div>
                </croppa>

                <div class="croppa-btns">
                    <v-ons-icon icon="ion-android-refresh" class="rotate-b" v-show="myCroppa.imageSet" @click="rotate"></v-ons-icon>
                    <div class="rotate-b dummy" v-show="!myCroppa.imageSet">dummy</div>
                </div>
                <div class="croppa-btns">
                    <v-ons-button class="cancel-b" @click="cancel" modifier="quiet">キャンセル</v-ons-button>
                    <v-ons-button class="choose-b" @click="choose" v-show="myCroppa.imageSet">決定</v-ons-button>
                </div>
                </v-ons-modal>
                <div class="imgInp">
                    <img class="list-item__thumbnail" :src="upImg" id="upImg" @click="upImage">
                    <div class="name-rg">
                        <input type="text" v-if="edit=='保存'" v-model="userName" placeholder="ユーザー名" class="user-name unedit"/>
                        <div v-else class="user-name">{{$store.state.myData.name}}</div>
                        <div class="role-grade" :style="edit=='保存' ? {marginBottom: '0px'} : ''">
                            <v-ons-select v-if="edit=='保存'" v-model="role" class="role-slct">
                                <option disabled selected>役割</option>
                                <option v-for="item in $store.state.role" :key="item.id">
                                    {{ item.text }}
                                </option>
                            </v-ons-select>
                            <div v-else class="role">
                                {{$store.state.myData.role}}
                            </div>
                            <div v-if="edit=='保存'">
                                <v-ons-select v-model="grade" class="grade-slct" v-if="$store.state.team.type!='社会人' && (role=='選手' || role=='マネジャー')">
                                    <option disabled selected>学年</option>
                                    <option v-for="item in gradeNum" :key="item.id">
                                        {{ item }}
                                    </option>
                                </v-ons-select>
                            </div>
                            <div v-else-if="$store.state.team.type!='社会人' && ($store.state.myData.role=='選手' || $store.state.myData.role=='マネジャー')" class="grade">
                                {{$store.state.myData.grade}}年生
                            </div>
                        </div>
                        <div class="edit-b" @click="editPush">
                            <v-ons-icon icon='fa-cog' class="cog"/>
                            <span class="edit-b-t">{{edit}}</span>
                        </div>
                    </div>
                </div>
            
                    <div class="row">
                        <div class="r-title">チーム名</div>
                        <div class="r-content">{{$store.state.team.name}}</div>
                    </div>
                    <div class="row">
                        <div class="r-title">チームID</div>
                        <div class="r-content">{{$store.state.teamId}}</div>
                    </div>
                    <div class="row">
                        <div class="r-title">メール</div>
                        <div class="r-content">{{$store.state.myData.email}}</div>
                    </div>
                    <div class="row">
                        <div class="r-title">日誌カテゴリ</div>
                        <div class="r-content">Comming Soon</div>
                    </div>
                <v-ons-button modifier="quiet" class="logout-b" @click="logoutPush">ログアウト</v-ons-button>
            </div>

            <v-ons-list class="list" v-show="!pIsTapped">
                <v-ons-lazy-repeat
                    :render-item="renderItem"
                    :length="renderLength"
                    :calculate-item-height="calculateItemHeight"
                >
                </v-ons-lazy-repeat>
        </v-ons-list> 
        </div>
    </v-ons-page>
    <!-- </no-ssr> -->
</template>

<script>
import Vue from 'vue';
import DiaryWrite from './DiaryWrite';
import png from '../assets/dUsrImg.jpg';

export default {
    data() {
        return {
            questions: this.$store.state.questions,
            pIsTapped: true,
            croppaVisible: false,
            myCroppa: {},
            file: '',
            edit: '編集',
            userName: this.$store.state.myData.name,
            role: this.$store.state.myData.role,
            grade: this.$store.state.myData.grade,
            androidStyle: {position: 'relative', left: '-4px'},//androidの場合、右に寄ってしまうため、調整。
            upImg: this.$store.state.myData.image == null ? png : this.$store.state.myData.image,
            addVisible: false,
            calculateItemHeight:
                i=> {
                        return 300;
                    },

                renderItem:
                i => {
                    return new Vue({
                    render: createElement => {
                        if(this.$store.state.myData) {
                        return createElement(
                            "div",
                            {},
                            [
                                (()=> {
                                        const target = this.$store.state.diaries.filter(diary => diary.submit == true && diary.userId == this.$store.state.uid)[i];

                                        return createElement('div', {class: 'diary-wrap'},[
                                                createElement('div', {class: 'header'},[
                                                    createElement('div', {class: 'title-date'},[
                                                        createElement('p', {class: 'diary-title'}, target.title),
                                                        createElement('p', {class: 'diary-date'}, target.date + ' ' + target.time),
                                                    ]),
                                                    createElement('div', {class: 'actions'},[
                                                        createElement('div', {on: {click: ()=>{this.editDiary(target)}}, class: 'icon-text edit'},[
                                                            createElement('v-ons-icon', {attrs: {icon: 'fa-pencil'}, class: 'pen'}),
                                                            createElement('p', {class: 'text'}, '編集'),
                                                        ]),
                                                        createElement('div', {on: {click: ()=>{this.deleteDiary(target.id)}}, class: 'icon-text'},[
                                                            createElement('v-ons-icon', {attrs: {icon: 'ion-ios-trash-outline'}, class: 'trash'}),
                                                            createElement('p', {class: 'text'}, '削除'),
                                                        ])
                                                    ])
                                                ]),
                                                createElement('div', {class: 'diary-contents'},[
                                                    createElement('div', {domProps: {innerHTML: '1. ' + this.questions.q1}, class: 'qTitle'},[]),
                                                    createElement('div', {domProps: {innerHTML: target.content1}, class: 'qAnswer'},[]),
                                                    createElement('div', {domProps: {innerHTML: '2. ' + this.questions.q2}, class: 'qTitle'},[]),
                                                    createElement('div', {domProps: {innerHTML: target.content2}, class: 'qAnswer'},[]),
                                                    createElement('div', {domProps: {innerHTML: '3. ' + this.questions.q3}, class: 'qTitle'},[]),
                                                    createElement('div', {domProps: {innerHTML: target.content3}, class: 'qAnswer'},[]),
                                                    createElement('div', {domProps: {innerHTML: '4. ' + this.questions.q4}, class: 'qTitle'},[]),
                                                    createElement('div', {domProps: {innerHTML: target.content4}, class: 'qAnswer'},[]),
                                                    createElement('div', {domProps: {innerHTML: '5. ' + this.questions.q5}, class: 'qTitle'},[]),
                                                    createElement('div', {domProps: {innerHTML: target.content5}, class: 'qAnswer'},[])
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
                }
        }
    },


    computed: {
        pColor() {
            return this.pIsTapped==true ? {color: '#f0be42', borderBottom: 'solid 3px #ffbd00', paddingBottom: '3px'} : {color: '#dbd9d9'};
        },

        tColor() {
            return this.pIsTapped==false ? {color: '#f0be42', borderBottom: 'solid 3px #ffbd00', paddingBottom: '3px'} : {color: '#dbd9d9'};
        },

        gradeNum() {
            let num = 0
            const type = this.$store.state.team.type
            switch (type) {
                case '高校':
                    num = 3;
                    break;
                case '大学':
                    num = 4;
                    break;
                case '中学':
                    num = 3;
                    break;
                default:
                    break;
            }
            return num;
        },

        renderLength() {
            const myDiaries = this.$store.state.diaries.filter(diary => diary.submit == true && diary.userId == this.$store.state.uid);
            return myDiaries != '' ? myDiaries.length : 0;
        },

    },

    methods: {
        pTap() {
          this.pIsTapped = true;
        },
        
        tTap() {
            this.pIsTapped = false;
        },
        //todo: croppaにfile-size-limitを設定し、limit超過時にtoastメッセージを表示する。
        editPush() {
            if(this.edit == '編集') {
                this.edit = '保存';
            } else {
                if(this.userName == '') {
                    this.$ons.notification.alert('ユーザー名を入力ください。', {title:''});
                    return
                } else {
                    if(this.file) {
                        this.$store.dispatch('updateUser', {name: this.userName, role: this.role, grade: this.grade, img: this.file});
                    } else {
                        this.$store.dispatch('updateUser', {name: this.userName, role: this.role, grade: this.grade});
                    }
                    if (!navigator.onLine) {
                        this.$ons.notification.alert({messageHTML:'オンラインになると保存されます。<br>オンラインになる前に画面を更新すると保存されません。', title:''});
                    } else {
                        this.$ons.notification.alert('保存しました。', {title:''});
                    }
                    this.file = '';
                    this.edit = '編集';
                }
            }
        },

        onInit() {
            this.myCroppa.addClipPlugin(function (ctx, x, y, w, h) {
                /*
                * ctx: canvas context
                * x: start point (top-left corner) x coordination
                * y: start point (top-left corner) y coordination
                * w: croppa width
                * h: croppa height
                */
                ctx.beginPath();
                ctx.arc(x + w / 2, y + h / 2, w / 2, 0, 2 * Math.PI, true);
                ctx.closePath();
            })

        },

        rotate() {
            this.myCroppa.rotate();
        },

        choose() {
            this.myCroppa.generateBlob(
                (blob) => {
                    this.file =  blob;
                },
                'image/jpeg', 0.5);
                
            this.upImg = this.myCroppa.generateDataUrl('image/jpeg', 0.5);
            this.croppaVisible = false;
            this.myCroppa.remove();
        },

        cancel() {
            this.croppaVisible = false;
            this.myCroppa.remove();
        },

        upImage() {
            if(this.edit == '保存') {
                this.croppaVisible = true;
            } 
        },

        logoutPush() {
            const vm = this;
            this.$ons.notification.confirm({messageHTML:'ログアウトします。<br>よろしいですか。',
                                                title:'',
                                                callback: function(idx) {
                                                                if (idx == 0) {
                                                                    return;
                                                                } else {
                                                                    vm.$store.dispatch('logout');
                                                                }
                                                }});
        },

        editDiary(data) {
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
                                submitted: true
                            };
                    },
                    onsNavigatorOptions: {
                        animation: 'lift',
                        animationOptions: { duration: 0.5 }
                        }
            });
        },

        deleteDiary(id) {
            const vm = this;
            this.$ons.notification.confirm({messageHTML:'削除します。よろしいですか。',
                                                title:'',
                                                callback: function(idx) {
                                                                if (idx == 0) {
                                                                    return;
                                                                } else {
                                                                    vm.$store.dispatch('deleteDiary', {id: id});
                                                                    vm.$ons.notification.alert('削除しました。', {title:''});
                                                                }
                                                }});
        }
    },
}

</script>

<style scoped>
@media (max-width: 600px){
    .left {
        font-size: 1rem;
        width: 140px;
    }

    .center {
        font-size: 1rem;
        width: 140px;
    }
}
    .container {
        background-color: #fdfeff;
        color: #575757;
    }

    .name-rg {
        margin-left: 8px;
        display: flex;
        flex-direction: column;
    }

    .user-name {
        font-size: 1.15rem;
        font-weight: bold;
        border: none;
        width: 50vw;
        overflow: auto;
        white-space:nowrap;
        height: 28px;
    }

    .unedit {
        position: relative;
        top: -0.5px;
        padding-left: 0;
        color: #575757;
    }

    .imgInp {
        display: flex;
        padding-top: 3vh;
        border-bottom: solid 1px #ccc;
    }

    .list-item__thumbnail{
        height: 13vh;
        width: 13vh;
        border-radius: 8vh;
        margin: 0 18px 0 32px;
        transform: translateY(-0.6vh);
    }

    .role-grade {
        display: flex;
        font-size: 1rem;
        margin-bottom: 12px;
    }

    .role {
        margin-right: 8px;
    }

    .role-slct {
        margin-right: 8px;
        transform: translateY(-5px);
    }

    .grade-slct {
        transform: translateY(-5px);
        margin-bottom: 0;
    }

    .edit-b {
        background-color: #9b9b9b;
        width: 72px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
    }

    .cog {
        color: #f0efef;
        margin-right: 6px;
    }

    .edit-b-t {
        font-size: 1rem;
        color: #ffffff;
    }

    .row {
        border-bottom: solid 1px #ccc;
        padding: 16px 0 16px 24px ;
        display: flex;
        align-items: center;
    }

    .r-title {
        width: 112px;
    }

    .edit-b {
        display: flex;
        justify-content: center;
        font-size: 1rem;
        font-size: 1.2rem;
        margin-bottom: 16px;
    }

    .logout-b {
        display: flex;
        justify-content: center;
        font-size: 1rem;
        font-size: 1.2rem;
        margin-top: 32px;
    }

    .croppa {
        display: flex;
        justify-content: center;
        margin-bottom: 8px;
    }

    .spinner {
        will-change: rotate;
        position: absolute;
        top: 50%;
        left: 50%;
        height: 70px;
        width: 70px;
        margin-left: -35px;
        margin-top: -35px;
        -webkit-animation: spin 1s linear infinite;
                animation: spin 1s linear infinite;
        border: 3px solid #ddd;
        border-top: 3px solid #42a5f5;
        border-radius: 50%;
    }

    @-webkit-keyframes spin {
    to {
        border-top-color: #ec407a;
        -webkit-transform: rotate(360deg);
                transform: rotate(360deg);
    }
    }

    @keyframes spin {
    to {
        border-top-color: #ec407a;
        -webkit-transform: rotate(360deg);
                transform: rotate(360deg);
    }
    }

    .croppa-btns {
        display: flex;
        justify-content: center;
        padding: 16px 0;
    }

    .rotate-b-center {
        display: flex;
        justify-content: center;
        height: 72px;
        
    }

    .rotate-b {
        font-size: 2.4rem;
        width: 80px;
        text-align: center;
    }

    .dummy {
        color: transparent;
    }

    .choose-b {
        font-size: 1.1rem;
        text-align: center;
        width: 80px;
        margin-left: 56px;
    }

    .cancel-b {
        font-size: 1.1rem;
        text-align: center;
        width: 120px;
    }


    @media (max-width: 340px){
        .r-title {
            width: 104px;
            font-size: 0.92rem;
        }
        .r-content {
            font-size: 0.92rem;
        }

    }
</style>