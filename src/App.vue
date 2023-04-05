<template>
  <appHeader></appHeader>
  <transition name="route" mode="out-in">
    <router-view v-slot="{ Component }">
      <component :is="Component"></component>
    </router-view>
  </transition>
  <transition name="player" mode="out-in">
    <appPlayer></appPlayer>
  </transition>
  <appAuth></appAuth>
</template>
<script>
import appHeader from './components/App-header.vue'
import appAuth from './components/App-auth.vue'
import appPlayer from './components/Player.vue'
import { mapWritableState } from 'pinia';
import { use_user_store } from './stores/user';
import { auth } from './includes/firebase';

export default {
  name: 'App',
  components: {
    appHeader, appAuth, appPlayer
  },
  computed: {
    ...mapWritableState(use_user_store, ['user_logged_in'])
  },
  created() {
    if (auth.currentUser) {
      this.user_logged_in = true
    }
  }
};
</script>
<style>
.route-enter-from{
  opacity: 0;
  transform: translateX(100px);
}
.route-enter-active{
  transition: all 0.3s ease;
}
.route-leave-to{
  opacity: 0;
  transform: translateX(-100px);
}
.route-leave-active{
  transition: all 0.3s ease-out;
}

.player-enter-from{
  opacity: 0;
  transform: translateY(100px);
}
.player-enter-active{
  transition: all 0.3s ease;
}
.player-leave-to{
  opacity: 0;
  transform: translateY(-100px);
}
.player-leave-active{
  transition: all 0.3s ease-out;
}

</style>
