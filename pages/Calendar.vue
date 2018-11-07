<template>
   <!-- <no-ssr> -->
    <v-ons-page>
      <div class="container">
        <v-calendar :attributes='attrs(currentPage)' :theme-styles='themeStyles' :from-page.sync="currentPage" @dayclick="dayClick" class="calendar">
          <div
            slot='header-title'
            slot-scope='{ page }'
            >
            {{currentPage.year + '年 ' + currentPage.month + '月'}}
          </div>
            <!-- <v-ons-toolbar
            slot='header-title'
            slot-scope='{ page }'>
            <div class="left">
                
            </div>
            <div class="center">
                {{currentPage.year + '年' + currentPage.month + '月'}}
            </div>
            <div class="right">
                
            </div>
        </v-ons-toolbar> -->
        </v-calendar>
          <!-- :from-page.sync="currentPage"でカレンダーの月をattributesとシンクロさせる。 -->
          <!-- attrs(currentPage)とすることで、その月のスケジュールのみ読み込むことが可能になり、パフォーマンスが上がる。 -->
        <v-ons-modal :visible="addVisible">
          <div class="add-container">
            <div class="add-header">イベント{{ addHText }}</div>
            <div class="add-under-h">
            <div class="add-div" v-show="isROnly">{{ title }}</div>
            <v-ons-input type="text" placeholder="タイトル" class="add-input" v-model="title" v-show="!isROnly"/>
            
            <div class="add-div" v-show="isROnly">{{ dateRange }}</div>
            <v-date-picker
              v-model='selectedValue'
              mode='range'
              :input-props='{ class: "input", placeholder: "日付", readonly: true }'
              @input="datePicked"
              is-expanded
              v-show="!isROnly"
              :attributes='dPAttr'
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
            <div class="add-div" v-show="isROnly" :style="place != '' ? '' : 'color: #999'">{{ place != '' ? place : '場所（任意）'}}</div>
            <v-ons-input type="text" placeholder="場所（任意）" class="add-input" v-model="place" v-show="!isROnly"/>
            <textarea cols="30" rows="10" class="ex-info" placeholder="備考（任意、300字以内）" v-model="exInfo" :readonly="isROnly"></textarea>
            <div class="add-btns">
              <v-ons-button modifier="quiet" @click="addCancel">{{ cBText }}</v-ons-button>
              <v-ons-button @click="addSchedule">{{ addBText }}</v-ons-button>
            </div>
            </div>
          </div>
        </v-ons-modal>

        <div  
          class='selected-day'>
          <v-ons-list-title class="dateTitle" v-show="isToday">
            今日
          </v-ons-list-title>

          <v-ons-list-title class="dateTitle" v-show="!isToday&&dayClicked">
            <!-- {{ selectedDay.year }}年 -->
            {{ selectedDay.month }}月{{ selectedDay.day }}日({{ returnDay(String(selectedDay.date)) }})
          </v-ons-list-title>

          <v-ons-list-title class="dateTitle" v-show="!isToday&&!dayClicked">
            {{ eventSMonth }}月{{ eventSDate }}日({{ eventSDay }})
          </v-ons-list-title>

          <div class="diary-title" @click="diaryOfOneday != null ? showDiary() : ''">
            <v-ons-ripple light-gray></v-ons-ripple>
            <v-ons-icon icon='ion-ios-book' class="book"/>
              <span class="diary-title-text" :style="diaryOfOneday == null ? 'color: #8e8e8e' : ''">
                {{diaryOfOneday != null ? diaryOfOneday.title : '提出済みの日誌はありません'}}
              </span>
          </div>

          <v-ons-list class="eventList" v-if="dayClicked">
            <!-- リストアイテムはstateを直接読むように変更。初期表示は今日を読む。ただし、dayclickイベントを発火することはできないため、firebaseから読む方法しかないと思われる。今はv-showで非表示にしている。 -->
            <!-- 「今日」をハイライトするために、keyをtodayにしてschedule(event)に追加している。空のリストなので、表示しない。 -->
            <v-ons-list-item v-show="ordered.filter(data => data.key != 'today') != '' && attr.key != 'today'" tappable v-for='attr in ordered' :key="attr.key" @click="eventClick(attr)" class="eventLItem">
              <div class="time-title" v-if="attr.customData.time_start!='00:00' && attr.customData.time_end!='00:00'">
                <div class="time-colmn">
                  <p>{{ attr.customData.time_start }}</p>
                  <p>{{ attr.customData.time_end }}</p>
                </div>
                  <p class="event-title">{{ attr.customData.title }}</p>
              </div>
              <p v-else class="event-title-notime">{{ attr.customData.title }}</p>
            </v-ons-list-item>
            <v-ons-list-item v-show="ordered.filter(data => data.key != 'today') == ''" class="eventLItem" style="color: #8e8e8e">
              イベントはありません
            </v-ons-list-item>
          </v-ons-list>

          <!-- dayClickedは頻繁に切り替わらないので、v-ifを使用する。 -->
          <v-ons-list class="eventList" v-if="!dayClicked">
            <!-- リストアイテムはstateを直接読むように変更。初期表示は今日を読む。ただし、dayclickイベントを発火することはできないため、firebaseから読む方法しかないと思われる。 -->
            <v-ons-list-item v-if="getScheduleOfOneday != ''" tappable v-for='attr in getScheduleOfOneday' :key="attr.id" @click="eventOfOnedayClick(attr)" class="eventLItem">
              <div class="time-title" v-if="attr.time_start!='00:00' && attr.time_end!='00:00'">
                <div class="time-colmn">
                  <p>{{ attr.time_start }}</p>
                  <p>{{ attr.time_end }}</p>
                </div>
                  <p class="event-title">{{ attr.title }}</p>
              </div>
              <p v-else class="event-title-notime">{{ attr.title }}</p>
            </v-ons-list-item>
            <v-ons-list-item v-if="getScheduleOfOneday == ''" class="eventLItem" style="color: #8e8e8e">
              イベントはありません
            </v-ons-list-item>
          </v-ons-list>
        </div>


      </div>
        <v-ons-fab class="add-b" @click="addPushed">
            <v-ons-icon icon="md-plus"></v-ons-icon>
        </v-ons-fab>
    </v-ons-page>
    <!-- </no-ssr> -->
