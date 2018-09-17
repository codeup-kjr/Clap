<template>
   <!-- <no-ssr> -->
    <v-ons-page>
      <div class="container">
        <v-calendar :attributes='attrs' :theme-styles='themeStyles' @dayclick="dayClick" class="calendar"/>
        <v-ons-button modifier="cta" class="addEvent" @click="addPushed">＋</v-ons-button>
        
        <v-ons-modal :visible="addVisible">
          <div class="add-container">
            <div class="add-header">イベント{{addHText}}</div>
            <div class="add-under-h">
            <div class="add-div" v-show="isROnly">{{title}}</div>
            <div class="add-div" v-show="isROnly">{{place}}</div>
            <v-ons-input type="text" placeholder="タイトル" class="add-input" v-model="title" v-show="!isROnly"/>
            <v-ons-input type="text" placeholder="場所（任意）" class="add-input" v-model="place" v-show="!isROnly"/>
            
            <div class="add-div" v-show="isROnly">{{dateRange}}</div>
            <v-date-picker
              v-model='selectedValue'
              mode='range'
              :input-props='{ class: "input", placeholder: "日付", readonly: true }'
              @input="datePicked"
              is-expanded
              v-show="!isROnly"
              >
                <v-ons-input
                  type='text'
                  slot-scope='{ inputValue, updateValue }'
                  v-model='dateRange'
                  placeholder='日付（長押し）'
                  class="add-input"
                  :readonly="true"/>
            </v-date-picker>
            <div class="time-container add-input">
              <v-ons-input type="time" v-model="sTime" :readonly="isROnly" class="time"/>
              <p class="time-btw"> 〜 </p>
              <v-ons-input type="time" v-model="eTime" :readonly="isROnly" class="time"/>
            </div>
            <textarea cols="30" rows="10" class="ex-info" placeholder="備考（任意、300字以内）" v-model="exInfo" :readonly="isROnly"></textarea>
            <div class="add-btns">
              <v-ons-button modifier="quiet" @click="addCancel">{{cBText}}</v-ons-button>
              <v-ons-button @click="addSchedule">{{addBText}}</v-ons-button>
            </div>
            </div>
          </div>
        </v-ons-modal>
        
        <div  
          class='selected-day'>
          <v-ons-list-title class="dateTitle" v-show="isToday&&dayClicked">
            今日
          </v-ons-list-title>
          <v-ons-list-title class="dateTitle" v-show="!isToday&&dayClicked">
            {{ selectedDay.year }}年{{ selectedDay.month }}月{{ selectedDay.day }}日
          </v-ons-list-title>
          
          <v-ons-list class="eventList" v-show="dayClicked">
            <!-- リストアイテムはstateを直接読むように変更。初期表示は今日を読む。ただし、dayclickイベントを発火することはできないため、firebaseから読む方法しかないと思われる。今はv-showで非表示にしている。 -->
            <!-- 「今日」をハイライトするために、keyをtodayにしてschedule(event)に追加している。空のリストなため、表示しない。 -->
            <v-ons-list-item tappable v-for='attr in ordered' :key="attr.key" @click="eventClick(attr)" class="eventLItem" v-if="attr.key!='today'">
              {{ attr.customData.time_start }}-{{ attr.customData.time_end }}  {{ attr.customData.title }}
            </v-ons-list-item>
          </v-ons-list>
          
        </div>
      </div>
    </v-ons-page>
    <!-- </no-ssr> -->
</template>

<script>
import Vue from 'vue'
import lodash from 'lodash'//並べ替え用「 ._ 」

