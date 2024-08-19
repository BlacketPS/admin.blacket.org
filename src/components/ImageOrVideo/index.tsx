import { ImageOrVideoProps } from "./imageOrVideo.d";

export default function ImageOrVideo({ src, alt, ...props }: ImageOrVideoProps) {
    if (src && ["mp4", "webm"].includes(src.split(".").pop()!)) return (
        <video
            src={src}
            autoPlay
            muted
            loop
            controls={false}
            {...props}
        />
    );
    else return (
        <img
            src={src}
            alt={alt}
            {...props}
        />
    );
}