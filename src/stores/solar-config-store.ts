import { createStore } from "zustand/vanilla";
import { batteries, Battery, Inverter, inverters, SolarPanel, solarPanels } from "./data";

export type ConfigState = {
  electricityBill: number;
  averageElectricityPrice: number;
  depthOfDischarge: number;
  batteryQuantity: number;
  inverterQuantity: number;
  solarPanelQuantity: number;
  battery: Battery;
  inverter: Inverter;
  solarPanel: SolarPanel;
};

export type ConfigActions = {
  setElectricityBill: (bill: number) => void;
  setAverageElectricityPrice: (price: number) => void;
  setDepthOfDischarge: (depth: number) => void;
  setBatteryQuantity: (quantity: number) => void;
  setInverterQuantity: (quantity: number) => void;
  setSolarPanelQuantity: (quantity: number) => void;
  setBattery: (battery: Battery) => void;
  setInverter: (inverter: Inverter) => void;
  setSolarPanel: (solarPanel: SolarPanel) => void;
};

export type ConfigStore = ConfigState & ConfigActions;

export const initConfigStore = (): ConfigState => {
  return {
    electricityBill: 200,
    averageElectricityPrice: 2.07,
    depthOfDischarge: 0.8,
    batteryQuantity: 1,
    inverterQuantity: 1,
    solarPanelQuantity: 1,
    battery: batteries[0]!,
    inverter: inverters[0]!,
    solarPanel: solarPanels[0]!,
  };
};

export const defaultInitialState: ConfigState = {
  electricityBill: 200,
  averageElectricityPrice: 2.07,
  depthOfDischarge: 0.8,
  battery: batteries[0]!,
  inverter: inverters[0]!,
  solarPanel: solarPanels[0]!,
  batteryQuantity: 1,
  inverterQuantity: 1,
  solarPanelQuantity: 1,
};

export const createConfigStore = (
  initState: ConfigState = defaultInitialState,
) => {
  return createStore<ConfigStore>()((set) => ({
    ...initState,
    setElectricityBill: (bill) =>
      set((state) => ({ ...state, electricityBill: bill })),
    setAverageElectricityPrice: (price) =>
      set((state) => ({ ...state, averageElectricityPrice: price })),
    setDepthOfDischarge: (depth) =>
      set((state) => ({ ...state, depthOfDischarge: depth })),
    setBattery: (battery) => set((state) => ({ ...state, battery: battery })),
    setInverter: (inverter) => set((state) => ({ ...state, inverter: inverter })),
    setBatteryQuantity: (quantity) => set((state) => ({ ...state, batteryQuantity: quantity })),
    setInverterQuantity: (quantity) => set((state) => ({ ...state, inverterQuantity: quantity })),
    setSolarPanelQuantity: (quantity) => set((state) => ({ ...state, solarPanelQuantity: quantity })),
    setSolarPanel: (solarPanel) =>
      set((state) => ({ ...state, solarPanel: solarPanel })),
  }));
};
