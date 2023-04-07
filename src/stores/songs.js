import { defineStore } from "pinia"
import { songs_collection } from '../includes/firebase'

export default defineStore('songs', {
    state: () => ({
        songs:[]
    }),
    actions: {
        async getSongs() {
            if (this.pendingReq) {
                return
            }

            this.pendingReq = true

            let snapshots

            if (this.songs.length) {
                const lastDoc = await songs_collection
                    .doc(this.songs[this.songs.length - 1].docID).get()

                snapshots = await songs_collection
                    .orderBy('modified_name')
                    .startAfter(lastDoc)
                    .limit(this.maxPerPage).get()
            } else {
                snapshots = await songs_collection
                    .orderBy('modified_name')
                    .limit(this.maxPerPage).get()
            }

            snapshots.forEach((doc) => {
                this.songs.push({
                    docID: doc.id,
                    ...doc.data(),
                })
            })
            this.pendingReq = false
        }
    }
})