import Navbar from "@/components/Navbar";
import QuickLogButton from "@/components/QuickLogButton";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-6 py-10">{children}</main>
      <QuickLogButton />
    </div>
  );
}
