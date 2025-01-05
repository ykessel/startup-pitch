'use client'
import React, {useActionState, useState} from 'react';
import {Input} from "@/components/ui/input";
import MDEditor from "@uiw/react-md-editor";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {Send} from "lucide-react";
import {formSchema} from "@/lib/validation";
import z from "zod";
import {useToast} from "@/hooks/use-toast";
import {useRouter} from "next/navigation";
import {createPitch} from "@/lib/actions";

const StartupForm = () => {
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [pitch, setPitch] = useState('');
    const {toast} = useToast();
    const router = useRouter();
    const handleSubmit = async (prevState: object, formData: FormData) => {
        try {
            const formValues = {
                title: formData.get('title') as string,
                description: formData.get('description') as string,
                category: formData.get('category') as string,
                link: formData.get('link') as string,
                pitch
            };
            await formSchema.parseAsync(formValues);
            const result = await createPitch(prevState, formData, pitch)
            console.log('result', result);
            if (result.status === 'SUCCESS') {
                toast({
                    title: 'Success',
                    description: 'Your startup has been submitted successfully',
                    variant: 'default'
                })
                router.push(`/startup/${result?._id}`)
            }
            return result;
        } catch (error) {
            if (error instanceof z.ZodError) {
                const fieldErrors = error.flatten().fieldErrors
                setErrors(fieldErrors as unknown as Record<string, string>)
                toast({
                    title: 'Error',
                    description: 'Please check you inputs and try again',
                    variant: 'destructive'
                })
                return {...prevState, error: 'Form validation failed', status: 'ERROR'}
            }
            toast({
                title: 'Error',
                description: 'Something went wrong',
                variant: 'destructive'
            })
            return {...prevState, error: 'Something went wrong', status: 'ERROR'}
        }
    }
    const [, formAction, isPending] = useActionState(handleSubmit, {error: '', status: 'INITIAL'})

    return <form action={formAction} className={'startup-form'}>
        <div>
            <label htmlFor='title' className={'startup-form_label'}>Title</label>
            <Input id='title' name='title' required placeholder={"Startup Title"} className={'startup-form_input'}/>
            {errors?.title && <p className={'startup-form_error'}>{errors?.title}</p>}
        </div>

        <div>
            <label htmlFor='description' className={'startup-form_label'}>Description</label>
            <Textarea id='description' name='description' required placeholder={"Startup description"}
                      className={'startup-form_input'}/>
            {errors?.description && <p className={'startup-form_error'}>{errors?.description}</p>}
        </div>

        <div>
            <label htmlFor='category' className={'startup-form_label'}>Category</label>
            <Input id='category' name='category' required
                   placeholder={"Startup Category (Tech, Health, Education...)"} className={'startup-form_input'}/>
            {errors?.category && <p className={'startup-form_error'}>{errors?.category}</p>}
        </div>

        <div>
            <label htmlFor='link' className={'startup-form_label'}>Image Url</label>
            <Input id='link' name='link' required placeholder={"Startup image url"} className={'startup-form_input'}/>
            {errors?.link && <p className={'startup-form_error'}>{errors?.link}</p>}
        </div>

        <div>
            <label htmlFor='pitch' className={'startup-form_label'}>Pitch</label>
            <MDEditor
                data-color-mode={'light'}
                value={pitch}
                onChange={(value) => setPitch(value as string)}
                id={'pitch'}
                preview={'edit'}
                height={300}
                style={{borderRadius: 20, overflow: 'hidden'}}
                textareaProps={{
                    placeholder: "Briefly describe your idea and problem it solves"
                }}
                previewOptions={{
                    disallowedElements: ['style']
                }}
            />
            {errors?.link && <p className={'startup-form_error'}>{errors?.link}</p>}
        </div>
        <Button disabled={isPending} type={'submit'} className={'startup-form_btn text-white'}>
            {isPending ? 'Submitting...' : 'Submit your pitch'}
            <Send className={'size-6 ml-2'}/>
        </Button>
    </form>
};

export default StartupForm;