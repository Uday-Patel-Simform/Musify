
<template>
    <!-- Header -->
    <header id="header" class="bg-gray-700">
        <nav class="container mx-auto flex justify-start items-center py-5 px-4">
            <!-- App Name -->
            <router-link class="text-white font-bold uppercase text-2xl mr-4" :to="{ name:'home' }" exact-active-class="no-active">Music</router-link>

            <div class="flex flex-grow items-center">
                <!-- Primary Navigation -->
                <ul class="flex flex-row mt-1">
                    <li>
                        <router-link class="px-2 text-white" :to="{ name:'about' }">About</router-link>
                    </li>
                    <!-- Navigation Links -->
                    <li v-if="!user_logged_in">
                        <a class="px-2 text-white" href="#" @click.prevent="toggle_auth_model">Login / Register</a>
                    </li>
                    <template v-else>
                        <li>
                            <router-link class="px-2 text-white" :to="{ name:'manage' }">Manage</router-link>
                        </li>
                        <li>
                            <a class="px-2 text-white" href="#" @click.prevent="sign_Out()">LogOut</a>
                        </li>
                    </template>
                </ul>
            </div>
        </nav> 
    </header>
</template>
<script>
import { mapStores,mapState, mapActions } from 'pinia';
import use_model_store from '../stores/model'
import { use_user_store } from '../stores/user';

export default {
    computed: {
        ...mapStores(use_model_store),
        ...mapState(use_user_store,['user_logged_in']),
    },
    methods: {
        ...mapActions(use_user_store,['sign_out']),
        toggle_auth_model() {
            this.modalStore.is_open = !this.modalStore.is_open
        },
        sign_Out(){
            this.sign_out()
            if(this.$route.meta.requires_auth){
                this.$router.push({name:'home'})
            }
        }
    },
}
</script>
<style ></style>