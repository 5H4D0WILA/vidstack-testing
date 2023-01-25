import styles from "../../../styles/Watch.module.scss";
import {
    AspectRatio,
    FullscreenButton,
    Media,
    MediaProvider,
    MuteButton,
    SliderValueText,
    TimeSlider,
    useMediaElement,
    useMediaProviderElement,
    useMediaState,
    VolumeSlider,
} from "@vidstack/react";
import { HLSVideo } from "@vidstack/react";
import { PlayButton } from "@vidstack/react";
import { CaptionButton } from "../../../components/caption_button";
import { SettingsPanel } from "../../../components/setting_panel";
import { useRef, useState } from "react";
import { WebVTTParser } from "webvtt-parser";
import axios from "axios";
import { useEffect } from "react";
import Head from "next/head";
import "vidstack/styles/base.css";
// the following styles are optional - remove to go headless.
import "vidstack/styles/ui/buttons.css";
import "vidstack/styles/ui/sliders.css";
import Link from "next/link";

export default function Home(props) {
    return (
        <div>
            <Head>
                <title>Create Next App</title>
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
                                    src={
                                        props.epData != null
                                            ? "https://cors.proxy.consumet.org/" +
                                              props.epData.sources[
                                                  props.quality
                                              ].url
                                            : ""
                                    }
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
    const [cues, setCues] = useState(false);
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
    const [videoDuration, setVideoDuration] = useState("00:00");

    useEffect(() => {
        if (!media) return;

        const minutes = Math.floor(currentTime / 60);
        const seconds = (currentTime % 60).toFixed(0).padStart(2, "0");
        setTime(`${minutes}:${seconds}`);

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
                <div className="top-bar">
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
                        aria-label="Settings"
                        onClick={() => {
                            setOpen(!open);
                        }}
                        className={`media-settings-button ${open ? "active": ""}`}
                    >
                        <span
                            className="material-symbols-outlined media-settings-icon"
                            style={{
                                transform: open
                                    ? "rotate(35deg)"
                                    : "rotate(0deg)",
                                transition: "0.3s all ease",
                            }}
                        >
                            settings
                        </span>
                    </div>
                </div>
                <div className="media-controls">
                    <div className="progressWrapper">
                        <h4 className="videoTime">{time}</h4>
                        <TimeSlider>
                            <SliderValueText
                                type="pointer"
                                format="time"
                                slot="preview"
                            />
                        </TimeSlider>
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
                                {props.data.title.english ??
                                    props.data.title.romaji}{" "}
                                :{" "}
                                {props.data.episodes[props.epNumber - 1].title}
                            </h2>
                        </div>
                        <div className="media-controls-buttons">
                            <SettingsPanel
                                isOpen={open}
                                sources={props.epData.sources}
                                subtitles={[]}
                            />
                            <CaptionButton />
                            <FullscreenButton>
                                <svg
                                    className="media-enter-fs-icon"
                                    aria-hidden="true"
                                    viewBox="0 0 24 24"
                                    slot="enter"
                                >
                                    <path
                                        fill="currentColor"
                                        d="M16 3h6v6h-2V5h-4V3zM2 3h6v2H4v4H2V3zm18 16v-4h2v6h-6v-2h4zM4 19h4v2H2v-6h2v4z"
                                    />
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
                    </div>
                </div>
            </div>
            <div className="subtitlesWrapper">
                <p className="subtitle" id="subtitles"></p>
            </div>
        </div>
    );
}

export async function getServerSideProps(context) {
    const id = context.params.id;
    const epNumber = context.params.number.split("-ep-")[1];

    console.log(id);

    const url = `https://api.consumet.org/meta/anilist/info/${id}?provider=zoro`;

    console.log(url);

    const res = await fetch(url);
    const data = await res.json();

    console.log(data);

    const epRes = await fetch(
        `https://api.consumet.org/meta/anilist/watch/${
            data.episodes[epNumber == 0 ? 0 : epNumber - 1].id
        }?provider=zoro`
    );
    const epData = await epRes.json();

    let quality = 0;
    let previewQuality = 0;

    epData.sources.forEach((episode, index) => {
        if (episode.quality == "1080p") {
            quality = index;
        } else if (episode.quality == "320p") {
            previewQuality = index;
        }
    });

    let subtitleIndex = 0;

    epData.subtitles.forEach((episode, index) => {
        if (episode.lang == "English") {
            subtitleIndex = index;
        }
    });

    const parser = new WebVTTParser();
    const webVtt = await axios.get(epData.subtitles[subtitleIndex].url);
    //console.log(webVtt.data);

    const tree = parser.parse(webVtt.data, "metadata");

    console.log(tree.cues[0]);

    // Pass data to the page via props
    return { props: { data, epData, quality, previewQuality, epNumber, tree } };
}
