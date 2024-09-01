
import { MapPinOff } from "lucide-react";
import AddressForm from "../_components/home/address-form";

export default function ErrorPage() {

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
			<div className="max-w-md w-full space-y-8 text-center">
				<MapPinOff
					className="mx-auto h-12 w-12 text-destructive"
					aria-hidden="true"
				/>
				<h1 className="text-2xl font-bold text-foreground">Address Error</h1>
				<p className="text-muted-foreground">
					We could not find the coordinates for the provided address. Please try
					again with a different address.
				</p>
				<AddressForm />
			</div>
		</div>
	);
}
