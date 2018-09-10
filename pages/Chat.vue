<template>
   <!-- <no-ssr> -->
    <v-ons-page>
            <v-ons-tabbar position="auto"
                :modifier="'autogrow white-content'"
                :tabs="tabs"
                :index.sync="index"
                :tabbar-style="md ? androidTabStyle : iosTabStyle"
            ></v-ons-tabbar>
    </v-ons-page>
    <!-- </no-ssr> -->
</template>

<script>
import ChatUsers from './ChatUsers'
import ChatTalk from './ChatTalk'
export default {
  data () {
    return {
        iosTabStyle: {backgroundColor:'#5fb75b'},
        androidTabStyle: {backgroundColor:'#4f4e4e'},
      tabs: [
        {
          icon: 'ion-ios-people',
          page: ChatUsers,
          top: 0 // Toolbarを使用する場合は、-(Toolbar + Tabbar heights)
        },

        {
          icon: 'ion-android-textsms',
          page: ChatTalk,
          top: 0
        },
      ]
    };
  },

  methods: {
      friends() {

      }
    
  },

  computed: {
    index: {
      get() {
        return this.$store.state.chatTabBarIndex;
      },
      set(newValue) {
        this.$store.commit('chatTabBarSet', newValue)
      }
    },

  }
};
</script>

<style scoped>
:checked{
  color: #ffffff;
  background-color: transparent;
  box-shadow: none;
  border-top: none;
}

</style>
