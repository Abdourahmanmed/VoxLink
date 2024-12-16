"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";
import { Power } from "lucide-react";
import { LogOutButton } from "@/actions/route";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ScrollArea } from "./ui/scroll-area";
import Link from "next/link";

// Interface pour les sous-menus
interface SubMenuItem {
  title: string;
  link: string; // Les liens doivent toujours être des chaînes valides
}

// Interface pour les éléments du menu
interface MenuItem {
  title: string;
  icon: ReactNode;
  link?: string; // Peut être optionnel
  Submenu?: SubMenuItem[]; // Sous-menu optionnel
}

interface SideBarProps {
  menu: MenuItem[];
  titre: string;
}

export default function Sidebar({ menu, titre }: SideBarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState<string | null>(null); // État pour gérer les sous-menus ouverts

  // Fonction pour basculer l'état du sous-menu
  const toggleSubMenu = (title: string) => {
    setOpen(open === title ? null : title);
  };

  // Fonction pour vérifier si un sous-menu est actif
  const isSubMenuActive = (submenu: SubMenuItem[]) => {
    return submenu.some((subItem) => pathname === subItem.link);
  };

  return (
    <div className="h-screen w-[20%] bg-blue flex flex-col justify-between overflow-hidden">
      <ScrollArea className="w-full h-full">
        {/* Logo et titre */}
        <h1 className="flex items-center text-white p-4 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl">
          <Image src="/logo.png" alt="logo" width={30} height={30} />
          {titre}
        </h1>

        {/* Menu */}
        <ul className="p-4">
          {menu.map((item, index) => (
            <li key={index} className="mt-2">
              {item.Submenu ? (
                // Gestion des sous-menus
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div
                      className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-md w-full transition-colors duration-300
                        ${open === item.title || (item.Submenu && isSubMenuActive(item.Submenu)) ? "bg-white text-blue" : "text-white"}
                        group hover:bg-white`}
                      onClick={() => toggleSubMenu(item.title)}
                    >
                      <span
                        className={`mr-2 duration-500 group-hover:text-blue ${item.Submenu && isSubMenuActive(item.Submenu) ? "text-blue" : "text-white"
                          }`}
                      >
                        {item.icon}
                      </span>
                      <span className="text-sm group-hover:text-blue">{item.title}</span>
                    </div>
                  </DropdownMenuTrigger>
                  {open === item.title && item.Submenu && (
                    <DropdownMenuContent className="w-full">
                      {item.Submenu.map((subItem, subIndex) => (
                        <DropdownMenuItem asChild key={subIndex}>
                          <Link
                            href={subItem.link}
                            className={`text-sm block w-full cursor-pointer p-2 transition-colors duration-300
                              ${pathname === subItem.link ? "text-blue" : "text-gray-800"}
                              hover:text-blue`}
                          >
                            {subItem.title}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  )}
                </DropdownMenu>
              ) : (
                // Élément de menu simple sans sous-menu
                item.link && (
                  <Link
                    href={item.link}
                    className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-md w-full transition-colors duration-300
                      ${pathname === item.link ? "bg-white text-blue" : "text-white"}
                      group hover:bg-white`}
                  >
                    <span
                      className={`mr-2 duration-500 ${pathname === item.link ? "text-blue" : "text-white"
                        } group-hover:text-blue`}
                    >
                      {item.icon}
                    </span>
                    <span className="text-sm group-hover:text-blue">{item.title}</span>
                  </Link>
                )
              )}
            </li>
          ))}
        </ul>
      </ScrollArea>

      {/* Bouton de déconnexion */}
      <form className="w-full p-4" action={LogOutButton}>
        <button
          type="submit"
          className="w-[95%] group hover:bg-white p-2 text-white flex rounded-lg transition-colors duration-500"
        >
          <Power className="mr-2 group-hover:text-blue" />
          <span className="group-hover:text-blue">Déconnexion</span>
        </button>
      </form>
    </div>
  );
}
