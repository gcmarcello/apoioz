import Image from "next/image";
import { useMapData } from "../hooks/useMapData";
import { UsersIcon } from "@heroicons/react/24/solid";

export function MapDataStats() {
  const { addresses } = useMapData();

  return (
    <div className="divide-y">
      <div className="hidden space-y-3 border-t py-4 lg:flex lg:flex-col lg:items-start lg:justify-start ">
        <div className="flex">
          <Image src="/urna.png" alt="urna roxa" height={40} width={50} />
          <div className="flex items-center text-sm text-gray-900">
            {addresses?.filter((data) => data.supportersCount).length || 0}{" "}
            Colégios com apoio
          </div>
        </div>
        <div className="flex">
          <Image src="/urnaempty.png" alt="urna roxa" height={40} width={50} />
          <div className="flex items-center text-sm text-gray-900">
            {addresses?.filter((data) => !data.supportersCount).length || 0}{" "}
            Colégios sem apoio
          </div>
        </div>
        <div className="flex gap-1">
          <div className="relative flex h-14 w-14 items-center justify-center text-white">
            <div className="absolute h-[50px] w-[50px] rounded-full bg-indigo-300 opacity-70"></div>
            <div className="z-10 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500">
              Nº
            </div>
          </div>

          <div className="flex items-center text-sm text-gray-900">
            Apoiadores na área
          </div>
        </div>
      </div>
      <div className="hidden space-y-3 border-t py-4 lg:flex lg:flex-col lg:items-start lg:justify-start ">
        <div className="flex">
          <UsersIcon className="h-[40px] w-[50px] text-indigo-600" />
          <div className="flex items-center text-sm text-gray-900">
            {addresses.reduce((acc, data) => acc + data.supportersCount, 0)}{" "}
            Apoiadores
          </div>
        </div>
      </div>
    </div>
  );
}
