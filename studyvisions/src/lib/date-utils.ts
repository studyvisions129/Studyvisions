import { 
  startOfDay, endOfDay, subDays, startOfWeek, endOfWeek, subWeeks,
  startOfMonth, endOfMonth, subMonths, startOfQuarter, endOfQuarter, subQuarters,
  startOfYear, endOfYear, subYears, differenceInCalendarDays, addDays
} from "date-fns";

export type DateRangePreset = 
  | "Today" 
  | "Yesterday" 
  | "Last 7 Days" 
  | "This Week" 
  | "Last Week" 
  | "This Month" 
  | "Last Month" 
  | "This Quarter" 
  | "Last Quarter"
  | "This Year" 
  | "Last Year" 
  | "All Time" 
  | "Custom Range";

export type CompareOption = 
  | "Previous Period" 
  | "Previous Week" 
  | "Previous Month" 
  | "Previous Year";

export interface DateRangeBoundary {
  from: Date;
  to: Date;
  preset: DateRangePreset;
  label: string;
}

export interface ComparisonBoundary {
  from: Date;
  to: Date;
  option: CompareOption;
  label: string;
}

// Convert a UTC date or local date to IST (Asia/Kolkata, UTC+5:30)
const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

export function getNowIST(): Date {
  const now = new Date();
  return new Date(now.getTime());
}

export function getDateRangeBoundaries(
  preset: string = "This Month", 
  customFrom?: string | null, 
  customTo?: string | null
): DateRangeBoundary {
  const now = getNowIST();

  switch (preset) {
    case "Today": {
      const from = startOfDay(now);
      const to = endOfDay(now);
      return { from, to, preset: "Today", label: "Today" };
    }
    case "Yesterday": {
      const yesterday = subDays(now, 1);
      return { from: startOfDay(yesterday), to: endOfDay(yesterday), preset: "Yesterday", label: "Yesterday" };
    }
    case "Last 7 Days": {
      return { from: startOfDay(subDays(now, 6)), to: endOfDay(now), preset: "Last 7 Days", label: "Last 7 Days" };
    }
    case "This Week": {
      return { from: startOfWeek(now, { weekStartsOn: 1 }), to: endOfDay(now), preset: "This Week", label: "This Week" };
    }
    case "Last Week": {
      const lastWeekDate = subWeeks(now, 1);
      return { 
        from: startOfWeek(lastWeekDate, { weekStartsOn: 1 }), 
        to: endOfWeek(lastWeekDate, { weekStartsOn: 1 }), 
        preset: "Last Week", 
        label: "Last Week" 
      };
    }
    case "This Month": {
      return { from: startOfMonth(now), to: endOfDay(now), preset: "This Month", label: "This Month" };
    }
    case "Last Month": {
      const lastMonthDate = subMonths(now, 1);
      return { 
        from: startOfMonth(lastMonthDate), 
        to: endOfMonth(lastMonthDate), 
        preset: "Last Month", 
        label: "Last Month" 
      };
    }
    case "This Quarter": {
      return { from: startOfQuarter(now), to: endOfDay(now), preset: "This Quarter", label: "This Quarter" };
    }
    case "Last Quarter": {
      const lastQuarterDate = subQuarters(now, 1);
      return { 
        from: startOfQuarter(lastQuarterDate), 
        to: endOfQuarter(lastQuarterDate), 
        preset: "Last Quarter", 
        label: "Last Quarter" 
      };
    }
    case "This Year": {
      return { from: startOfYear(now), to: endOfDay(now), preset: "This Year", label: "This Year" };
    }
    case "Last Year": {
      const lastYearDate = subYears(now, 1);
      return { 
        from: startOfYear(lastYearDate), 
        to: endOfYear(lastYearDate), 
        preset: "Last Year", 
        label: "Last Year" 
      };
    }
    case "All Time": {
      return { from: new Date(2020, 0, 1), to: endOfDay(now), preset: "All Time", label: "All Time" };
    }
    case "Custom Range": {
      if (customFrom && customTo) {
        const from = startOfDay(new Date(customFrom));
        const to = endOfDay(new Date(customTo));
        return { from, to, preset: "Custom Range", label: `${customFrom} to ${customTo}` };
      }
      return { from: startOfMonth(now), to: endOfDay(now), preset: "This Month", label: "This Month" };
    }
    default:
      return { from: startOfMonth(now), to: endOfDay(now), preset: "This Month", label: "This Month" };
  }
}

export function getComparisonBoundaries(
  current: DateRangeBoundary,
  compareOption: CompareOption = "Previous Period"
): ComparisonBoundary {
  const durationDays = Math.max(1, differenceInCalendarDays(current.to, current.from) + 1);

  switch (compareOption) {
    case "Previous Week": {
      const from = subWeeks(current.from, 1);
      const to = subWeeks(current.to, 1);
      return { from, to, option: "Previous Week", label: "Previous Week" };
    }
    case "Previous Month": {
      const from = subMonths(current.from, 1);
      const to = subMonths(current.to, 1);
      return { from, to, option: "Previous Month", label: "Previous Month" };
    }
    case "Previous Year": {
      const from = subYears(current.from, 1);
      const to = subYears(current.to, 1);
      return { from, to, option: "Previous Year", label: "Previous Year" };
    }
    case "Previous Period":
    default: {
      const to = subDays(current.from, 1);
      const from = subDays(to, durationDays - 1);
      return { from, to, option: "Previous Period", label: "Previous Period" };
    }
  }
}

export interface MetricComparison {
  currentValue: number;
  previousValue: number;
  percentageChange: number | null;
  absoluteChange: number;
  direction: "up" | "down" | "flat";
  hasInsufficientData: boolean;
  formattedChange: string;
}

export function computeComparison(current: number, previous: number): MetricComparison {
  const absoluteChange = current - previous;
  
  if (previous === 0 && current === 0) {
    return {
      currentValue: current,
      previousValue: previous,
      percentageChange: 0,
      absoluteChange: 0,
      direction: "flat",
      hasInsufficientData: true,
      formattedChange: "0.0%"
    };
  }

  if (previous === 0 && current > 0) {
    return {
      currentValue: current,
      previousValue: previous,
      percentageChange: 100,
      absoluteChange,
      direction: "up",
      hasInsufficientData: false,
      formattedChange: "+100%"
    };
  }

  if (previous > 0) {
    const percentageChange = Number(((absoluteChange / previous) * 100).toFixed(1));
    const direction = percentageChange > 0 ? "up" : percentageChange < 0 ? "down" : "flat";
    const formattedChange = percentageChange > 0 ? `+${percentageChange}%` : `${percentageChange}%`;
    return {
      currentValue: current,
      previousValue: previous,
      percentageChange,
      absoluteChange,
      direction,
      hasInsufficientData: false,
      formattedChange
    };
  }

  return {
    currentValue: current,
    previousValue: previous,
    percentageChange: null,
    absoluteChange,
    direction: "flat",
    hasInsufficientData: true,
    formattedChange: "N/A"
  };
}
