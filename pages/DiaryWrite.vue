<template>
  <v-ons-page>
    <v-ons-toolbar>
        <div class="left" @click="close">
            <v-ons-icon icon='ion-android-close' class="close-icon"/>
        </div>
        <div class="center">
        <v-ons-select class="date" v-model="date" :style="md ? 'position: relative; top: 10px; left: 32px;' : ''">
            <option v-if="editDate!=''" :selected="editDate=='' ? false : true">{{ editDate }}</option>
            <option v-if="editDate!=today" :selected="editDate=='' ? true : false">{{ today }}</option>
            <option v-if="editDate!=yesterday">{{ yesterday }}</option>
        </v-ons-select>
        </div>
        <div class="right">
            <div class="save" :style="md ? 'position: relative; top: 3px;' : ''" @click="addDiary(false)">保存</div>
        </div>
    </v-ons-toolbar>

    <v-ons-carousel fullscreen swipeable auto-scroll overscrollable
      :index.sync="carouselIndex" class="carousel"
    >
      <v-ons-carousel-item v-for="(value, key) in questions" :key="key" class="crousel-item">
        <div class="question">{{value}}</div>
        <p v-if="key!='title'" class="count"><span :style="answers[key].length > 400 ? {color:'red'} : {}">{{answers[key].length}}</span> / 400</p>
        <p v-else class="count"><span :style="answers[key].length > 12 ? {color:'red'} : {}">{{answers[key].length}}</span> / 12</p>
        <textarea cols="30" rows="10" class="answer" placeholder="何でも書こう！" v-model="answers[key]"></textarea>
      </v-ons-carousel-item>
    </v-ons-carousel>
    
    <div class="btns">
        <div class="control">
            <div class="number-carousel">{{ carouselIndex + 1}} / 6</div>
            <div class="dots-arrows">
                <v-ons-icon icon='ion-ios-arrow-back' :style="carouselIndex == 0 ? 'color: transparent' : ''" class="arrow" @click="left"/>
                <span>
                    <span :index="dotIndex - 1" v-for="dotIndex in Object.keys(questions).length" :key="dotIndex" style="cursor: pointer" @click="carouselIndex = dotIndex - 1">
                        {{ carouselIndex === dotIndex - 1 ? '\u25CF' : '\u25CB' }}
                    </span>
                </span>
                <v-ons-icon icon='ion-ios-arrow-forward' class="arrow" :style="carouselIndex == 5 ? 'color: transparent' : ''" @click="right"/>
            </div>
            
        </div>
        <v-ons-button
            v-show="Object.values(answers).indexOf('') < 0"
            class="upload" modifier="quiet"
            @click="addDiary(true)">
            <v-ons-icon icon='ion-ios-cloud-upload'/><span class="up-t">up!</span>
        </v-ons-button>
    </div>
  </v-ons-page>
</template>

