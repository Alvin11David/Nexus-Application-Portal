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
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/integrations/firebase/config";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface PageContent {
  id: string;
  page_key: string;
  section_key: string;
  title: string | null;
  subtitle: string | null;
  body: string | null;
  image_url: string | null;
}

const emptyForm = { page_key: "", section_key: "", title: "", subtitle: "", body: "", image_url: "" };

const AdminPagesPage = () => {
  const [pages, setPages] = useState<PageContent[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchPages = async () => {
    if (!db) {
      setPages([]);
      return;
    }

    const pagesQuery = query(collection(db, "page_content"), orderBy("page_key", "asc"));
    const snapshot = await getDocs(pagesQuery);
    const mapped = snapshot.docs.map((pageDoc) => {
      const data = pageDoc.data();
      return {
        id: pageDoc.id,
        page_key: String(data.page_key ?? ""),
        section_key: String(data.section_key ?? ""),
        title: (data.title as string | null | undefined) ?? null,
        subtitle: (data.subtitle as string | null | undefined) ?? null,
        body: (data.body as string | null | undefined) ?? null,
        image_url: (data.image_url as string | null | undefined) ?? null,
      } as PageContent;
    });

    setPages(mapped);
  };

  useEffect(() => { fetchPages(); }, []);

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
      page_key: form.page_key,
      section_key: form.section_key,
      title: form.title || null,
      subtitle: form.subtitle || null,
      body: form.body || null,
      image_url: form.image_url || null,
      updated_at: serverTimestamp(),
    };

    try {
      if (editing) {
        await updateDoc(doc(db, "page_content", editing), payload);
      } else {
        await addDoc(collection(db, "page_content"), {
          ...payload,
          created_at: serverTimestamp(),
        });
      }
      toast({ title: editing ? "Updated" : "Created" });
      setDialogOpen(false);
      setEditing(null);
      setForm(emptyForm);
      await fetchPages();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to save page content.";
      toast({ title: "Error", description: message, variant: "destructive" });
    }
    setLoading(false);
  };

  const handleEdit = (p: PageContent) => {
    setEditing(p.id);
    setForm({
      page_key: p.page_key, section_key: p.section_key,
      title: p.title || "", subtitle: p.subtitle || "",
      body: p.body || "", image_url: p.image_url || "",
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

    if (!confirm("Delete this section?")) return;
    try {
      await deleteDoc(doc(db, "page_content", id));
      toast({ title: "Deleted" });
      await fetchPages();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete page content.";
      toast({ title: "Error", description: message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] text-foreground">Page Content</h1>
        <Button onClick={() => { setEditing(null); setForm(emptyForm); setDialogOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" /> Add Section
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Page</TableHead>
                <TableHead>Section</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pages.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.page_key}</TableCell>
                  <TableCell className="text-muted-foreground">{p.section_key}</TableCell>
                  <TableCell className="text-muted-foreground">{p.title}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(p)}><Pencil className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {pages.length === 0 && (
                <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">No page content yet</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "Edit Section" : "New Section"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Page Key</Label>
                <Input value={form.page_key} onChange={(e) => setForm({ ...form, page_key: e.target.value })} placeholder="e.g. home, about, research" />
              </div>
              <div className="space-y-2">
                <Label>Section Key</Label>
                <Input value={form.section_key} onChange={(e) => setForm({ ...form, section_key: e.target.value })} placeholder="e.g. hero, intro, stats" />
              </div>
            </div>
            <div className="space-y-2"><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div className="space-y-2"><Label>Subtitle</Label><Input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} /></div>
            <div className="space-y-2"><Label>Body</Label><Textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} rows={6} /></div>
            <div className="space-y-2"><Label>Image URL</Label><Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={loading || !form.page_key || !form.section_key}>{loading ? "Saving..." : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPagesPage;
