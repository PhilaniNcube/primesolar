import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, SunIcon } from "lucide-react";
import Link from "next/link";
import DashboardAccount from "./dashboard-account";

const DashboardHeader = () => {
  return <header className="border-b-2 h-[50px]">
    <div className="grid grid-cols-[250px_1fr]">
      <div className="border-r-2 p-2">
       <Link href="/dashboard" className="flex items-center">
         <SunIcon className="w-8 h-8 mr-2" />
          <span className="font-semibold text-md uppercase">Prime Solar</span>
       </Link>
      </div>
      <div className="w-full py-2 px-6 flex justify-between items-center">
        <form className="flex justify-start items-center max-w-2xl">
          <Input placeholder="Search" type="search" className="h-8" />
          <Button className="ml-2 flex items-center h-8" type="submit" size="sm"> <Search size={16} className="mr-2" />Search</Button>
        </form>
        <DashboardAccount />
      </div>
    </div>
  </header>;
};
export default DashboardHeader;
