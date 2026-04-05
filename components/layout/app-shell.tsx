import { BottomNavigation } from "@/components/navigation/bottom-navigation";
import { EventDetailsDialog } from "@/components/calendar/event-details-dialog";
import { TopBar } from "@/components/layout/top-bar";

export function AppShell({
  children,
  title,
  subtitle,
  topBarAction,
  topBarLeading,
  chrome = "default",
  hideTopBarTitle = false,
  centerTopBarTitle = false
}: {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  topBarAction?: React.ReactNode;
  topBarLeading?: React.ReactNode;
  chrome?: "default" | "plain";
  hideTopBarTitle?: boolean;
  centerTopBarTitle?: boolean;
}) {
  return (
    <div className="app-frame">
      <TopBar
        title={title}
        subtitle={subtitle}
        action={topBarAction}
        leadingAction={topBarLeading}
        plain={chrome === "plain"}
        hideTitle={hideTopBarTitle}
        centerTitle={centerTopBarTitle}
      />
      <div className="screen-padding">{children}</div>
      <BottomNavigation />
      <EventDetailsDialog />
    </div>
  );
}
