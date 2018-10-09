<template>
   <!-- <no-ssr> -->
    <v-ons-page>
        <div class="container">
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
            <!-- <input type="file" accept="image/*" id="f" @change="changeImg" :style="{display: 'none'}"> -->
            <div class="imgInp">
                <img class="list-item__thumbnail" :src="upImg" id="upImg" @click="upImage">
                <div class="name-rg">
                    <input v-if="edit=='保存する'" type="text" v-model="userName" placeholder="ユーザー名" class="user-name">
                    <div v-else class="user-name">{{$store.state.myData.name}}</div>
                    <div class="role-grade">
                        <v-ons-select v-if="edit=='保存する'" v-model="role" class="role">
                            <option disabled selected>役割</option>
                            <option v-for="item in $store.state.role" :key="item.id">
                                {{ item.text }}
                            </option>
                        </v-ons-select>
                        <div v-else class="role">
                            {{$store.state.myData.role}}
                        </div>
                        <div v-if="edit=='保存する'">
                            <v-ons-select v-model="grade" class="grade" v-if="$store.state.team.type!='社会人' && (role=='選手' || role=='マネジャー')">
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
                </div>
            </div>
            <v-ons-button modifier="quiet" class="edit-b" @click="editPush">{{edit}}</v-ons-button>
            <v-ons-list class="team-info" modifier="material">
            <v-ons-list-header modifier="material">チーム名</v-ons-list-header>
            <v-ons-list-item modifier="material">
                {{$store.state.team.name}}
            </v-ons-list-item>
            <v-ons-list-header modifier="material">チームID</v-ons-list-header>
            <v-ons-list-item modifier="material">
                {{$store.state.teamId}}
            </v-ons-list-item>
            </v-ons-list>
            <v-ons-button modifier="quiet" class="logout-b" @click="logoutPush">ログアウト</v-ons-button>
        </div>
    </v-ons-page>
    <!-- </no-ssr> -->
</template>

<script>
// import loadImage from 'blueimp-load-image'
import png from '../assets/dUsrImg.jpg'
export default {
    
    data() {
        return {
            croppaVisible: false,
            myCroppa: {},
            file: '',
            edit: '編集する',
            userName: this.$store.state.myData.name,
            role: this.$store.state.myData.role,
            grade: this.$store.state.myData.grade,
            androidStyle: {position: 'relative', left: '-4px'},//androidの場合、右に寄ってしまうため、調整。
            // upImg: this.$store.state.myData.image == null ? "http://placekitten.com/g/40/40" : this.$store.state.myData.image,
            upImg: this.$store.state.myData.image == null ? png : this.$store.state.myData.image,
            // upImg: this.$store.state.myData.image == null ? png : '',
            addVisible: false,
        }
    },


    computed: {
        gradeNum() {
            let num = 0
            const type = this.$store.state.team.type
            switch (type) {
                case '高校':
                    num = 3
                    break
                case '大学':
                    num = 4
                    break
                case '中学':
                    num = 3
                    break
                default:
                    break
            }
            return num
        },

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

        onInit() {
            this.myCroppa.addClipPlugin(function (ctx, x, y, w, h) {
                /*
                * ctx: canvas context
                * x: start point (top-left corner) x coordination
                * y: start point (top-left corner) y coordination
                * w: croppa width
                * h: croppa height
                */
                ctx.beginPath()
                ctx.arc(x + w / 2, y + h / 2, w / 2, 0, 2 * Math.PI, true)
                ctx.closePath()
            })

        },

        rotate() {
            this.myCroppa.rotate()
        },

        choose() {
            this.myCroppa.generateBlob(
                (blob) => {
                    this.file =  blob
                },
                'image/jpeg', 0.5)
                
            this.upImg = this.myCroppa.generateDataUrl('image/jpeg', 0.5)
            this.croppaVisible = false
            this.myCroppa.remove()
        },

        cancel() {
            this.croppaVisible = false
            this.myCroppa.remove()
        },

        upImage() {
            if(this.edit == '保存する') {
                // document.getElementById('f').click()
                this.croppaVisible = true
            } 
        },

        logoutPush() {
            const vm = this
            this.$ons.notification.confirm({messageHTML:'ログアウトします。<br>よろしいですか。',
                                                title:'',
                                                callback: function(idx) {
                                                                if (idx == 0) {
                                                                    return
                                                                } else {
                                                                    vm.$store.dispatch('logout')
                                                                }
                                                }})
        },
        

    },
    
}

</script>

<style scoped>
    .container {
        display: flex;
        flex-direction: column;
        width: 100vw;
        height: 90vh;
        background-color: #fdfeff;
    }


    .name-rg {
        margin-left: 8px;
        display: flex;
        flex-direction: column;
    }

    .user-name {
        font-size: 1.2rem;
        font-weight: bold;
        border: none;
        width: 40vw;
        overflow: auto;
        height: 32px;
    }

    .imgInp {
        display: flex;
        align-items: center;
        padding-top: 4vh;
        margin-bottom: 1vh;
    }

    .list-item__thumbnail{
        height: 15vh;
        width: 15vh;
        border-radius: 8vh;
        margin: 0 18px 0 32px;
    }

    .role-grade {
        display: flex;
        font-size: 1rem;
    }

    .role {
        margin-right: 8px;
    }

    .team-info{
        margin-bottom: 32px;
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
    }

    .croppa {
        display: flex;
        justify-content: center;
        margin-bottom: 8px;
    }

    .spinner {
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
</style>
