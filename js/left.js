/**
 * LEFT PANEL
 * 
 * This file controls the left sidebar
 * where the user can browse and search songs
 * 
 * It handles:
 * - navigation clicks (songs, albums, artists, etc.)
 * - rendering song info cards
 * - filtering songs using search input
 * - updating UI dynamically based on user input
 */

import { songs } from "./song.js";
import { loadSong, playSong } from "./player.js";


/* NAV ITEMS
 * These are the category buttons
 * (songs, albums, artists, favorites, recent)
 */
const navItems = document.querySelectorAll(".nav li");


/* LEFT CONTENT
 * This is where dynamic info cards
 * (songs, albums, artists) will be displayed
 */
const leftContent = document.querySelector(".left-content");


/* SEARCH INPUT
 * This listens to user typing
 * and filters songs in real time
 */
const searchInput = document.querySelector(".search-input");


/**
 * CREATE INFO BOX
 * 
 * This function creates a reusable UI card
 * used for songs, albums, and artists
 * 
 * It builds a clickable element dynamically
 */
function createInfoBox(icon, title, subtitle, cover){

    const box = document.createElement("div");

    box.classList.add("info-box");

    box.innerHTML = `

        <div class="info-icon"> 
            ${ 
                cover
                ?` <img src="${cover}" alt="cover" class="info-cover"> `
                :` <i class="${icon}"></i> `
            }
        </div>

        <div class="info-details">

            <div class="info-title">
                ${title}
            </div>

            <div class="info-subtitle">
                ${subtitle}
            </div>

        </div>

    `;

    return box;
}


/**
 * RENDER SONGS
 * 
 * This function displays songs inside the left panel
 * 
 * It loops through the song array and creates
 * a card for each song
 * 
 * Clicking a song:
 * - loads it into the player
 * - starts playback immediately
 */
function renderSongs(data = songs){

    leftContent.innerHTML = "";

    data.forEach((song) => {

        const box = createInfoBox(
            "fa-solid fa-music",
            song.title,
            song.artist,
            song.cover
        );

        box.addEventListener("click", () => {

            loadSong(song);
            playSong();

        });

        leftContent.appendChild(box);

    });

}


/**
 * SEARCH FUNCTION
 * 
 * This listens for user input in the search bar
 * 
 * Every time the user types:
 * - it converts input to lowercase
 * - filters songs by title, artist, or album
 * - re-renders the song list
 */
searchInput.addEventListener("input", () => {

    const value = searchInput.value.toLowerCase();

    const filteredSongs = songs.filter((song) => {

        return (

            song.title.toLowerCase().includes(value)
            ||
            song.artist.toLowerCase().includes(value)
            ||
            song.album.toLowerCase().includes(value)

        );

    });

    renderSongs(filteredSongs);

});


/**
 * RENDER ALBUMS
 * 
 * This groups all songs by album name
 * and displays each unique album only once
 * 
 * Clicking an album:
 * - filters all songs with same album
 * - re-renders left panel with album songs
 */
function renderAlbums(){

    leftContent.innerHTML = "";

    // get unique album names only
    const albums =
    [...new Set(songs.map(song => song.album))];

    albums.forEach((album) => {

        // get first song from album
        // used for album cover preview
        const firstSong =
        songs.find(song => song.album === album);

        const box = createInfoBox(
            "fa-solid fa-compact-disc",
            album,
            "Album",
            firstSong?.cover
        );

        /**
         * CLICK ALBUM
         * 
         * Filters songs that belong
         * to the selected album only
         */
        box.addEventListener("click", () => {

            // get all songs from clicked album
            const albumSongs =
            songs.filter(song => song.album === album);

            renderSongs(albumSongs);

        });

        leftContent.appendChild(box);

    });

}


/**
 * RENDER ARTISTS
 * 
 * This groups all songs by artist name
 * and shows each unique artist only once
 */
function renderArtists(){

    leftContent.innerHTML = "";

    const artists = [...new Set(songs.map(song => song.artist))];

    artists.forEach((artist) => {

        const firstSong = songs.find(song => song.artist === artist);

        const box = createInfoBox(
            "fa-solid fa-user",
            artist,
            "Artist",
            firstSong?.cover
        );

        box.addEventListener("click", () => {

            // get all songs from clicked artist
            const artistSongs =
            songs.filter(song => song.artist === artist);

            renderSongs(artistSongs);

        });

        leftContent.appendChild(box);

    });

}


/**
 * RENDER FAVORITES
 * 
 * This filters songs that are marked as favorite
 * and displays all liked songs
 * 
 * 
 */
export function renderFavorites(){

    leftContent.innerHTML = "";

    // get all favorited songs
    const favoriteSongs =
    songs.filter(song => song.favorite);

    // render all favorite songs
    favoriteSongs.forEach((song) => {

        const box = createInfoBox(
            "fa-solid fa-heart",
            song.title,
            song.artist,
            song.cover
        );

        /**
         * CLICK FAVORITE SONG
         * 
         * Loads selected favorite song
         * and starts playback
         */
        box.addEventListener("click", () => {

            setCurrentSong(song);

            loadSong(song);
            playSong();

        });

        leftContent.appendChild(box);

    });

}


/**
 * NAVIGATION
 * 
 * This handles switching what is displayed
 * in the left panel based on category clicked
 * 
 * Each nav item controls what render function runs
 */
navItems.forEach((item) => {

    item.addEventListener("click", () => {

        /**
         * REMOVE ACTIVE CLASS
         * 
         * Clears highlight from all nav items
         * so only one item stays active
         */
        navItems.forEach((nav) => {
            nav.classList.remove("active-nav");
        });

        /**
         * SET ACTIVE CLASS
         * 
         * Highlights the clicked nav item
         */
        item.classList.add("active-nav");

        /**
         * GET CATEGORY
         * 
         * Reads data-category from HTML
         * example: songs, albums, artists
         */
        const category = item.dataset.category;

        /**
         * SWITCH VIEW
         * 
         * This decides what to render
         * based on selected category
         */
        if (category === "songs") {
            renderSongs();
        } else if (category === "albums") {
            renderAlbums();
        } else if (category === "artists") {
            renderArtists();
        } else if (category === "favorites") {
            renderFavorites();
        } 

    });

});


/**
 * INITIAL LOAD
 * 
 * When the page first loads:
 * - display all songs
 * - highlight the first nav item
 */
renderSongs();

navItems[0].classList.add("active-nav");