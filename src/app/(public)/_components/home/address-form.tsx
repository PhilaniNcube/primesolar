"use client";

import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import SubmitButton from "@/components/submit-button";
import { useState } from "react";
import { useFormState } from "react-dom";
import { searchAddressAction } from "@/actions/search-address-action";
import { Label } from "@/components/ui/label";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";


type AutoCompleteType = {
	label: string;
	value: {
		matched_substrings: {
			length: number;
			offset: number;
		}[];
		description: string;
		place_id: string;
		reference: string;
		structured_formatting: {
			main_text: string;
			secondary_text: string;
			main_text_substring: {
				offset: number;
				length: number;
			}[];
		};
		terms: {
			offset: number;
			value: string;
		}[];
		types: string[];
	};
};

export default function AddressForm() {
	 const [value, setValue] = useState<AutoCompleteType | null>(null);

	const [state, formAction] = useFormState(searchAddressAction, null);



	return (
		<Card className="w-full max-w-md mx-auto">
			<CardContent className="p-4">
				<form action={(formData:FormData) => {
          formAction(formData);
        }}
        className="flex flex-col space-y-2">
					<Label htmlFor="address">Enter Street Address</Label>
					<GooglePlacesAutocomplete
						apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY}
						apiOptions={{
							apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
						}}
						selectProps={{
							value,
							onChange: setValue,
						}}
					/>
					<Input required type="hidden" name="address" value={value?.label} />
					<SubmitButton>Search</SubmitButton>
				</form>
			</CardContent>
		</Card>
	);
}
