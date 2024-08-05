"use client"
import { CustomizationProvider } from "@/contexts/CustomizationContext"
import Configurator from "@/Components/customization/Configurator"
import Experience from "@/Components/customization/Experience"
export  default function Page() {
    return (
        <CustomizationProvider>
            <div className="fixed w-full h-full flex p-4">
                <div className="w-2/3 h-full rounded-lg py-20">
                    <Experience />
                </div>
                <div className="w-1/3 h-full rounded-lg py-20">
                    <Configurator />
                </div>
            </div>
        </CustomizationProvider>
    )
}
