<template>
      <!-- <no-ssr> -->
    <v-ons-page>
        <div class="container">
            <div class="sch-script">
                <p class="all-show" @click="allSch">全員表示</p>
                <p>学年で検索</p>
            </div>
            <div class="search">
                <span v-for="grade in 3" :key="grade" @click="gradeSch(grade)">{{grade}}</span>
            </div>
            <div class="menber-list">
                <div v-for="member in showMembers" :key="member.id" class="member-container" @click="memberClick(member)">
                    <img class="list-item__thumbnail" src="http://placekitten.com/g/40/40">
                    <p class="member-name">{{member.name}}</p>
                </div>
            </div>
        </div>
    </v-ons-page>
    <!-- </no-ssr> -->
</template>

<script>
import AsyncComputed from 'vue-async-computed'

export default {
    data() {
        return {
            // members: [
            //     {id: 1, name: '中山雅史', role: '選手', grade: 3},
            //     {id: 2, name: '中田英寿', role: '選手', grade: 2},
            //     {id: 3, name: '高原直泰', role: '選手', grade: 1},
            //     {id: 4, name: 'べロンべロンべロン', role: '選手', grade: 3},
            //     {id: 5, name: 'ベッカム', role: '選手', grade: 3},
            //     {id: 6, name: 'オルテガ', role: '選手', grade: 3},
            //     {id: 7, name: 'リケルメ', role: '選手', grade: 1},
            // ],
            // showMembers: [
            //     {id: 1, name: '中山雅史', role: '選手', grade: 3},
            //     {id: 2, name: '中田英寿', role: '選手', grade: 2},
            //     {id: 3, name: '高原直泰', role: '選手', grade: 1},
            //     {id: 4, name: 'べロンべロンべロン', role: '選手', grade: 3},
            //     {id: 5, name: 'ベッカム', role: '選手', grade: 3},
            //     {id: 6, name: 'オルテガ', role: '選手', grade: 3},
            //     {id: 7, name: 'リケルメ', role: '選手', grade: 1},
            // ],
        }
    },
    methods: {
        allSch(grade) {

            let members = []
            let member = {}
            const l = this.$store.state.teamU.length
            for(let i=0; i<l; i++) {
                const id = this.$store.state.teamU[i].userId
                member = this.$store.dispatch('getUser', {id: id})
                console.log(member)
                members.push({
                    id: id,
                    name: ''
                })
            }
        },

        gradeSch(grade) {
            this. showMembers = this.members.filter((member)=>{return (member.grade == grade && member.role == '選手')})
        },

        memberClick(member) {
            console.log(member)
        }
    },

    // computed: {
    asyncComputed: {//npm installした非同期処理を行えるcomputed
        async showMembers() {
            let members = []
            let ids = []
            const l = this.$store.state.teamU.length

            for(let i=0; i<l; i++) {
                await ids.push(this.$store.state.teamU[i].userId)
            }

            await this.$store.dispatch('getUser', {ids: ids})
        
            for(let i=0; i<l; i++) {
                await members.push({
                    id: this.$store.state.usersData[i].id,
                    name: this.$store.state.usersData[i].name,
                    grade: this.$store.state.usersData[i].grade,
                    role: this.$store.state.usersData[i].role,
                })
            }
            return members
        }
    }
}
</script>

<style scoped>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    /* justify-content: center; */
    height: 90%;
  }

  .search {
    width: 200px;
    display: flex;
    justify-content: space-around;
    margin-bottom: 2.7vh;
  }

  .sch-script {
    padding-top: 8vh;
    color: #7c7b7b;
    text-align: center;
  }

  .all-show {
      color: black;
      margin-bottom: 1.3vh
  }

  .member-margin {
      /* text-align: center;
      display: flex;
      justify-content: center;
          width:80vw; */
  }

  .menber-list {
    width: 84vw;
    display: flex;
    flex-wrap: wrap;
    height: fit-content;
    max-height: 60vh;
    overflow: auto;

  }

  .member-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 20vw;
    margin-right: 1vw;
    margin-bottom: 1vh;
  }

.list-item__thumbnail{
    width: 14vw;
    height: 14vw;
    border-radius: 10vw;
    margin-bottom: 4px;
}


</style>4