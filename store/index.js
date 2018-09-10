import firebase from 'firebase';
import 'firebase/firestore'
import { firebaseMutations, firebaseAction } from 'vuexfire'

if (!firebase.apps.length) {
    firebase.initializeApp(JSON.parse(process.env.FIREBASE_KEY));
}

const db = firebase.firestore();
const settings = {/* your settings... */ timestampsInSnapshots: true};
db.settings(settings);

// const teamRef = db.collection('team')
// teamIdが必要だが、stateのexportの前に定義することはできないので、actions内で定義する。
// const scheduleRef = teamRef.collection('schedule')
// const teamURef = teamRef.collection('users')

 export const state = () => {
    return {
        userData: {},
        loginErrMsg: '', //ログイン試行時のエラーメッセージ結果格納用
        schTeamId: '', //チームに参加の時のteamIdによるチーム存在調査結果格納用
        uid: '',//authのuid格納用
        teamId: '',
        team: [],
        schedule: [],
        teamU: [],
        pageStack: [],
        types: [
            {text: '高校'},
            {text: '大学'},
            {text: '社会人'},
            {text: '中学'},
        ],
        events: [
            {text: '野球'},
            {text: 'サッカー'},
            {text: 'ラグビー'},
            {text: 'バレーボール'},
            {text: 'バスケットボール'},
            {text: '水泳'},

        ],
        role: [
            {text: '選手'},
            {text: 'マネジャー'},
            {text: '監督'},
            {text: '部長'},
            {text: 'スタッフ'},
        ],
        tabBarIndex: 0,
        chatTabBarIndex: 0
    }
};

// stateを参照した定義ができないため、action内などで記述する。
export const teamRef = db.collection('team')
// export const teamRef = db.collection('team').doc(String(state.teamId))
// export const scheduleRef = teamRef.doc(String(state.teamId)).collection('schedule')
// export const teamURef = teamRef.doc(String(state.teamId)).collection('users')
export const userRef = db.collection('users')

export const mutations = {

    ...firebaseMutations,

    push(state, page) {
        state.pageStack.push(page)
    },

    pop(state) {
        if (state.pageStack.length > 1) {
            state.pageStack.pop()
          }
    },

    clear(state) {
        state.pageStack = []
    },

    tabBarSet(state, index) {
        state.tabBarIndex = index
    },

    chatTabBarSet(state, index) {
        state.chatTabBarIndex = index
    },

    setTeamId(state, teamId) {
        state.teamId = teamId
    },

    setUid(state, uid) {
        state.uid = uid
    },

    setSchTeamId(state, data) {
        state.schTeamId = data
    },

    setLoginErrMsg(state, msg) {
        state.loginErrMsg = msg
    },

    setUserData(state, data) {
        state.userData = data
    },

  }

