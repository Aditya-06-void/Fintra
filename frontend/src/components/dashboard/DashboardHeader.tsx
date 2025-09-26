import { SidebarTrigger } from "@/components/ui/sidebar";

export function DashboardHeader() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="flex h-16 items-center gap-2 border-b bg-background px-4">
      <SidebarTrigger className="-ml-1" />
      <div className="flex-1">
        <div className="text-sm text-muted-foreground">{currentDate}</div>
      </div>
    </header>
  );
}