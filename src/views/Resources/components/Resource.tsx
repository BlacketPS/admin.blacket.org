import styles from "../resources.module.scss";

import { ResourceProps } from "../resources.d";

export default function Resource({ resource, ...props }: ResourceProps) {

    const renderResource = () => {
        const extension = resource.path.split(".").pop()?.toLowerCase();

        if (!extension) return null;

        switch (extension) {
            case "jpg":
            case "jpeg":
            case "png":
            case "gif":
            case "webp":
                return <img src={`https://rewrite.blacket.org${resource.path}`} />;
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
        <div className={styles.resourceContainer}>
            {renderResource()}
            <div>[{resource.id}] {resource.path}</div>
        </div>
    );
}
