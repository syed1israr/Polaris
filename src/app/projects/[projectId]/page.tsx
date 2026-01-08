import ProjectIdView from '@/Features/Projects/Components/ProjectIdView';
import React from 'react'
import { Id } from '../../../../convex/_generated/dataModel';

const page = async ({params} : { params:Promise<{projectId : Id<"projects">}>}) => {
    const { projectId } = await params;
  return <ProjectIdView projectId={projectId} />
}

export default page