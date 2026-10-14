import { ProjectAnalyticsResponseType } from '@/features/projects/api/use-get-project-analytics';
import { ScrollArea } from './ui/scroll-area';

export const Analytics = ({ data }: ProjectAnalyticsResponseType) => {
  return (
    <ScrollArea className="border rounded-lg w-full whitespace-nowrap shrink-0">
      <div className="w-full flex flex-row">
        <div className="flex items-center flex-1"></div>
      </div>
    </ScrollArea>
  );
};