</template>

<script>
import lodash from 'lodash';//並べ替え用「 ._ 」
import DiaryDetail from './DiaryDetail';
import png from '../assets/dUsrImg.jpg';

export default {
    data() {
        return {
          currentPage: {}, //currentPageはTabBarからextends
          eventSYear: '',
          eventSMonth: '',
          eventSDate: '',
          eventSDay: '',
          diaryDate: '',
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
            header: {
              backgroundColor: '#1251c4',
              height: '44px',
              color: '#ffff',
              margin: '-0.8px -0.8px 8px -0.8px ', //余白調整。子要素であるcalendarを親要素であるpageからはみ出させる。
              padding: '0.8px 0.8px 0 0.8px'//余白調整。
            },
            headerTitle: {
              fontSize: '1.2rem'
            },
            headerArrows: {
              hight: '0',
              width: '0'
            },
            bars: {
              // width:'3px',
            }
          },
        }
    },

    mounted() {
      //起動時に本日の日誌を読み込む。
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const date = today.getDate();
        const day = [ "日", "月", "火", "水", "木", "金", "土" ][today.getDay()];
        this.diaryDate = `${year}年${month}月${date}日(${day})`;
    },

    computed: {
      dPAttr() {
        return [{
            contentStyle: {
              color: 'rgb(210, 30, 30)'
            },
            dates: new Date()
        }]
      },

      diaryOfOneday() {
        return this.$store.state.diaries.filter(diary => diary.userId == this.$store.state.uid && diary.date == this.diaryDate && diary.submit == true)[0];
      },

      getScheduleOfOneday() {
        //起動時に本日のスケジュールを表示する。ライブラリの仕様で、dayClickイベントをプログラムから発動できないため、DBから読み込む。
        let year = '';
        let month = '';
        let date = '';

        if(this.isToday) {
          const today = new Date();
          year = today.getFullYear();
          month = today.getMonth() + 1;
          date = today.getDate();
        } else {
          year = this.eventSYear;
          month = this.eventSMonth;
          date = this.eventSDate;
        }

        let listS = [];
        let listE = [];
        let list = [];

        listS = listS.concat(this.$store.state.schedule.filter(data => data.date_start == date && data.month_start == month && data.year_start == year));
        listE = listE.concat(this.$store.state.schedule.filter(data => data.date_end == date && data.month_end == month && data.year_end == year));
        list = listS.concat(listE);
        const cleanList = list.filter(function(v1,i1,a1){ 
            return (a1.findIndex(function(v2){ 
              return (v1.id===v2.id);
            }) === i1);
          });
        return _.sortBy(cleanList, item => {
            return [item.time_start];
        });
      },

      ordered(){
        return _.sortBy(this.selectedDay.attributes, item => {
            return [item.customData.time_start];
        });
      },

      attrs() {
        return(currentPage)=> {
          let events = [];
          let listS = [];
          let listE = [];

          listS = listS.concat(this.$store.state.schedule.filter(schedule => schedule.month_start == currentPage.month && schedule.year_start == currentPage.year));
          listE = listE.concat(this.$store.state.schedule.filter(schedule => schedule.month_end == currentPage.month && schedule.year_end == currentPage.year));
          events = listS.concat(listE);

          let cleanList = events.filter(function(v1,i1,a1){ 
            return (a1.findIndex(function(v2){ 
              return (v1.id===v2.id);
            }) === i1);
          });

          cleanList = cleanList.map(t => ({
            key: `todo.${t.id}`,
            bar: {backgroundColor: '#8e8e8e'},
            dates: {start: new Date(t.year_start, t.month_start - 1, t.date_start), end: new Date(t.year_end, t.month_end - 1, t.date_end)},
            customData: t,
          }));
         
          cleanList.push({
                      key: 'today',
                      contentStyle: {
                        color: 'rgb(210, 30, 30)'
                      },
                      dates: new Date(),
                      customData: {
                        //orderedにて、customDataを並べ替えのキーにしているため、からのオブジェクトを作成する。
                      }
                    });

          cleanList.push({
                      key: 'clicked',
                      highlight: {backgroundColor: 'rgb(31, 158, 120)'},
                      contentStyle: {
                        color: '#fcfcfc',
                        fontWeight: '700'
                      },
                      dates: new Date(this.selectedDay.year, this.selectedDay.month - 1, this.selectedDay.day),
                      customData: {
                        //orderedにて、customDataを並べ替えのキーにしているため、からのオブジェクトを作成する。
                      }
                    });

          return cleanList;
        }
      },

    inputState() {
      if (!this.selectedValue) {
        return {
          type: 'is-danger',
          message: 'Date required.',
        };
      }
      return {
        type: 'is-primary',
        message: '',
      };
    },

    dateRange() {
      if(!this.sYear) return '';

      if(this.sYear==this.eYear) {
          if(this.sMonth==this.eMonth) {
            if(this.sDate==this.eDate) {
              return `${this.sYear}年${this.sMonth}月${this.sDate}日(${this.sDay})`;
            } else {
              return `${this.sYear}年${this.sMonth}月${this.sDate}日(${this.sDay}) 〜 ${this.eDate}日(${this.eDay})`;
            }
          } else {
            return `${this.sYear}年${this.sMonth}月${this.sDate}日(${this.sDay}) 〜 ${this.eMonth}月${this.eDate}日(${this.eDay})`;
          }
        } else {
          return `${this.sYear}年${this.sMonth}月${this.sDate}日(${this.sDay}) 〜 ${this.eYear}年${this.eMonth}月${this.eDate}日(${this.eDay})`;
        }

    },

    returnMonth() {
      return(string) => {
        const monthT = string.substr(4, 3);
        let month = '';
        switch (monthT) {
              case 'Jan':
                month = 1;
                break;
              case 'Feb':
                month = 2;
                break;
              case 'Mar':
                month = 3;
                break;
              case 'Apr':
                month = 4;
                break;
              case 'May':
                month = 5;
                break;
              case 'Jun':
                month = 6;
                break;
              case 'Jul':
                month = 7;
                break;
              case 'Aug':
                month = 8;
                break;
              case 'Sep':
                month = 9;
                break;
              case 'Oct':
                month = 10;
                break;
              case 'Nov':
                month = 11;
                break;
              case 'Dec':
                month = 12;
                break;
              default:
                break;
            }
            return month;
          }
        },

        dateModify() {
          return(string) => {
            if(string.substr(8, 1)=='0') {
              return string.substr(9, 1);
            } else {
              return string.substr(8, 2);
            }
          }
        },

      returnDay() {
        return(string) => {
          const dayT = string.substr(0, 3);
          let day = '';
          switch (dayT) {
                case 'Sun':
                  day = '日';
                  break;
                case 'Mon':
                  day = '月';
                  break;
                case 'Tue':
                  day = '火';
                  break;
                case 'Wed':
                  day = '水';
                  break;
                case 'Thu':
                  day = '木';
                  break;
                case 'Fri':
                  day = '金';
                  break;
                case 'Sat':
                  day = '土';
                  break;
                default:
                  break;
              }
            return day;
          }
        },

        addHText() {
          if (this.isDetail) {
            return '詳細';
          }
          else if(this.isEdit) {
            return '編集';
          } else {
            return '登録';
          }
        },

        addBText() {
          if (this.isDetail) {
            return '編集する';
          }
          else if(this.isEdit) {
            return '保存';
          } else {
            return '登録';
          }
        },

        cBText() {
          if (this.isDetail) {
            return '閉じる';
          } else {
            return 'キャンセル';
          }
        }
    },

    methods: {
      dayClick(data) {
        this.dayClicked = true;
        this.selectedDay = data;
        this.isToday = data.isToday;
        this.diaryDate = `${data.year}年${data.month}月${data.day}日(${this.returnDay(String(data.date))})`;
      },

      addPushed() {
        this.addVisible = true;
        this.isROnly = false;
        this.isDetail = false;
        this.isEdit = false;
        this.sTime = '00:00';
        this.eTime = '00:00';
      },

      addCancel() {
        this.addVisible = false;
        this.dRPicked = false;
        this.isROnly = false;
        this.editId = '';
        this.title = '';
        this.sTime = '';
        this.place = '';
        this.eTime = '';
        this.sYear = '';
        this.sMonth = '';
        this.sDate = '';
        this.sDay = '';
        this.eYear = '';
        this.eMonth = '';
        this.eDate = '';
        this.eDay = '';
        this.exInfo = '';
        this.selectedValue = null;
      },

      datePicked() {
        this.start = String(this.selectedValue.start);
        this.end = String(this.selectedValue.end);
      
        this.sYear = this.start.substr(11, 4);
        this.sMonth = this.returnMonth(this.start);
        this.sDate = this.dateModify(this.start);
        this.sDay = this.returnDay(this.start);

        // if(this.start!=this.end) {
          this.eYear = this.end.substr(11, 4);
          this.eMonth = this.returnMonth(this.end);
          this.eDate = this.dateModify(this.end);
          this.eDay = this.returnDay(this.end);

          this.dRPicked = true;
        // }
      },

      showDiary() {
        this.$store.dispatch('showDetail', {
                                            data: this.$store.state.diaries.filter(diary => diary.userId == this.$store.state.uid && diary.date == this.diaryDate && diary.submit == true)[0],
                                            page: DiaryDetail
                                            });
      },

      eventClick(attr) {
          this.addVisible = true;
          this.isDetail = true;
          this.isROnly = true;
          
          this.editId = attr.customData.id;
          this.title  = attr.customData.title;
          this.place  = attr.customData.place;

          this.sYear  = attr.customData.year_start;
          this.sMonth = attr.customData.month_start;
          this.sDate  = attr.customData.date_start;
          this.sDay   = this.returnDay(String(attr.dates[0].start));
          this.eYear  = attr.customData.year_end;
          this.eMonth = attr.customData.month_end;
          this.eDate  = attr.customData.date_end;
          this.eDay   = this.returnDay(String(attr.dates[0].end));

          this.sTime = attr.customData.time_start;
          this.eTime = attr.customData.time_end;
          this.exInfo = attr.customData.ex_info;

      },

      eventOfOnedayClick(attr) {
          let day = '';
          if(this.isToday) {
            day = [ "日", "月", "火", "水", "木", "金", "土" ][new Date().getDay()];
          }
          
          this.addVisible = true;
          this.isDetail = true;
          this.isROnly = true;
          
          this.editId = attr.id;
          this.title  = attr.title;
          this.place  = attr.place;

          this.sYear  = attr.year_start;
          this.sMonth = attr.month_start;
          this.sDate  = attr.date_start;
          this.sDay   = day != '' ? day : this.eventSDay;
          this.eYear  = attr.year_end;
          this.eMonth = attr.month_end;
          this.eDate  = attr.date_end;
          this.eDay   = day != '' ? day : this.eventEDay;

          this.sTime = attr.time_start;
          this.eTime = attr.time_end;
          this.exInfo = attr.ex_info;

      },

    addSchedule() {
          if(this.addBText=='編集する') {
            this.isDetail = false;
            this.isEdit = true;
            this.isROnly = false;
            return;
          }

          if(!this.title) {
            this.$ons.notification.alert('タイトルを入力ください。', {title:''});
            return;
          }
          if(!this.sYear) {
            this.$ons.notification.alert('日付を入力ください。', {title:''})
            return;
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
                                                exInfo: this.exInfo});
          
          if (!navigator.onLine) {
              if(this.addBText=='登録') {
                this.$ons.notification.alert({messageHTML:'オンラインになると登録されます。<br>オンラインになる前に画面を更新すると登録されません。', title:''});
              } else if(this.addBText=='保存') {
                this.$ons.notification.alert({messageHTML:'オンラインになると保存されます。<br>オンラインになる前に画面を更新すると保存されません。', title:''});
                this.editId = '';
              }
          } else {
            if(this.addBText=='登録') {
              this.$ons.notification.alert('登録しました。', {title:''});
            } else if(this.addBText=='保存') {
              this.$ons.notification.alert('保存しました。', {title:''});
              this.editId = '';
            }
          }
          this.addVisible = false;
          this.dayClicked = false;
          this.eventSYear = this.sYear;
          this.eventSMonth = this.sMonth;
          this.eventSDate = this.sDate;
          this.eventSDay = this.sDay;
          // this.eventEYear = this.eYear;
          // this.eventEMonth = this.eMonth;
          // this.eventEDate = this.eDate;
          // this.eventEDay = this.eDay;
          this.diaryDate = `${this.eventSYear}年${this.eventSMonth}月${this.eventSDate}日(${this.eventSDay})`;
          this.title = '';
          this.sTime = '';
          this.place = '';
          this.eTime = '';
          this.sYear = '';
          this.sMonth = '';
          this.sDate = '';
          this.sDay = '';
          this.eYear = '';
          this.eMonth = '';
          this.eDate = '';
          this.eDay = '';
          this.exInfo = '';
          this.selectedValue = null;
          this.dRPicked = false;

          const today = new Date();
          const todayYear = today.getFullYear();
          const todayMonth = today.getMonth() + 1;
          const todayDate = today.getDate();
          if(this.eventSYear == todayYear && this.eventSMonth == todayMonth && this.eventSDate == todayDate) {
            this.isToday = true;
          } else {
            this.isToday = false;
          }
      }
	  }
}
</script>

