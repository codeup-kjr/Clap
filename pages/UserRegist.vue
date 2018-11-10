<template>
    <!-- <no-ssr> -->
    <v-ons-page>
        <div class="container">
            <div class="route">
                <img :src="teamRegist==true ? barTr : bar" alt="ユーザー登録" class="bar">
            </div>
            <p v-if="!$store.state.uRErr" class="request">{{request}}</p>
            <p v-else class="error">{{$store.state.uRErr}}</p>
            
            <v-ons-input modifier="material" type="text" placeholder="お名前" v-model="userName" class="input"/>
            <v-ons-input modifier="material" type="email" placeholder="メールアドレス" v-model="mail" class="input"/>
            <v-ons-input modifier="material" type="password" placeholder="パスワード" v-model="pass" class="input"/>
            <v-ons-input modifier="material" type="password" placeholder="パスワードの確認" v-model="passRe" class="input"/>

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
            <div class="cancel-b" @click.prevent="cancel">キャンセル</div>
        </div>
    </v-ons-page>
    <!-- </no-ssr> -->
</template>

<script>
import TabBar from './TabBar';
import { mapActions } from 'vuex';
import barTr from '../assets/teamRegUserBar@2x.png';
import bar from '../assets/teamJoinUserBar@2x.png';

export default {
    data() {
        return {
            barTr: barTr,
            bar: bar,
            request: 'ユーザーを登録ください。',
            teamRegist: '',
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
            .then( () => this.bindTeamU());
    },

    destroyed() {
        this.unBindTeam();
        this.unBindTeamU();
        this.$store.commit('setURErr', '');
    },

    methods: {
        ...mapActions({
            bindTeam: 'bindTeam',
            bindTeamU: 'bindTeamU',
            unBindTeam: 'unBindTeam',
            unBindTeamU: 'unBindTeamU'
        }),

        async regist() {
            if(this.$store.state.uRErr) {
                this.$store.commit('setURErr', '');
            }

            if(this.userName == '') {
                this.$ons.notification.alert('お名前を入力ください。', {title:''});
                return;
            }
            if(this.mail == '') {
                this.$ons.notification.alert('メールアドレスを入力ください。', {title:''});
                return;
            }
            if(this.mail.indexOf('@')==-1 || (this.mail.indexOf('.com')==-1 && this.mail.indexOf('.co.jp')==-1)) {
                this.$ons.notification.alert('メールアドレスを正しく入力ください。', {title:''});
                return;
            }
            if(this.pass == '') {
                this.$ons.notification.alert('パスワードを入力ください。', {title:''});
                return;
            }
            
            if(this.pass.length < 6) {
                this.$ons.notification.alert('パスワードは6字以上を入力ください。', {title:''});
                return;
            }

            if(this.passRe == '') {
                this.$ons.notification.alert('パスワードの確認を入力ください。', {title:''});
                return;
            }
            if(this.pass != this.passRe) {
                this.$ons.notification.alert('パスワードとパスワードの確認の入力内容が異なっています。', {title:''});
                return;
            }
            if(this.role == '役割') {
                this.$ons.notification.alert('役割を選択ください。', {title:''});
                return;
            }
            if((this.$store.state.team.type != '社会人' && (this.role=='選手' || this.role=='マネジャー')) && (this.grade == '学年')) {
                this.$ons.notification.alert('学年を選択ください。', {title:''});
                return;
            }

            this.request = '内容を確認しています...';
            if (!navigator.onLine) {
                this.$ons.notification.alert('ネットワークの接続を確認ください。', {title:''});
                return;
            }

            await this.$store.dispatch('userRegist', {
                                                name:  this.userName,
                                                mail:  this.mail,
                                                pass:  this.pass,
                                                role:  this.role,
                                                grade: this.grade
                                });

            if(!this.$store.state.uRErr) {          
                this.$ons.notification.alert({messageHTML:'登録しました。<br>チームIDをマイページで確認して、<br>チームメートに共有しよう！', title:''});
            }
        },

        cancel() {
            const vm = this;
            if(this.teamRegist) {
                this.$ons.notification.confirm({messageHTML:'ログインページに戻ります。<br>作成したチーム情報は削除されます。',
                                                title:'',
                                                callback: function(idx) {
                                                                if (idx == 0) {
                                                                    return
                                                                } else {
                                                                    vm.$store.dispatch('deleteTeam', {teamId: vm.$store.state.teamId});
                                                                    for (let i=1; i<=3; i++) {
                                                                        vm.$store.commit('pop');
                                                                    }
                                                                }
                                                }});
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
                                                }});
            }
        }
    },

    computed: {
        gradeNum() {
            let num = 0;
            const type = this.$store.state.team.type;
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
        }
    }
}
</script>

<style scoped>
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100%;
        background: linear-gradient(0deg,#6fb1fc,#4364f7, #0052D4);
        background-size: 100vw 100vh;
        color: #ffff;
    }

    .route {
        padding-top: 6vh;
        margin-bottom: 5vh;
    }

    .bar {
        width: 100vw; 
    }

    @media (min-width: 700px){
        .bar {
            width: 50vw; 
        }
    }

    @media (min-width: 1200px){
        .bar {
            width: 30vw; 
        }
    }

    .request {
        color: #ffbd00;
        font-size: 1.4rem;
        margin-bottom: 5vh;
    }

    .error {
        margin: 6px 0 5.6vh;
        color: #fff703;
    }

    @media (min-height: 800px){
        .error {
            margin: 6px 0 5.4vh;
        }
    }

    @media (min-height: 1000px){
        .error {
            margin: 6px 0 5.3vh;
        }
    }

    .input {
        width: 240px;
        margin-bottom: 24px;
        font-size: 1.6rem;
    }

    .role-grade {
        width: 240px;
        display: flex;
        justify-content: space-between;
        margin-bottom: 6vh;
    }

    .select {
        font-size: 1.6rem;
    }

    .role {
        width: 140px;
    }

    .grade {
        width: 60px;
    }

    .regist-b {
        text-align: center;
        margin-bottom: 24px;
        width: 185px;
        border-radius: 24px;
        background-color: #ffbb00e7;
    }

    .cancel-b {
        text-align: center;
        width: 185px;
    }

</style>
