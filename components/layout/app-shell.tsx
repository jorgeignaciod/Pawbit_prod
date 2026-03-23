import { BottomNavigation } from "@/components/navigation/bottom-navigation";
import { TopBar } from "@/components/layout/top-bar";

export function AppShell({
  children,
  title,
  subtitle,
  topBarAction,
  chrome = "default"
}: {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  topBarAction?: React.ReactNode;
  chrome?: "default" | "plain";
}) {
  return (
    <div className="app-frame">
      <TopBar title={title} subtitle={subtitle} action={topBarAction} plain={chrome === "plain"} />
      <div className="screen-padding">{children}</div>
      <BottomNavigation />
    </div>
  );
}
