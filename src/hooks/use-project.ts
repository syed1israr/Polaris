/* eslint-disable react-hooks/purity */
import { useAuth } from "@clerk/nextjs"
import { useMutation, useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import { Id } from "../../convex/_generated/dataModel"


export const useProjectbyID = ( projectId : Id<"projects"> ) =>{
    return useQuery(api.projects.getById,{ id: projectId})
}

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

export const useRenameProject = () => {
  return useMutation(api.projects.rename).withOptimisticUpdate(
    (localStorage, args) => {
      const existing = localStorage.getQuery(api.projects.getById, {
        id: args.id,
      });

      if (existing) {
        localStorage.setQuery(
          api.projects.getById,
          { id: args.id },
          {
            ...existing,
            name: args.name,
            updatedAt: Date.now(),
          }
        );
      }

      const existingProjects = localStorage.getQuery(api.projects.get);

      if (existingProjects) {
        localStorage.setQuery(
          api.projects.get,
          {},
          existingProjects.map((m) =>
            m._id === args.id
              ? { ...m, name: args.name, updatedAt: Date.now() }
              : m
          )
        );
      }
    }
  );
};



