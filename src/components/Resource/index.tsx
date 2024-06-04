import styles from "./resource.module.scss";

import { ResourceProps } from "./resource.d";

function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

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
            case "avi":
            case "mov":
            case "wmv":
                return <i className="fas fa-file-video" />;
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
            <div>[{resource.id}] {hideGroup ? "" : (<><span style={{fontWeight:900}}>{resource.path.split("/")[2]}</span> / </>)}<span style={{fontWeight: 700}}>{resource.path?.split("/")?.pop()?.split(".")[0]}</span>.{resource.path?.split("/")?.pop()?.split(".").pop()}</div>
        </div>
    );
}
