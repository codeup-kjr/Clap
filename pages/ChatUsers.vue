<template>
   <!-- <no-ssr> -->
    <v-ons-page>
       <v-ons-list>
        <v-ons-list-item tappable @click="makeGroup">グループ作成</v-ons-list-item>
        <v-ons-list-header>グループ</v-ons-list-header>
        <v-ons-list-item v-for="room in rooms" :key="room.id" tappable @click="selectGroup(room.img, room.name)">
            <img class="list-item__thumbnail" :src="room.img">
            {{room.name}}
        </v-ons-list-item>
        <v-ons-list-header>ユーザー</v-ons-list-header>
        <v-ons-list-item v-for="user in users" :key="user.id" tappable @click="goRoom(user.id, user.name)">
            <img class="list-item__thumbnail" src="http://placekitten.com/g/40/40">
            {{user.name}}
        </v-ons-list-item>
       </v-ons-list>
 
        <v-ons-modal :visible="groupVisible">
            <div class="group-modal-container">
                <img :src="groupImg" alt="グループ写真" class="selected-group-img">
                <div class="under-group-img">
                    <p class="selected-group-name">{{groupName}}</p>
                    <div class="group-btns">
                        <div class="group-btn-txt" @click="goRoom(1, groupName)">
                            <v-ons-icon icon="ion-android-textsms"></v-ons-icon>
                            <p>トーク</p>
                        </div>
                        <div class="group-btn-txt" @click="showGInfo">
                            <v-ons-icon icon="ion-information-circled"></v-ons-icon>
                            <p>グループ情報</p>
                        </div>
                        <div class="group-btn-txt" @click="groupVisible=false">
                            <v-ons-icon icon="ion-android-close"></v-ons-icon>
                            <p>閉じる</p>
                        </div>
                    </div>
                </div>
            </div>
        </v-ons-modal>
    </v-ons-page>
    <!-- </no-ssr> -->
</template>

<script>
import ChatRoom from './ChatRoom'
import ChatMakeGroup from './ChatMakeGroup'

export default {
  data () {
    return {
        groupVisible: false,
        groupImg: '',
        groupName: '',
        rooms: [
            {id: 1, name: '点取り屋', img:'http://placekitten.com/g/40/40'},
            {id: 2, name: 'アジアの壁', img:'http://placekitten.com/g/40/40'},
            {id: 3, name: '監督さんの誕生を祝おう会', img:'http://placekitten.com/g/40/40'},
        ],
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
    };
  },

  methods: {
      makeGroup() {
          this.$store.commit('push', {extends: ChatMakeGroup, data() {return {type: '作成', right: '保存', groupName: '', checkedMembers: []}}})
      },

      selectGroup(roomImg, roomName) {
          this.groupImg = roomImg
          this.groupName = roomName
          this.groupVisible = true
      },

      showGInfo() {
          const vm = this
          this.$store.commit('push', {extends: ChatMakeGroup, data() {return {type: '情報', right: '編集', groupName: vm.groupName,  checkedMembers: ["1", "2", "3"]}}})
          this.groupVisible = false
      },

      goRoom(userId, userName) {
          this.$store.commit('push', {extends: ChatRoom, data() {return {roomName: userName}}})
          this.groupVisible = false
      }
    
  },

  computed: {


  }
};
</script>

<style scoped>
    .list-item__thumbnail{
        margin-right: 12px;
    }

    .group-modal-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .under-group-img {
        background-color: #fdfeff;
        width: 70vw;
        color: #6d6d72;
    }

    .selected-group-img {
        width: 70vw;
        height: 50vw;
    }

    .selected-group-name {
        font-size: 1.15rem;
        padding-top: 12px;
        width: 60vw;
        word-wrap: break-word;
        margin: auto;
        margin-bottom: 24px;
    }

    .group-btns {
        display: flex;
        justify-content: space-around;
    }

    .group-btn-txt {
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 0.8rem;
        padding-bottom: 16px;
    }
</style>
