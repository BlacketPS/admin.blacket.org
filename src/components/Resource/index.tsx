import { ResourceProps } from "./resource.d";
import styles from "./resource.module.scss";

export default function Resource({ resource, fit = false, hideGroup = false, ...props }: ResourceProps) {
    const renderResource = () => {
        const extension = resource.path.split(".").pop()?.toLowerCase();

        if (!extension) return null;

        switch (extension) {
            case "jpg":
            case "jpeg":
            case "png":
            case "gif":
            case "webp":
                return <img src={resource.path} />;
            case "mp4":
            case "webm":
                return <video src={resource.path} autoPlay muted loop controls={false} />;
            case "mp3":
            case "wav":
            case "ogg":
                return <i className="fas fa-file-audio" />;
            case "ttf":
            case "otf":
            case "woff":
            case "woff2":
                return <i className="fas fa-font-case" />;
            default:
                return <i className="fas fa-file" />;
        }

    };

    return (
        <div className={styles.resourceContainer} style={{
            width: fit && "fit-content" || undefined,
            height: fit && "fit-content" || undefined,
            ...props.style
        }} {...props}>
            {renderResource()}
            <div>[{resource.id}] <b>{resource.path}</b></div>
        </div>
    );
}
