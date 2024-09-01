import { Sun } from "lucide-react";

export default function LoadingSolarComponent() {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-sky-400 to-sky-200 p-4">
			<div className="text-center space-y-4">
				<div className="relative">
					<Sun className="w-16 h-16 text-yellow-500 animate-spin-slow" />
					<div className="absolute inset-0 flex items-center justify-center">
						<div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
					</div>
				</div>
				<h1 className="text-2xl font-bold text-sky-900">Loading Solar Data</h1>
				<p className="text-sky-700 max-w-md">
					Please wait while we fetch the latest solar information. This may take
					a few moments.
				</p>
			</div>
		</div>
	);
}
