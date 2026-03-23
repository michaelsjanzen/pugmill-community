"use client";
import { createContext, useContext, useState } from "react";

interface DesignSaveContextValue {
  isSaving: boolean;
  setIsSaving: (v: boolean) => void;
}

const DesignSaveContext = createContext<DesignSaveContextValue>({
  isSaving: false,
  setIsSaving: () => {},
});

export function DesignSaveProvider({ children }: { children: React.ReactNode }) {
  const [isSaving, setIsSaving] = useState(false);
  return (
    <DesignSaveContext.Provider value={{ isSaving, setIsSaving }}>
      {children}
    </DesignSaveContext.Provider>
  );
}

export function useDesignSave() {
  return useContext(DesignSaveContext);
}
