import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Newspaper, Users, BookOpen, Layout } from "lucide-react";

const AdminDashboard = () => {
  const [counts, setCounts] = useState({ news: 0, faculty: 0, courses: 0, pages: 0 });

  useEffect(() => {
    const fetchCounts = async () => {
      const [news, faculty, courses, pages] = await Promise.all([
        supabase.from("news_articles").select("id", { count: "exact", head: true }),
        supabase.from("faculty_members").select("id", { count: "exact", head: true }),
        supabase.from("courses").select("id", { count: "exact", head: true }),
        supabase.from("page_content").select("id", { count: "exact", head: true }),
      ]);
      setCounts({
        news: news.count ?? 0,
        faculty: faculty.count ?? 0,
        courses: courses.count ?? 0,
        pages: pages.count ?? 0,
      });
    };
    fetchCounts();
  }, []);

  const stats = [
    { label: "News Articles", count: counts.news, icon: Newspaper, color: "text-blue-600" },
    { label: "Faculty Members", count: counts.faculty, icon: Users, color: "text-green-600" },
    { label: "Courses", count: counts.courses, icon: BookOpen, color: "text-purple-600" },
    { label: "Page Sections", count: counts.pages, icon: Layout, color: "text-amber-600" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] text-foreground">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stat.count}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
