import { requireUser } from "@/lib/auth";
import { getCalendarData } from "@/server/analytics/calendar-data";
import { CalendarGrid } from "@/components/calendar/calendar-grid";

export default async function CalendarPage() {
  const user = await requireUser();
  const now = new Date();
  const initialMonth = now.getMonth();
  const initialYear = now.getFullYear();
  const calendarData = await getCalendarData(user.id, initialMonth, initialYear);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Trading Calendar</h1>
      <CalendarGrid
        daysData={calendarData.days}
        initialMonth={initialMonth}
        initialYear={initialYear}
      />
    </div>
  );
}
