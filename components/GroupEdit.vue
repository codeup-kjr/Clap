<template>
   <!-- <no-ssr> -->
    <v-ons-page>
      <div class="container">
        <v-ons-toolbar class="tool-bar">
            <div class="left">
                <v-ons-back-button class="b-button">
                </v-ons-back-button>
            </div>
            <div class="center tool-b-c" :style="md ? androidStyle : ''">グループ作成</div>
            <div class="right">
                <v-ons-toolbar-button class="save-b" @click="savePush">保存</v-ons-toolbar-button>
            </div>
        </v-ons-toolbar>
        <div class="underTB">
            <input type="file" accept="image/*" id="f" @change="changeImg" :style="{display: 'none'}">
            <div class="imgInp">
                <img class="list-item__thumbnail" :src="upImg" id="upImg" @click="upImage">
                <input type="text" v-model="groupName" placeholder="グループ名" class="group-name">
            </div>
          <v-ons-list-header>
            メンバー
          </v-ons-list-header>
          <v-ons-list class="member-l">
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
      </div>
    </v-ons-page>
    <!-- </no-ssr> -->
</template>

<script>

export default {
    
    data() {
        return {
            androidStyle: {position: 'relative', left: '-4px'},//androidの場合、右に寄ってしまうため、調整。
            upImg: 'http://placekitten.com/g/40/40',
            groupName: '',
            checkedMembers: [],
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


    },

    components: {
        
    },

    methods: {
        savePush() {
            
            if(this.groupName == '') {
                this.$ons.notification.alert('グループ名を入力ください。', {title:''})
                return
            } else {

            }
        },

        upImage() {
            document.getElementById('f').click()
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
  }

    .tool-b-c {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 1.1rem;
        color:#fdfeff;
    }

    .save-b {
        font-size: 1rem;
        padding-right: 12px;
    }

    .group-name {
        padding: 8px;
        padding-top: 16px;
        font-size: 1.33rem;
        font-weight: bold;
        /* width: 100vw; */
        background-color: #fdfeff;
        border: none;
    }

    .list-item__thumbnail{
        margin-right: 12px;
    }

    .underTB {
        padding-top: 56px;
        width: 100vw;
    }

    .imgInp {
        display: flex;
        align-items: center;
        background-color: #fdfeff;
    }

    #upImg {
        height: 80px;
        width: 80px;
        border-radius: 40px;
        margin: 12px 24px 8px 24px;
    }

    .member-l {
        overflow: auto;
        font-size: 0.85rem;
        width: 100vw;
        height: 70vh;
    }
</style>
