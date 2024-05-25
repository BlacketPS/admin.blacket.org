import { ComponentType } from "react";

declare global {

    interface Fetch2Response {
        ok: boolean;
        status: number;
        data: any;
    }

    interface Window {
        fetch2: {
            get: (url: string) => Promise<Fetch2Response>;
            head: (url: string) => Promise<Fetch2Response>;
            post: (url: string, body: object) => Promise<Fetch2Response>;
            put: (url: string, body: object) => Promise<Fetch2Response>;
            delete: (url: string, body: object) => Promise<Fetch2Response>;
            patch: (url: string, body: object) => Promise<Fetch2Response>;
        };
    }
}

declare module "*.module.scss" {
    const content: { [className: string]: string };

    export default content;
}

declare module "@assets/*" {
    const content: string;

    export default content;
}

declare module "@components/*" {
    const content: ComponentType;

    export default content;
}

declare module "@controllers/*" {
    const content: ComponentType;

    export default content;
}

declare module "@functions/*" {
    const content: ComponentType;

    export default content;
}

declare module "@stores/*" {
    const content: ComponentType;

    export default content;
}
