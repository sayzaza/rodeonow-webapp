<template>
  <section>
    <div
      class="title d-flex align-items-center justify-content-between"
      @click="toggleExpand"
    >
      <span>
        ACTIVE USERS ON ORDER ({{ activeUsersOnOrder.length }})
      </span>

      <button v-if="!expanded">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M12 10.828l-4.95 4.95-1.414-1.414L12 8l6.364 6.364-1.414 1.414z" fill="rgba(255,255,255,1)"/></svg>
      </button>
      <button v-else>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20"><path fill="none" d="M0 0h24v24H0z"/><path d="M5 11h14v2H5z" fill="rgba(255,255,255,1)"/></svg>
      </button>
    </div>
    <div
      v-if="expanded"
      class="users"
    >
      <div
        v-for="(user, i) in activeUsersOnOrder"
        :key="i"
        class="user d-flex align-items-center"
      >
        <span class="bullet"></span>

        <div>
          {{ user.displayName }}
          
          <span
            v-if="user.uid === currentUser.uid"
          >
            (me)
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data: () => ({
    expanded: false,
  }),
  computed: {
    ...mapState([
      'activeUsersOnOrder'
    ]),
    currentUser () {
      return this.getCurrentUser()
    }
  },
  methods: {
    toggleExpand () {
      this.expanded = !this.expanded
    }
  }
}
</script>

<style scoped>
section {
  position: fixed;
  bottom: 0;
  right: 1rem;
  background: white;
  box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.1);
}

section .title {
  background: #2c3346;
  color: white;
  padding: .5rem 1rem;
  font-size: .8rem;
  font-weight: 500;
  gap: 1rem;
  cursor: pointer;
  border-top-left-radius: .4rem;
  border-top-right-radius: .4rem;
}

section .title button {
  background: transparent;
  border: none;
  padding: 0;
}

section .users .user {
  padding: .5rem 1rem;
  font-size: .85rem;
  gap: .5rem;
}

section .users .user:not(:last-child) {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

section .users .user .bullet {
  width: 6px;
  height: 6px;
  display: block;
  background: rgb(0, 169, 0);
  border-radius: 50%;
}
</style>