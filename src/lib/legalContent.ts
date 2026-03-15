export type LegalPageContent = {
  slug: string;
  title: string;
  intro: string;
  sections: Array<{ title: string; body: string }>;
};

export const legalPages: LegalPageContent[] = [
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    intro:
      "This site collects only the information required to operate inquiries, content access, and lightweight engagement features responsibly.",
    sections: [
      {
        title: "What we collect",
        body: "Typical data includes contact details submitted through forms, device-level analytics used to improve performance, and support messages that help the institution respond to user needs.",
      },
      {
        title: "How it is used",
        body: "Information is used to respond to inquiries, improve site experience, and support admissions, communications, or operational workflows that the user explicitly triggers.",
      },
      {
        title: "Retention and care",
        body: "Data should be retained only for as long as operationally necessary, with access limited to the teams responsible for handling the relevant service or inquiry.",
      },
    ],
  },
  {
    slug: "terms-of-use",
    title: "Terms of Use",
    intro:
      "Use of this website assumes lawful behavior, respectful engagement, and reasonable reliance on institutional guidance rather than misuse of site content or systems.",
    sections: [
      {
        title: "Acceptable use",
        body: "Users should interact with the site only for legitimate informational, application, or support purposes and should not attempt to disrupt services or misuse protected areas.",
      },
      {
        title: "Content and guidance",
        body: "Published information is intended to support planning and communication, but official decisions and binding commitments remain subject to institutional process and confirmation.",
      },
      {
        title: "Service continuity",
        body: "The institution may update site content, structure, and service availability as academic cycles, policies, or technical requirements evolve.",
      },
    ],
  },
  {
    slug: "accessibility",
    title: "Accessibility",
    intro:
      "The website aims to provide inclusive access across devices and assistive technologies while continuing to improve content structure, navigation clarity, and readable interactions.",
    sections: [
      {
        title: "Design intent",
        body: "Accessibility work focuses on clear navigation, usable contrast, keyboard access, and content structures that remain understandable across screen sizes and interaction modes.",
      },
      {
        title: "Ongoing improvement",
        body: "Accessibility is treated as an iterative engineering concern, with issues reviewed as new features, content types, and navigation patterns are introduced.",
      },
      {
        title: "Reporting issues",
        body: "Users who encounter barriers should contact the institution so the issue can be reproduced, prioritized, and corrected in the appropriate release cycle.",
      },
    ],
  },
];

export const getLegalPageBySlug = (slug: string) =>
  legalPages.find((page) => page.slug === slug);