export const actions = {
    bindTeam: firebaseAction(async ({bindFirebaseRef, state}) => {
        // await console.log(state.teamId)
        await bindFirebaseRef('team', teamRef.doc(String(state.teamId)))
        // await console.log(state.team)
    }),

    bindSchedule: firebaseAction(async ({bindFirebaseRef, state}) => {
        await bindFirebaseRef('schedule', teamRef.doc(String(state.teamId)).collection('schedule'))
    }),

    bindTeamU: firebaseAction(async ({bindFirebaseRef, state}) => {
        await bindFirebaseRef('teamU', teamRef.doc(String(state.teamId)).collection('users'))
    }),

    unBindTeam: firebaseAction(async ({unbindFirebaseRef}) => {
        await unbindFirebaseRef('team')
    }),
  
    unBindSchedule: firebaseAction(async ({unbindFirebaseRef}) => {
        await unbindFirebaseRef('schedule')
    }),
  
    unBindTeamU: firebaseAction(async ({unbindFirebaseRef}) => {
      await unbindFirebaseRef('teamU')
    }),


    teamRegist: firebaseAction(({context, state}, {name, type, event}) => {
        teamRef.doc(String(state.teamId)).set({
          name: name,
          type: type,
          event: event
        })
      }),

    userRegist: firebaseAction(async({context, state, commit}, {name, mail, pass, role, grade}) => {
        await firebase.auth().createUserWithEmailAndPassword(mail, pass).catch(function(error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage)
          })

        await firebase.auth().signInWithEmailAndPassword(mail, pass).catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorMessage)
          });
        
        await firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
              commit('setUid', user.uid)
            }
          });

        await teamRef.doc(String(state.teamId)).collection('users').doc(String(state.uid)).set({
            userId: state.uid,
            regist: true
        })

        await userRef.doc(String(state.uid)).set({
            id: state.uid,
            name: name,
            role: role,
            grade: Number(grade),
            clap: 3,
            input_at: firebase.firestore.FieldValue.serverTimestamp(),
            updated_at: firebase.firestore.FieldValue.serverTimestamp()
        })

        await userRef.doc(String(state.uid)).collection('teams').doc(String(state.teamId)).set({
            regist: true
        })
      }),

      searchTeamId: firebaseAction(async({context, state, commit}, {teamId}) => {
        let flg = false
        let docData = ''
        await teamRef.doc(String(teamId)).get().then(function(doc) {
            if (doc.exists) {
                flg = true
                docData = doc.data()
            } else {
                console.log("No such document!");
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
        //async awaitを使用して、この関数内の処理を同期的に処理する。そのためにflgとdocDataを定義した。
        await (flg = true ? commit('setSchTeamId', docData) : '')
      }),

      deleteTeam: firebaseAction(async({context, state, commit}, {teamId}) => {
        let flg = false
        await teamRef.doc(String(teamId)).delete().then(function() {
            console.log("Document successfully deleted!");
            flg = true
        }).catch(function(error) {
            console.error("Error removing document: ", error);
        });
        await (flg = true ? commit('setTeamId', '') : '')
      }),


      login: firebaseAction(async({context, state, commit}, {mail, pass}) => {
        //signOut()は、ログアウトと初期表示の調整(ログイン状態ならTabBarへ遷移)が済めば不要なので、削除すること。
        await firebase.auth().signOut().catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorMessage)
            return
          })

        await firebase.auth().signInWithEmailAndPassword(mail, pass).catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorMessage)
            commit('setLoginErrMsg', errorMessage)
            return
          })
        
        await firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                commit('setLoginErrMsg', '')
                commit('setUid', user.uid)
            }
          })
    }),

    getTeamByUid: firebaseAction(({context, state, commit, dispatch}) => {
        userRef.doc(String(state.uid)).collection('teams').where("regist", "==", true)
            .get().then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    if (doc.exists) {
                        commit('setTeamId', doc.data().teamId)
                        dispatch('bindTeam')
                        dispatch('bindSchedule')
                        dispatch('bindTeamU')
                    } else {
                        console.log("No such document!");
                    }
                })
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
    }),

    checkLogin: firebaseAction(async({context, state, commit, dispatch}, {page}) => {
        let uid = ''
        let flg = false
        await firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                flg = true
                uid = user.uid
                commit('setUid', uid)
                dispatch('getTeamByUid')
                commit('push', page)
            }
        })
        // await (flg = true ? commit('setUid', uid) : '')
        // await (flg = true ? console.log(uid) : '')
        // await (flg = true ? dispatch('getTeamByUid') : '')
        // await dispatch('bindTeam')
    }),

    scheduleAdd: firebaseAction(async({context, state}, {id, title, place, sYear, sMonth, sDate, eYear, eMonth, eDate, sTime, eTime, exInfo}) => {
        await teamRef.doc(String(state.teamId)).collection('schedule').doc(String(id)).set({
            id: id,
            title: title,
            place: place,
            year_start: sYear,
            month_start: sMonth,
            date_start: sDate,
            year_end: eYear,
            month_end: eMonth,
            date_end: eDate,
            time_start: sTime,
            time_end: eTime,
            ex_info: exInfo
        })
      }),

      getUser: firebaseAction(async({context, state, commit}, {id}) => {
        let flg = false
        let docData = ''
        await userRef.doc(String(id)).get().then(function(doc) {
            if (doc.exists) {
                flg = true
                docData = doc.data()
            } else {
                console.log("No such document!");
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
        //async awaitを使用して、この関数内の処理を同期的に処理する。そのためにflgとdocDataを定義した。
        await (flg = true ? commit('setUserData', docData) : '')
      }),
  }