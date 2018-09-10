<template>
   <!-- <no-ssr> -->
    <v-ons-page>
        <div class="container">
        <v-ons-toolbar>
            <div class="left">
                <v-ons-back-button class="b-button">
                </v-ons-back-button>
            </div>
            <div class="center room-name" :style="md ? androidStyle : ''">{{roomName}}</div>
        </v-ons-toolbar>
        <div class="underTB">
            <div v-for="message in messages" :key="message.id" class="img-msg">
                <img v-if="imgIf(message.sender)" class="list-item__thumbnail" src="http://placekitten.com/g/40/40">
                <div class="timeMsg" :style="timeMsgStyle(message.sender)">
                    <div v-if="timeIf(message.sender)" class="send-time">{{message.send_at}}</div>
                    <div  class="message" :style="msgStyle(message.sender)">{{message.text}}</div>
                    <div v-if="!timeIf(message.sender)" class="send-time">{{message.send_at}}</div>
                </div>
            </div>
        </div>  
            <div class="inB">
                <div contenteditable="true" class="textInput"/>
                <submit-b class="submitB"/>
            </div>
  
        </div>
    </v-ons-page>
    <!-- </no-ssr> -->
</template>

<script>
import NormalB from '../components/NormalB'
export default {
  data () {
    return {
        userId: 3,
        androidStyle: {position: 'relative', left: '-24px'},//androidの場合、右に寄ってしまうため、調整。
        messages: [
            {sender: 1, text: '点取り屋', send_at: '12:09'},
            {sender: 2, text: 'アジアの壁', send_at: '12:10'},
            {sender: 3, text: '監督さんの誕生日近いらしいよ。\nそろそろグループ作ろうか。ってか作って欲しい', send_at: '12:15'},
            {sender: 4, text: '監督さんの誕生日近いらしいよ。\nそろそろグループ作ろうか。ってか作って欲しい', send_at: '12:19'},
        ],

    };
  },

  components: {
      submitB: { extends: NormalB,
                    data() {
                        return { text: '送信', nextP: '' }
                    } },
  },

  methods: {
    
    
  },

  computed: {
      imgIf() {
          return (sender) => {
                if(sender == this.userId) {
                    return false
              } else {
                  return true
              }
          }
      },

      timeIf() {
          return (sender) => {
              if(sender == this.userId) {
                    return true
                } else {
                    return false
                }
          }
      },

      msgStyle() {
          return(sender) => {
            if(sender == this.userId) {
                return {backgroundColor: '#a3e0ac'}
            } else {
                return {backgroundColor: '#fdfeff'}
            }
        }
      },
      timeMsgStyle() {
          return(sender) => {
            if(sender == this.userId) {
                return {marginLeft: 'auto'}
            } else {
                return {marginRight: 'auto'}
            }
        }
      }

  }
};
</script>

<style scoped>
    .container {
        height: 100vh;
    }

    .b-button {
        color: #ffff;
    }

    .room-name {
        display: flex;
        justify-content: center;
        align-items: center;
        /* position: relative;
        left: -24px; */
        font-size: 1.1rem;

    }

    .img-msg {
        display: flex;
    }

    .list-item__thumbnail{
        margin-right: 8px;
        width: 30px;
        height: 30px;
        margin-top: 1px;
    }

    .underTB {
        padding-top: 57px;
        padding: 75px 8px 0 8px;
    }

    .textInput {
        width: 50%;
        max-height: 80px;
        word-wrap: break-word;
        background-color: rgba(255, 255, 255, 0.934);
        border-radius: 20px;
        padding: 8px;
        font-size: 0.9rem;
        overflow: auto;
        position: fixed;
        left: 18%;

    }

    .inB {
        display: flex;
        align-items: flex-end;
        position: fixed;
        top: 95%;

    }

    .submitB {
        width: 60px;
        font-size: 0.8rem;
        margin: 0;
        position: fixed;
        left: 71.4%;
    }

    .message {
        width: fit-content;
        /* max-width: 240px; */
        max-width: 60vw;
        word-wrap: break-word;
        border-radius: 20px;
        padding: 8px;
        font-size: 0.9rem;
        overflow: auto;
        margin-right: 4px;
        margin-bottom: 8px;
    }

    .send-time {
        padding-bottom: 8px;
        margin-right: 4px;
        font-size: 0.5rem;
        color: rgb(95, 93, 93);
    }

    .timeMsg {
        display: flex;
        align-items: flex-end;
    }
</style>