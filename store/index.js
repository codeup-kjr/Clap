import firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';
import { firebaseMutations, firebaseAction } from 'vuexfire';

if (!firebase.apps.length) {
    firebase.initializeApp(JSON.parse(process.env.FIREBASE_KEY));
}

const db = firebase.firestore()
const settings = {timestampsInSnapshots: true};
db.settings(settings);

 export const state = () => {
    return {
        scheduleOfToday: [],
        diaryData: {},
        commentData: [],
        replyData: [],
        diaries: [],
        scheduleAddErr: '',
        schTIdErr: '',
        schTIdConfirmed: false,
        confirmed: false,
        sentFlg: false,
        //エラーメッセージ(未登録メール警告)表示調整のため、初期値をtrueに。
        emailFlg: true,
        uRErr: '',
        myData: {},
            //チャット検証用
            // players: [],
            //チャット検証用
        // myRoom: [],
        // groupList: [],
        usersData: [],
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
        // chatTabBarIndex: 0
    };
};

// stateを参照した定義ができないため、action内などで記述する。
export const teamRef = db.collection('team');
export const userRef = db.collection('users');
// export const roomRef = db.collection('room')
export const diaryRef = db.collection('diary');

export const mutations = {

    ...firebaseMutations,

    push(state, page) {
        state.pageStack.push(page);
    },

    pop(state) {
        if (state.pageStack.length > 1) {
            state.pageStack.pop();
          }
    },

    clear(state) {
        state.pageStack = [];
    },

    tabBarSet(state, index) {
        state.tabBarIndex = index;
    },

    // chatTabBarSet(state, index) {
    //     state.chatTabBarIndex = index
    // },

    setTeamId(state, teamId) {
        state.teamId = teamId;
    },

    setUid(state, uid) {
        state.uid = uid;
    },

    setSchTeamId(state, data) {
        state.schTeamId = data;
    },

    setLoginErrMsg(state, msg) {
        state.loginErrMsg = msg;
    },

    setUsersData(state, data) {
        state.usersData = data;
    },

    // setGroupList(state, data) {
    //     state.groupList = data
    // },

    setURErr(state, txt) {
        state.uRErr = txt;
    },

    setEmailFlg(state, bool) {
        state.emailFlg = bool;
    },

    setSentFlg(state, bool) {
        state.sentFlg = bool;
    },

    setConfirmed(state, bool) {
        state.confirmed = bool;
    },

    setSchTIdErr(state, text) {
        state.schTIdErr = text;
    },

    setSchTIdConfirmed(state, bool) {
        state.schTIdConfirmed = bool;
    },

    setScheduleOfToday(state, data) {
        state.scheduleOfToday = data;
    }

  }

