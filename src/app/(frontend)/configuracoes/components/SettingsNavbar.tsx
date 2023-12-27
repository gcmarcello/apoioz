"use client";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SettingsNavbar({
  disableCampaign,
}: {
  disableCampaign?: boolean;
}) {
  const pathname = usePathname();

  const secondaryNavigation = [
    {
      name: "Perfil",
      href: "/painel/configuracoes",
      current: pathname === "/painel/configuracoes",
    },
  ];

  if (!disableCampaign) {
    secondaryNavigation.push({
      name: "Campanha Ativa",
      href: "/painel/configuracoes/campanha",
      current: pathname === "/painel/configuracoes/campanha",
    });
  }

  return (
    <header className="border-gray/5 sm:-px-6 fixed -mx-4 -my-4 w-full border-b bg-white lg:-mx-8 lg:-my-8">
      {/* Secondary navigation */}
      <nav className="flex overflow-x-auto bg-white py-4">
        <ul
          role="list"
          className="flex min-w-full flex-none gap-x-6  px-4 text-sm font-semibold leading-6 text-gray-400  sm:px-6 lg:px-8"
        >
          {secondaryNavigation.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={clsx(
                  item.current ? "text-indigo-600" : "duration-200 hover:text-indigo-600",
                  item.name === "Campanha Ativa" && "border-s-2 ps-4"
                )}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
