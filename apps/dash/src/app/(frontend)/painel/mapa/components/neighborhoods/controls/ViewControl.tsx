import { Field, Label, Select, Switch } from "@headlessui/react";
import { useMapData } from "../../../hooks/useMapData";
import MapControl from "../../MapControl";
import clsx from "clsx";
import { useMap } from "react-leaflet";
import { Description, selectClasses } from "odinkit/client";
import Image from "next/image";

export function ViewControl() {
  const {
    viewMode,
    setViewMode,
    setSelectedNeighborhood,
    setSelectedZone,
    setSelectedAddress,
    setAddressViewMode,
    addressViewMode,
  } = useMapData();

  function handleViewModeChange() {
    const newMode = viewMode === "neighborhood" ? "zone" : "neighborhood";
    setViewMode(newMode);
    setSelectedNeighborhood(null);
    setSelectedZone(null);
    setSelectedAddress(null);
  }

  const isNeighborhood = viewMode === "neighborhood";

  return (
    <MapControl position="bottomleft">
      <div className="flex-column flex items-center justify-center space-x-4 lg:flex-row">
        <span
          className={clsx(
            isNeighborhood ? "font-bold text-indigo-500" : "text-gray-500"
          )}
        >
          Bairro
        </span>
        <Switch
          checked={isNeighborhood}
          onChange={handleViewModeChange}
          className={clsx(
            "relative inline-flex h-6 w-11 items-center rounded-full bg-indigo-500 transition-colors"
          )}
        >
          <span
            className={clsx(
              "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
              isNeighborhood ? "translate-x-1" : "translate-x-6"
            )}
          />
        </Switch>
        <span
          className={clsx(
            !isNeighborhood ? "font-bold text-indigo-500" : "text-gray-500"
          )}
        >
          Zona
        </span>
      </div>
      <div className="mt-2">
        <Field>
          <Label htmlFor="address-view-mode" className="text-gray-500">
            Endereços
          </Label>
          <Select
            value={addressViewMode}
            onChange={(e) => setAddressViewMode(e.target.value as any)}
            className={clsx(selectClasses(false))}
          >
            <option value="all" className="text-black">
              Todos
            </option>
            <option value="some" className="text-black">
              Apenas com apoio
            </option>
            <option value="empty" className="text-black">
              Apenas sem apoio
            </option>
          </Select>
          <div className="mt-2 space-y-2 text-gray-500">
            <div className="flex items-center">
              <Image alt="urna" src={"/urna.png"} height={24} width={24} />
              <div className="text-xs">Escolas (Apoiadores)</div>
            </div>
            <div className="flex items-center">
              <div className="relative flex h-6 w-6 items-center justify-center font-bold text-white">
                <div className="absolute h-4 w-4 rounded-full bg-gray-400 opacity-70"></div>
                <div className="z-10 flex h-2 w-2 items-center justify-center rounded-full bg-gray-500"></div>
              </div>
              <div className="text-xs">Grupo de Escolas (Número)</div>
            </div>
          </div>
        </Field>
      </div>
    </MapControl>
  );
}
