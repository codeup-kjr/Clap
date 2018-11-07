<template>
   <!-- <no-ssr> -->
    <v-ons-page>
        <v-ons-toolbar>
            <div class="left" @click="close">
                <v-ons-icon icon='ion-android-close' class="close-icon"/>
            </div>
            <div class="center">
                下書き
            </div>
            <div class="right">
            </div>
        </v-ons-toolbar>

        <div v-for="draft in drafts" :key="draft.id" class="diary-wrap">
            <div class="header">
                <div class="title-date">
                    <div class="diary-title">{{draft.title=='' ? 'タイトルなし' : draft.title}}</div>
                    <div class="diary-date">{{draft.date}} {{draft.time}}</div>
                </div>
                <div class="actions">
                    <div class="icon-text edit" @click="editDraft(draft)">
                        <v-ons-icon icon="fa-pencil" class="pen"></v-ons-icon>
                        <div class="text">編集</div>
                    </div>
                    <div class="icon-text" @click="deleteDraft(draft.id)">
                        <v-ons-icon icon="ion-ios-trash-outline" class="trash"></v-ons-icon>
                        <div class="text">削除</div>
                    </div>
                </div>
            </div>
            <div class="diary-contents">
                    <div class="qTitle" v-html="'1. ' + questions.q1"></div>
                    <div class="qAnswer" v-html="draft.content1"></div>
                    <div class="qTitle" v-html="'2. ' + questions.q2"></div>
                    <div class="qAnswer" v-html="draft.content2"></div>
                    <div class="qTitle" v-html="'3. ' + questions.q3"></div>
                    <div class="qAnswer" v-html="draft.content3"></div>
                    <div class="qTitle" v-html="'4. ' + questions.q4"></div>
                    <div class="qAnswer" v-html="draft.content4"></div>
                    <div class="qTitle" v-html="'5. ' + questions.q5"></div>
                    <div class="qAnswer" v-html="draft.content5"></div>
            </div>
        </div>
    </v-ons-page>
    <!-- </no-ssr> -->
</template>

<script>
let unwatch;
import Vue from 'vue';
import DiaryWrite from './DiaryWrite';
export default {
    
    data() {
        return {
            questions: this.$store.state.questions
        }
    },

    computed: {
        drafts() {
            return this.$store.state.diaries.filter(diary => diary.userId == this.$store.state.uid && diary.submit == false);
        },

        displayTime() {
            return(time) => {
                if(!time) {
                    //自身の画面からの登録直後はnullになるため。
                    return 'たった今';
                }
                const timestamp = time.seconds * 1000;
                const date = new Date(timestamp);
                const diff = new Date().getTime() - date.getTime()
                const d = new Date(diff);

                if (d.getUTCFullYear() - 1970) {
                    return d.getUTCFullYear() - 1970 + '年前';
                } else if (d.getUTCMonth()) {
                    return d.getUTCMonth() + 'ヶ月前';
                } else if (d.getUTCDate() - 1) {
                    return d.getUTCDate() - 1 + '日前';
                } else if (d.getUTCHours()) {
                    return d.getUTCHours() + '時間前';
                } else if (d.getUTCMinutes()) {
                    return d.getUTCMinutes() + '分前';
                } else {
                    return 'たった今';
                    // return d.getUTCSeconds() + '秒前'
                }
            }
        }
    },

    methods: {
        close() {
            this.$store.commit('pop');
        },

        editDraft(data) {
            this.$store.commit('pop');
            this.$store.commit('pop');
            this.$store.commit('push', {extends: DiaryWrite,
                    data() {return {
                                answers: {
                                    q1: data.content1,
                                    q2: data.content2,
                                    q3: data.content3,
                                    q4: data.content4,
                                    q5: data.content5,
                                    title: data.title
                                },
                                id: data.id,
                                editDate: data.date
                            };
                    },
                    onsNavigatorOptions: {
                        animation: 'lift',
                        animationOptions: { duration: 0.5 }
                        }
            });
        },

        deleteDraft(id) {
            const vm = this;
            this.$ons.notification.confirm({messageHTML:'削除します。よろしいですか。',
                                                title:'',
                                                callback: function(idx) {
                                                                if (idx == 0) {
                                                                    return;
                                                                } else {
                                                                    vm.$store.dispatch('deleteDiary', {id: id});
                                                                    vm.$ons.notification.alert('削除しました。', {title:''});
                                                                }
                                                }});
        }
    },
    
}

</script>

<style scoped>
    /* .draft-wrap {
        border-bottom: solid 1px #575757;
        margin-bottom: 8px;
        padding-bottom: 0;
    }

    .header {
        width: 100vw;
        padding: 16px 16px;
        margin-bottom: 8px;
        border-bottom: solid 1px #e2e1e1;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .title-date {
        display: flex;
        flex-direction: column;
    }

    .title {
        font-size: 1.2rem;
    }

    .date {
        padding-left: 8px;
        color: #575757;
    }

    .contents {
        width: 96vw;
        word-wrap: break-word;
    }

    .qTitle {
        padding: 8px 16px 0;
        margin-bottom: 8px;
    }

    .qAnswer {
        padding: 0 16px 16px;
        border-bottom: solid 1px #e2e1e1;
        color: #575757;
        white-space: pre-wrap;
    }

    .trash-text {
        display: flex;
        flex-direction: column;
        align-items: center;
        color: #575757;
    }

    .trash {
        font-size: 1.5rem;
    }

    .text {
        font-size: 0.9rem;
    } */

</style>
