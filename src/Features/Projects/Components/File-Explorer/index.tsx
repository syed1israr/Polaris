import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { ChevronRightIcon, CopyMinusIcon, FilePlusCornerIcon, FolderPlusIcon } from "lucide-react"
import { useState } from "react"
import { Id } from "../../../../../convex/_generated/dataModel"
import { useProject, useProjectbyID } from "@/hooks/use-project"
import { Button } from "@/components/ui/button"
import { useCreateFile, useCreateFolder, useFolderContents } from "@/hooks/use-files"
import CreateInput from "./CreateInput"
import LoadingRow from "./LoadingRow"
import Tree from "./Tree"



export const FileExplorer = ({ projectId }: { projectId: Id<"projects"> }) => {
    const [collapseKey, setCollapseKey] = useState(0)
    const [creating, setCreating] = useState<"file" | "folder" | null>(null)
    const [isOpen, setisOpen] = useState(false)
    const project = useProjectbyID(projectId);

    const createFile = useCreateFile();
    const createFolder = useCreateFolder();

    const handleCreate = (name: string) =>{
        setCreating(null);
        if( creating === "file" ){
            createFile({
                projectId,
                name,
                content:"",
                parentId:undefined
            })
        }else {
            createFolder({
                projectId,
                name,
                parentId:undefined
            })
        }
    }
    const rootFiles = useFolderContents({ projectId, enabled:isOpen})

    return (
        <div className="h-full bg-sidebar">
            <ScrollArea>
                <div role="button" onClick={() => setisOpen((p) => !p)}
                    className="group/project w-full flex text-left items-center cursor-pointer h-5.5 bg-accent gap-0.5 font-bold"
                    >
                    <ChevronRightIcon 
                    className={ cn(
                        "size-4 shrink-0 text-muted-foreground",
                        isOpen && "rotate-90"
                    )}
                    />
                     <p className="text-sm uppercase line-clamp-1">{ project?.name ?? "Loading..."}</p>
                    <div className="opacity-0 group-hover/project:opacity-100 transition-none duration-0 flex items-center gap-0.5 ml-auto">
                    <Button
                    variant={"highlight"}
                    size={"icon-xs"}
                    onClick={(e) =>{
                        e.stopPropagation();
                        e.preventDefault();
                        setisOpen(true);
                        setCreating("file")
                    }}
                    >
                    <FilePlusCornerIcon className="size-3.5"/>
                    </Button>
                    <Button
                    variant={"highlight"}
                    size={"icon-xs"}
                    onClick={(e) =>{
                        e.stopPropagation();
                        e.preventDefault();
                        setisOpen(true);
                        setCreating("folder")
                    }}
                    >
                    <FolderPlusIcon className="size-3.5"/>
                    </Button>
                    <Button
                    variant={"highlight"}
                    size={"icon-xs"}
                    onClick={(e) =>{
                        e.stopPropagation();
                        e.preventDefault();
                        setCollapseKey((p) => p + 1);
                    }}
                    >
                    <CopyMinusIcon className="size-3.5"/>
                    </Button>
                    </div>
                </div>
                                 { isOpen && (
                                     <>
                                         {rootFiles === undefined && <LoadingRow level={0} />}
                                         {creating && (
                                             <CreateInput
                                                 type={creating}
                                                 level={0}
                                                 onSubmit={handleCreate}
                                                 onCancel={() => setCreating(null)}
                                             />
                                         )}
                                     </>
                                 )}
                                {rootFiles?.map((f) => (
                                    <Tree
                                        key={`${f._id}-${collapseKey}`}
                                        item={f}
                                        level={0}
                                        projectId={projectId}
                                    />
                                ))}
            </ScrollArea>
        </div>
    )
}