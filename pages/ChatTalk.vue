<template>
   <!-- <no-ssr> -->
    <v-ons-page>
       <v-ons-list>
        <v-ons-list-item v-for="message in messages" :key="message.id" tappable  @click="goRoom(message.id, message.userName)">
            <img class="list-item__thumbnail" src="http://placekitten.com/g/40/40">
            <span class="rightContents">
                <span class="userName">{{message.userName}}</span>
                <p class="talk">{{adjustedCount(message.talk)}}</p>
            </span>
            <span v-if="message.unread!=0" class="list-item__unread">{{message.unread}}</span>
        </v-ons-list-item>
       </v-ons-list>
    </v-ons-page>
    <!-- </no-ssr> -->
</template>

<script>
import ChatRoom from './ChatRoom'
export default {
  data () {
    return {
        messages: [
            {id: 1, userName: '中山雅史', unread: 100, talk: 'ほんとですか。大変ですね。しょうがない部分もあるとは思いますけどね。そういえば、ワインを横浜に卸す件はどうなりましたか。'},
            {id: 2, userName: '中田英寿', unread: 2, talk: 'ほんとですか。大変ですね。'},
            {id: 3, userName: '高原直泰', unread: 40, talk: 'ほんとですか。大変ですね。'},
            {id: 4, userName: 'べロン', unread: 0, talk: 'ほんとですか。大変ですね。'},
            {id: 5, userName: 'ベッカム', unread: 0, talk: 'ほんとですか。大変ですね。'},
            {id: 6, userName: 'オルテガ', unread: 0, talk: 'ほんとですか。大変ですね。'},
            {id: 7, userName: 'リケルメ', unread: 0, talk: 'ほんとですか。大変ですね。'},
            {id: 8, userName: 'カヌ', unread: 0, talk: 'ほんとですか。大変ですね。'},
        ]
    };
  },

  methods: {
      goRoom(userId, userName) {
          this.$store.commit('push', {extends: ChatRoom, data() {return {roomName: userName}}})
          this.groupVisible = false
      }
  },

  computed: {
      adjustedCount() {
          return(words) => {
            const ratio = window.innerWidth / 640 // iphone5のwidth
            const maxCount = 86 * ratio
            if(words.length > maxCount) {
                return words.substr(0, maxCount) + '...' 
            }
            return words
          }
      }

  }
};
</script>

<style scoped>
    .list-item__thumbnail{
        margin-right: 12px;
    }

    .userName {
        margin-bottom: 4px;
    }

    .rightContents {
        display: flex;
        flex-direction: column;
        width: 76%;
    }

    .talk {
        font-size: 0.6rem;
        color: #7c7b7b;
        line-height: 1.2;
        margin-right: 8px;

    }

    .list-item__unread {
        width: 24px;
        height: 24px;
        border-radius: 12px;
        display: block;
        margin: 0;
        background-color: rgb(84, 175, 38);
        color: whitesmoke;
        text-align: center;
        font-size: 0.5rem;
        font-weight: bold;
        padding: 2.4px 0 0 0;
    }
</style>
