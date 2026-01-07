import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useProject } from "@/hooks/use-project";
import { useRouter } from "next/navigation";

import { Doc } from "../../../../convex/_generated/dataModel";
import { FaGithub } from "react-icons/fa";
import { AlertCircleIcon, GlobeIcon, Loader2Icon } from "lucide-react";
import { getProjectIcon } from "./ProjectsList";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}



//  const getProjectIcon = ({data} : {
//     data : Doc<"projects">
// }) =>{
//     if( data.importStatus === "completed" ){
//         return <FaGithub className="size-3.5 text-muted-foreground"/>
//     }else if( data.importStatus === "failed" ){
//         return <AlertCircleIcon className="size-3.5 text-muted-foreground"/>
//     }else if( data.importStatus === "importing" ) {
//         return <Loader2Icon className="size-3.5 text-muted-foreground animate-spin"/>
//     }

//     return <GlobeIcon className="size-3.5 text-muted-foreground"/>
// }


export const ProjectsCommandDialog = ({
    open,
    onOpenChange
}: Props) => {
    const router = useRouter();
    const projects = useProject();

    const handleSelect = (projectId: string) => {
        router.push(`/projects/${projectId}`);
        onOpenChange(false);
    };

    return (
        <CommandDialog
        open={open}
        onOpenChange={onOpenChange}
        title="Search Project"
        description="Search and navigate to your projects"
        >
        <CommandInput placeholder="Search Projects"/>
        <CommandList>
            <CommandEmpty>No projects found</CommandEmpty>
            <CommandGroup heading="projects">
               {  projects?.map((p) => {
                return(
                    <CommandItem
                    key={p._id}
                    value={`${p.name}-${p._id}`}
                    onSelect={()=>handleSelect(p._id)}
                    >
                        { getProjectIcon({data:p})}
                        <span>{p.name}</span>
                    </CommandItem>
                )
               })}
            </CommandGroup>
        </CommandList>
        </CommandDialog>
    );
};