export const actions = {
    //チャット検証用
    bindPlayers: firebaseAction(async ({bindFirebaseRef, state}) => {
        await bindFirebaseRef('players', userRef.where("role", "==", "選手"));
    }),
    //チャット検証用

    bindTeam: firebaseAction(async ({bindFirebaseRef, state}) => {
        await bindFirebaseRef('team', teamRef.doc(String(state.teamId)));
    }),

    bindSchedule: firebaseAction(async ({bindFirebaseRef, state}) => {
        await bindFirebaseRef('schedule', teamRef.doc(String(state.teamId)).collection('schedule'));
    }),

    bindTeamU: firebaseAction(async ({bindFirebaseRef, state}) => {
        await bindFirebaseRef('teamU', teamRef.doc(String(state.teamId)).collection('users'));
    }),

    // bindMyRoom: firebaseAction(async ({bindFirebaseRef, state}) => {
    //     await bindFirebaseRef('myRoom', userRef.doc(String(state.uid)).collection('rooms'))
    //   }),

    bindMyData: firebaseAction(async ({bindFirebaseRef, state}) => {
        await bindFirebaseRef('myData', userRef.doc(String(state.uid)));
    }),

    bindDiaries: firebaseAction(async ({bindFirebaseRef, state}) => {
        await bindFirebaseRef('diaries', diaryRef.doc(String(state.teamId)).collection('diaries').orderBy('update_at', 'desc'));
    }),

    bindDiaryData: firebaseAction(async ({bindFirebaseRef, state}, {id}) => {
        await bindFirebaseRef('diaryData', diaryRef.doc(String(state.teamId)).collection('diaries').doc(String(id)));
    }),

    bindCommentData: firebaseAction(async ({bindFirebaseRef, state}, {id}) => {
        await bindFirebaseRef('commentData', diaryRef.doc(String(state.teamId)).collection('diaries').doc(String(id)).collection('comment').orderBy('input_at', 'desc'));
    }),

    bindReplyData: firebaseAction(async ({bindFirebaseRef, state}, {id}) => {
        await bindFirebaseRef('replyData', diaryRef.doc(String(state.teamId)).collection('diaries').doc(String(id)).collection('reply').orderBy('commentId').orderBy('input_at'));
    }),


    unBindTeam: firebaseAction(async ({unbindFirebaseRef}) => {
        await unbindFirebaseRef('team');
    }),
  
    unBindSchedule: firebaseAction(async ({unbindFirebaseRef}) => {
        await unbindFirebaseRef('schedule');
    }),
  
    unBindTeamU: firebaseAction(async ({unbindFirebaseRef}) => {
        await unbindFirebaseRef('teamU');
    }),

    // unBindMyRoom: firebaseAction(async ({unbindFirebaseRef}) => {
    //     await unbindFirebaseRef('myRoom')
    //   }),

    unBindMyData: firebaseAction(async ({unbindFirebaseRef}) => {
        await unbindFirebaseRef('myData');
    }),

    unBindDiaries: firebaseAction(async ({unbindFirebaseRef}) => {
        await unbindFirebaseRef('diaries');
    }),

    unBindDiaryData: firebaseAction(async ({unbindFirebaseRef}) => {
        await unbindFirebaseRef('diaryData');
    }),

    unBindCommentData: firebaseAction(async ({unbindFirebaseRef}) => {
        await unbindFirebaseRef('commentData');
    }),

    unBindReplyData: firebaseAction(async ({unbindFirebaseRef}) => {
        await unbindFirebaseRef('replyData');
    }),


    teamRegist: firebaseAction(({context, state}, {name, type, event}) => {
        teamRef.doc(String(state.teamId)).set({
          name: name,
          type: type,
          event: event
        });
      }),

    userRegist: firebaseAction(async({context, state, commit, dispatch}, {name, mail, pass, role, grade}) => {
        await firebase.auth().createUserWithEmailAndPassword(mail, pass).catch(function(error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage);
            //メールアドレスが使われているかどうか
            if(errorMessage == 'The email address is already in use by another account.') {
                commit('setURErr', 'そのメールアドレスは使われています');
            } else {
                commit('setURErr', 'ネットワークの問題が発生しました。');
            }
          })

          if(state.uRErr) {
              return;
            }

            //LoginCheck.vueのcheckLoginにより、create後にstate.uidがセットされる。
            let batch = db.batch()
            batch.set(teamRef.doc(String(state.teamId)).collection('users').doc(String(state.uid)), {
                userId: state.uid,
                regist: true
            });
            batch.set(userRef.doc(String(state.uid)), {
                id: state.uid,
                name: name,
                role: role,
                grade: Number(grade),
                clap: 3,
                email: mail,
                input_at: firebase.firestore.FieldValue.serverTimestamp(),
                updated_at: firebase.firestore.FieldValue.serverTimestamp()
            });
            batch.set(userRef.doc(String(state.uid)).collection('teams').doc(String(state.teamId)), {
                teamId: state.teamId,
                regist: true
            });
            //batchはオフラインでも実行でき、オンラインになった瞬間にDB操作されるため、エラーが起きない。
            await batch.commit();

            dispatch('bindMyData');
      }),

    searchTeamId: firebaseAction(({context, commit}, {teamId}) => {
        teamRef.doc(String(teamId)).get().then(function(doc) {
            if (doc.exists) {
                commit('setSchTeamId', doc.data());
                commit('setSchTIdConfirmed', true);
                commit('setSchTIdErr', '');
            } else {
                console.log("No such document!");
                commit('setSchTIdErr', 'そのIDは登録されていません。<br>正しいチームIDを入力ください。');
                commit('setSchTIdConfirmed', false);
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
            commit('setSchTIdErr', 'ネットワークの問題が発生しました。');
        });
    }),

    deleteTeam: firebaseAction(({context, commit}, {teamId}) => {
        teamRef.doc(String(teamId)).delete().then(function() {
            console.log("Document successfully deleted!");
            commit('setTeamId', '');
        }).catch(function(error) {
            console.error("Error removing document: ", error);
        });
    }),


    login: firebaseAction(async({context, commit}, {mail, pass}) => {
        commit('setLoginErrMsg', '');
        await firebase.auth().signInWithEmailAndPassword(mail, pass).catch(function(error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage);
            commit('setLoginErrMsg', errorMessage);
            return;
          });
        
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                commit('setUid', user.uid);
            }
          });
    }),

    logout: firebaseAction(({context}) => {       
        firebase.auth().signOut().then(function(){
            location.reload();
            }).catch(function(error) {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorMessage);
            });   
    }),

    getTeamByUid: firebaseAction(({context, state, commit, dispatch}, {page}) => {
        userRef.doc(String(state.uid)).collection('teams').where("regist", "==", true)
            .get().then(function(querySnapshot) {
                querySnapshot.forEach(async function(doc) {
                    if (doc.exists) {
                            await commit('setTeamId', doc.data().teamId);
                            dispatch('bindSchedule');
                            dispatch('bindTeam');
                            const getU = dispatch('getUser');
                            const bindD = dispatch('bindDiaries');
                            await Promise.all([getU, bindD]);
                            commit('clear');
                            commit('push', page);
                    } else {
                        console.log("No such document!");
                    }
                })
        }).catch(function(error) {
            console.log("Error getting document:", error);
        })
    }),

    checkLogin: firebaseAction(({context, commit, dispatch}, {page1, page2}) => {
        let uid = '';
        let currentPage = {};
        firebase.auth().onAuthStateChanged(async function(user) {
                if (user) {
                    uid = user.uid;
                    await commit('setUid', uid);
                    dispatch('bindMyData');
                    dispatch('getTeamByUid', {page: page2});
                } else {
                    commit('clear');
                    commit('push', page1);
                }
        })
    }),

    scheduleAdd: firebaseAction(({context, state}, {id, title, place, sYear, sMonth, sDate, eYear, eMonth, eDate, sTime, eTime, exInfo}) => {
        teamRef.doc(String(state.teamId)).collection('schedule').doc(String(id)).set({
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
        }).catch(function(error) {
            console.log("Error writing document: ", error);
        })
      }),

    getUser: firebaseAction(async({context, state, commit, dispatch}) => {
        await dispatch('bindTeamU');
        let flg = false;
        let usersData = [];
        const l = state.teamU.length;
        let getUd;
        for(let i=0; i<l; i++) {
            getUd = userRef.doc(String(state.teamU[i].id)).get().then(function(doc) {
                    if (doc.exists) {
                        flg = true;
                        usersData.push(doc.data());
                    } else {
                        console.log("No such document!");
                    }
                }).catch(function(error) {
                    console.log("Error getting document:", error);
                })
        }
        await Promise.all([getUd]);
        //async awaitを使用して、この関数内の処理を同期的に処理する。そのためにflgとusersDataを定義した。
        flg = true ? commit('setUsersData', usersData) : '';
      }),

    updateUser: firebaseAction(async ({context, state}, {name, role, grade, img}) => {
        if(img) {
            let imgSrc = '';
            const ref = firebase.storage().ref(state.uid);
            await ref.put(img);
            await ref.getDownloadURL().then(function(url){imgSrc = url})
            userRef.doc(String(state.uid)).update({
                name: name,
                role: role,
                grade: Number(grade),
                image: imgSrc,
                updated_at: firebase.firestore.FieldValue.serverTimestamp()
            }).catch(function(error) {
                console.error("Error updating document: ", error)
            });
        } else {
            userRef.doc(String(state.uid)).update({
                name: name,
                role: role,
                grade: Number(grade),
                updated_at: firebase.firestore.FieldValue.serverTimestamp()
            }).catch(function(error) {
                console.error("Error updating document: ", error)
            });
        }
    }),

    searchEmail: firebaseAction(async ({context, state, commit, dispatch}, {email}) => {
        //エラーメッセージ(未登録メール警告)表示調整用
        let flg = false;
        commit('setSentFlg', false);
        await userRef.where("email", "==", email).get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                flg = true;
                commit('setEmailFlg', true);
                dispatch('sendPasswordReset', {email: email});
            });
        });
        //querySnapshotはerrorを返すことができない。
            if(!flg) {
                commit('setEmailFlg', false);
            }
            commit('setConfirmed', true);
    }),

    sendPasswordReset: firebaseAction(({context, commit}, {email}) => {
        firebase.auth().sendPasswordResetEmail(email).then(function() {
            commit('setSentFlg', true);
            console.log('Successfully Sent.');
          }).catch(function(error) {
                commit('setSentFlg', false);
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorMessage);
            })
    }),
    
    diaryAdd: firebaseAction(async({context, state}, {id, submit, date, title, content1, content2, content3, content4, content5, edit}) => {
            const now = new Date();
            const h = String(now.getHours());
            let m = String(now.getMinutes());
            if(m.length==1) {
                m = String('0' + m);
            }

            if(edit) {
                diaryRef.doc(String(state.teamId)).collection('diaries').doc(String(id)).update({
                    submit:         submit,
                    hcChecked:      false,
                    commentCount:   0,
                    date:           date,
                    time:           `${h}:${m}`,
                    title:          title,
                    content1:       content1,
                    content2:       content2,
                    content3:       content3,
                    content4:       content4,
                    content5:       content5,
                    update_at:      firebase.firestore.FieldValue.serverTimestamp()
                }).catch(function(error) {
                    console.log("Error writing document: ", error);
                });
            } else {
                diaryRef.doc(String(state.teamId)).collection('diaries').doc(String(id)).set({
                    id:             id,
                    userId:         state.uid,
                    submit:         submit,
                    hcChecked:      false,
                    commentCount:   0,
                    date:           date,
                    time:           `${h}:${m}`,
                    title:          title,
                    content1:       content1,
                    content2:       content2,
                    content3:       content3,
                    content4:       content4,
                    content5:       content5,
                    input_at:       firebase.firestore.FieldValue.serverTimestamp(),
                    update_at:      firebase.firestore.FieldValue.serverTimestamp()
                }).catch(function(error) {
                    console.log("Error writing document: ", error);
                });
            }
    }),

    showDetail : firebaseAction(async({context, commit, dispatch}, {data, page}) => {
        dispatch('bindDiaryData', {id: data.id});
        dispatch('bindCommentData', {id: data.id});
        // replyはコメントと異なり、lazyrepeat内のmapで処理しているため、awaitする必要がある。
        await dispatch('bindReplyData', {id: data.id});
        commit('push', {extends: page,
            data() {return {
                        answers: {
                            q1:     data.content1,
                            q2:     data.content2,
                            q3:     data.content3,
                            q4:     data.content4,
                            q5:     data.content5,
                            title:  data.title
                        },
                        id: data.id,
                        date: data.date,
                        userId: data.userId
            }},
            onsNavigatorOptions: {
                animation: 'lift',
                animationOptions: { duration: 0.5 }
        }});
    }),

    diaryCommentAdd: firebaseAction(({context, state}, {id, text}) => {
        diaryRef.doc(String(state.teamId)).collection('diaries').doc(String(state.diaryData.id)).collection('comment').doc(String(id)).set({
            id:         id,
            text:       text,
            userId:     state.uid,
            edited:     false,
            input_at:   firebase.firestore.FieldValue.serverTimestamp(),
            update_at:  firebase.firestore.FieldValue.serverTimestamp()
        }).catch(function(error) {
            console.log("Error writing document: ", error);
        });
    }),

    diaryCommentUpdate: firebaseAction(({context, state}, {id, text}) => {
        diaryRef.doc(String(state.teamId)).collection('diaries').doc(String(state.diaryData.id)).collection('comment').doc(String(id)).update({
            text:       text,
            edited: true,
            update_at:  firebase.firestore.FieldValue.serverTimestamp()
        }).catch(function(error) {
            console.log("Error writing document: ", error);
        });
    }),

    diaryReplyAdd: firebaseAction(({context, state}, {id, commentId, text}) => {
        diaryRef.doc(String(state.teamId)).collection('diaries').doc(String(state.diaryData.id)).collection('reply').doc(String(id)).set({
            id:         id,
            commentId:  commentId,
            text:       text,
            userId:     state.uid,
            edited:     false,
            input_at:   firebase.firestore.FieldValue.serverTimestamp(),
            update_at:  firebase.firestore.FieldValue.serverTimestamp()
        }).catch(function(error) {
            console.log("Error writing document: ", error);
        });
    }),
    
    diaryReplyUpdate: firebaseAction(({context, state}, {id, text}) => {
        diaryRef.doc(String(state.teamId)).collection('diaries').doc(String(state.diaryData.id)).collection('reply').doc(String(id)).update({
            text:       text,
            edited:     true,
            update_at:  firebase.firestore.FieldValue.serverTimestamp()
        }).catch(function(error) {
            console.log("Error writing document: ", error);
        });
    }),
  }