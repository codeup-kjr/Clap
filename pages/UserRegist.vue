<template>
    <!-- <no-ssr> -->
    <v-ons-page>
        <div class="container">
            <div class="route">
                <div class="point" v-if="!teamRegist">
                    <img src="../assets/group.png" alt="チームに参加" class="img"><br>
                    チームに参加
                </div>
                <div class="point" v-if="teamRegist">
                    <img src="../assets/coach.png" alt="チームを登録" class="img"><br>
                    チームを登録
                </div>
                <div class="arrow"/>
                <div class="point">
                    <img src="../assets/group.png" alt="チーム情報" class="img"><br>
                    チーム情報
                </div>
                <div class="arrow"/>
                <div class="point">
                    <img src="../assets/athlete.png" alt="ユーザー情報" class="img"><br>
                    ユーザー情報
                </div>
            </div>
            <p class="request">ユーザー情報を登録ください。</p>
            
            <v-ons-input modifier="material" type="text" placeholder="お名前" v-model="userName" class="input"/>
            <v-ons-input modifier="material" type="text" placeholder="メールアドレス" v-model="mail" class="input"/>
            <v-ons-input modifier="material" type="text" placeholder="パスワード" v-model="pass" class="input"/>
            <v-ons-input modifier="material" type="text" placeholder="パスワードの確認" v-model="passRe" class="input"/>

            <div class="role-grade">
                <v-ons-select modifier="material" v-model="role" class="select role">
                    <option disabled selected>役割</option>
                    <option v-for="item in $store.state.role" :key="item.id">
                        {{ item.text }}
                    </option>
                </v-ons-select>

                <v-ons-select modifier="material" v-model="grade" class="select grade" v-show="$store.state.team.type!='社会人' && (role=='選手' || role=='マネジャー')">
                    <option disabled selected>学年</option>
                    <option v-for="item in gradeNum" :key="item.id">
                        {{ item }}
                    </option>
                </v-ons-select>
            </div>
            <v-ons-button class="regist-b" @click.prevent="regist">登録する</v-ons-button>
            <v-ons-button class="cancel-b" modifier="quiet" @click.prevent="cancel">キャンセル</v-ons-button>
        </div>
    </v-ons-page>
    <!-- </no-ssr> -->
</template>

<script>
import TabBar from './TabBar'
import { mapActions } from 'vuex'

export default {
    data() {
        return {
            userName: '',
            mail: '',
            pass: '',
            passRe: '',
            role: '役割',
            grade: '学年'
        }
    },

    mounted() {
        Promise.resolve()
            .then( () => this.bindTeam())
    },

    destroyed() {
        Promise.resolve()
            .then( () => this.unBindTeam())
    },

    methods: {
        ...mapActions({
            bindTeam: 'bindTeam',
            unBindTeam: 'unBindTeam'
        }),

        regist() {
            if(this.userName == '') {
                this.$ons.notification.alert('お名前を入力ください。', {title:''})
                return
            }
            if(this.mail == '') {
                this.$ons.notification.alert('メールアドレスを入力ください。', {title:''})
                return
            }
            if(this.mail.indexOf('@')==-1 || (this.mail.indexOf('.com')==-1 && this.mail.indexOf('.co.jp')==-1)) {
                this.$ons.notification.alert('メールアドレスを入力ください。', {title:''})
                return
            }
            if(this.pass == '') {
                this.$ons.notification.alert('パスワードを入力ください。', {title:''})
                return
            }
            
            if(this.pass.length < 6) {
                this.$ons.notification.alert('パスワードは6字以上を入力ください。', {title:''})
                return
            }

            if(this.passRe == '') {
                this.$ons.notification.alert('パスワードの確認を入力ください。', {title:''})
                return
            }
            if(this.pass != this.passRe) {
                this.$ons.notification.alert('パスワードとパスワードの確認の入力内容が異なっています。', {title:''})
                return
            }
            if(this.role == '役割') {
                this.$ons.notification.alert('役割を選択ください。', {title:''})
                return
            }
            if((this.$store.state.team.type != '社会人' && (this.role=='選手' || this.role=='マネジャー')) && (this.grade == '学年')) {
                this.$ons.notification.alert('学年を選択ください。', {title:''})
                return
            }
            
            this.$store.dispatch('userRegist', {
                                                name:  this.userName,
                                                mail:  this.mail,
                                                pass:  this.pass,
                                                role:  this.role,
                                                grade: this.grade
                                })
            this.$ons.notification.alert({messageHTML:'登録しました。<br>チームIDをマイページで確認して、<br>チームメートに共有しよう！', title:''})
            this.$store.commit('push', TabBar)
        },

        cancel() {
            console.log(this.teamRegist)
            const vm = this
            if(this.teamRegist) {
                this.$ons.notification.confirm({messageHTML:'ログインページに戻ります。<br>作成したチーム情報は削除されます。',
                                                title:'',
                                                callback: function(idx) {
                                                                if (idx == 0) {
                                                                    return
                                                                } else {
                                                                    vm.$store.dispatch('deleteTeam', {teamId: vm.$store.state.teamId})
                                                                    for (let i=1; i<=3; i++) {
                                                                        vm.$store.commit('pop')
                                                                    }
                                                                }
                                                }})
            } else {
                this.$ons.notification.confirm({message:'ログインページに戻ります。',
                                                title:'',
                                                callback: function(idx) {
                                                                if (idx == 0) {
                                                                    return
                                                                } else {
                                                                    vm.$store.commit('setTeamId', '')
                                                                    for (let i=1; i<=3; i++) {
                                                                        vm.$store.commit('pop')
                                                                    }
                                                                }
                                                }})
            }
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
        }
    }
}
</script>

<style scoped>
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
    }

    .route {
        width: 240px;
        display: flex;
        justify-content: space-between;
        margin-bottom: 16px;
        padding-top: 16px;
    }

    .point {
        text-align: center;
        font-size: 0.8rem;
        color: rgb(109, 108, 108);
    }

    .arrow{
        position: relative;
        display: inline-block;
        padding-left: 10px;
    }

    .arrow::before{
        content: '';
        width: 12px;
        height: 12px;
        border: 0px;
        border-top: solid 2px #499cb6;
        border-right: solid 2px #499cb6;
        -ms-transform: rotate(45deg);
        -webkit-transform: rotate(45deg);
        transform: rotate(45deg);
        position: absolute;
        top: 50%;
        left: 0;
        margin-top: -8px;
    }

    .img {
        width: 40px;
        height: 40px;
    }

    .request {
        margin-bottom: 32px;
    }

    .input {
        margin-bottom: 24px;
        font-size: 1.6rem;
    }

    .role-grade {
        width: 185px;
        display: flex;
        justify-content: space-between;
    }

    .select {
        margin-bottom: 24px;
        font-size: 1.6rem;
    }

    .role {
        width: 96px;
    }

    .grade {
        width: 64px;
    }

    .regist-b {
        text-align: center;
        margin: 8px 0 12px;
        width: 200px;
    }

</style>
