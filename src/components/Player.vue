<template>
    <!-- Player -->
    <div class="fixed bottom-0 left-0 bg-white px-4 py-2 w-full" v-if="current_song.modified_name">
        <!-- Track Info -->
        <div class="text-center">
            <span class="song-title font-bold">
                {{ current_song.modified_name }}
            </span> by
            <span class="song-artist">
                {{ current_song.display_name }}
            </span>
        </div>
        <div class="flex flex-nowrap gap-4 items-center">
            <!-- Play/Pause Button -->
            <button type="button" @click.prevent="toggleAudio">
                <i :class="{ 'fa-play' : !playing, 'fa-pause' : playing}" class="fa text-gray-500 text-xl hover:text-green-500"></i>
            </button>
            <!-- Current Position -->
            <div class="player-currenttime">
                {{ seek }}
            </div>
            <!-- Scrub Container  -->
            <div @click.prevent="updateSeek" class="w-full h-2 rounded bg-gray-200 relative cursor-pointer">
                <!-- Player Ball -->
                <span class="absolute -top-2.5 -ml-2.5 text-gray-800 text-lg" :style="{left: playerProgress}">
                    <i class="fas fa-circle"></i>
                </span>
                <!-- Player Progress Bar-->
                <span class="block h-2 rounded bg-gradient-to-r from-green-500 to-green-400" :style="{width: playerProgress}"></span>
            </div>
            <!-- Duration -->
            <div class="player-duration">
                {{ duration }}
            </div>
        </div>
        <div class="flex text-center w-24 m-auto justify-between">
            <button type="button" @click.prevent="toNextSong" class="rotate-180">
                <i class="fa fa-forward text-gray-500 text-xl hover:text-green-500"></i>
            </button>
            <button type="button" @click.prevent="toPreviousSong">
                <i class="fa fa-forward text-gray-500 text-xl hover:text-green-500"></i>
            </button>
        </div>
    </div>
</template>

<script>
import {mapActions,mapState} from 'pinia'
import usePlayerStore from '../stores/player'
import useSongsStore from '../stores/songs'

export default {
methods:{
    ...mapActions(usePlayerStore,['toggleAudio','updateSeek', 'skipSong']),
    toNextSong(){
        let index = this.songs.findIndex(song => this.current_song.docID === song.docID)
        this.songs[index + 1] ? this.skipSong(this.songs[index + 1]) : this.skipSong(this.songs[0])
    },
    toPreviousSong(){
        let index = this.songs.findIndex(song => this.current_song.docID === song.docID)
        this.songs[index - 1] ? this.skipSong(this.songs[index - 1]) : this.skipSong(this.songs[this.songs.length - 1])
    }
},
computed:{
    ...mapState(usePlayerStore,['playing','duration','seek', 'playerProgress','current_song']),
    ...mapState(useSongsStore,['songs'])
}
}
</script>