"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Id } from "../../../../convex/_generated/dataModel";
import { FaGithub } from "react-icons/fa";

type TabProps = {
  label: string;
  isActive: boolean;
  onClick: () => void;
};

const Tab = ({ label, isActive, onClick }: TabProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 h-full cursor-pointer px-3 text-muted-foreground border-r hover:bg-accent/30",
        isActive && "bg-background text-foreground"
      )}
    >
      <span className="text-sm">{label}</span>
    </div>
  );
};

const ProjectIdView = ({ projectId }: { projectId: Id<"projects"> }) => {
  const [activeTab, setActiveTab] = useState<"code" | "preview">("code");

  return (
    <div className="h-full flex flex-col">
      <nav className="h-8.75 flex items-center bg-sidebar border-b">
        <Tab
          label="Code"
          isActive={activeTab === "code"}
          onClick={() => setActiveTab("code")}
        />
        <Tab
          label="Preview"
          isActive={activeTab === "preview"}
          onClick={() => setActiveTab("preview")}
        />

        <div className="flex-1 flex justify-end h-full">
            <div className="flex items-center gap-2 h-full cursor-pointer px-3 text-muted-foreground border-r hover:bg-accent/30">
                <FaGithub className="size-3.5"/>
                <span className="text-sm">Export to Github</span>
            </div>
        </div>
      </nav>

      <div className="flex-1">
        {activeTab === "code" && (
          <div className="p-4">Code view for project {projectId}</div>
        )}
        {activeTab === "preview" && (
          <div className="p-4">Preview view for project {projectId}</div>
        )}
      </div>

    </div>
  );
};

export default ProjectIdView;
