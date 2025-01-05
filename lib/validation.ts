import z from 'zod';

export const formSchema = z.object({
    title: z.string().min(3).max(100),
    description: z.string().min(20).max(500),
    category: z.string().min(3).max(20),
    link: z.string().url().refine(async (link) => {
        try {
            const res = await fetch(link);
            const contentType = res.headers.get('content-type');
            return contentType?.startsWith('image/');
        } catch {
            return false
        }
    }),
    pitch: z.string().min(10)
})