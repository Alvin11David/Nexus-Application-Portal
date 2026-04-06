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

interface FacultyMember {
  id: string;
  name: string;
  title: string | null;
  department: string | null;
  bio: string | null;
  image_url: string | null;
  email: string | null;
  specialization: string | null;
  display_order: number;
}

const emptyForm = { name: "", title: "", department: "", bio: "", image_url: "", email: "", specialization: "", display_order: 0 };

const AdminFacultyPage = () => {
  const [members, setMembers] = useState<FacultyMember[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchMembers = async () => {
    if (!db) {
      setMembers([]);
      return;
    }

    const facultyQuery = query(collection(db, "faculty"), orderBy("display_order", "asc"));
    const snapshot = await getDocs(facultyQuery);
    const mapped = snapshot.docs.map((facultyDoc) => {
      const data = facultyDoc.data();
      return {
        id: facultyDoc.id,
        name: String(data.name ?? ""),
        title: (data.title as string | null | undefined) ?? null,
        department: (data.department as string | null | undefined) ?? null,
        bio: (data.bio as string | null | undefined) ?? null,
        image_url: (data.image_url as string | null | undefined) ?? null,
        email: (data.email as string | null | undefined) ?? null,
        specialization:
          Array.isArray(data.specialization)
            ? data.specialization.join(", ")
            : ((data.specialization as string | null | undefined) ?? null),
        display_order:
          typeof data.display_order === "number"
            ? data.display_order
            : Number(data.display_order ?? 0) || 0,
      } as FacultyMember;
    });

    setMembers(mapped);
  };

  useEffect(() => { fetchMembers(); }, []);

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
      name: form.name,
      title: form.title || null,
      department: form.department || null,
      bio: form.bio || null,
      image_url: form.image_url || null,
      email: form.email || null,
      specialization: form.specialization || null,
      display_order: form.display_order,
      updated_at: serverTimestamp(),
    };

    try {
      if (editing) {
        await updateDoc(doc(db, "faculty", editing), payload);
      } else {
        await addDoc(collection(db, "faculty"), {
          ...payload,
          created_at: serverTimestamp(),
        });
      }
      toast({ title: editing ? "Updated" : "Created" });
      setDialogOpen(false);
      setEditing(null);
      setForm(emptyForm);
      await fetchMembers();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to save faculty member.";
      toast({ title: "Error", description: message, variant: "destructive" });
    }
    setLoading(false);
  };

  const handleEdit = (m: FacultyMember) => {
    setEditing(m.id);
    setForm({
      name: m.name, title: m.title || "", department: m.department || "",
      bio: m.bio || "", image_url: m.image_url || "", email: m.email || "",
      specialization: m.specialization || "", display_order: m.display_order,
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

    if (!confirm("Delete this faculty member?")) return;
    try {
      await deleteDoc(doc(db, "faculty", id));
      toast({ title: "Deleted" });
      await fetchMembers();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete faculty member.";
      toast({ title: "Error", description: message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] text-foreground">Faculty Members</h1>
        <Button onClick={() => { setEditing(null); setForm(emptyForm); setDialogOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" /> Add Member
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Department</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="font-medium">{m.name}</TableCell>
                  <TableCell className="text-muted-foreground">{m.title}</TableCell>
                  <TableCell className="text-muted-foreground">{m.department}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(m)}><Pencil className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(m.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {members.length === 0 && (
                <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">No faculty members yet</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "Edit Member" : "New Member"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div className="space-y-2"><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Professor" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Department</Label><Input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} /></div>
              <div className="space-y-2"><Label>Email</Label><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            </div>
            <div className="space-y-2"><Label>Specialization</Label><Input value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} /></div>
            <div className="space-y-2"><Label>Bio</Label><Textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={4} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Image URL</Label><Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} /></div>
              <div className="space-y-2"><Label>Display Order</Label><Input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })} /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={loading || !form.name}>{loading ? "Saving..." : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminFacultyPage;
