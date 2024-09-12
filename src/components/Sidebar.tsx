"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { Power } from 'lucide-react';
import { LogOutButton } from "@/actions/route";

interface MenuItem {
    title: string;
    icon: ReactNode;
    link: string;
}

interface SideBarProps {
    menu: MenuItem[],
    titre: string,
}

export default function Sidebar({ menu, titre }: SideBarProps) {
    const pathname = usePathname();
    return (
        <div className="h-screen w-60 bg-blue flex flex-col justify-between">
            <div className="w-full">
                {/* le logo et le titre du l'utilisateur */}
                <h1 className="flex items-center text-blanc p-4 text-xl">
                    <Image src="/logo.png" alt="photo" width={30} height={30} className="" />
                    {titre}
                </h1>
                {/* le menu du l'utilisateur */}
                <ul className="p-4">
                    {menu.map((menu, index) => (
                        <li
                            key={index}
                            className={`text-white flex items-center gap-x-1 cursor-pointer p-2 group hover:bg-blanc  ${pathname === menu.link ? "bg-blanc" : "bg-none"
                                } rounded-md mt-2 w-[100%]`}
                        >
                            <span
                                className={`cursor-pointer block float-left mr-2 ${pathname === menu.link ? "text-blue" : "text-white"
                                    } duration-500 group-hover:text-blue`}
                            >
                                {menu.icon}
                            </span>
                            <a
                                className={`lex-1 text-base  ${pathname === menu.link ? "text-blue" : "text-white"
                                    } duration-500 group-hover:text-blue text-sm w-max`}
                                href={menu.link}
                            >
                                {menu.title}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
            <form className="w-full p-4 " action={LogOutButton}>
                <button type="submit" className="w-[95%] group hover:bg-blanc p-2 hover:text-blue text-white flex rounded-lg duration-500"><Power className="mr-2"/> Deconnexion</button>
            </form>
        </div>
    )
}