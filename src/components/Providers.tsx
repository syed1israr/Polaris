'use client';


import { AuthLoadingView } from "@/Features/auth/Components/Authloading-view";
import { UnauthenticatedView } from "@/Features/auth/Components/Unauthenticated-view";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { Authenticated, AuthLoading, ConvexReactClient, Unauthenticated } from "convex/react";
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import React from "react";
import { ThemeProvider } from "./theme-provider";


const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);



export const Providers = ({ children } : { children : React.ReactNode} ) =>{
    return(
        <ClerkProvider>
            <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
                <ThemeProvider
                attribute={"class"}
                defaultTheme="dark"
                enableSystem
                disableTransitionOnChange
                >
                     <Authenticated>
                        {children}
                     </Authenticated>
                     <Unauthenticated>
                        <UnauthenticatedView/>
                     </Unauthenticated>
                     <AuthLoading>
                        <AuthLoadingView/>
                     </AuthLoading>
                </ThemeProvider>  
            </ConvexProviderWithClerk>
        </ClerkProvider>
    )
}