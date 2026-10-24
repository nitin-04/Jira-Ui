import { ProjectAnalyticsResponseType } from '@/features/projects/api/use-get-project-analytics';
import { AnalyticsCard } from './analytics-card';
import {
  AlertTriangle,
  CheckCircle2,
  Hourglass,
  Layers,
  UserCheck,
} from 'lucide-react';

export const Analytics = ({ data }: ProjectAnalyticsResponseType) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3.5 w-full">
      <AnalyticsCard
        title="Total tasks"
        value={data.taskCount}
        variant={data.taskDifference >= 0 ? 'up' : 'down'}
        increaseValue={data.taskDifference}
        icon={<Layers className="size-4" />}
        iconBg="bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400"
      />
      <AnalyticsCard
        title="Assigned tasks"
        value={data.assignedTaskCount}
        variant={data.assignedTaskDifference >= 0 ? 'up' : 'down'}
        increaseValue={data.assignedTaskDifference}
        icon={<UserCheck className="size-4" />}
        iconBg="bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400"
      />
      <AnalyticsCard
        title="Completed tasks"
        value={data.completeTaskCount}
        variant={data.completeTaskDifference >= 0 ? 'up' : 'down'}
        increaseValue={data.completeTaskDifference}
        icon={<CheckCircle2 className="size-4" />}
        iconBg="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400"
      />
      <AnalyticsCard
        title="Overdue tasks"
        value={data.overdueTaskCount}
        variant={data.overdueTaskDifference <= 0 ? 'up' : 'down'}
        increaseValue={data.overdueTaskDifference}
        icon={<AlertTriangle className="size-4" />}
        iconBg="bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400"
      />
      <AnalyticsCard
        title="Incomplete tasks"
        value={data.incompleteTaskCount}
        variant={data.incompleteTaskDifference <= 0 ? 'up' : 'down'}
        increaseValue={data.incompleteTaskDifference}
        icon={<Hourglass className="size-4" />}
        iconBg="bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400"
      />
    </div>
  );
};
