import React from 'react';
import {auth} from "@/auth";
import {redirect} from "next/navigation";
import StartupForm from "@/components/core/StartupForm";

const Page = async () => {
    const session = await auth()
    if (!session) return redirect('/')

    return (
        <>
            <section className={'pink_container !min-h-[230px]'}>
                <h1 className='heading'>Submit you startup</h1>
            </section>
            <section className={'section_container'}>
                <StartupForm/>
            </section>
        </>
    );
};

export default Page;