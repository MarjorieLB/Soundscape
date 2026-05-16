/**
 * PLAYER
 * 
 * This file controls the music player
 * in the middle section
 * 
 * It handles:
 * - loading songs into UI and audio element
 * - playing and pausing audio
 * - next and previous song navigation
 * - updating progress bar and time
 * - syncing UI with current song state
 */
import { renderFavorites } from "./left.js"
import { songs } from "./song.js";
import { renderSidebar } from "./sidebar.js";


/* SONG INDEX
 * Tracks the currently active song
 * Used for navigation (next / previous)
 */
let currentSong = 0;


/* ELEMENTS
 * References to UI elements that update
 * when song changes or plays
 */
const cover = document.querySelector(".cover");
const title = document.querySelector(".title");
const artist = document.querySelector(".artist");
const album = document.querySelector(".album");

const audio = document.querySelector(".audio");

const playBtn = document.querySelector(".play-btn");
const playIcon = document.querySelector(".play-icon");

const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".prev");

const progress = document.querySelector(".progress");
const progressBar = document.querySelector(".progress-bar");

const current = document.querySelector(".current");
const duration = document.querySelector(".duration");

const volumeBtn = document.querySelector(".volume");
const volumeSlider = document.querySelector(".volume-slider");
const volumeContainer = document.querySelector(".volume-container");

const favorite= document.querySelector(".heart");

/**
 * FAVORITE BUTTON
 *
 * Handles liking/unliking the current song
 * - toggles song.favorite state
 * - updates heart icon UI
 * - refreshes sidebar favorites list
 */
favorite.addEventListener("click", () => {

    const song = songs.find((item) => {

    return audio.src.includes(item.src);

    });

    // stop if song not found
    if(!song) return;

    // toggle favorite state
    song.favorite = !song.favorite;


    // update UI icon state
    if (song.favorite) {
        favorite.classList.remove("fa-regular");
        favorite.classList.add("fa-solid", "active-heart");
    } else {
        favorite.classList.remove("fa-solid", "active-heart");
        favorite.classList.add("fa-regular");
    }

    // refresh sidebar so Favorites updates
    renderSidebar();
    renderFavorites();
});

/**
 * FORMAT TIME
 * 
 * Converts seconds into mm:ss format
 * so audio time is readable in UI
 */
function formatTime(seconds){

    if(isNaN(seconds)) return "0:00";

    const mins = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);

    if(secs < 10){
        secs = "0" + secs;
    }

    return `${mins}:${secs}`;
}


/**
 * LOAD SONG
 * 
 * Updates all UI elements with song data
 * and sets audio source
 * 
 * Also refreshes sidebar to sync UI state
 */
export function loadSong(song){

    if(song.favorite){
        favorite.classList.remove("fa-regular");
        favorite.classList.add("fa-solid", "active-heart");
    } else {
        favorite.classList.remove("fa-solid", "active-heart");
        favorite.classList.add("fa-regular");
    } 
    cover.src = song.cover;
    title.textContent = song.title;
    artist.textContent = song.artist;
    album.textContent = song.album;

    audio.src = song.src;

    renderSidebar();

}


/**
 * PLAY SONG
 * 
 * Starts audio playback
 * and changes icon to pause
 */
export function playSong(){

    audio.play();

    playIcon.classList.replace(
        "fa-play",
        "fa-pause"
    );
}


/**
 * PAUSE SONG
 * 
 * Stops audio playback
 * and changes icon back to play
 */
function pauseSong(){

    audio.pause();

    playIcon.classList.replace(
        "fa-pause",
        "fa-play"
    );
}


/**
 * PLAY BUTTON
 * 
 * Toggles between play and pause
 * based on current audio state
 */
playBtn.addEventListener("click", () => {

    if(audio.paused){
        playSong();
    }
    else{
        pauseSong();
    }

});


/**
 * NEXT SONG
 * 
 * Moves to next song in playlist
 * If at end → loops back to first song
 */
nextBtn.addEventListener("click", () => {

    currentSong++;

    if(currentSong > songs.length - 1){
        currentSong = 0;
    }

    loadSong(songs[currentSong]);
    playSong();

});


/**
 * PREVIOUS SONG
 * 
 * Moves to previous song in playlist
 * If at start → goes to last song
 */
prevBtn.addEventListener("click", () => {

    currentSong--;

    if(currentSong < 0){
        currentSong = songs.length - 1;
    }

    loadSong(songs[currentSong]);
    playSong();

});


/**
 * AUTO NEXT (when song ends)
 * 
 * Automatically plays next song
 * when current audio finishes
 */
audio.addEventListener("ended", () => {

    currentSong++;

    if(currentSong > songs.length - 1){
        currentSong = 0;
    }

    loadSong(songs[currentSong]);
    playSong();

});


/**
 * PROGRESS UPDATE
 * 
 * Updates progress bar and time display
 * while song is playing
 */
audio.addEventListener("timeupdate", (e) => {

    const { duration: dur, currentTime } = e.srcElement;

    const percent = (currentTime / dur) * 100;

    progress.style.width = `${percent}%`;

    current.textContent = formatTime(currentTime);
    duration.textContent = formatTime(dur);

});


/**
 * SEEK AUDIO
 * 
 * Allows user to click progress bar
 * to jump to a specific time
 */
progressBar.addEventListener("click", (e) => {

    const width = progressBar.clientWidth;
    const clickX = e.offsetX;
    const dur = audio.duration;

    audio.currentTime = (clickX / width) * dur;

});

/**
 * VOLUME SLIDER
 * 
 * Updates audio volume in real time
 * based on slider value
 * 
 * HTML range is 0 - 100
 * audio volume uses 0 - 1
 */
volumeSlider.addEventListener("input", () => {

    audio.volume = volumeSlider.value / 100;

    /**
     * VOLUME ICON STATES
     * 
     * Changes icon dynamically
     * depending on current volume level
     */

    if(audio.volume === 0){

        volumeBtn.classList.remove(
            "fa-volume-high",
            "fa-volume-low"
        );

        volumeBtn.classList.add(
            "fa-volume-xmark"
        );

    }

    else if(audio.volume < 0.5){

        volumeBtn.classList.remove(
            "fa-volume-high",
            "fa-volume-xmark"
        );

        volumeBtn.classList.add(
            "fa-volume-low"
        );

    }

    else{

        volumeBtn.classList.remove(
            "fa-volume-low",
            "fa-volume-xmark"
        );

        volumeBtn.classList.add(
            "fa-volume-high"
        );

    }

});


/**
 * VOLUME BUTTON
 * 
 * Toggles mute and unmute
 * when volume icon is clicked
 */
volumeBtn.addEventListener("click", () => {

    if(audio.volume > 0){

        audio.volume = 0;
        volumeSlider.value = 0;

        volumeBtn.classList.remove(
            "fa-volume-high",
            "fa-volume-low"
        );

        volumeBtn.classList.add(
            "fa-volume-xmark"
        );

    }

    else{

        audio.volume = 0.5;
        volumeSlider.value = 50;

        volumeBtn.classList.remove(
            "fa-volume-xmark",
            "fa-volume-low"
        );

        volumeBtn.classList.add(
            "fa-volume-high"
        );

    }

});

/**
 * INITIAL LOAD
 * 
 * Loads first song when app starts
 */
loadSong(songs[currentSong]);