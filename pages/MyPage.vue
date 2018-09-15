<template>
   <!-- <no-ssr> -->
    <v-ons-page>
      <div class="container">
            <input type="file" accept="image/*" id="f" @change="changeImg" :style="{display: 'none'}">
            <div class="imgInp">
                <img class="list-item__thumbnail" :src="upImg" id="upImg" @click="upImage">
                <!-- <img v-else class="list-item__thumbnail" :src="$store.state.myData.image"> -->
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
            <v-ons-list class="team-info">
            <v-ons-list-header>チーム名</v-ons-list-header>
            <v-ons-list-item>
                {{$store.state.team.name}}
            </v-ons-list-item>
            <v-ons-list-header>チームID</v-ons-list-header>
            <v-ons-list-item>
                {{$store.state.teamId}}
            </v-ons-list-item>
            </v-ons-list>
            <v-ons-button modifier="quiet" class="logout-b" @click="logoutPush">ログアウト</v-ons-button>
        </div>
    </v-ons-page>
    <!-- </no-ssr> -->
</template>

<script>
import Home from './Home'
export default {
    
    data() {
        return {
            file: '',
            edit: '編集する',
            userName: this.$store.state.myData.name,
            role: this.$store.state.myData.role,
            grade: this.$store.state.myData.grade,
            androidStyle: {position: 'relative', left: '-4px'},//androidの場合、右に寄ってしまうため、調整。
            upImg: this.$store.state.myData.image == null ? "http://placekitten.com/g/40/40" : this.$store.state.myData.image,
            addVisible: false,
            users: [
            {id: 1, name: '中山雅史'},
            {id: 2, name: '中田英寿'},
            {id: 3, name: '高原直泰'},
            {id: 4, name: 'べロン'},
            {id: 5, name: 'ベッカム'},
            {id: 6, name: 'オルテガ'},
            {id: 7, name: 'リケルメ'},
            {id: 8, name: 'カヌ'},
        ]

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

    components: {
        
    },

    methods: {
        editPush() {
            console.log(this.userName)
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
                    this.$ons.notification.alert('保存しました', {title:''})
                    this.file = ''
                    this.edit = '編集する'
                }
            }
        },

        upImage() {
            if(this.edit == '保存する') {
                document.getElementById('f').click()
            } 
        },

        changeImg() {
            const imgF = document.getElementById('f').files
            // const file = imgF[0]
            this.file = imgF[0];
            const fr = new FileReader()
            const vm = this
            fr.onload = function() {
                vm.upImg = fr.result
            }
            
            fr.readAsDataURL(this.file)
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

    }
    
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
        border-radius: 7vh;
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
</style>
