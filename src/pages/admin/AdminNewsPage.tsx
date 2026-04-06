import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/integrations/firebase/config";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  image_url: string | null;
  published: boolean;
  published_at: string | null;
  created_at?: string;
}

const emptyForm = { title: "", slug: "", excerpt: "", content: "", image_url: "", published: false };

const AdminNewsPage = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const normalizeDate = (value: unknown) => {
    if (!value) return "";
    if (typeof value === "string") return value;
    if (
      typeof value === "object" &&
      value !== null &&
      "toDate" in value &&
      typeof (value as { toDate?: () => Date }).toDate === "function"
    ) {
      return (value as { toDate: () => Date }).toDate().toISOString();
    }
    return "";
  };

  const fetchArticles = async () => {
    if (!db) {
      setArticles([]);
      return;
    }

    const newsQuery = query(collection(db, "news"), orderBy("created_at", "desc"));
    const snapshot = await getDocs(newsQuery);

    const mapped = snapshot.docs.map((newsDoc) => {
      const data = newsDoc.data();
      return {
        id: newsDoc.id,
        title: String(data.title ?? ""),
        slug: String(data.slug ?? ""),
        excerpt: (data.excerpt as string | null | undefined) ?? null,
        content: (data.content as string | null | undefined) ?? null,
        image_url: (data.image_url as string | null | undefined) ?? null,
        published: Boolean(data.published),
        published_at: normalizeDate(data.published_at) || null,
        created_at: normalizeDate(data.created_at),
      } as NewsArticle;
    });

    setArticles(mapped);
  };

  useEffect(() => { fetchArticles(); }, []);

  const generateSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handleSave = async () => {
    if (!db) {
      toast({
        title: "Firebase not configured",
        description: "Unable to save while Firestore is not available.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const payload = {
      title: form.title,
      slug: form.slug || generateSlug(form.title),
      excerpt: form.excerpt || null,
      content: form.content || null,
      image_url: form.image_url || null,
      published: form.published,
      published_at: form.published ? serverTimestamp() : null,
      updated_at: serverTimestamp(),
    };

    try {
      if (editing) {
        await updateDoc(doc(db, "news", editing), payload);
      } else {
        await addDoc(collection(db, "news"), {
          ...payload,
          created_at: serverTimestamp(),
        });
      }
      toast({ title: editing ? "Updated" : "Created", description: "News article saved." });
      setDialogOpen(false);
      setEditing(null);
      setForm(emptyForm);
      await fetchArticles();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to save article.";
      toast({ title: "Error", description: message, variant: "destructive" });
    }
    setLoading(false);
  };

  const handleEdit = (article: NewsArticle) => {
    setEditing(article.id);
    setForm({
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt || "",
      content: article.content || "",
      image_url: article.image_url || "",
      published: article.published,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!db) {
      toast({
        title: "Firebase not configured",
        description: "Unable to delete while Firestore is not available.",
        variant: "destructive",
      });
      return;
    }

    if (!confirm("Delete this article?")) return;
    try {
      await deleteDoc(doc(db, "news", id));
      toast({ title: "Deleted" });
      await fetchArticles();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete article.";
      toast({ title: "Error", description: message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] text-foreground">News Articles</h1>
        <Button onClick={() => { setEditing(null); setForm(emptyForm); setDialogOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" /> Add Article
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.title}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${a.published ? "bg-green-100 text-green-800" : "bg-muted text-muted-foreground"}`}>
                      {a.published ? "Published" : "Draft"}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {a.created_at ? new Date(a.created_at).toLocaleDateString() : "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(a)}><Pencil className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(a.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {articles.length === 0 && (
                <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">No articles yet</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Article" : "New Article"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: generateSlug(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Excerpt</Label>
              <Textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={2} />
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={8} />
            </div>
            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.published} onCheckedChange={(v) => setForm({ ...form, published: v })} />
              <Label>Published</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={loading || !form.title}>{loading ? "Saving..." : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminNewsPage;
