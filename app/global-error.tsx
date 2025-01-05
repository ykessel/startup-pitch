'use client';
import * as Sentry from "@sentry/nextjs";
import {useEffect} from "react";

export default function GlobalError({error}: { error: Error }) {
    useEffect(() => {
        Sentry.captureException(error);
    }, [error]);

    return (
        <html>
        <body>
        <h2>Something went wrong!</h2>
        <pre>{error?.message}</pre>
        </body>
        </html>
    );
}