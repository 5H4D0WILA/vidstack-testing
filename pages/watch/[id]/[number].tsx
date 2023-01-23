import styles from "../../../styles/Watch.module.scss";
import {
    AspectRatio,
    FullscreenButton,
    Gesture,
    Media,
    MuteButton,
    SliderValueText,
    SliderVideo,
    Time,
    TimeSlider,
    ToggleButton,
    useMediaContext,
    VolumeSlider,
} from "@vidstack/player-react";
import "@vidstack/player/hydrate.js";
import { Hls } from "@vidstack/player-react";
import { PlayButton } from "@vidstack/player-react";
import { CaptionButton } from "../../../components/caption_button";
import { SettingsPanel } from "../../../components/setting_panel";
import { useRef, useState } from "react";
import { WebVTTParser } from "webvtt-parser";
import { AUDIO_EXTENSIONS } from "@vidstack/player";
import axios from "axios";
import { useEffect } from "react";
import { MediaElement } from "@vidstack/player";
import Head from "next/head";

export default function Home(props) {
    const [open, setOpen] = useState(false);
    const [cues, setCues] = useState(false);
    const media = useRef<MediaElement>(null);

    // - This is a live subscription to the paused store.
    // - All stores are lazily subscribed to on prop access.
    const { currentTime, duration } = useMediaContext(media);
    const [currentCue, setCurrentCue] = useState(0);

    useEffect(() => {
      setCues(props.tree.cues)
    }, [])

    async function timeUpdate(event) {
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
  }

    const [time, setTime] = useState("");
    const [videoDuration, setVideoDuration] = useState("");

    useEffect(() => {
        const minutes = Math.floor(currentTime / 60);
        const seconds = (currentTime % 60).toFixed(0).padStart(2, "0");
        setTime(`${minutes}:${seconds}`);
    }, [currentTime]);

    useEffect(() => {
        const dur_minutes = Math.floor(duration / 60);
        const dur_seconds = (duration % 60).toFixed(0).padStart(2, "0");
        setVideoDuration(`${dur_minutes}:${dur_seconds}`);
    }, [duration]);

    return (
        <>
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
                <Media className={styles.videoWrapper} ref={media}>
                    <AspectRatio ratio="16/9">
                        <Hls className={styles.videoPlayer}>
                            <video
                                src={
                                  props.epData != null
                                    ? "https://cors.proxy.consumet.org/" + props.epData.sources[props.quality].url
                                    : ""
                                }
                                preload="none"
                                data-video="0"
                                className={styles.video}
                                onTimeUpdate={timeUpdate}
                            />
                        </Hls>
                    </AspectRatio>
                    <div className="media-overlay">
                        <div className="top-bar">
                            <div className="vidstackLogoWrapper">
                                <img
                                    className="vidstackLogo"
                                    src="https://media.discordapp.net/attachments/1018251990624641044/1067154803068764170/RLcAMyjL_400x400-removebg-preview.png"
                                    alt=""
                                />
                                <h4 className="vidstackTitle">
                                    Vidstack Player
                                </h4>
                                <span className="material-symbols-outlined">
                                    chevron_right
                                </span>
                            </div>
                                    <ToggleButton
                                        aria-label="Settings"
                                        onClick={() => {
                                            setOpen(!open);
                                        }}
                                        className="media-settings-button"
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
                                    </ToggleButton>
                        </div>
                        <div className="media-controls">
                            <div className="progressWrapper">
                                <h4 className="videoTime">{time}</h4>
                                <TimeSlider>
                                    <div className="slider-track"></div>
                                    <div className="slider-track fill"></div>
                                    <div className="slider-times">
                                        <div className="intro-time"></div>
                                    </div>
                                </TimeSlider>
                                <h4 className="videoTime">{videoDuration}</h4>
                            </div>

                            <div className="time">
                                <div className="playPauseWrapper">
                                    <div className="playWrapper">
                                        <PlayButton>
                                            <span className="material-symbols-outlined media-play-icon">
                                                play_arrow
                                            </span>
                                            <span className="material-symbols-outlined media-pause-icon">
                                                pause
                                            </span>
                                        </PlayButton>
                                    </div>
                                    <div className="volume-controls">
                                        <MuteButton>
                                            <span className="material-symbols-outlined media-mute-icon">
                                                volume_up
                                            </span>
                                            <svg
                                                className="media-unmute-icon"
                                                aria-hidden="true"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    fill="currentColor"
                                                    d="M5.889 16H2a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h3.889l5.294-4.332a.5.5 0 0 1 .817.387v15.89a.5.5 0 0 1-.817.387L5.89 16zm13.517 4.134l-1.416-1.416A8.978 8.978 0 0 0 21 12a8.982 8.982 0 0 0-3.304-6.968l1.42-1.42A10.976 10.976 0 0 1 23 12c0 3.223-1.386 6.122-3.594 8.134zm-3.543-3.543l-1.422-1.422A3.993 3.993 0 0 0 16 12c0-1.43-.75-2.685-1.88-3.392l1.439-1.439A5.991 5.991 0 0 1 18 12c0 1.842-.83 3.49-2.137 4.591z"
                                                />
                                            </svg>
                                        </MuteButton>
                                        <VolumeSlider>
                                            <div className="volume-track"></div>
                                            <div className="volume-track fill"></div>
                                        </VolumeSlider>
                                    </div>
                                </div>
                                <div className="title-wrapper">
                                    <h2 className="video-title">
                                        {props.data.title.english ?? props.data.title.romaji} : {props.data.episodes[props.epNumber - 1].title}
                                    </h2>
                                </div>
                                <div className="media-controls-buttons">
                                    <SettingsPanel isOpen={open} sources={props.epData.sources} subtitles={[]} />
                                    <CaptionButton />
                                    <FullscreenButton>
                                        <span className="material-symbols-outlined media-enter-fs-icon" style={{marginRight: '0', paddingRight: '0'}}>
                                            fullscreen
                                        </span>
                                        <svg
                                            className="media-exit-fs-icon"
                                            aria-hidden="true"
                                            viewBox="0 0 24 24"
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
                    <Gesture type="click" action="toggle:paused"></Gesture>
                    <Gesture
                        type="click"
                        repeat={1}
                        priority={1}
                        action="toggle:fullscreen"
                    ></Gesture>
                    <Gesture
                        className="seek-gesture left"
                        type="click"
                        repeat={1}
                        priority={0}
                        action="seek:-30"
                    ></Gesture>
                    <Gesture
                        className="seek-gesture right"
                        type="click"
                        repeat={1}
                        priority={0}
                        action="seek:30"
                    ></Gesture>
                </Media>
            </div>
        </>
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
  const webVtt = await axios.get(
    epData.subtitles[subtitleIndex].url
  );
  //console.log(webVtt.data);

  const tree = parser.parse(webVtt.data, "metadata");

  console.log(tree.cues[0]);

  // Pass data to the page via props
  return { props: { data, epData, quality, previewQuality, epNumber, tree } };
}
