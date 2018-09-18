<template>
  <v-ons-page :style="swipePosition" class="bg">
    <v-ons-tabbar position="auto"
      swipeable
      :modifier="md ? 'autogrow white-content' : ''"
      :on-swipe="md ? onSwipe : null"
      :tabbar-style="swipeTheme"
      :tabs="tabs"
      :index.sync="index"
    ></v-ons-tabbar>

  </v-ons-page>
</template>

<script>
import MyPage from './MyPage'
// import Home from './Home'
import Calendar from './Calendar'
import Applaud from './Applaud'
import Chat from './Chat'
import { mapActions } from 'vuex'

// Just a linear interpolation formula
const lerp = (x0, x1, t) => parseInt((1 - t) * x0 + t * x1, 10);
// RGB colors
const gray = [97, 130, 131];
const green = [84, 175, 38];
const blue = [30, 136, 229];
const yerrow = [146, 146, 10];

export default {
  data () {
    return {

      colors: blue,
      animationOptions: {},
      topPosition: 0,
      tabs: [
        {
          // label: 'カレンダー',
          icon: 'ion-calendar',
          page: Calendar,
          theme: blue,
        //   style: this.md ? { maxWidth: '60px' } : {}, //小さくする場合
          top: 0 // Toolbarを使用する場合は、-(Toolbar + Tabbar heights)
        },
 {
          // label: 'メンバー評価',
          icon: 'ion-star',
          page: Applaud,
          theme: yerrow
        },
        // {
        //   // label: 'チャット',
        //   icon: 'ion-chatboxes',
        //   page: Chat,
        //   theme: green
        // },
        {
          // label: 'マイページ',
          icon: 'ion-person',
          page: MyPage,
          theme: gray
        }
      ]
    };
  },

  mounted() {
    if(this.$store.state.teamId) {
      // this.bindTeam()
      // this.bindSchedule()
      // this.bindTeamU()
    }
    if(this.$store.state.uid) {
        // this.bindMyRoom()
      //myDataはstore/index.jsのcheckLoginでbindする。
      // this.bindMyData()
    }

    // this.bindPlayers()

  },

  destroyed() {
  
    // this.unBindMyRoom()
    // this.unBindTeam()
    // this.unBindSchedule()
    // this.unBindTeamU()

    // this.unBindMyData()
  },

  methods: {
    ...mapActions({
      // bindTeam: 'bindTeam',
      // bindSchedule: 'bindSchedule',
      // bindTeamU: 'bindTeamU',
      // bindMyRoom: 'bindMyRoom',
      // bindPlayers: 'bindPlayers',
      // bindMyData: 'bindMyData',

      // unBindTeam: 'unBindTeam',
      // unBindSchedule: 'unBindSchedule',
      // unBindTeamU: 'unBindTeamU',
      // unBindMyRoom: 'unBindMyRoom',
      // unBindMyData: 'unBindMyData',
    }),

    onSwipe(index, animationOptions) {
      // Apply the same transition as ons-tabbar
      this.animationOptions = animationOptions;

      // Interpolate colors and top position
      const a = Math.floor(index), b = Math.ceil(index), ratio = index % 1;
      this.colors = this.colors.map((c, i) => lerp(this.tabs[a].theme[i], this.tabs[b].theme[i], ratio));
      this.topPosition = lerp(this.tabs[a].top || 0, this.tabs[b].top || 0, ratio);
    },
    
  },

  computed: {
    index: {
      get() {
        return this.$store.state.tabBarIndex;
      },
      set(newValue) {
        this.$store.commit('tabBarSet', newValue)
      }
    },
    
    swipeTheme() {
      return this.md && {
        backgroundColor: `rgb(${this.colors.join(',')})`,
        transition: `all ${this.animationOptions.duration || 0}s ${this.animationOptions.timing || ''}`
      }
    },
    swipePosition() {
      return this.md && {
        top: this.topPosition + 'px',
        transition: `all ${this.animationOptions.duration || 0}s ${this.animationOptions.timing || ''}`
      }
    }
  }
};
</script>

<style>
/* Custom 'white-content' modifier */

.page--material .toolbar--white-content__center,
.page--material .toolbar-button--white-content,
.page--material :checked + .tabbar--white-content__button {
  color: white;
}

.page--material .tabbar--white-content__button {
  color: rgba(255, 255, 255, 0.7);
}

.page--material .tabbar--white-content__border {
  background-color: white;
}
</style>