export default {
    data() {
        return {
          editId: '',
          isROnly: false,
          isDetail: false,
          isEdit: false,
          dayClicked: false,
          dRPicked: false,
          title: '',
          place: '',
          sTime: '00:00',
          eTime: '00:00',
          sYear: '',
          sMonth: '',
          sDate: '',
          sDay: '',
          eYear: '',
          eMonth: '',
          eDate: '',
          eDay: '',
          exInfo: '',
          selectedValue: null,
          addVisible: false,
          isToday: true,
          selectedDay: '',
          isExpanded: false,
          todos: this.$store.state.schedule,
          themeStyles: {
            bars: {
              width:'30%'
            }
          },

        }
    },

    created() {
      
    },

    computed: {

      ordered(){
        // return _.orderBy(this.selectedDay.attributes, ['customData.title'], ['desc'])
        return _.sortBy(this.selectedDay.attributes, function(item) {
            return [item.customData.time_start];
        });
      },

      attrs() {
        const events = this.$store.state.schedule.map(t => ({
          key: `todo.${t.id}`,
          bar: {backgroundColor: 'red'},
          dates: {start: new Date(t.year_start, t.month_start - 1, t.date_start), end: new Date(t.year_end, t.month_end - 1, t.date_end)},
          customData: t,
        }));
        events.push({
                    key: 'today',
                    customData: {
                      },
                    highlight: {backgroundColor: '#f9e4b8'},
                    dates: new Date(),
                  })
        return events
      },

      inputState() {
      if (!this.selectedValue) {
        return {
          type: 'is-danger',
          message: 'Date required.',
        }
      }
      return {
        type: 'is-primary',
        message: '',
      }
    },

    dateRange() {
      if(!this.sYear) return ''

      if(this.sYear==this.eYear) {
          if(this.sMonth==this.eMonth) {
            if(this.sDate==this.eDate) {
              return `${this.sYear}年${this.sMonth}月${this.sDate}日(${this.sDay})`
            } else {
              return `${this.sYear}年${this.sMonth}月${this.sDate}日(${this.sDay}) 〜 ${this.eDate}日(${this.eDay})`
            }
          } else {
            return `${this.sYear}年${this.sMonth}月${this.sDate}日(${this.sDay}) 〜 ${this.eMonth}月${this.eDate}日(${this.eDay})`
          }
        } else {
          return `${this.sYear}年${this.sMonth}月${this.sDate}日(${this.sDay}) 〜 ${this.eYear}年${this.eMonth}月${this.eDate}日(${this.eDay})`
        }

    },

    returnMonth() {
      return(string) => {
        const monthT = string.substr(4, 3)
        let month = ''
        switch (monthT) {
              case 'Jan':
                month = 1
                break;
              case 'Feb':
                month = 2
                break;
              case 'Mar':
                month = 3
                break;
              case 'Apr':
                month = 4
                break;
              case 'May':
                month = 5
                break;
              case 'Jun':
                month = 6
                break;
              case 'Jul':
                month = 7
                break;
              case 'Aug':
                month = 8
                break;
              case 'Sep':
                month = 9
                break;
              case 'Oct':
                month = 10
                break;
              case 'Nov':
                month = 11
                break;
              case 'Dec':
                month = 12
                break;
              default:
                break;
            }
            return month
          }
        },

        dateModify() {
          return(string) => {
            if(string.substr(8, 1)=='0') {
              return string.substr(9, 1)
            } else {
              return string.substr(8, 2)
            }
          }
        },

      returnDay() {
        return(string) => {
          const dayT = string.substr(0, 3)
          let day = ''
          switch (dayT) {
                case 'Sun':
                  day = '日'
                  break;
                case 'Mon':
                  day = '月'
                  break;
                case 'Tue':
                  day = '火'
                  break;
                case 'Wed':
                  day = '水'
                  break;
                case 'Thu':
                  day = '木'
                  break;
                case 'Fri':
                  day = '金'
                  break;
                case 'Sat':
                  day = '土'
                  break;
                default:
                  break;
              }
            return day
          }
        },

        addHText() {
          if (this.isDetail) {
            return '詳細'
          }
          else if(this.isEdit) {
            return '編集'
          } else {
            return '登録'
          }
        },

        addBText() {
          if (this.isDetail) {
            return '編集する'
          }
          else if(this.isEdit) {
            return '保存'
          } else {
            return '登録'
          }
        },

        cBText() {
          if (this.isDetail) {
            return '閉じる'
          } else {
            return 'キャンセル'
          }
        }
    },

    components: {

    },

    methods: {
      dayClick(data) {
        this.dayClicked = true
        this.selectedDay = data
        this.isToday = data.isToday
        // イベントリストアイテムを更新する処理を書く。

      },

      addPushed() {
        this.addVisible = true
        this.isROnly = false
        this.isDetail = false
        this.isEdit = false
        this.sTime = '00:00'
        this.eTime = '00:00'
      },

      addCancel() {
        this.addVisible = false
        this.dRPicked = false
        this.isROnly = false
        this.editId = ''
        this.title = ''
        this.sTime = ''
        this.place = ''
        this.eTime = ''
        this.sYear = ''
        this.sMonth = ''
        this.sDate = ''
        this.sDay = ''
        this.eYear = ''
        this.eMonth = ''
        this.eDate = ''
        this.eDay = ''
        this.exInfo = ''
        this.selectedValue = null
      },

      datePicked() {
        this.start = String(this.selectedValue.start)
        this.end = String(this.selectedValue.end)
      
        this.sYear = this.start.substr(11, 4)
        this.sMonth = this.returnMonth(this.start)
        this.sDate = this.dateModify(this.start)
        this.sDay = this.returnDay(this.start)

        // if(this.start!=this.end) {
          this.eYear = this.end.substr(11, 4)
          this.eMonth = this.returnMonth(this.end)
          this.eDate = this.dateModify(this.end)
          this.eDay = this.returnDay(this.end)

          this.dRPicked = true
        // }
      },

      eventClick(attr) {
          this.addVisible = true
          this.isDetail = true
          this.isROnly = true
          
          this.editId = attr.customData.id
          this.title  = attr.customData.title
          this.place  = attr.customData.place

          this.sYear  = attr.customData.year_start
          this.sMonth = attr.customData.month_start
          this.sDate  = attr.customData.date_start
          this.sDay   = this.returnDay(String(attr.dates[0].start))
          this.eYear  = attr.customData.year_end
          this.eMonth = attr.customData.month_end
          this.eDate  = attr.customData.date_end
          this.eDay   = this.returnDay(String(attr.dates[0].end))

          this.sTime = attr.customData.time_start
          this.eTime = attr.customData.time_end
          this.exInfo = attr.customData.ex_info

      },

      addSchedule() {
          if(this.addBText=='編集する') {
            this.isDetail = false
            this.isEdit = true
            this.isROnly = false
            return
          }

          if(!this.title) {
            this.$ons.notification.alert('タイトルを入力ください。', {title:''})
            return
          }
          if(!this.sYear) {
            this.$ons.notification.alert('日付を入力ください。', {title:''})
            return
          }

          let id = "";
          if(this.addBText=='登録') {
              // 生成する文字列の長さ
              const l = 20;
              // 生成する文字列に含める文字セット
              const c = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
              const cl = c.length;
              for(var i=0; i<l; i++){
                  id += c[Math.floor(Math.random()*cl)];
              }
          }
          this.$store.dispatch('scheduleAdd', { id: this.addBText == '登録' ? id : this.editId,
                                                title: this.title,
                                                place: this.place,
                                                sYear: Number(this.sYear),
                                                sMonth: Number(this.sMonth),
                                                sDate: Number(this.sDate),
                                                eYear: Number(this.eYear),
                                                eMonth: Number(this.eMonth),
                                                eDate: Number(this.eDate),
                                                sTime: this.sTime,
                                                eTime: this.eTime,
                                                exInfo: this.exInfo})
          // エラーが起きた時の対処(stateの更新など)をindex.js内に記述し、ここでstateを読み込んで判定する処理を書く。
          
          if(this.addBText=='登録') {
            this.$ons.notification.alert('登録しました', {title:''})
          } else if(this.addBText=='保存') {
            this.$ons.notification.alert('保存しました', {title:''})
            this.editId = ''
          }

          this.addVisible = false
          this.dayClicked = false
          this.title = ''
          this.sTime = ''
          this.place = ''
          this.eTime = ''
          this.sYear = ''
          this.sMonth = ''
          this.sDate = ''
          this.sDay = ''
          this.eYear = ''
          this.eMonth = ''
          this.eDate = ''
          this.eDay = ''
          this.exInfo = ''
          this.selectedValue = null
          this.dRPicked = false
      }
	  }
}
</script>

