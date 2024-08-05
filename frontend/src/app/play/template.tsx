import Navbar from "@/Components/Navbar"
import { Suspense } from "react"
import Loading from "@/Components/pong/Loading"
export default function Template({ children }: { children: React.ReactNode }) {
    return <>
        <Navbar />
        <Suspense fallback={<Loading />}>
        {children}
        </Suspense>
        </>
    }