import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export const SignInCard = () => {
  return (
    <Card className="w-full h-full md:w-[487px] border-none shadow-none">
      <CardHeader className="flex items-center justify-center text-center p-7">
        <CardTitle className="text-2xl">Welcome Back!</CardTitle>
      </CardHeader>
      <div className="px-7 mb-2">
        <Separator />
      </div>
    </Card>
  );
};
