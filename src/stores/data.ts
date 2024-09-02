import { Weight } from "lucide-react";

export const batteries = [

  {
    name: "Dyness Powerbox Pro 10.24Kw Lithium Battery",
    capacity: 10.24,
    price: 34000,
    application: "Residential",
    voltage: 48,
    weight: 103,
    dimension: {
      height: 92.8,
      width: 55.5,
      depth: 21
    },
    cycle_life: 6000,
    depth_of_discharge: 0.95,
  },
  {
    name: "Dyness 5.12KW Lithium Battery BX51100",
    capacity: 5.12,
    price: 15990,
    application: "Residential",
    voltage: 48,
    weight: 50,
    dimension: {
      height: 55.8,
      width: 54.5,
      depth: 19
    },
    cycle_life: 6000,
    depth_of_discharge: 0.8,
  },
  {
    name: "Deye Battery HV 61.44 kWh BOS-G",
    capacity: 61.44,
    price: 289000,
    application: "Commercial",
    voltage: 153,
    weight: 50,
    dimension: {
      height: 224,
      width: 589,
      depth: 590
    },
    cycle_life: 6000,
    depth_of_discharge: 0.9,
  },

]

export const inverters = [
    {
    name: "Deye 5KW Hybrid Inverter",
    kW: 5,
    volts: 48,
    price: 15900,
    application: "Residential",
  },
    {
    name: "Dyness 5KW Single Phase Hybrid Inverter",
    kW: 5,
    volts: 48,
    price: 16100,
    application: "Residential",
  },
    {
    name: "Solis 6KW Hybrid Inverter",
    kW: 6,
    volts: 48,
    price: 17700,
    application: "Residential",
  },
    {
    name: "Deye 12KW 3 Phase Hybrid Inverter",
    kW: 12,
    volts: 48,
    price: 45500,
    application: "Commercial",
  },
]

export const solarPanels = [
  {
    name: "Canadian Solar 410W High Power Mono PERC HiKU6",
    watts: 410,
    dimensions: {
      length: 172.2,
      width: 113.4,
      thickness: 3.0,
    },
    weight: 21.3,
    price: 1883,
  },
  {
    name: "Canadian Solar 605W Super High Power Mono PERC HiKU7",
    watts: 605,
    dimensions: {
      length: 217.2,
      width: 130.3,
      thickness: 3.5,
    },
    weight: 31,
    price: 2805,
  },
];


export type SolarPanel = typeof solarPanels[0]
export type Inverter = typeof inverters[0]

export type Battery = typeof batteries[0]