<style scoped>
  .container {
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 92vh;
  }

  .calendar {
    /* height: 264px; */
    width: 100vw;
    /* height: 48vh; */
    height: 44vh;
  }

  .dateTitle {
    font-size: 1rem;
    background-color: #e7f9fc;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
    height: 4vh;
  }
  .eventList {
    overflow: auto;
    font-size: 0.85rem;
    width: 100vw;
    /* height: 34vh; */
    height: 38vh;
  }

  .eventLItem {
    overflow: auto;
    white-space: nowrap;
    font-size: 0.8rem;
  }

  .addEvent {
    width: 100vw;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.6rem;
    padding: 0;
    height: 6vh;
  }

  .add-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      color: black;
  }

  .add-header {
      width: 85vw;
      background-color: #fdfeff;
      padding: 12px;
      border-bottom: dotted 1px #6d6d72;
  }

  .add-under-h {
      width: 85vw;
      background-color: #fdfeff;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 16px;
      padding-bottom: 16px;
  }

  .add-input {
    margin-bottom: 16px;
    width: 67vw;
  }

  .add-div {
    margin-bottom: 16px;
    width: 67vw;
    text-align: left;
    padding: 3.5px 0;
  }

  .time-container {
    width: 67vw;
    display: flex;
    margin-bottom: 16px;
  }

  .time {
    /* width: 100px; */
    margin-right: 8px;
  }

  .time-btw {
    margin-right: 16px;
    /* padding-top: 7px; */
  }

  .ex-info {
    border: dotted 1px #6d6d72;
    width: 67vw;
    font-size: 0.8rem;
    resize: none;
    margin-bottom: 16px;
  }

  .add-btns {
    width: 67vw;
    display: flex;
    justify-content: space-between;
  }
</style>
