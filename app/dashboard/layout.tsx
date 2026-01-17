"use client"

import type React from "react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Footer } from "@/components/footer"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header isLoggedIn={true} />

      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 ml-64 p-8 bg-gray-50">
          {children}
        </main>
      </div>

      <Footer />
    </div>
  )
}
