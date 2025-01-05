'use server'

import {auth} from "@/auth";
import {parseServerActionResponse} from "@/lib/utils";
import slugify from "slugify";
import {writeClient} from "@/sanity/lib/write-client";

export const createPitch = async (state: any, form: FormData, pitch: string) => {
    const session = await auth();

    if (!session) parseServerActionResponse({error: 'Unauthorized', status: 'ERROR'})

    const {
        title,
        description,
        category,
        link
    } = Object.fromEntries(Array.from(form).filter(([key]) => key !== 'pitch'));
    const slug = slugify(title as string, {lower: true, strict: true})

    try {
        const startup = {
            title,
            description,
            category,
            image: link,
            slug: {
                _type: slug,
                current: slug
            },
            author: {
                _ref: session?.id,
                _type: 'reference'
            },
            pitch
        }
        const result = await writeClient.create({_type: 'startup', ...startup})

        return parseServerActionResponse({
            ...result,
            error: '',
            status: 'SUCCESS',
        })
    } catch (e) {
        console.log(e)
        return parseServerActionResponse({error: JSON.stringify(e), status: 'ERROR'})
    }
}