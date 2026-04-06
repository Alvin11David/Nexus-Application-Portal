# Firestore Collections Schema

## Collection Descriptions & Field Schemas

### 1. **news**

News articles and updates for the NewsPage

```
{
  id: string (auto-generated)
  title: string (required)
  slug: string (unique, for URL routing)
  content: string (rich text/markdown)
  excerpt: string (short summary)
  image_url: string
  author: string
  published_date: timestamp
  featured: boolean (default: false)
  category: string (optional)
}
```

### 2. **events**

Events and announcements displayed on NewsPage

```
{
  id: string (auto-generated)
  title: string (required)
  date: timestamp (required)
  type: string (e.g., "Admissions", "Academic", "Community", "Student Life")
  description: string
  location: string
  image_url: string
}
```

### 3. **gallery**

Gallery images for GalleryPage

```
{
  id: string (auto-generated)
  src: string (image URL, required)
  alt: string (alt text, required)
  caption: string (required)
  category: string (e.g., "Training", "Graduation", "Community", "Projects")
  span: string (optional: "tall", "wide", "normal")
  created_at: timestamp
}
```

### 4. **courses**

Course listings for CoursesListingsPage

```
{
  id: string (auto-generated)
  code: string (unique course code, required)
  title: string (required)
  college: string (required)
  credits: number
  description: string
  prerequisites: array[string]
  level: string (e.g., "Undergraduate", "Graduate", "Professional")
}
```

### 5. **faqs**

FAQ questions for FAQPage

```
{
  id: string (auto-generated)
  category: string (required, e.g., "Admissions", "Academics", "Financial Aid")
  question: string (required)
  answer: string (required)
  order: number (for sorting within category)
}
```

### 6. **faculty**

Faculty members for AdminFacultyPage

```
{
  id: string (auto-generated)
  name: string (required)
  title: string (role/position)
  department: string (required)
  email: string
  phone: string
  bio: string
  image_url: string
  specialization: array[string]
  office_location: string
}
```

### 7. **partners**

Partners for PartnersPage

```
{
  id: string (auto-generated)
  name: string (required)
  logo_url: string
  category: string (e.g., "Academic", "Industry", "Community", "Government")
  description: string
  website: string
  contact_person: string
  contact_email: string
}
```

### 8. **student_stories**

Student success stories for StudentStoriesPage

```
{
  id: string (auto-generated)
  title: string (required)
  slug: string (unique, for URL routing)
  content: string (rich text/markdown)
  student_name: string (required)
  program: string
  graduation_year: number
  image_url: string
  featured: boolean (default: false)
  published_date: timestamp
  author: string
}
```

### 9. **programs**

Academic programs for ProgramsPage

```
{
  id: string (auto-generated)
  name: string (required)
  college: string (required)
  level: string (e.g., "Undergraduate", "Graduate", "Professional")
  description: string
  duration: string (e.g., "4 years")
  credits_required: number
  admission_requirements: string
  details_url: string
}
```

### 10. **research_opportunities**

Research opportunities for ResearchPage/ResearchOpportunitiesPage

```
{
  id: string (auto-generated)
  title: string (required)
  department: string (required)
  description: string
  supervisor: string (faculty member name)
  requirements: string
  stipend: string
  start_date: timestamp
  published_date: timestamp
  available_positions: number
  contact_email: string
}
```

### 11. **alumni**

Alumni information for AlumniPage

```
{
  id: string (auto-generated)
  name: string (required)
  program: string
  graduation_year: number (required)
  occupation: string
  company: string
  location: string
  bio: string
  image_url: string
  featured: boolean (optional: highlight notable alumni)
}
```

### 12. **scholarships**

Scholarships for ScholarshipsPage

```
{
  id: string (auto-generated)
  name: string (required)
  level: string (e.g., "Undergraduate", "Graduate", "International")
  amount: number (in currency unit)
  currency: string (e.g., "USD")
  description: string
  eligibility_criteria: string
  application_deadline: timestamp
  renewable: boolean
  contact_email: string
}
```

### 13. **legal_pages**

Legal content for LegalPage (Privacy Policy, Terms, etc.)

```
{
  id: string (auto-generated)
  title: string (required)
  slug: string (unique, for URL routing)
  content: string (rich text/markdown, required)
  type: string (e.g., "privacy", "terms", "disclaimer")
  updated_date: timestamp
  version: number
}
```

### 14. **quick_links**

Quick navigation links for QuickLinksPage

```
{
  id: string (auto-generated)
  title: string (required)
  slug: string (unique, for URL routing)
  category: string (required, e.g., "Admissions", "Academics", "Support")
  description: string
  link_url: string (required)
  icon: string (optional: icon name or emoji)
  order: number (for sorting)
}
```

### 15. **contact_submissions**

Contact form submissions for ContactPage

```
{
  id: string (auto-generated)
  name: string (required)
  email: string (required)
  phone: string
  subject: string (required)
  message: string (required)
  submitted_at: timestamp (auto: server timestamp)
  read: boolean (default: false)
  responded: boolean (default: false)
  response_message: string (optional: admin response)
  response_date: timestamp
}
```

---

## Existing Collections (from Firebase Init)

### Assignments

```
{
  course_id: string
  title: string
  description: string
  due_date: timestamp
  created_at: timestamp
}
```

### exam_results

```
{
  student_id: string
  academic_year: string
  semester: string
  subject: string
  score: number
  grade: string
  created_at: timestamp
}
```

### messages

```
{
  from_user_id: string
  to_user_id: string
  content: string
  created_at: timestamp
  is_read: boolean
  is_starred: boolean
  is_deleted_by_sender: boolean
  is_deleted_by_recipient: boolean
}
```

### message_drafts

```
{
  user_id: string
  to_user_id: string
  content: string
  created_at: timestamp
  updated_at: timestamp
}
```

### notifications

```
{
  user_id: string
  type: string (e.g., "message", "announcement", "grade")
  title: string
  message: string
  link: string
  is_read: boolean
  created_at: timestamp
}
```

---

## How to Add Data to Collections

### Option 1: Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select project "universityportal2026"
3. Navigate to Firestore Database
4. Click "+" next to the collection name to add documents

### Option 2: Programmatically (in Cloud Functions or App)

```javascript
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const db = getFirestore();

// Add a news article
await addDoc(collection(db, "news"), {
  title: "New Research Initiative",
  slug: "new-research-initiative",
  content: "Article content here...",
  author: "Admin",
  published_date: new Date(),
  featured: false,
});
```

---

## Migration Guide

To move existing data from hardcoded files to Firestore:

1. **newsContent.ts** → import data into `news` collection
2. **GalleryPage** → import galleryItems into `gallery` collection
3. **FAQPage** → import faqCategories & questions into `faqs` collection
4. **CoursesListingsPage** → import colleges into `courses` collection
5. Other hardcoded data → corresponding collections
