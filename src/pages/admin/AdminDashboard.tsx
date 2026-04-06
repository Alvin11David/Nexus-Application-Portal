import { useEffect, useState } from "react";
import { collection, getCountFromServer } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/integrations/firebase/config";
import { Newspaper, Users, BookOpen, Layout } from "lucide-react";

const AdminDashboard = () => {
  const [counts, setCounts] = useState({ news: 0, faculty: 0, courses: 0, pages: 0 });

  useEffect(() => {
    const fetchCounts = async () => {
      if (!db) {
        setCounts({ news: 0, faculty: 0, courses: 0, pages: 0 });
        return;
      }

      const [news, faculty, courses, pages] = await Promise.all([
        getCountFromServer(collection(db, "news")),
        getCountFromServer(collection(db, "faculty")),
        getCountFromServer(collection(db, "courses")),
        getCountFromServer(collection(db, "page_content")),
      ]);

      setCounts({
        news: news.data().count,
        faculty: faculty.data().count,
        courses: courses.data().count,
        pages: pages.data().count,
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
