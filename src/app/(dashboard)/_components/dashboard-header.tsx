import { SunIcon } from "lucide-react";
import Link from "next/link";

const DashboardHeader = () => {
  return <header className="border-b-2 h-[50px]">
    <div className="grid grid-cols-[250px_1fr]">
      <div className="border-r-2 p-2">
       <Link href="/dashboard" className="flex items-center">
         <SunIcon className="w-8 h-8 mr-2" />
          <span className="font-semibold text-md uppercase">Prime Solar</span>
       </Link>
      </div>
    </div>
  </header>;
};
export default DashboardHeader;