<style scoped>

  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: calc(100vh - 49px);
  }

  .calendar {
    width: 100vw;
    height: 340px;
  }

  .dateTitle {
    font-size: 1rem;
    background-color: #dededf;
    width: 100%;
    display: flex;
    align-items: center;
    padding-left: 8px;
    height: 28px;
  }

  .diary-title {
    border: solid 1px #f4f4f7;
    height: 40px;
    width: 100vw;
  }

  .book {
    color: #e98811;
    border: solid 2px #f0ab57;
    font-size: 1.5rem;
    padding: 1px 4px;
    margin: 3.5px 8px 2px 8px;
  }

  .diary-title-text {
    color: #575757;
    font-size: 0.9rem;
    position: relative;
    top: 1px;
  }

  .eventList {
    overflow: auto;
    font-size: 0.85rem;
    width: 100vw;
    /* height: 39vh; */
    height: calc((100vh - 49px) - (340px + 28px + 40px));
  }

  .eventLItem {
    overflow: auto;
    white-space: nowrap;
    font-size: 0.8rem;
    height: 48px;
    color: #575757;
    background-size: 100% 1px;
    background-repeat: no-repeat;
    background-position: bottom;
    background-image: linear-gradient(0deg, #ccc, #ccc 50%, transparent 50%);
  }

  .time-title {
    display: flex;
  }

  .time-column {
    display: flex;
    flex-direction: column;
    margin-right: 8px;
  }

  .event-title {
    margin-left: 16px;
    font-size: 1rem;
    display: flex;
    align-items: center;
  }
  
  .event-title-notime {
    font-size: 1rem;
    display: flex;
    align-items: center;
  }
  
  .add-b {
    background-color: #ffbd00;
    color: #fffefe;
    margin-left: 79%;
    position: fixed;
    bottom: 6%;
    /* left: 79%; */
    /* z-index: 100; */
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
    margin-right: 8px;
  }

  .time-btw {
    margin-right: 16px;
  }

  .ex-info {
    border: dotted 1px #6d6d72;
    width: 67vw;
    font-size: 0.9rem;
    resize: none;
    border: none;
    margin-bottom: 16px;
  }

  .add-btns {
    width: 67vw;
    display: flex;
    justify-content: space-between;
  }
</style>

