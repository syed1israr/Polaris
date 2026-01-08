import { cn } from '@/lib/utils'
import React from 'react'
import { getItemPadding } from './Constants'
import { Spinner } from '@/components/ui/spinner'

const LoadingRow = ({level = 0, className} :{ level?:number,className?:string}) => {
  return (
    <div className={cn(
        "h-5.5 flex items-center text-muted-foreground",
        className
    )}
    style={{ paddingLeft: getItemPadding(level,true)}}
    >
        <Spinner className='size-4 text-ring ml-0.5'/>
    </div>
  )
}

export default LoadingRow