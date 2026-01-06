'use client'

import { Button } from "@/components/ui/button"
import { useState } from "react"

const page = () => {
    const [loading, setloading] = useState(false)
    const [loading1, setloading1] = useState(false)

    const handleer = async() =>{
        setloading(true);
        await fetch('/api/demo/blocking',{method:"POST"})
        setloading(false);
    }
    const backgroundHandler = async() =>{
        setloading1(true);
        await fetch('/api/demo/background',{method:"POST"})
        setloading1(false);
    }
  return (
    <div className="p-8 space-x-4 ">
        <Button disabled={loading} onClick={handleer}>
            { loading ? "loading" : "blocking"}
        </Button>
        <Button disabled={loading1} onClick={backgroundHandler}>
            { loading1 ? "loading" : "background"}
        </Button>
    </div>
  )
}

export default page