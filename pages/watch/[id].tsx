import styles from "../../styles/Watch.module.scss";
import {
  AspectRatio,
  FullscreenButton,
  Gesture,
  Media,
  MuteButton,
  Time,
  TimeSlider,
  ToggleButton,
  VolumeSlider,
} from "@vidstack/player-react";
import "@vidstack/player/hydrate.js";
import { Hls } from "@vidstack/player-react";
import { PlayButton } from "@vidstack/player-react";
import { CaptionButton } from "../../components/caption_button";
import { SettingsPanel } from "../../components/setting_panel";
import { useState } from "react";

export default function Home(props) {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.container}>
      <Media className={styles.videoWrapper}>
        <AspectRatio ratio="16/9">
          <Hls
            poster={
              props.data != null
                ? "https://cors.proxy.consumet.org/" + props.data.cover
                : ""
            }
            className={styles.videoPlayer}
          >
            <video
              src={
                props.epData != null
                  ? props.epData.sources[props.quality].url
                  : ""
              }
              preload="none"
              data-video="0"
              className={styles.video}
            />
          </Hls>
        </AspectRatio>
        <div className="media-overlay">
          <div className="top-bar">
            <h2 className="anime-title">
              {props.data != null
                ? props.data.title.english ?? props.data.title.english
                : ""}
            </h2>
            <h2 className="episode-title">
              {props.data != null ? props.data.episodes[0].title : ""}
            </h2>
          </div>
          <div className="playWrapper">
            <PlayButton>
              <svg
                className="media-play-icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 384 512"
              >
                <path
                  fill="white"
                  d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"
                />
              </svg>
              <svg
                className="media-pause-icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
              >
                <path
                  fill="white"
                  d="M48 64C21.5 64 0 85.5 0 112V400c0 26.5 21.5 48 48 48H80c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zm192 0c-26.5 0-48 21.5-48 48V400c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H240z"
                />
              </svg>
            </PlayButton>
          </div>
          <div className="media-controls">
            <div className="media-controls-buttons">
              <CaptionButton />
              <ToggleButton
                aria-label="Settings"
                onClick={() => {
                  setOpen(!open);
                }}
              >
                <svg
                  className="media-settings-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  style={{
                    transform: open ? "rotate(35deg)" : "rotate(0deg)",
                    transition: "0.3s all ease",
                  }}
                >
                  <path
                    fill="white"
                    d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336c44.2 0 80-35.8 80-80s-35.8-80-80-80s-80 35.8-80 80s35.8 80 80 80z"
                  />
                </svg>
              </ToggleButton>
              <SettingsPanel isOpen={open} sources={props.epData.sources} />
              <FullscreenButton>
                <svg
                  className="media-enter-fs-icon"
                  aria-hidden="true"
                  viewBox="0 0 24 24"
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
                >
                  <path
                    fill="currentColor"
                    d="M18 7h4v2h-6V3h2v4zM8 9H2V7h4V3h2v6zm10 8v4h-2v-6h6v2h-4zM8 15v6H6v-4H2v-2h6z"
                  />
                </svg>
              </FullscreenButton>
              <svg
                className="media-next-icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
              >
                <path
                  fill="white"
                  d="M52.5 440.6c-9.5 7.9-22.8 9.7-34.1 4.4S0 428.4 0 416V96C0 83.6 7.2 72.3 18.4 67s24.5-3.6 34.1 4.4l192 160L256 241V96c0-17.7 14.3-32 32-32s32 14.3 32 32V416c0 17.7-14.3 32-32 32s-32-14.3-32-32V271l-11.5 9.6-192 160z"
                />
              </svg>
            </div>
            <TimeSlider>
              <div className="slider-track"></div>
              <div className="slider-track fill"></div>
              <div className="slider-times">
                <div className="intro-time"></div>
              </div>
            </TimeSlider>
            <div className="time">
              <div className="volume-controls">
                <MuteButton>
                  <svg
                    className="media-mute-icon"
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M5.889 16H2a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h3.889l5.294-4.332a.5.5 0 0 1 .817.387v15.89a.5.5 0 0 1-.817.387L5.89 16zm14.525-4l3.536 3.536l-1.414 1.414L19 13.414l-3.536 3.536l-1.414-1.414L17.586 12L14.05 8.464l1.414-1.414L19 10.586l3.536-3.536l1.414 1.414L20.414 12z"
                    />
                  </svg>
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
              <div>
                <Time type="current" />
              </div>
              /
              <div>
                <Time type="duration" />
              </div>
            </div>
          </div>
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
  );
}

export async function getServerSideProps(context) {
  // Fetch data from external API
  const id = context.params.id;

  console.log(id);

  const url = `https://api.consumet.org/meta/anilist/info/${id}`;

  console.log(url);

  const res = await fetch(url);
  const data = await res.json();

  console.log(data);

  const epRes = await fetch(
    `https://api.consumet.org/meta/anilist/watch/${data.episodes[0].id}`
  );
  const epData = await epRes.json();

  let quality = 0;

  epData.sources.forEach((episode, index) => {
    if (episode.quality == "1080p") {
      quality = index;
    }
  });

  // Pass data to the page via props
  return { props: { data, epData, quality } };
}