import { BottomNavigation } from "@/components/navigation/bottom-navigation";
import { TopBar } from "@/components/layout/top-bar";

export function AppShell({
  children,
  title,
  subtitle,
  topBarAction,
  chrome = "default",
  hideTopBarTitle = false
}: {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  topBarAction?: React.ReactNode;
  chrome?: "default" | "plain";
  hideTopBarTitle?: boolean;
}) {
  return (
    <div className="app-frame">
      <TopBar
        title={title}
        subtitle={subtitle}
        action={topBarAction}
        plain={chrome === "plain"}
        hideTitle={hideTopBarTitle}
      />
      <div className="screen-padding">{children}</div>
      <BottomNavigation />
    </div>
  );
}
