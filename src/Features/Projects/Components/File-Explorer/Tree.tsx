import { useCreateFile, useCreateFolder, useDeleteFile, useFolderContents, useRenameFile } from '@/hooks/use-files'
import { cn } from '@/lib/utils'
import { FileIcon, FolderIcon } from '@react-symbols/icons/utils'
import { ChevronRightIcon } from 'lucide-react'
import { useState } from 'react'
import { Doc, Id } from '../../../../../convex/_generated/dataModel'
import { getItemPadding } from './Constants'
import CreateInput from './CreateInput'
import LoadingRow from './LoadingRow'
import RenameInput from './RenameInput'
import TreeItemWrapper from './TreeItemWrapper'

const Tree = ({item,level, projectId}:{
    item : Doc<"files">
    level?:number
    projectId:Id<"projects">
}) => {

  
    const [isOpen, setisOpen] = useState(false);
    const [isRenaming, setisRenaming] = useState(false);
    const [creating, setCreating] = useState<"file" | "folder" | null>(null);
    const renameFile = useRenameFile();
    const deleteFile = useDeleteFile();
    const createFile = useCreateFile();
    const createFolder = useCreateFolder();
    const folderContents = useFolderContents({
        projectId,
        parentId: item._id,
        enabled: item.type === "folder" && isOpen
    });
    const fileName = item.name;

    const startCreating = ( type : "file" | "folder") =>{
        setisOpen(true);
        setCreating(type);
    }

    const handleCreate = (name: string) =>{
        setCreating(null)
        if( creating === "file" ){
            createFile({
                projectId,
                name,
                content:"",
                parentId:item._id
            })
        }else{
             createFolder({
                projectId,
                name,
                parentId:item._id
            })
        }
    }

    const handleRename = (newName: string) =>{
        setisRenaming(false);
        if( newName === item.name ) return;
        renameFile({ id:item._id, newName})
    }
    
    // Render rename input for files or folders when renaming
    if (isRenaming) {
        return (
            <RenameInput
                type={item.type}
                level={level!}
                defaultValue={item.name}
                isOpen={isOpen}
                onSubmit={handleRename}
                onCancel={() => setisRenaming(false)}
            />
        );
    }

    if (item.type === "file") {
        return (
            <TreeItemWrapper
                item={item}
                level={level!}
                isActive={false}
                onClick={() => {}}
                onDoubleClick={() => {}}
                onRename={() => setisRenaming(true)}
                onDelete={() => {
                    deleteFile({ id: item._id });
                }}
            >
                <FileIcon fileName={fileName} autoAssign className="size-4" />
                <span className="truncate text-sm">{fileName}</span>
            </TreeItemWrapper>
        );
    }

    const folderName = item.name;
    // CAUTION : 😡😡😡
    const folderContent = (
        <>
            <div className='flex items-center gap-0.5'>
                <ChevronRightIcon
                className={cn("size-4 shrink-0 text-muted-foreground ", isOpen && "rotate-90")}
                />
                <FolderIcon folderName={folderName} className='size-4' />
            </div>       
            <span className='truncate text-sm'>
            {folderName}
            </span> 
        </>
    )
    // CAUTION : 😡😡😡

    if( creating ){
        return(
            <>
            <button 
            className='group flex items-center gap-1 h-5.5 hover:bg-accent/50 w-full'
            style={{ paddingLeft: getItemPadding(level!,false)}}
            onClick={() => setisOpen((p) => !p)}>
                {folderContent}
            </button>
              { isOpen && (
                    <>
                    { folderContents === undefined && <LoadingRow level={level! + 1}/>}
                    <CreateInput
                    type={creating}
                    level={level! + 1}
                    onSubmit={handleCreate}
                    onCancel={() => setCreating(null)}
                    />
                    { folderContents?.map((i) =>(
                        <Tree
                            key={i._id}
                            item={i}
                            level={level! + 1}
                            projectId={projectId}
                        />
                    )) }
                    </>
                )}
            </>
        )
    }
    if( isRenaming ){
        return(
            <>
            <RenameInput
            type="folder"
            level={level!}
            defaultValue={fileName}
            onSubmit={handleRename}
            onCancel={() => setisRenaming(false)}
            />
            { isOpen && (
                    <>
                    { folderContents === undefined && <LoadingRow level={level! + 1}/>}

                    { folderContents?.map((i) =>(
                        <Tree
                            key={i._id}
                            item={i}
                            level={level! + 1}
                            projectId={projectId}
                        />
                    )) }
                    </>
                )}
            </>
        )
    }
    return(
        <>
        <TreeItemWrapper
        item={item}
        level={level!}
        onClick={()=>{ setisOpen((v) => !v)}}
        
        onRename={()=>setisRenaming(true)}
        onDelete={()=>{
            deleteFile({ id : item._id })
        }}
        onCreateFile={() => startCreating("file")}
        onCreateFolder={() => startCreating("folder")}
        >
        { folderContent}    
        </TreeItemWrapper>
        {
            isOpen && (
                <>
                { folderContents === undefined && <LoadingRow level={level! + 1}/>}
                { folderContents?.map((m) => (
                    <Tree
                    key={m._id}
                    item={m}
                    level={level! + 1}
                    projectId={projectId}
                    />
                ))}
                </>
            )
        }
        </>
    )
   
}

export default Tree