import { MediaToggleButton } from "@vidstack/react";

export function CaptionButton(props) {

    return (
        <MediaToggleButton aria-label="Caption"
        onClick={() => {
            props.setOpen((prev) => !prev)
        }}
        className="media-caption-button">
      <svg
                className="media-caption-icon"
                width="40"
                height="40"
                viewBox="0 0 22 18"
                fill="white"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                    display: props.open ? "none" : "block",
                    transition: "0.3s all ease",
                }}
                slot="on"
            >
                <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M1.08285 0.833618C0.760679 0.833618 0.499512 1.09479 0.499512 1.41695V16.5836C0.499512 16.9058 0.760679 17.167 1.08285 17.167H20.9162C21.2383 17.167 21.4995 16.9058 21.4995 16.5836V1.41695C21.4995 1.09479 21.2383 0.833618 20.9162 0.833618H1.08285ZM4.58334 13.6667C4.26118 13.6667 4.00001 13.4055 4.00001 13.0833V4.91667C4.00001 4.5945 4.26118 4.33333 4.58334 4.33333H9.25001C9.57218 4.33333 9.83334 4.5945 9.83334 4.91667V6.08333C9.83334 6.4055 9.57218 6.66667 9.25001 6.66667H6.45001C6.38558 6.66667 6.33334 6.7189 6.33334 6.78333V11.2167C6.33334 11.2811 6.38558 11.3333 6.45001 11.3333H9.25001C9.57218 11.3333 9.83334 11.5945 9.83334 11.9167V13.0833C9.83334 13.4055 9.57218 13.6667 9.25001 13.6667H4.58334ZM12.75 13.6667C12.4278 13.6667 12.1667 13.4055 12.1667 13.0833V4.91667C12.1667 4.5945 12.4278 4.33333 12.75 4.33333H17.4167C17.7388 4.33333 18 4.5945 18 4.91667V6.08333C18 6.4055 17.7388 6.66667 17.4167 6.66667H14.6167C14.5522 6.66667 14.5 6.7189 14.5 6.78333V11.2167C14.5 11.2811 14.5522 11.3333 14.6167 11.3333H17.4167C17.7388 11.3333 18 11.5945 18 11.9167V13.0833C18 13.4055 17.7388 13.6667 17.4167 13.6667H12.75Z"
                />
            </svg><svg
                className="media-caption-icon"
                width="64"
                height="64"
                viewBox="0 0 28 28"
                fill="white"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                    display: props.open ? "block" : "none",
                    transition: "0.3s all ease",
                }}
                slot="off"
            >
                <path d="M7 24.5003C7 24.1781 7.26117 23.9169 7.58333 23.9169H20.4167C20.7388 23.9169 21 24.1781 21 24.5003V25.6669C21 25.9891 20.7388 26.2503 20.4167 26.2503H7.58333C7.26117 26.2503 7 25.9891 7 25.6669V24.5003Z" />
                <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M4.08278 5.83362C3.76062 5.83362 3.49945 6.09479 3.49945 6.41695V21.5836C3.49945 21.9058 3.76062 22.167 4.08278 22.167H23.9161C24.2383 22.167 24.4994 21.9058 24.4994 21.5836V6.41695C24.4994 6.09479 24.2383 5.83362 23.9161 5.83362H4.08278ZM7.58328 18.6667C7.26112 18.6667 6.99995 18.4055 6.99995 18.0833V9.91667C6.99995 9.5945 7.26112 9.33333 7.58328 9.33333H12.2499C12.5721 9.33333 12.8333 9.5945 12.8333 9.91667V11.0833C12.8333 11.4055 12.5721 11.6667 12.2499 11.6667H9.44995C9.38552 11.6667 9.33328 11.7189 9.33328 11.7833V16.2167C9.33328 16.2811 9.38552 16.3333 9.44995 16.3333H12.2499C12.5721 16.3333 12.8333 16.5945 12.8333 16.9167V18.0833C12.8333 18.4055 12.5721 18.6667 12.2499 18.6667H7.58328ZM15.7499 18.6667C15.4278 18.6667 15.1666 18.4055 15.1666 18.0833V9.91667C15.1666 9.5945 15.4278 9.33333 15.7499 9.33333H20.4166C20.7388 9.33333 20.9999 9.5945 20.9999 9.91667V11.0833C20.9999 11.4055 20.7388 11.6667 20.4166 11.6667H17.6166C17.5522 11.6667 17.4999 11.7189 17.4999 11.7833V16.2167C17.4999 16.2811 17.5522 16.3333 17.6166 16.3333H20.4166C20.7388 16.3333 20.9999 16.5945 20.9999 16.9167V18.0833C20.9999 18.4055 20.7388 18.6667 20.4166 18.6667H15.7499Z"
                />
            </svg>
    </MediaToggleButton>
    );
}
