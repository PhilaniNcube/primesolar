"use client";

import { type ReactNode, createContext, useRef, useContext } from 'react'
import { useStore } from 'zustand'

import  {type ConfigStore, createConfigStore, initConfigStore } from '@/stores/solar-config-store'

export type ConfigStoreApi = ReturnType<typeof createConfigStore>

export const ConfigStoreContext = createContext<ConfigStoreApi | undefined>(undefined)

export interface ConfigStoreProviderProps {
  children: ReactNode
}

export const ConfigStoreProvider = ({children}: ConfigStoreProviderProps) => {
  const storeRef = useRef<ConfigStoreApi>()

  if(!storeRef.current) {
    storeRef.current = createConfigStore(initConfigStore())
  }

  return (
    <ConfigStoreContext.Provider value={storeRef.current}>
      {children}
    </ConfigStoreContext.Provider>
  )
}

export const useConfigStore = <T,>(selector: (store:ConfigStore) => T): T => {
  const configStoreContext = useContext(ConfigStoreContext)

  if (!configStoreContext) {
    throw new Error('useConfigStore must be used within a ConfigStoreProvider')
  }

  return useStore(configStoreContext, selector)
}




