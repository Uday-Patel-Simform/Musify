<template>
    <main>
        <!-- Music Header -->
        <section class="w-full mb-8 py-14 text-center text-white relative">
            <div class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
                style="background-image: url(/assets/img/song-header.png)"></div>
            <div class="container mx-auto flex items-center">
                <!-- Play/Pause Button -->
                <button @click.prevent="newSong(song)" type="button"
                    class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full focus:outline-none">
                    <i :class="{ 'fa-play': current_song.modified_name !== song.modified_name || !playing, 'fa-pause': playing }"
                        class="fas"></i>
                </button>
                <div class="z-50 text-left ml-8">
                    <!-- Song Info -->
                    <div class="text-3xl font-bold">
                        {{ song.modified_name }}
                    </div>
                    <div>
                        {{ song.genre }}
                    </div>
                </div>
            </div>
        </section>
        <!-- Form -->
        <section class="container mx-auto mt-6" id="comments">
            <div class="bg-white rounded border border-gray-200 relative flex flex-col">
                <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
                    <!-- Comment Count -->
                    <span class="card-title">
                        Comments({{ song.comment_count }})
                    </span>
                    <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
                </div>
                <div class="p-6">
                    <div class="text-white text-center font-bold p-4 mb-4" v-if="commentShowAlert"
                        :class="commentAlertVariant">
                        {{ commentAlertMessage }}
                    </div>
                    <vee-form v-if="user_logged_in" :validation-schema="schema" @submit="addComment">
                        <vee-field as="textarea" name="comment"
                            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded mb-4"
                            placeholder="Your comment here..."></vee-field>
                        <button type="submit" class="py-1.5 px-3 rounded text-white bg-green-600 block"
                            :disabled="commentInSubmission">
                            Submit
                        </button>
                        <ErrorMessage class="text-red-600" name="comment"></ErrorMessage>
                    </vee-form>
                    <!-- Sort Comments -->
                    <select v-model="sort"
                        class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded">
                        <option value="1">Latest</option>
                        <option value="2">Oldest</option>
                    </select>
                </div>
            </div>
        </section>
        <!-- Comments -->
        <ul class="container mx-auto">
            <li class="p-6 bg-gray-50 border border-gray-200" v-for="comment in sortedComments" :key="comment.docID">
                <!-- Comment Author -->
                <div class="mb-5">
                    <div class="font-bold">
                        {{ comment.name }}
                    </div>
                    <time>
                        {{ comment.datePosted.slice(0,25) }}
                    </time>
                </div>

                <p>
                    {{ comment.content }}
                </p>
            </li>
        </ul>
    </main>
</template>

<script>
import { songs_collection, comments_collection, auth } from '../includes/firebase';
import { mapState, mapActions } from 'pinia'
import { use_user_store } from '../stores/user';
import usePlayerStore from '../stores/player'

export default {
    data() {
        return {
            song: {},
            schema: {
                comment: 'required|min:3',
            },
            commentInSubmission: false,
            commentShowAlert: false,
            commentAlertVariant: 'bg-blue-500',
            commentAlertMessage: 'Hold on! Your comment is being added.',
            comments: [],
            sort: '1'
        }
    },
    computed: {
        ...mapState(use_user_store, ['user_logged_in']),
        ...mapState(usePlayerStore, ['playing', 'current_song']),
        sortedComments() {
            return this.comments.slice().sort((a, b) => {
                if (this.sort === '1') {
                    return new Date(b.datePosted) - new Date(a.datePosted)
                }
                return new Date(a.datePosted) - new Date(b.datePosted)
            })
        }
    },
    methods: {
        ...mapActions(usePlayerStore, ['newSong']),
        async addComment(values, { resetForm }) {
            this.commentInSubmission = true
            this.commentShowAlert = true

            const comment = {
                content: values.comment,
                datePosted: new Date().toString(),
                sid: this.$route.params.id,
                name: auth.currentUser.displayName,
                uid: auth.currentUser.uid,
            }

            await comments_collection.add(comment)
            this.song.comment_count += 1
            await songs_collection.doc(this.$route.params.id).update({
                comment_count: this.song.comment_count
            })
            this.getComments()

            this.commentInSubmission = false
            this.commentAlertVariant = 'bg-green-500'
            this.commentAlertMessage = 'Comment added!'

            resetForm()
        },
        async getComments() {
            const snapshots = await comments_collection.where('sid', '==', this.$route.params.id).get()
            this.comments = []
            snapshots.forEach((doc) => {
                this.comments.push({
                    docID: doc.id,
                    ...doc.data(),
                })
            })
        }
    },
    async created() {
        const docSnapshot = await songs_collection.doc(this.$route.params.id).get()
        if (!docSnapshot.exists) {
            this.$router.push({ name: 'home' })
            return
        }

        const { sort } = this.$route.query
        this.sort = sort === '1' || sort === '2' ? sort : '1'

        this.song = docSnapshot.data()
        this.getComments()
    },
    watch: {
        sort(newVal) {
            if (newVal === this.$route.params.sort) {
                return
            }
            this.$router.push({
                query: {
                    sort: newVal,
                }
            })
        }
    }
}
</script>
