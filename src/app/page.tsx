'use client'
import { Button } from "@/components/ui/button"
import { useMutation, useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"

const page = () => {
  const projects = useQuery(api.projects.get);
  const createProject = useMutation(api.projects.create);
  return (
    <div className="flex flex-col gap-2 p-4">
      <h1 className="text-3xl font-bold">Hello, Polaris!</h1>
      <Button onClick={() => createProject({
        name:"me"
      })} className="m-1.5"> add new </Button>
      {projects?.map((project) => (
        <div key={project._id} className="p-2 border-b flex flex-col rounded-2xl">
           {project.name}
           <br/>
          { project.ownerId }
        </div>
      ))}
    </div>
  )
}

export default page