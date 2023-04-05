<template>
    <!-- Main Content -->
    <main>
        <section class="container mx-auto mt-6">
            <div class="md:grid md:grid-cols-3 md:gap-4">
                <div class="col-span-1">
                    <AppUpload ref="upload" :addSong="addSong"></AppUpload>
                </div>
                <div class="col-span-2">
                    <div class="bg-white rounded border border-gray-200 relative flex flex-col">
                        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
                            <span class="card-title">My Songs</span>
                            <i class="fa fa-compact-disc float-right text-green-400 text-2xl"></i>
                        </div>
                        <div class="p-6">
                            <!-- Composition Items -->
                            <CompositionItem :song="song" v-for="(song, i) in songs" :key="song.doc"
                                :updateSong="updateSong" :index="i" :removeSong="removeSong"
                                :updateUnsavedFlag="updateUnsavedFlag">
                            </CompositionItem>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>
</template>
<script>
// import { use_user_store } from '../stores/user';
import AppUpload from '../components/Upload.vue'
import CompositionItem from '../components/CompositionItem.vue'
import { songs_collection, auth } from '../includes/firebase'

export default {
    name: 'manage',
    components: {
        AppUpload,
        CompositionItem
    },
    data() {
        return {
            songs: [],
            unSavedFlag: false,
        }
    },
    async created() {
        const snapshot = await songs_collection.where('uid', '==', auth.currentUser.uid).get()
        snapshot.forEach(this.addSong)
    },
    methods: {
        updateSong(i, values) {
            this.songs[i].modified_name = values.modified_name
            this.songs[i].genre = values.genre
        },
        removeSong(i) {
            this.songs.splice(i, 1)
        },
        addSong(doc) {
            const song = {
                ...doc.data(),
                docID: doc.id,
            }
            this.songs.push(song)
        },
        updateUnsavedFlag(value) {
            this.unSavedFlag = value
        }
    },
    beforeRouteLeave(to, from, next) {
        if (!this.unSavedFlag) {
            next()
        } else {
            const leave = confirm('You have unsaved changes. Are you sure you want to leave this page??')
            next(leave)
        }
    }
    // beforeRouteLeave (to, from, next) {
    //     this.$refs.upload.cancelUploads()
    //     next()
    // }
    // beforeRouteEnter(to,from,next){
    //     const store = use_user_store()
    //     if(store.user_logged_in){
    //         next()
    //     } else {
    //         next({name:'home'})
    //     }
    // }
}
</script>