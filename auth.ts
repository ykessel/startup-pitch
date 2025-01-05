import NextAuth from "next-auth"
import GitHub from 'next-auth/providers/github'
import {client} from "@/sanity/lib/client"
import {AUTHOR_BY_GITHUB_ID_QUERY} from "@/sanity/lib/queries"
import {writeClient} from "@/sanity/lib/write-client"

// Create a reusable client instance with CDN disabled
const sanityClient = client.withConfig({useCdn: false})

export const {handlers, signIn, signOut, auth} = NextAuth({
    providers: [GitHub],
    callbacks: {
        async signIn({user, profile}) {
            try {
                if (!profile?.id) return false

                const existUser = await sanityClient.withConfig({useCdn: false}).fetch(AUTHOR_BY_GITHUB_ID_QUERY, {
                    id: profile.id
                })

                if (!existUser) {
                    await writeClient.create({
                        _type: 'author',
                        id: profile.id,
                        name: user.name ?? '',
                        username: profile.login ?? '',
                        email: user.email ?? '',
                        image: user.image ?? '',
                        bio: profile.bio ?? ''
                    })
                }

                return true
            } catch (error) {
                console.error('SignIn error:', error)
                return false
            }
        },
        async jwt({token, account, profile}) {
            try {
                if (account && profile?.id) {
                    const user = await client.withConfig({useCdn: false}).fetch(AUTHOR_BY_GITHUB_ID_QUERY, {
                        id: profile.id
                    })
                    token.id = user?._id
                }
                return token
            } catch (error) {
                console.error('JWT error:', error)
                return token
            }
        },
        async session({session, token}) {
            return {
                ...session,
                id: token.id
            }
        }
    }
})
