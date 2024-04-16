/* eslint-disable no-var */

declare global {
    interface Window {
        fetch2: {
            get: (url: string) => Promise<any>;
            head: (url: string) => Promise<any>;
            post: (url: string, body: JSON) => Promise<any>;
            put: (url: string, body: JSON) => Promise<any>;
            delete: (url: string, body: JSON) => Promise<any>;
            connect: (url: string, body: JSON) => Promise<any>;
            options: (url: string, body: JSON) => Promise<any>;
            trace: (url: string, body: JSON) => Promise<any>;
            patch: (url: string, body: JSON) => Promise<any>;
        }
    }
}

export enum HTTPMethod {
    GET = "GET",
    HEAD = "HEAD",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
    CONNECT = "CONNECT",
    OPTIONS = "OPTIONS",
    TRACE = "TRACE",
    PATCH = "PATCH"
}

const fetchInterceptor = (method: HTTPMethod) => (url: string, body: JSON) => new Promise((resolve, reject) => window.fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
})
    .then(async (response) => {
        try {
            var data = await response.json();
        } catch {
            var data = null;
        }

        if (!response.ok) reject({
            ok: false,
            status: response.status,
            data: data
        });
        else resolve({
            ok: true,
            status: response.status,
            data: data
        });
    })
    .catch((error) => reject(error)));

window.fetch2 = {
    get: fetchInterceptor(HTTPMethod.GET),
    head: fetchInterceptor(HTTPMethod.HEAD),
    post: fetchInterceptor(HTTPMethod.POST),
    put: fetchInterceptor(HTTPMethod.PUT),
    delete: fetchInterceptor(HTTPMethod.DELETE),
    connect: fetchInterceptor(HTTPMethod.CONNECT),
    options: fetchInterceptor(HTTPMethod.OPTIONS),
    trace: fetchInterceptor(HTTPMethod.TRACE),
    patch: fetchInterceptor(HTTPMethod.PATCH)
} as any;
