<template>
  <v-ons-page>
    <v-ons-toolbar>
        <div class="left" @click="close">
            <v-ons-icon icon='ion-android-close' class="close-icon"/>
        </div>
        <div class="center">
            <div class="date" @click="toggleDL()">
                {{dispDate(date)}} 
                <span :style="{fontSize: '0.9rem', position: 'relative', top: '-2px', left: '2px'}">
                    <span v-show="!dateListVisible">▼</span>
                    <span v-show="dateListVisible">▲</span>
                </span>
            </div>
        </div>
        <div class="right">
            <div class="save" :style="md ? 'position: relative; top: 3px;' : ''" @click="addDiary(false)">保存</div>
        </div>
    </v-ons-toolbar>

    <div v-show="dateListVisible" class="date-list">
        <div @click="changeDate(editDate)" v-if="editDate!=''" class="date-list-item">{{ dispDate(editDate) }}</div>
        <div @click="changeDate(today)" v-if="editDate!=today" class="date-list-item">{{ dispDate(today) }}</div>
        <div @click="changeDate(yesterday)" v-if="editDate!=yesterday" class="date-list-item">{{ dispDate(yesterday) }}</div>
        <div @click="showDraft()" class="date-list-item">下書き</div>
    </div>

    <v-ons-carousel fullscreen auto-scroll overscrollable
      :index.sync="carouselIndex" class="carousel"
    >
      <v-ons-carousel-item v-for="(value, key) in questions" :key="key" class="crousel-item">
        <div class="question">{{value}}</div>
        <!-- <p v-if="key!='title'" class="count"><span :style="answers[key].length > 400 ? {color:'red'} : {}">{{answers[key].length}}</span> / 400</p>
        <p v-else class="count"><span :style="answers[key].length > 12 ? {color:'red'} : {}">{{answers[key].length}}</span> / 12</p> -->
        <p v-if="key=='title'" class="count"><span :style="answers[key].length > 12 ? {color:'red'} : {}">{{answers[key].length}}</span> / 12</p>
        <p v-else class="count" :style="{marginTop:'2.4rem'}"></p>
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

        <div v-show="Object.values(answers).indexOf('') < 0" class="upload" @click="addDiary(true)">
            提出する
        </div>
    </div>

  </v-ons-page>
</template>

<script>
import DiaryDrafts from './DiaryDrafts';
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
            submitted: false, //DiaryDetailから提出済の日誌を編集した場合にextends
            editDate: '',
            date: this.today,
            dateListVisible: false,
            carouselIndex: 0,
            questions: this.$store.state.questions,
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

        toggleDL() {
            this.dateListVisible = !this.dateListVisible;
        },

        changeDate(date) {
            this.date = date;
            this.dateListVisible = false;
        },

        showDraft() {
            this.$store.commit('push', {extends: DiaryDrafts,
                            onsNavigatorOptions: {
                                animation: 'fade',
                                animationOptions: { duration: 0.1 }
                                }
                        });
            this.dateListVisible = false;
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

        addDiary(submit) {
            if(submit==true) {
                if(this.submitted == false && this.$store.state.diaries.filter(diary => diary.userId == this.$store.state.uid && diary.date == this.date && diary.submit == true).length > 0) {
                    this.$ons.notification.alert({messageHTML:`その日付の日誌は既に提出済みです！`, title:''});
                    return;
                }

                // if(this.answers.q1.length > 400) {
                //     this.$ons.notification.alert({messageHTML:`第1項の回答を<br>400字以内に納めてください。`, title:''});
                //     this.carouselIndex = 0;
                //     return;
                // }
                // if(this.answers.q2.length > 400) {
                //     this.$ons.notification.alert({messageHTML:`第2項の回答を<br>400字以内に納めてください。`, title:''});
                //     this.carouselIndex = 1;
                //     return;
                // }
                // if(this.answers.q3.length > 400) {
                //     this.$ons.notification.alert({messageHTML:`第3項の回答を<br>400字以内に納めてください。`, title:''});
                //     this.carouselIndex = 2;
                //     return;
                // }
                // if(this.answers.q4.length > 400) {
                //     this.$ons.notification.alert({messageHTML:`第4項の回答を<br>400字以内に納めてください。`, title:''});
                //     this.carouselIndex = 3;
                //     return;
                // }
                // if(this.answers.q5.length > 400) {
                //     this.$ons.notification.alert({messageHTML:`第5項の回答を<br>400字以内に納めてください。`, title:''});
                //     this.carouselIndex = 4;
                //     return;
                // }
                if(this.answers.title.length > 12) {
                    this.$ons.notification.alert({messageHTML:`タイトルを<br>12字以内に納めてください。`, title:''});
                    this.carouselIndex = 5;
                    return;
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

          this.$store.dispatch('diaryAdd', {        id:         this.id == '' ? id : this.id,
                                                    submit:     submit,
                                                    date:       this.date,
                                                    title:      this.answers.title,
                                                    content1:   this.answers.q1,
                                                    content2:   this.answers.q2,
                                                    content3:   this.answers.q3,
                                                    content4:   this.answers.q4,
                                                    content5:   this.answers.q5,
                                                    //下書きの編集かどうか
                                                    edit:       this.id == '' ? false : true
                                                });
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
              return string.substr(1, 1);
            } else {
              return string.substr(0, 2);
            }
          }
        },

        dispDate() {
            return(date) => {
                return date == null ? '' : date.substr(5, date.length - 5)
            }
        }
    }
}
</script>

<style scoped>
    @media (min-width: 760px){
        .right {
            padding-right: 1.5vw;
        }
    }

    .crousel {
        height: 10vh;
        overflow: hidden;
    }
    
    .crousel-item {
        background-color: #fefefe;
    }

    .date {
        margin-left: 16px;
        margin-top: -2px;
    }

    .save {
        font-size: 1rem;
        padding-right: 12px;
        position: relative;
        top: -2px;
    }

    .date-list {
        position: fixed;
        top: 44px;
        width: 100vw;
        text-align: center;
        background-color: #fefefe;
        color: #828080;
        z-index: 1000;
    }

    .date-list-item {
        border-bottom: solid 1px #ccc;
        padding: 8px 0;
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

    @media (min-width: 1200px){
        .control {
            transform: translateY(50vh);
        }
    }

    .number-carousel {
        color: #a3a2a2;
        z-index: 1;
        font-size: 1.2rem;
    }

    .dots-arrows {
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
