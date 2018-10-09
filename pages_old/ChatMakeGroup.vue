<template>
   <!-- <no-ssr> -->
    <v-ons-page>
      <div class="container">
        <v-ons-toolbar class="tool-bar">
            <div class="left">
                <v-ons-back-button class="b-button">
                </v-ons-back-button>
            </div>
            <div class="center tool-b-c" :style="md ? androidStyle : ''">グループ{{type}}</div>
            <div class="right">
                <v-ons-toolbar-button class="right-b" @click="rightPush">{{right}}</v-ons-toolbar-button>
            </div>
        </v-ons-toolbar>
        <div class="underTB">
            <input type="file" accept="image/*" id="f" @change="changeImg" :style="{display: 'none'}">
            <div class="imgInp">
                <img class="list-item__thumbnail" :src="upImg" id="upImg" @click="upImage">
                <input v-if="right=='保存'" type="text" v-model="groupName" placeholder="グループ名" class="group-name">
                <div v-else class="group-name">{{groupName}}</div>
            </div>
            <div class="add-b-w">
            <v-ons-button v-if="type=='編集'&&right=='保存'" @click="addMember" class="add-b">メンバーを追加</v-ons-button>
            </div>
            <v-ons-modal :visible="addVisible">
                <div class="add-container">
                <div class="add-header">
                    <v-ons-list-title>メンバーを追加
                    </v-ons-list-title>
                    <div class="add-btns">
                        <v-ons-button @click="addVisible=false">追加</v-ons-button>
                        <v-ons-button @click="addVisible=false">キャンセル</v-ons-button>
                    </div>
                </div>
                <v-ons-list class="add-member-l">
                    <v-ons-list-item v-for="user in users" :key="user.id" tappable>
                        <label class="left">
                            <v-ons-checkbox
                                :input-id="'checkbox-' + user.id"
                                :value="user.id"
                                v-model="checkedMembers"
                            >
                            </v-ons-checkbox>
                        </label>
                        <label class="center" :for="'checkbox-' + user.id">
                            <img class="list-item__thumbnail" src="http://placekitten.com/g/40/40">
                            {{user.name}}
                        </label>
                    </v-ons-list-item>
                </v-ons-list> 
                </div>
            </v-ons-modal>

          <v-ons-list-header>
            メンバー
          </v-ons-list-header>
          <v-ons-list class="member-l">
            <v-ons-list-item v-for="user in users" :key="user.id" :tappable="ifRTap">
                <label class="left">
                    <v-ons-checkbox
                        v-if="right=='保存'"
                        :input-id="'checkbox-' + user.id"
                        :value="user.id"
                        v-model="checkedMembers"
                    >
                    </v-ons-checkbox>
                </label>
                <label class="center" :for="'checkbox-' + user.id">
                    <img class="list-item__thumbnail" src="http://placekitten.com/g/40/40">
                    {{user.name}}
                </label>
            </v-ons-list-item>
          </v-ons-list>
        </div>
      </div>
    </v-ons-page>
    <!-- </no-ssr> -->
</template>

<script>

export default {
    
    data() {
        return {
            right: '',
            type: '',
            androidStyle: {position: 'relative', left: '-4px'},//androidの場合、右に寄ってしまうため、調整。
            upImg: 'http://placekitten.com/g/40/40',
            // checkedMembers: ["1", "2"],//ページ遷移の際にextendsで渡す。中の要素は文字列である必要がある。
            checkedMembers: [],
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
        ifRTap() {
            if(this.right == '保存') {
                return true
            } 
        }
    },

    components: {
        
    },

    methods: {
        rightPush() {
            if(this.right == '編集') {
                this.type = '編集'
                this.right = '保存'
            } else {
                if(this.groupName == '') {
                    this.$ons.notification.alert('グループ名を入力ください。', {title:''})
                    return
                } else {

                }
            }
        },

        upImage() {
            if(this.right == '保存') {
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

    .right-b {
        font-size: 1rem;
        padding-right: 12px;
    }

    .group-name {
        font-size: 1.1rem;
        font-weight: bold;
        /* width: 100vw; */
        border: none;
        /* width: 90vw; */
    }

    .list-item__thumbnail{
        margin-right: 12px;
    }

    .underTB {
        /* padding-top: 56px; */
        padding-top: 9.7vh;
        width: 100vw;
    }

    .imgInp {
        display: flex;
        align-items: center;
    }

    #upImg {
        /* height: 70px;
        width: 70px; */
        height: 13vh;
        width: 13vh;
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
