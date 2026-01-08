import ProjectIdLayout from '@/Features/Projects/Components/project-layout';
import React from 'react'

const layout = async ({children,params}:{children:React.ReactNode, params:Promise<{projectId : string}>}) => {
const  { projectId } = await params;
    return (
   <ProjectIdLayout
   projectId={projectId} 
   
   >
    {children}
   </ProjectIdLayout>
  )
}

export default layout