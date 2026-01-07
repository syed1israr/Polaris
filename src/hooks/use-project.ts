/* eslint-disable react-hooks/purity */
import { useAuth } from "@clerk/nextjs"
import { useMutation, useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import { Id } from "../../convex/_generated/dataModel"




export const useProject = () =>{
    return useQuery(api.projects.get)
}

export const useProjectPartial = (limit : number) =>{
    return useQuery(api.projects.getPartial,{
        limit
    })
}


export const useCreateProject = () =>{
    const { userId } = useAuth();

    return useMutation(api.projects.create).withOptimisticUpdate(
        (localStorage, args) =>{
            const existing = localStorage.getQuery(api.projects.get);

            if( existing !== undefined ){
                const now = Date.now();

                const newProject = {
                    _id: crypto.randomUUID() as Id<"projects">,
                    _creationTime:now,
                    name:args.name,
                    ownerId: "anJan",
                    updatedAt:now
                };

                localStorage.setQuery(api.projects.get,{},[
                    newProject,
                    ...existing
                ])
            }
        }
    )
}