'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, BrainCircuit, Users, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

const chartData = [
  { month: 'January', sleep: 14 },
  { month: 'February', sleep: 14.5 },
  { month: 'March', sleep: 15 },
  { month: 'April', sleep: 14 },
  { month: 'May', sleep: 13.5 },
  { month: 'June', sleep: 13 },
];

const chartConfig = {
  sleep: {
    label: "Sleep (hours)",
    color: "hsl(var(--primary))",
  },
};

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Generate Insight</CardTitle>
            <BrainCircuit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Get personalized, AI-powered parenting advice based on your baby's current behavior.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild size="sm" className="w-full">
              <Link href="/insights">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Community Forum</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Connect with other parents, share experiences, and learn from the community.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild size="sm" className="w-full" variant="secondary">
              <Link href="/community">
                Join Discussion <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
        <Card>
           <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="font-medium text-foreground">10:45 AM:</span> Baby is cooing
              </li>
              <li className="flex items-center gap-2">
                <span className="font-medium text-foreground">9:30 AM:</span> Morning nap started
              </li>
               <li className="flex items-center gap-2">
                <span className="font-medium text-foreground">8:15 AM:</span> Feeding time
              </li>
            </ul>
          </CardContent>
           <CardFooter>
             <Button size="sm" className="w-full" variant="outline">View Full Log</Button>
          </CardFooter>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Average Sleep Hours</CardTitle>
          <CardDescription>A look at your baby's sleep patterns over the last 6 months.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis />
              <Tooltip cursor={false} content={<ChartTooltipContent />} />
              <Bar dataKey="sleep" fill="var(--color-sleep)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
