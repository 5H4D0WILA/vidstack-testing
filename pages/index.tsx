import Head from "next/head";
import { Inter } from "@next/font/google";
import "vidstack/styles/base.css";
// the following styles are optional - remove to go headless.
import "vidstack/styles/ui/buttons.css";
import "vidstack/styles/ui/sliders.css";
import styles from "../styles/Home.module.scss";
import {
    AspectRatio,
    FullscreenButton,
    HLSVideo,
    Media,
    MediaProvider,
    MuteButton,
    PlayButton,
    SliderValueText,
    TimeSlider,
    useMediaElement,
    useMediaState,
    VolumeSlider,
} from "@vidstack/react";
import { SettingsPanel } from "../components/setting_panel";
import { CaptionButton } from "../components/caption_button";
import { useEffect, useState } from "react";
import axios from "axios";
import { WebVTTParser } from "webvtt-parser";
import { ChaptersPanel } from "../components/chapters_panel";

const inter = Inter({ subsets: ["latin"] });

export default function Home(props) {
    return (
        <div>
            <Head>
                <title>Vidstack</title>
                <meta
                    name="description"
                    content="Generated by create next app"
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,1,0"
                />
            </Head>
            <div className={styles.container}>
                <MediaProvider>
                    <Media className={styles.videoWrapper} view="video">
                        <AspectRatio
                            ratio="16/9"
                            className={styles.videoAspect}
                        >
                            <HLSVideo className={styles.videoPlayer}>
                                <video
                                    src="https://media-files.vidstack.io/1080p.mp4"
                                    preload="none"
                                    data-video="0"
                                    className={styles.video}
                                />
                            </HLSVideo>
                        </AspectRatio>
                        <MediaPlayerUI {...props} />
                    </Media>
                </MediaProvider>
            </div>
        </div>
    );
}

