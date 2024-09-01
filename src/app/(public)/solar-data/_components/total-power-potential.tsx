"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useConfigStore } from "@/providers/solar-config-provider";
import type { SolarConfig } from "@/types";
import { Info, Sun } from "lucide-react";
import { type ChangeEvent, useState } from "react";

interface SolarPotentialDisplayProps {
	address: string;
	solarConfig: SolarConfig[];
	maxPotentialKwh: number;
}

export default function TotalPowerPotential({
	address,
	solarConfig,
	maxPotentialKwh,
}: SolarPotentialDisplayProps) {
	const [selectedConfigIndex, setSelectedConfigIndex] = useState(0);

  const { electricityBill, setElectricityBill } =
    useConfigStore((store) => store);



	const averageElectricityPrice = 2.07;

	// calculate the number of KW usage per month based on the electricity bill
	const monthlyKwh = electricityBill / averageElectricityPrice;

	const depthOfDischarge = 0.8;

	const usableBatteryCapacity = monthlyKwh / 31 / depthOfDischarge;

	console.log(usableBatteryCapacity);

	// calculate the number of KW usage per year based on the electricity bill
	const yearlyKwh = monthlyKwh * 12;

	const selectedConfig = solarConfig[selectedConfigIndex];

	const potentialKwh = selectedConfig ? selectedConfig.yearlyEnergyDcKwh : 0;
	const potentialPercentage = selectedConfig
		? (selectedConfig.yearlyEnergyDcKwh / maxPotentialKwh) * 100
		: 0;

	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Sun className="w-6 h-6 text-yellow-500" />
					Solar Power Potential
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4 @container">
				<div>
					<h3 className="text-sm font-medium text-muted-foreground">Address</h3>
					<p className="text-lg font-semibold">{address}</p>
				</div>
				<div>
					<h3 className="text-sm font-medium text-muted-foreground">
						Average Monthly Electricity Usage
					</h3>
					<p className="text-lg font-semibold">{monthlyKwh.toFixed(2)} kWh</p>
				</div>
				<div>
					<h3 className="text-sm font-medium text-muted-foreground">
						Average Yearly Electricity Usage
					</h3>
					<p className="text-lg font-semibold">{yearlyKwh.toFixed(2)} kWh</p>
				</div>
				<div>
					<h3 className="text-sm font-medium text-muted-foreground">
						Minimum Battery Capacity
					</h3>
					<p className="text-lg font-semibold">
						{usableBatteryCapacity.toFixed(2)} kWh
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger>
									<Info className="w-4 h-4 text-blue-500 ml-1" />
								</TooltipTrigger>
								<TooltipContent>
									<p className="text-sm text-muted-foreground">
										This is the minimum battery capacity required to store enough energy to power your home for a day based on your average electricity usage.
									</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</p>
				</div>
				<div className="grid @md:grid-cols-2 gap-3">
					<div>
						<h3 className="text-sm font-medium text-muted-foreground">
							Monthly Electricity Bill
						</h3>
						<p className={cn("text-3xl font-bold")}>R{electricityBill}</p>
						<div className="p-3 border-2 bg-zinc-100 border-slate-400 rounded-sm mt-2">
							<h3 className="text-sm font-medium text-muted-foreground">
								Monthly Electricity Bill
							</h3>
							<Input
								type="number"
								value={electricityBill}
								className="w-full mt-1"
								onChange={(e: ChangeEvent<HTMLInputElement>) =>
									setElectricityBill(Number(e.target.value))
								}
							/>
						</div>
					</div>
					<div>
						<h3 className="text-sm font-medium text-muted-foreground">
							Annual Total Solar Potential ({selectedConfig?.panelsCount}{" "}
							Panels)
						</h3>
						<p
							className={cn(
								"text-3xl font-bold",
								yearlyKwh > potentialKwh && "text-red-500",
								yearlyKwh < potentialKwh && "text-green-700",
							)}
						>
							{potentialKwh.toFixed(2)} kWh
						</p>
						<div className="p-3 border-2 bg-blue-100 border-blue-400 rounded-sm mt-2">
							<Label htmlFor="solar-config">
								Select Solar Panel Configuration
							</Label>
							<Select
								defaultValue={selectedConfigIndex.toString()}
								onValueChange={(value: string) =>
									setSelectedConfigIndex(Number(value))
								}
							>
								<SelectTrigger>
									<SelectValue>
										{selectedConfig?.panelsCount} Solar Panels
									</SelectValue>
								</SelectTrigger>
								<SelectContent>
									{solarConfig.map((config: SolarConfig, index: number) => (
										<SelectGroup key={config.panelsCount}>
											<SelectItem value={index.toString()}>
												<SelectLabel>{config.panelsCount} Panels</SelectLabel>
											</SelectItem>
										</SelectGroup>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
				</div>

				<div className="space-y-2">
					<div className="flex justify-between text-sm text-muted-foreground">
						<span>0 kWh</span>
						<span className="h-2">{maxPotentialKwh.toLocaleString()} kWh</span>
					</div>
					<Progress value={potentialPercentage} className={cn("h-2")} />
				</div>
			</CardContent>
		</Card>
	);
}
