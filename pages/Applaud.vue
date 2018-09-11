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

export default {
    data() {
        return {
            gradeNum: null
        }
    },

    methods: {
        allSch(grade) {
            this.gradeNum = null
        },

        gradeSch(grade) {
            this.gradeNum = grade
        },

        memberClick(member) {
            console.log(member)
        }
    },

    asyncComputed: {//npm installした非同期処理を行えるcomputed
        async showMembers() {
            //学年で絞って表示している状態でも最新の情報を取得したい場合は下記をfirestoreを見にいく仕様に修正する。
            // ただし、今の所影響がありそうなのは名前と写真くらいなので、学年で絞るたびに最新化するコストは無駄と考え、stateの全メンバー情報から絞り込む方式をとっている。
            if(this.gradeNum != null) {
                return [...this.$store.state.usersData.filter(user => user.grade == this.gradeNum)]
            }

        //改善点。orderByがされていない/監督、部長、スタッフを検索できない。
        //UI上で、roleと学年をselectboxで選択させ、onchangeイベントで絞り込む。
        //条件分岐としてgradeだけでなく、roleも必要になる。
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