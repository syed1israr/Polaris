
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { verifyAuth } from "./auth";
import { Id } from "./_generated/dataModel";




export const getFiles = query({
    args:{ projectId:v.id("projects")},
    handler: async(ctx,args) =>{

        const identity = await verifyAuth(ctx);
        const project = await ctx.db.get("projects",args.projectId);
        if( !project ){
            throw new Error("Project not found")
        }

        if( project.ownerId !== identity.subject ){
            throw new Error("Unauthorized to access this project")
        }

        return await ctx.db
        .query("files")
        .withIndex("by_project",(q) => q.eq("projectId",args.projectId))
        .collect()
    }
})

export const getFolderContents = query({
    args:{ projectId:v.id("projects"), parentId: v.optional(v.id("files"))},
    handler: async(ctx,args) =>{

        const identity = await verifyAuth(ctx);
        const project = await ctx.db.get("projects",args.projectId);

        if( !project ){
            throw new Error("Project not found")
        }

        if( project.ownerId !== identity.subject ){
            throw new Error("Unauthorized to access this project")
        }

        const files = await ctx.db.query("files")
        .withIndex("by_project_parent", (q) => (
            q.eq("projectId",args.projectId)
             .eq("parentId",args.parentId)
        ))
        .collect()

        return files.sort((a,b) =>{
            if( a.type === "folder" && b.type === "file" ) return -1;
            if( a.type === "file" && b.type === "folder" ) return 1;

            return a.name.localeCompare(b.name);
        })
        
    }
})

export const createFile = mutation({
    args:{ projectId:v.id("projects"),
         parentId: v.optional(v.id("files")),
        name: v.string(),
        content:v.string()
        },
    handler: async(ctx,args) =>{

        const identity = await verifyAuth(ctx);
        const project = await ctx.db.get("projects",args.projectId);

        if( !project ){
            throw new Error("Project not found")
        }

        if( project.ownerId !== identity.subject ){
            throw new Error("Unauthorized to access this project")
        }


        const files = await ctx.db.query("files")
        .withIndex("by_project_parent", (q) => (
            q.eq("projectId",args.projectId)
             .eq("parentId",args.parentId)
        ))
        .collect()

        const exisitngFile = files.find((f)=>f.name == args.name && f.type === "file" )
        
        if( exisitngFile ){
            throw new Error("File already Exists");
        }
        
        await ctx.db.insert("files",{
            projectId:args.projectId,
            name:args.name,
            content: args.content,
            type:"file",
            parentId:args.parentId,
            updatedAt:Date.now()
        })

        await ctx.db.patch("projects",args.projectId,{
            updatedAt:Date.now()
        })
    }
})


export const createFolder = mutation({
    args:{ projectId:v.id("projects"),
         parentId: v.optional(v.id("files")),
        name: v.string(),
        },
    handler: async(ctx,args) =>{

        const identity = await verifyAuth(ctx);
        const project = await ctx.db.get("projects",args.projectId);

        if( !project ){
            throw new Error("Project not found")
        }

        if( project.ownerId !== identity.subject ){
            throw new Error("Unauthorized to access this project")
        }


        const folder = await ctx.db.query("files")
        .withIndex("by_project_parent", (q) => (
            q.eq("projectId",args.projectId)
             .eq("parentId",args.parentId)
        ))
        .collect()

        const exisitngFile = folder.find((f)=>f.name == args.name && f.type === "folder" )
        
        if( exisitngFile ){
            throw new Error("folder already Exists");
        }

        await ctx.db.insert("files",{
            projectId:args.projectId,
            name:args.name,
            type:"folder",
            parentId:args.parentId,
            updatedAt:Date.now()
        })
        await ctx.db.patch("projects",args.projectId,{
            updatedAt:Date.now()
        })
    }
})


export const renameFile = mutation({
    args:{
        id:v.id("files"),
        newName:v.string()
    }
,handler: async(ctx, args) =>{
    const identity = await verifyAuth(ctx);
    const file = await ctx.db.get("files",args.id);
    if( !file ) {
        throw new Error("File not found")
    }
    const project = await ctx.db.get("projects",file.projectId);

    if( !project ){
        throw new Error("Project not found")
    }

    if( project.ownerId !== identity.subject ){
        throw new Error("Unauthorized to access this project")
    }

    const sib = await ctx.db.query("files")
    .withIndex("by_project_parent", (q) =>
    q.eq("projectId",file.projectId)
      .eq("parentId",file.parentId)
    ).collect()
    
    const exisitng = sib.find((s) =>
        s.name === args.newName &&
        s.type === file.type &&
        s._id !== args.id
    )

    if( exisitng ){
        throw new Error(`A ${file.type} with this name already exists in this location`)
    }
     
    await ctx.db.patch("files",args.id,{
        name:args.newName,
        updatedAt:Date.now()
    })
    await ctx.db.patch("projects",file.projectId,{
            updatedAt:Date.now()
    })
}})


export const deleteFile = mutation({
    args:{
        id:v.id("files"),
    }
,handler: async(ctx, args) =>{
    const identity = await verifyAuth(ctx);
    const file = await ctx.db.get("files",args.id);
    if( !file ) {
        throw new Error("File not found")
    }
    const project = await ctx.db.get("projects",file.projectId);

    if( !project ){
        throw new Error("Project not found")
    }

    if( project.ownerId !== identity.subject ){
        throw new Error("Unauthorized to access this project")
    }
    const deleteRecursive = async(fileId: Id<"files">) =>{
        const item = await ctx.db.get("files",fileId);
        if( !item ) return;
        if( item.type === "folder" ){

            // Find children whose parentId is this folder's id (was incorrectly using item.parentId)
            const c = await ctx.db
            .query("files")
            .withIndex("by_project_parent", (q) => 
            q.eq("projectId", item.projectId).eq("parentId", item._id)
            ).collect();

            // If there are a very large number of children, consider processing in pages
            for (const child of c) {
                await deleteRecursive(child._id);
            }
        }
        if( item.storageId ){
            await ctx.storage.delete(item.storageId);
        }
           await ctx.db.delete("files",fileId);
           await ctx.db.patch("projects",file.projectId,{
            updatedAt:Date.now()
        })
    };

    await deleteRecursive(args.id);

}})



export const updateFile = mutation({
    args:{
        id:v.id("files"),
        content:v.string()
    },
    handler: async( ctx, args) => {
        const identity = await verifyAuth(ctx);
        const file = await ctx.db.get("files",args.id);
        if( !file ) {
            throw new Error("File not found")
        }
        const project = await ctx.db.get("projects",file.projectId);

        if( !project ){
            throw new Error("Project not found")
        }

        if( project.ownerId !== identity.subject ){
            throw new Error("Unauthorized to access this project")
        }

        const now = Date.now();

        await ctx.db.patch("files",args.id,{
            content:args.content,
            updatedAt:now
        })

        await ctx.db.patch("projects",file.projectId,{
            updatedAt:now
        })
    
    },
});

export const getFile = query({
    args:{  id: v.id("files") },
    handler: async(ctx,args) =>{

        const identity = await verifyAuth(ctx);
        const file = await ctx.db.get("files",args.id);
        if( !file ){
            throw new Error("File not found")
        }
        const project = await ctx.db.get("projects",file.projectId);


       if( !project ){
            throw new Error("Project not found")
        }

         if( project.ownerId !== identity.subject ){
            throw new Error("Unauthorized to access this project")
        }

        return file;
    }
})