<script>
export default {
    
    mounted() {
        if(!this.editDate) {
            //これをしないと、selectのonChangeイベントが発生するまで、dateがundefinedになる。
            this.date = this.today;
        } else {
            this.date = this.editDate;
        }
    },

    data() {
        return {
            editDate: '',
            date: this.today,
            carouselIndex: 0,
            questions: {
                q1: '「ここが良かった！」今日の自分。',
                q2: 'メンバーの、ココを褒めたい！',
                q3: '考えました、明日の課題',
                q4: 'こんな練習やってみたい！',
                q5: '監督へのメッセージ',
                title: '今日のタイトルは？'
            },
            answers: {
                q1: '',
                q2: '',
                q3: '',
                q4: '',
                q5: '',
                title: ''
            },
            height: '0px',
            id: '',
            
        }
    },

    methods: {
        close() {
            this.$store.commit('pop');
        },

        right() {
            if(this.carouselIndex != 5) {
                this.carouselIndex++;
            }
        },

        left() {
            if(this.carouselIndex != 0) {
                this.carouselIndex--;
            }
        },

        async addDiary(submit) {
            if(submit==true) {
                if(this.$store.state.diaries.filter(diary => diary.userId == this.$store.state.uid && diary.date == this.date && diary.submit == true).length > 0) {
                    this.$ons.notification.alert({messageHTML:`その日付の日誌は既に提出済みです！`, title:''});
                    return
                }

                if(this.answers.q1.length > 400) {
                    this.$ons.notification.alert({messageHTML:`第1項の回答を<br>400字以内に納めてください。`, title:''});
                    this.carouselIndex = 0;
                    return
                }
                if(this.answers.q2.length > 400) {
                    this.$ons.notification.alert({messageHTML:`第2項の回答を<br>400字以内に納めてください。`, title:''});
                    this.carouselIndex = 1;
                    return
                }
                if(this.answers.q3.length > 400) {
                    this.$ons.notification.alert({messageHTML:`第3項の回答を<br>400字以内に納めてください。`, title:''});
                    this.carouselIndex = 2;
                    return
                }
                if(this.answers.q4.length > 400) {
                    this.$ons.notification.alert({messageHTML:`第4項の回答を<br>400字以内に納めてください。`, title:''});
                    this.carouselIndex = 3;
                    return
                }
                if(this.answers.q5.length > 400) {
                    this.$ons.notification.alert({messageHTML:`第5項の回答を<br>400字以内に納めてください。`, title:''});
                    this.carouselIndex = 4;
                    return
                }
                if(this.answers.title.length > 12) {
                    this.$ons.notification.alert({messageHTML:`タイトルを<br>12字以内に納めてください。`, title:''});
                    this.carouselIndex = 5;
                    return
                }
            }

            let id = "";
            //Diary.vueから選んだ下書き編集の場合はthis.idを使う。
            if(!this.id) {
                // 生成する文字列の長さ
                const l = 20;
                // 生成する文字列に含める文字セット
                const c = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
                const cl = c.length;
                for(var i=0; i<l; i++){
                    id += c[Math.floor(Math.random()*cl)];
                }
            }

          await this.$store.dispatch('diaryAdd', {  id:         this.id == '' ? id : this.id,
                                                    submit:     submit,
                                                    date:       this.date,
                                                    title:      this.answers.title,
                                                    content1:   this.answers.q1,
                                                    content2:   this.answers.q2,
                                                    content3:   this.answers.q3,
                                                    content4:   this.answers.q4,
                                                    content5:   this.answers.q5,
                                                    //下書きの編集かどうか
                                                    edit:       this.id == '' ? false : true});
          
          let action = '';
          submit == true ? action = '提出' : action = '保存';

          if (!navigator.onLine) {
            this.$ons.notification.alert({messageHTML:`オンラインになると${action}されます。<br>オンラインになる前に画面を更新すると${action}されません。`, title:''});
          } else {
            this.$ons.notification.alert(`${action}しました。`, {title:''});
          }

          this.answers.title = '';
          this.answers.q1 = '';
          this.answers.q2 = '';
          this.answers.q3 = '';
          this.answers.q4 = '';
          this.answers.q5 = '';
          this.date = this.today;
          this.carouselIndex = 0;

          this.$store.commit('pop');
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
    .crousel {
        height: 10vh;
        overflow: hidden;
    }
    
    .crousel-item {
        background-color: #fefefe;
    }

    .close-icon {
        font-size: 1.3rem;
        padding-left: 12px;
        position: relative;
        top: -2px;
    }

    .date {
        width: 172px;
        padding-top: 4px;
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
        padding-bottom: 16px;
        border-bottom: solid 1px #f0ab57;
    }

    .answer {
        width: 100vw;
        height: 46vh;
        font-size: 1rem;
        resize: none;
        margin-bottom: 16px;
        padding: 8px 16px;
        border: none;
    }
    
    .btns {
        margin-top: -44%;
    }

    .control {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: 24px;
        margin-bottom: 24px;
    }

    .number-carousel {
        color: #a3a2a2;
        z-index: 1;
        font-size: 1.2rem;
    }

    .dots-arrows {
        /* font-size: 30px; */
        color: #a3a2a2;
        position: relative;
        top: -2px;
    }
    
    .arrow {
        position: relative;
        top: -3px;
        padding: 0 16px;
    }

    .upload {
        display: flex;
        font-size: 40px;
        margin: 0 auto;
        padding: 4px 16px;
        color: #67a3d8;
        width: fit-content;
        border: solid 1px #dad8d8;
        border-radius: 12px;
    }

    .up-t {
        padding-top: 4px;
        margin-left: 4px;
        font-size: 70%;
    }

</style>
