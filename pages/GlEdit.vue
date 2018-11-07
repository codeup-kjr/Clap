<template>
   <!-- <no-ssr> -->
    <v-ons-page>
        <v-ons-toolbar>
            <div class="left">
                <v-ons-icon icon='ion-android-close' class="close-icon" @click="close()"/>
            </div>
            <div class="center">
                メンバーを編集
            </div>
            <div class="right">
                
            </div>
        </v-ons-toolbar>
        <div class="container">

        <div class="ml">
            <div v-for="item in users" :key="item.id"
                @click="toggleMember(item.id)" class="ml-wrap">
                <img :src="uImage(item.image)" alt="img" class="ml-img" :style="defineM(item.id)">
                <p class="ml-name">{{item.name}}</p>
            </div>
        </div>
        <div v-show="isChanged" class="save" @click="save()">
            保存する
        </div>
        </div>
    </v-ons-page>
    <!-- </no-ssr> -->
</template>

<script>
import png from '../assets/dUsrImg.jpg'
import Vue from 'vue'

export default {
  data () {
    return {
        initialMId: [],
        membersId: [],//Diary.vueからextendsする
        removeList: [],
        addList: []
    };
  },

  async mounted() {
      const gl = this.$store.state.groupList;
      const len = gl.length;

      for(let i=0; i < len; i++) {
          this.membersId.push(gl[i].userId);
          this.initialMId.push(gl[i].userId);
      }
    //   this.initialMId = this.membersId;
  },

  methods: {
    close() {
        // save()を実行した後、処理が完了していない場合に閉じることを禁ずるならば、
            // save()を実行したことを管理するdataを追加し、this$store.state.glEditMsgと合わせて制御に利用する。
        this.$store.commit('pop');
    },

    toggleMember(userId) {
        if(this.membersId.indexOf(userId)>=0) {
            this.membersId = this.membersId.filter(id => id != userId);
            this.removeList.push(userId);
            if(this.addList.indexOf(userId)>=0) {
                this.addList = this.addList.filter(id => id != userId);
            }
        } else {
            this.membersId.push(userId);
            this.addList.push(userId);
            if(this.removeList.indexOf(userId)>=0) {
                this.removeList = this.removeList.filter(id => id != userId);
            }
        }
    },

    save(userId) {
        const vm = this;
        const unwatch = this.$store.watch(
            state => state.glEditMsg,
            glEditMsg => {
                if(glEditMsg == '編集完了') {
                    this.$ons.notification.alert({messageHTML:'編集が完了しました。', title:'',
                                                    callback: idx => {
                                                                    unwatch();
                                                                    vm.$store.commit('setGlEditMsg', '');
                                                                    vm.$store.commit('pop');
                                                                    vm.$ons.notification.close;
                                                                }
                                                    });
                }
            });
        this.$store.dispatch('glMemberEdit', {removeList: this.removeList, addList: this.addList});
    }
  },

  computed: {
    users() {
        return this.$store.state.usersData.filter(data => data.id != this.$store.state.uid);
    },

    uImage() {
        return(image) => {
            return image == null ? png : image;
        }
    },

    defineM() {
        return(userId) => {
            return this.membersId.indexOf(userId) >= 0 ? {opacity: '1'} : {opacity: '0.3'};
        }
    },

    isChanged() {
        // 初期状態から変更があったかを確認。JSONを使用することで、nullなどの場合もエラーが起きず、安定する。また、cloneするためにslice()をする必要がある。
        return JSON.stringify(this.initialMId.slice().sort()) != JSON.stringify(this.membersId.slice().sort());
    }
  }
};
</script>

<style scoped>
    .ml {
        overflow: auto;
        height: fit-content;
        margin-top: 16px;
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        /* saveボタンの高さ */
        padding-bottom: 60px;
    }

    .ml-wrap {
        width: 30vw;
        height: 32vw;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    
    .ml-wrap:not(:nth-child(3n)) {
        margin-right: 4vw;
    }

    .ml-img {
        width: 20vw;
        height: 20vw;
        border-radius: 10vw;
        margin-bottom: 8px;
    }

    .ml-name {
        font-size: 0.9rem;
        width: 100%;
        height: 1.1rem;
        text-align: center;
        overflow: hidden;
        color: #828080;
    }

    .save {
        width: 100vw;
        height: 60px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: fixed;
        bottom: 0;
        background-color: #86a1f2;
        font-size: 1.4rem;
        color: #fefefe;
    }
</style>