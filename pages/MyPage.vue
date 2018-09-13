<template>
   <!-- <no-ssr> -->
    <v-ons-page>
      <div class="container">
            <div class="edit">
                <v-ons-button modifier="quiet" class="edit-b" @click="editPush">{{edit}}</v-ons-button>
            </div>
        <div class="underTB">
            <input type="file" accept="image/*" id="f" @change="changeImg" :style="{display: 'none'}">
            <div class="imgInp">
                <img class="list-item__thumbnail" :src="upImg" id="upImg" @click="upImage">
                <input v-if="edit=='保存'" type="text" v-model="userName" placeholder="ユーザー名" class="user-name">
                <div v-else class="user-name">{{userName}}</div>
                <div v-if="edit=='保存'" class="user-name">
                    <v-ons-select modifier="material" v-model="grade" class="grade" v-if="$store.state.team.type!='社会人' && ($store.state.myData.role=='選手' || $store.state.myData.role=='マネジャー')">
                        <option disabled selected>学年</option>
                        <option v-for="item in gradeNum" :key="item.id">
                            {{ item }}
                        </option>
                    </v-ons-select>
                </div>
                <div v-else class="grade">{{grade}}年生</div>
            </div>
        </div>
      </div>
    </v-ons-page>
    <!-- </no-ssr> -->
</template>

<script>

export default {
    
    data() {
        return {
            edit: '編集',
            // userName: this.$store.state.myData.name,
            // userName: '',
            // userName: this.$store.state.usersData.filter(user => user.id == "5KeWBCa4gGdiOVL3CwmleYFQAJE2")[0].name,
            grade: this.$store.state.myData.grade,
            androidStyle: {position: 'relative', left: '-4px'},//androidの場合、右に寄ってしまうため、調整。
            upImg: 'http://placekitten.com/g/40/40',
            // checkedMembers: ["1", "2"],//ページ遷移の際にextendsで渡す。中の要素は文字列である必要がある。
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

        userName() {
            // return this.$store.state.usersData.filter(user => user.id == "5KeWBCa4gGdiOVL3CwmleYFQAJE2")[0].name
            return ''
        }

    },

    components: {
        
    },

    methods: {
        editPush() {
            console.log(this.userName)
            if(this.edit == '編集') {
                this.edit = '保存'
            } else {
                if(this.userName == '') {
                    this.$ons.notification.alert('グループ名を入力ください。', {title:''})
                    return
                } else {

                }
            }
        },

        upImage() {
            if(this.edit == '保存') {
                document.getElementById('f').click()
            } 
        },

        changeImg() {
            const imgF = document.getElementById('f').files;
            const file = imgF[0];
            const fr = new FileReader()
            const vm = this
            fr.onload = function() {
                vm.upImg = fr.result
            }
            
            fr.readAsDataURL(file)
        },

        addMember() {
            this.addVisible = true
        }
    }
    
}

</script>

<style scoped>
  .container {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100vw;
      height: 100vh;
      background-color: #fdfeff;
  }

    .tool-b-c {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 1.1rem;
        color:#fdfeff;
    }

    .edit-b {
        font-size: 1rem;
        padding-right: 12px;
    }

    .user-name {
        font-size: 1.1rem;
        font-weight: bold;
        border: none;
        width: 40vw;
        overflow: auto;
    }

    .list-item__thumbnail{
        margin-right: 12px;
    }

    .underTB {
        width: 100vw;
    }

    .imgInp {
        display: flex;
        align-items: center;
    }

    #upImg {
        /* height: 70px;
        width: 70px; */
        height: 15vh;
        width: 15vh;
        border-radius: 7vh;
        /* margin: 12px 16px 18px 16px; */
        margin: 2vh 18px 2.7vh 16px;
    }

    .add-b-w {
        display: flex;
        justify-content: flex-end;
    }
    .add-b {
        margin-right: 24px;
    }

    .add-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    
    .add-header {
        width: 90vw; 
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: #fdfeff;
        /* padding-bottom: 2px; */
        border-bottom: dotted 1px #6d6d72;
    }
 
    .add-btns {
        display: flex;
        justify-content: space-between;
        width: 176px;
        margin-right: 8px;
    }

    .add-member-l {
        overflow: auto;
        font-size: 0.85rem;
        width: 90vw;
        height: 70vh;
    }

    .member-l {
        overflow: auto;
        font-size: 0.85rem;
        width: 100vw;
        /* min-height: 54vh; */
        height: 59vh;
    }
</style>
