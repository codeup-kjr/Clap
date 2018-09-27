<template>
  <v-ons-page>
    <v-ons-toolbar>
        <div class="left" @click="close">
            <v-ons-icon icon='ion-android-close' class="close-icon"/>
        </div>
        <div class="center">
        <v-ons-select class="date" v-model="date">
            <option selected>{{ today }}</option>
            <option>{{ yesterday }}</option>
        </v-ons-select>
        </div>
        <div class="right">
            <div class="save">保存</div>
        </div>
    </v-ons-toolbar>

    <v-ons-carousel fullscreen swipeable auto-scroll overscrollable
      :index.sync="carouselIndex"
    >
      <v-ons-carousel-item v-for="(value, key) in questions" :key="key">
        <div class="question" @click="test">{{value}}</div>
        <p class="count">{{answers[key].length}} / 400</p>
        <textarea cols="30" rows="10" class="answer" placeholder="何でも書こう！" v-model="answers[key]"></textarea>
      </v-ons-carousel-item>
    </v-ons-carousel>

    <div class="dots">
      <span :index="dotIndex - 1" v-for="dotIndex in Object.keys(questions).length" :key="dotIndex" style="cursor: pointer" @click="carouselIndex = dotIndex - 1" class="dot" :class="carouselIndex === dotIndex - 1 ? 'dot-active' : ''">
        {{ carouselIndex === dotIndex - 1 ? '\u25CF' : '\u25CB' }}
      </span>
    </div>
  </v-ons-page>
</template>

<script>
export default {
    mounted() {
        //これをしないと、selectのonChangeイベントが発生するまで、dateがundefinedになる。
        this.date = this.today;
    },

    data() {
        return {
            date: this.today,
            carouselIndex: 0,
            questions: {
                q1: '「ここが良かった！」今日の自分。',
                q2: 'メンバーの、ココを褒めたい！',
                q3: '考えました、明日の課題',
                q4: 'こんな練習やってみたい！',
                q5: '監督へのメッセージ'
            },
            answers: {
                q1: '',
                q2: '',
                q3: '',
                q4: '',
                q5: ''
            },

            
        }
    },

    methods: {
        close() {
            this.$store.commit('pop');
        },

        test() {
            console.log(this.date)
        }
    },

    computed: {
        today() {
            const today = new Date();
            const year = today.getFullYear();
            const month = today.getMonth() + 1;
            const date = today.getDate();
            const day = [ "日", "月", "火", "水", "木", "金", "土" ][today.getDay()];
            return (year + '年' + month + '月' + date + '日' + '(' + day + ')');
        },

        yesterday() {
            // const today = new Date();
            const yesterday = ( d => new Date(d.setDate(d.getDate()-1)) )(new Date);
            const year = yesterday.getFullYear();
            const month = yesterday.getMonth() + 1;
            const date = yesterday.getDate();
            const day = [ "日", "月", "火", "水", "木", "金", "土" ][yesterday.getDay()];
            return (year + '年' + month + '月' + date + '日' + '(' + day + ')');
        },

        modify() {
          return(string) => {
            if(string.substr(0, 1)=='0') {
              return string.substr(1, 1)
            } else {
              return string.substr(0, 2)
            }
          }
        },
    }
}
</script>

<style>
    .close-icon {
        font-size: 1.3rem;
        padding-left: 12px;
        position: relative;
        top: -2px;
    }

    .date {
        width: 164px;
        padding-top: 4px;
        /* padding-left: 4px;  */
    }

    .save {
        font-size: 1rem;
        padding-right: 12px;
        position: relative;
        top: -2px;
    }

    .question {
         text-align: center;
         font-size: 1.2rem;
         margin: 20px 0;
         color: #363636;
    }

    .count {
        color: #363636;
        text-align: right;
        margin: 0 8px 4px;
        /* margin-bottom: 8px; */
        padding-bottom: 16px;
        /* border-bottom: dotted 1px #6d6d72; */
        border-bottom: solid 4px #5280a9;
    }

    .answer {
        width: 100vw;
        font-size: 1rem;
        resize: none;
        margin-bottom: 16px;
        padding: 8px 16px;
        border: none;

    }
    
    .dots {
        text-align:center;
        font-size: 30px;
        position: absolute;
        bottom: 40px;
        left: 0;
        right: 0;
        color: #a3a2a2;
    }

    .dot-active {
        /* HTMLの丸サイズが異なるため、調整。 */
        position: relative;
        top: 1.55px;

    }
</style>