function MediaPlayerUI(props) {
    const [open, setOpen] = useState(false);
    const [showChapters, setShowChapters] = useState(false);
    const [showControls, setShowControls] = useState(false);
    const [cues, setCues] = useState([]);
    const media = useMediaElement();

    // - This is a live subscription to the paused store.
    // - All stores are lazily subscribed to on prop access.
    const { currentTime, duration } = useMediaState();

    useEffect(() => {
        if (!media) return;
        // ...
    }, [media]);

    useEffect(() => {
        setCues(props.tree.cues);
        console.log(props);
    }, []);

    const [time, setTime] = useState("00:00");
    const [remaining, setRemaining] = useState("00:00");
    const [videoDuration, setVideoDuration] = useState("00:00");

    useEffect(() => {
        if (!media) return;

        const minutes = Math.floor(currentTime / 60);
        const seconds = (currentTime % 60).toFixed(0).padStart(2, "0");
        setTime(`${minutes}:${seconds}`);

        const rem = duration - currentTime;

        const dur_minutes = Math.floor(rem / 60);
        const dur_seconds = (rem % 60).toFixed(0).padStart(2, "0");
        setRemaining(`${dur_minutes}:${dur_seconds}`);

        console.log(currentTime);

        const subtitleHTML = document.getElementById("subtitles");

        const overlappingCues = cues.filter(
            (cue) => cue.startTime <= currentTime && cue.endTime >= currentTime
        );
        console.log(overlappingCues);
        if (overlappingCues.length > 0) {
            if (subtitleHTML != null) {
                let subText = "";
                overlappingCues.forEach((cue) => {
                    subText += cue.text + "\n";
                });
                subtitleHTML.innerHTML = subText.trimEnd();
                subtitleHTML.style.background = "rgba(0, 0, 0, 0.7)";
            }
        } else {
            if (subtitleHTML != null) {
                subtitleHTML.innerHTML = "";
                subtitleHTML.style.background = "transparent";
            }
        }
    }, [currentTime]);

    useEffect(() => {
        if (!media) return;

        const dur_minutes = Math.floor(duration / 60);
        const dur_seconds = (duration % 60).toFixed(0).padStart(2, "0");
        setVideoDuration(`${dur_minutes}:${dur_seconds}`);
    }, [duration]);

    return (
        <div>
            <div className="media-overlay">
                <div className={`top-bar ${showControls ? "opened" : ""}`}>
                    <a
                        target="_blank"
                        href="https://www.vidstack.io/"
                        rel="noopener noreferrer"
                    >
                        <div className="vidstackLogoWrapper">
                            <img
                                className="vidstackLogo"
                                src="https://media.discordapp.net/attachments/1018251990624641044/1067154803068764170/RLcAMyjL_400x400-removebg-preview.png"
                                alt=""
                            />
                            <h4 className="vidstackTitle">Vidstack Player</h4>
                            <span className="material-symbols-outlined">
                                chevron_right
                            </span>
                        </div>
                    </a>
                    <div
                        onClick={() => {
                            setShowChapters(!showChapters);
                            setOpen(false);
                        }}
                        className={`chapterWrapper ${
                            showChapters ? "active" : ""
                        }`}
                    >
                        <svg
                            width="20"
                            height="18"
                            viewBox="0 0 20 18"
                            fill="white"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M10.6061 17.1678C10.284 17.1678 10.0228 16.9066 10.0228 16.5844L10.0228 1.41778C10.0228 1.09561 10.284 0.834442 10.6061 0.834442L12.3561 0.834442C12.6783 0.834442 12.9395 1.09561 12.9395 1.41778L12.9395 16.5844C12.9395 16.9066 12.6783 17.1678 12.3561 17.1678H10.6061Z" />
                            <path d="M17.0228 17.1678C16.7006 17.1678 16.4395 16.9066 16.4395 16.5844L16.4395 1.41778C16.4395 1.09561 16.7006 0.834442 17.0228 0.834442L18.7728 0.834442C19.095 0.834442 19.3561 1.09561 19.3561 1.41778V16.5844C19.3561 16.9066 19.095 17.1678 18.7728 17.1678H17.0228Z" />
                            <path d="M0.796022 15.9481C0.71264 16.2593 0.897313 16.5791 1.2085 16.6625L2.89887 17.1154C3.21006 17.1988 3.52992 17.0141 3.61331 16.703L7.53873 2.05308C7.62211 1.74189 7.43744 1.42203 7.12625 1.33865L5.43588 0.885715C5.12469 0.802332 4.80483 0.987005 4.72144 1.29819L0.796022 15.9481Z" />
                        </svg>
                    </div>

                    <div
                        aria-label="Settings"
                        onClick={() => {
                            setOpen(!open);
                            setShowChapters(false);
                        }}
                        className={`media-settings-button ${
                            open ? "active" : ""
                        }`}
                    >
                        <svg
                            className="material-symbols-outlined media-settings-icon"
                            style={{
                                transform: open
                                    ? "rotate(35deg)"
                                    : "rotate(0deg)",
                                transition: "0.3s all ease",
                            }}
                            width="16"
                            height="16"
                            viewBox="0 0 20 20"
                            fill="white"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M7.87568 0.666664C7.58751 0.666664 7.34252 0.87709 7.29903 1.16196L6.85555 4.06677C6.85001 4.10301 6.82774 4.13448 6.79561 4.15213C6.70884 4.19979 6.62325 4.24932 6.53889 4.30067C6.50752 4.31977 6.46906 4.32337 6.43485 4.31003L3.69626 3.24231C3.42784 3.13766 3.12323 3.24463 2.97918 3.49413L0.85547 7.17251C0.711385 7.42207 0.771125 7.73945 0.996083 7.91955L3.29145 9.75719C3.32008 9.78011 3.3362 9.81515 3.3354 9.85181C3.33433 9.90086 3.3338 9.95004 3.3338 9.99935C3.3338 10.0488 3.33434 10.0981 3.33541 10.1473C3.33621 10.184 3.3201 10.219 3.29149 10.2419L0.996515 12.0805C0.771678 12.2607 0.712012 12.578 0.856059 12.8275L2.97977 16.5058C3.12386 16.7554 3.42859 16.8624 3.69704 16.7576L6.43522 15.6889C6.46944 15.6756 6.50792 15.6792 6.5393 15.6983C6.62352 15.7495 6.70896 15.799 6.79558 15.8465C6.82771 15.8642 6.84999 15.8957 6.85552 15.9319L7.29903 18.8369C7.34252 19.1218 7.58751 19.3322 7.87568 19.3322H12.1231C12.4112 19.3322 12.6561 19.1219 12.6997 18.8371L13.1442 15.9325C13.1497 15.8963 13.172 15.8649 13.2041 15.8472C13.2912 15.7994 13.3772 15.7497 13.4619 15.6981C13.4932 15.679 13.5317 15.6754 13.5659 15.6888L16.303 16.757C16.5715 16.8618 16.8762 16.7548 17.0203 16.5053L19.144 12.8269C19.2881 12.5774 19.2284 12.2601 19.0035 12.08L16.7094 10.242C16.6808 10.2191 16.6647 10.1841 16.6655 10.1474C16.6666 10.0982 16.6671 10.0488 16.6671 9.99935C16.6671 9.95 16.6666 9.90078 16.6655 9.85169C16.6647 9.81503 16.6809 9.77998 16.7095 9.75707L19.004 7.92012C19.2289 7.74002 19.2887 7.42264 19.1446 7.17307L17.0209 3.4947C16.8768 3.2452 16.5722 3.13823 16.3038 3.24288L13.5663 4.31017C13.5321 4.32351 13.4936 4.31991 13.4623 4.30081C13.3774 4.24917 13.2914 4.19937 13.2041 4.15146C13.172 4.13383 13.1497 4.10236 13.1442 4.06613L12.6997 1.16176C12.6561 0.876982 12.4112 0.666664 12.1231 0.666664H7.87568ZM10.0001 13.7497C12.0713 13.7497 13.7504 12.0706 13.7504 9.99939C13.7504 7.92814 12.0713 6.24906 10.0001 6.24906C7.92881 6.24906 6.24974 7.92814 6.24974 9.99939C6.24974 12.0706 7.92881 13.7497 10.0001 13.7497Z"
                            />
                        </svg>
                    </div>
                </div>
                <div
                    className="media-controls"
                    onClick={() => {
                        setShowControls(!showControls);
                    }}
                >
                    <div
                        className={`mobileControlsAboveProgress ${
                            showControls ? "opened" : ""
                        }`}
                    >
                        <h4 className="videoTimeRemaining">{remaining}</h4>
                        <FullscreenButton className="fullscreenMobile">
                            <svg
                                width="12"
                                height="12"
                                viewBox="0 0 18 18"
                                fill="white"
                                xmlns="http://www.w3.org/2000/svg"
                                slot="enter"
                            >
                                <path d="M17.1637 1.35703C17.1338 1.06289 16.8854 0.833344 16.5834 0.833344H11.9167C11.5945 0.833344 11.3334 1.09451 11.3334 1.41668V3.16668C11.3334 3.48884 11.5945 3.75001 11.9167 3.75001L14.1334 3.75001C14.1978 3.75001 14.25 3.80224 14.25 3.86668V6.08334C14.25 6.40551 14.5112 6.66668 14.8334 6.66668H16.5834C16.9055 6.66668 17.1667 6.40551 17.1667 6.08334V1.41668C17.1667 1.39654 17.1657 1.37664 17.1637 1.35703Z" />
                                <path d="M14.25 14.1333C14.25 14.1978 14.1978 14.25 14.1334 14.25L11.9167 14.25C11.5945 14.25 11.3334 14.5112 11.3334 14.8333V16.5833C11.3334 16.9055 11.5945 17.1667 11.9167 17.1667H16.5834C16.9055 17.1667 17.1667 16.9055 17.1667 16.5833V11.9167C17.1667 11.5945 16.9055 11.3333 16.5834 11.3333H14.8334C14.5112 11.3333 14.25 11.5945 14.25 11.9167V14.1333Z" />
                                <path d="M6.08337 14.25H3.86671C3.80227 14.25 3.75004 14.1978 3.75004 14.1333V11.9167C3.75004 11.5945 3.48887 11.3333 3.16671 11.3333H1.41671C1.09454 11.3333 0.833374 11.5945 0.833374 11.9167V16.5833C0.833374 16.9055 1.09454 17.1667 1.41671 17.1667H6.08337C6.40554 17.1667 6.66671 16.9055 6.66671 16.5833V14.8333C6.66671 14.5112 6.40554 14.25 6.08337 14.25Z" />
                                <path d="M3.75004 6.08334V3.86668C3.75004 3.80224 3.80227 3.75001 3.86671 3.75001L6.08337 3.75001C6.40554 3.75001 6.66671 3.48884 6.66671 3.16668V1.41668C6.66671 1.09451 6.40554 0.833344 6.08337 0.833344H1.41671C1.09454 0.833344 0.833374 1.09451 0.833374 1.41668V6.08334C0.833374 6.40551 1.09454 6.66668 1.41671 6.66668H3.16671C3.48887 6.66668 3.75004 6.40551 3.75004 6.08334Z" />
                            </svg>
                            <svg
                                className="media-exit-fs-icon"
                                aria-hidden="true"
                                viewBox="0 0 24 24"
                                slot="exit"
                            >
                                <path
                                    fill="currentColor"
                                    d="M18 7h4v2h-6V3h2v4zM8 9H2V7h4V3h2v6zm10 8v4h-2v-6h6v2h-4zM8 15v6H6v-4H2v-2h6z"
                                />
                            </svg>
                        </FullscreenButton>
                    </div>
                    <div className="progressWrapper">
                        <h4 className="videoTime">{time}</h4>
                        <TimeSlider
                            className={`videoTimeSlider ${
                                showControls ? "opened" : ""
                            }`}
                        ></TimeSlider>
                        <h4 className="videoTime">{videoDuration}</h4>
                    </div>

                    <div className="time">
                        <div className="playPauseWrapper">
                            <div className="playWrapper">
                                <PlayButton></PlayButton>
                            </div>
                            <div className="volume-controls">
                                <MuteButton></MuteButton>
                                <VolumeSlider></VolumeSlider>
                            </div>
                        </div>
                        <div className="title-wrapper">
                            <h2 className="video-title">
                                Video Title : Chapter Name
                            </h2>
                        </div>
                        <div className="media-controls-buttons">
                            <FullscreenButton className="fullscreenMobile">
                                <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 18 18"
                                    fill="white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    slot="enter"
                                >
                                    <path d="M17.1637 1.35703C17.1338 1.06289 16.8854 0.833344 16.5834 0.833344H11.9167C11.5945 0.833344 11.3334 1.09451 11.3334 1.41668V3.16668C11.3334 3.48884 11.5945 3.75001 11.9167 3.75001L14.1334 3.75001C14.1978 3.75001 14.25 3.80224 14.25 3.86668V6.08334C14.25 6.40551 14.5112 6.66668 14.8334 6.66668H16.5834C16.9055 6.66668 17.1667 6.40551 17.1667 6.08334V1.41668C17.1667 1.39654 17.1657 1.37664 17.1637 1.35703Z" />
                                    <path d="M14.25 14.1333C14.25 14.1978 14.1978 14.25 14.1334 14.25L11.9167 14.25C11.5945 14.25 11.3334 14.5112 11.3334 14.8333V16.5833C11.3334 16.9055 11.5945 17.1667 11.9167 17.1667H16.5834C16.9055 17.1667 17.1667 16.9055 17.1667 16.5833V11.9167C17.1667 11.5945 16.9055 11.3333 16.5834 11.3333H14.8334C14.5112 11.3333 14.25 11.5945 14.25 11.9167V14.1333Z" />
                                    <path d="M6.08337 14.25H3.86671C3.80227 14.25 3.75004 14.1978 3.75004 14.1333V11.9167C3.75004 11.5945 3.48887 11.3333 3.16671 11.3333H1.41671C1.09454 11.3333 0.833374 11.5945 0.833374 11.9167V16.5833C0.833374 16.9055 1.09454 17.1667 1.41671 17.1667H6.08337C6.40554 17.1667 6.66671 16.9055 6.66671 16.5833V14.8333C6.66671 14.5112 6.40554 14.25 6.08337 14.25Z" />
                                    <path d="M3.75004 6.08334V3.86668C3.75004 3.80224 3.80227 3.75001 3.86671 3.75001L6.08337 3.75001C6.40554 3.75001 6.66671 3.48884 6.66671 3.16668V1.41668C6.66671 1.09451 6.40554 0.833344 6.08337 0.833344H1.41671C1.09454 0.833344 0.833374 1.09451 0.833374 1.41668V6.08334C0.833374 6.40551 1.09454 6.66668 1.41671 6.66668H3.16671C3.48887 6.66668 3.75004 6.40551 3.75004 6.08334Z" />
                                </svg>
                                <svg
                                    className="media-exit-fs-icon"
                                    aria-hidden="true"
                                    viewBox="0 0 24 24"
                                    slot="exit"
                                >
                                    <path
                                        fill="currentColor"
                                        d="M18 7h4v2h-6V3h2v4zM8 9H2V7h4V3h2v6zm10 8v4h-2v-6h6v2h-4zM8 15v6H6v-4H2v-2h6z"
                                    />
                                </svg>
                            </FullscreenButton>
                            <CaptionButton />
                        </div>
                    </div>
                    <SettingsPanel isOpen={open} sources={[]} subtitles={[]} />
                    {showChapters ? (
                        <ChaptersPanel
                            chapters={[
                                {
                                    title: "Nature Stroll",
                                    length: "1 min 20 sec",
                                },
                                {
                                    title: "The Campsite",
                                    length: "2 min",
                                },
                                {
                                    title: "Meeting the sprites",
                                    length: "1 min 9 sec",
                                },
                                {
                                    title: "Things go wrong",
                                    length: "3 min",
                                },
                                {
                                    title: "Lucky escape",
                                    length: "3 min",
                                },
                            ]}
                        />
                    ) : (
                        ""
                    )}
                </div>
                <div
                    className={`mobilePlayControls ${
                        showControls ? "opened" : ""
                    }`}
                >
                    <div className="skipWrapper skipBackward">
                        <svg
                            width="15"
                            height="18"
                            viewBox="0 0 20 23"
                            fill="white"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M10.5834 7.05206C10.5834 7.53083 10.0385 7.80574 9.65341 7.52123L5.69205 4.59434C5.37648 4.36118 5.37647 3.88921 5.69203 3.65603L9.65339 0.728882C10.0385 0.44435 10.5834 0.719251 10.5834 1.19803V2.57346C10.5834 2.63527 10.632 2.6863 10.6937 2.69056C15.8469 3.04662 19.9167 7.3397 19.9167 12.5833C19.9167 18.0602 15.4769 22.5 10.0001 22.5C4.71927 22.5 0.402561 18.3723 0.100303 13.1673C0.0816248 12.8457 0.34458 12.5839 0.666759 12.5839H2.41677C2.73892 12.5839 2.99755 12.846 3.02405 13.167C3.32062 16.7599 6.33062 19.5833 10.0001 19.5833C13.8661 19.5833 17.0001 16.4493 17.0001 12.5833C17.0001 8.95717 14.2423 5.97498 10.7099 5.61895C10.642 5.61211 10.5834 5.66583 10.5834 5.73405V7.05206Z" />
                            <path d="M8.21915 15.3409C8.28359 15.3409 8.33582 15.2887 8.33582 15.2243V10.3667C8.33582 10.3022 8.28359 10.25 8.21915 10.25H7.22815C7.20638 10.25 7.18504 10.2561 7.16655 10.2676L5.99458 10.9963C5.96033 11.0176 5.93951 11.0551 5.93951 11.0954V11.8864C5.93951 11.9775 6.03929 12.0335 6.11703 11.9859L7.07242 11.4019C7.07607 11.3996 7.08027 11.3985 7.08456 11.3985C7.09742 11.3985 7.10784 11.4089 7.10784 11.4217V15.2243C7.10784 15.2887 7.16007 15.3409 7.2245 15.3409H8.21915Z" />
                            <path d="M11.1208 15.2092C11.4091 15.3434 11.7389 15.4105 12.1101 15.4105C12.5062 15.4105 12.8517 15.3343 13.1467 15.1818C13.4433 15.0277 13.6737 14.8156 13.8378 14.5455C14.0035 14.2753 14.0863 13.9655 14.0863 13.6158C14.0863 13.2926 14.0167 13.0059 13.8775 12.7557C13.74 12.5055 13.5511 12.3099 13.3108 12.169C13.0721 12.0265 12.8004 11.9553 12.4954 11.9553C12.2551 11.9553 12.0405 12.0017 11.8516 12.0945C11.6682 12.1838 11.5341 12.2969 11.4492 12.4338C11.4459 12.4392 11.4401 12.4425 11.4338 12.4425C11.4232 12.4425 11.415 12.4334 11.416 12.4229L11.5207 11.3472C11.5265 11.2874 11.5767 11.2418 11.6368 11.2418H13.6689C13.7333 11.2418 13.7856 11.1896 13.7856 11.1252V10.3667C13.7856 10.3022 13.7333 10.25 13.6689 10.25H10.6269C10.5661 10.25 10.5155 10.2967 10.5106 10.3573L10.3064 12.8897C10.3016 12.9492 10.3425 13.0027 10.4012 13.0137L11.3041 13.1831C11.3523 13.1922 11.4001 13.1695 11.4301 13.1308C11.4944 13.0477 11.5785 12.9799 11.6826 12.9272C11.8151 12.8609 11.9552 12.8286 12.1027 12.8303C12.2584 12.8303 12.396 12.8651 12.5153 12.9347C12.6363 13.0026 12.7307 13.0979 12.7987 13.2205C12.8683 13.3432 12.9023 13.4865 12.9006 13.6506C12.9023 13.8113 12.8691 13.9539 12.8012 14.0781C12.7332 14.2008 12.6396 14.2961 12.5203 14.364C12.401 14.432 12.2642 14.4659 12.1101 14.4659C11.9129 14.4659 11.7431 14.4096 11.6005 14.2969C11.487 14.2058 11.4155 14.0915 11.3861 13.9541C11.3731 13.8934 11.3232 13.8445 11.2612 13.8445H10.2979C10.2325 13.8445 10.1794 13.8984 10.1855 13.9635C10.2094 14.2202 10.2934 14.4506 10.4372 14.6548C10.6046 14.8902 10.8324 15.0749 11.1208 15.2092Z" />
                        </svg>
                    </div>
                    <div className="playWrapper mobilePlayWrapper">
                        <PlayButton></PlayButton>
                    </div>
                    <div className="skipWrapper skipBackward">
                        <svg
                            width="15"
                            height="18"
                            viewBox="0 0 20 23"
                            fill="white"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M9.41671 7.05206C9.41671 7.53083 9.96162 7.80574 10.3467 7.52123L14.308 4.59434C14.6236 4.36118 14.6236 3.88921 14.3081 3.65603L10.3467 0.728882C9.96164 0.44435 9.41671 0.719251 9.41671 1.19803V2.57346C9.41671 2.63527 9.36808 2.6863 9.30641 2.69056C4.15321 3.04662 0.083374 7.3397 0.083374 12.5833C0.083374 18.0602 4.52322 22.5 10 22.5C15.2808 22.5 19.5975 18.3723 19.8998 13.1673C19.9185 12.8457 19.6555 12.5839 19.3333 12.5839H17.5833C17.2612 12.5839 17.0026 12.846 16.9761 13.167C16.6795 16.7599 13.6695 19.5833 10 19.5833C6.13405 19.5833 3.00004 16.4493 3.00004 12.5833C3.00004 8.95717 5.75779 5.97498 9.29018 5.61895C9.35805 5.61211 9.41671 5.66583 9.41671 5.73405V7.05206Z" />
                            <path d="M8.21913 15.3409C8.28357 15.3409 8.3358 15.2887 8.3358 15.2243V10.3667C8.3358 10.3022 8.28357 10.25 8.21913 10.25H7.22813C7.20636 10.25 7.18502 10.2561 7.16653 10.2676L5.99456 10.9963C5.96031 11.0176 5.93949 11.0551 5.93949 11.0954V11.8864C5.93949 11.9775 6.03927 12.0335 6.11701 11.9859L7.0724 11.4019C7.07605 11.3996 7.08026 11.3985 7.08454 11.3985C7.0974 11.3985 7.10782 11.4089 7.10782 11.4217V15.2243C7.10782 15.2887 7.16005 15.3409 7.22448 15.3409H8.21913Z" />
                            <path d="M11.1208 15.2092C11.4091 15.3434 11.7389 15.4105 12.1101 15.4105C12.5062 15.4105 12.8517 15.3343 13.1467 15.1818C13.4433 15.0277 13.6737 14.8156 13.8377 14.5455C14.0035 14.2753 14.0863 13.9655 14.0863 13.6158C14.0863 13.2926 14.0167 13.0059 13.8775 12.7557C13.74 12.5055 13.551 12.3099 13.3107 12.169C13.0721 12.0265 12.8003 11.9553 12.4954 11.9553C12.2551 11.9553 12.0405 12.0017 11.8516 12.0945C11.6682 12.1838 11.534 12.2969 11.4492 12.4338C11.4459 12.4392 11.4401 12.4425 11.4338 12.4425C11.4232 12.4425 11.415 12.4334 11.416 12.4229L11.5207 11.3472C11.5265 11.2874 11.5767 11.2418 11.6368 11.2418H13.6689C13.7333 11.2418 13.7855 11.1896 13.7855 11.1252V10.3667C13.7855 10.3022 13.7333 10.25 13.6689 10.25H10.6268C10.566 10.25 10.5154 10.2967 10.5105 10.3573L10.3064 12.8897C10.3016 12.9492 10.3425 13.0027 10.4012 13.0137L11.3041 13.1831C11.3522 13.1922 11.4001 13.1695 11.4301 13.1308C11.4944 13.0477 11.5785 12.9799 11.6826 12.9272C11.8151 12.8609 11.9552 12.8286 12.1026 12.8303C12.2584 12.8303 12.396 12.8651 12.5153 12.9347C12.6363 13.0026 12.7307 13.0979 12.7987 13.2205C12.8683 13.3432 12.9022 13.4865 12.9006 13.6506C12.9022 13.8113 12.8691 13.9539 12.8012 14.0781C12.7332 14.2008 12.6396 14.2961 12.5203 14.364C12.4009 14.432 12.2642 14.4659 12.1101 14.4659C11.9129 14.4659 11.743 14.4096 11.6005 14.2969C11.487 14.2058 11.4155 14.0915 11.3861 13.9541C11.3731 13.8934 11.3232 13.8445 11.2612 13.8445H10.2979C10.2324 13.8445 10.1793 13.8984 10.1854 13.9635C10.2094 14.2202 10.2933 14.4506 10.4372 14.6548C10.6045 14.8902 10.8324 15.0749 11.1208 15.2092Z" />
                        </svg>
                    </div>
                </div>
            </div>
            <div className="subtitlesWrapper">
                <p
                    className="subtitle"
                    id="subtitles"
                    style={{
                        opacity: cues.length != 0 ? "1.0" : "0.0",
                        transition: "0.3s all ease",
                    }}
                ></p>
            </div>
        </div>
    );
}

export async function getServerSideProps(context) {
    const parser = new WebVTTParser();
    const webVtt = await axios.get(
        "https://cc.zorores.com/fa/64/fa6423d95507c06d2aad3cffe6bd0ea6/eng-3.vtt"
    );
    //console.log(webVtt.data);

    const tree = parser.parse(webVtt.data, "metadata");

    console.log(tree.cues[0]);

    // Pass data to the page via props
    return { props: { tree } };
}
