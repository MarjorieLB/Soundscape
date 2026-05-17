/**
 * SIDEBAR
 * 
 * This file controls the right sidebar
 * (queue and up next section)
 * 
 * It handles:
 * - creating song items dynamically
 * - rendering full song queue
 * - rendering upcoming songs only
 * - allowing click-to-play functionality
 * 
 * It keeps the sidebar synced with
 * the current song state from the player
 */

import { songs } from "./song.js";
import { loadSong, playSong } from "./player.js";


/* SIDEBAR ELEMENTS
 * These are the containers where
 * song items will be inserted
 */
const queueList = document.querySelector(".queue-list");
const upNextList = document.querySelector(".up-next-list");


/**
 * CREATE SONG ITEM
 * 
 * This function builds a single song row
 * that will be displayed in the sidebar
 * 
 * It receives:
 * - song object (data)
 * - index (position in playlist)
 * 
 * Instead of showing song number,
 * it now shows the song cover image
 */
function createSongItem(song, index){

    const songBox = document.createElement("div");

    songBox.classList.add("song-box");

    songBox.innerHTML = `

        <div class="song-image">

            <img 
                src="${song.cover}" 
                alt="${song.title}" 
                class="song-cover"
            >

        </div>

        <div class="song-details">

            <div class="song-name">
                ${song.title}
            </div>

            <div class="song-time">
                ${song.artist}
            </div>

        </div>

    `;

    /**
     * CLICK SONG
     * 
     * When the user clicks a song item:
     * - it loads that song into the player
     * - it immediately starts playback
     * 
     * This keeps sidebar and player in sync
     */
    songBox.addEventListener("click", () => {

        loadSong(song);
        playSong();

    });

    return songBox;
}


/**
 * RENDER SIDEBAR
 * 
 * This function updates both sections:
 * 
 * 1. QUEUE → shows ALL songs in order
 * 2. UP NEXT → shows only songs after index 0
 * 
 * It rebuilds the DOM every time it's called
 * so the UI always matches the current state
 */
export function renderSidebar(){

    queueList.innerHTML = "";


    /* QUEUE
     * This loops through all songs
     * and displays them in order
     */
    songs.forEach((song, index) => {

        const item =
        createSongItem(song, index);

        queueList.appendChild(item);

    });
    }
