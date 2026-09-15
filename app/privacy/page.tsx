import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { bookingDelivery } from "@/lib/booking";

export const metadata: Metadata = {
  title: "Privacy notice",
  description: "How Kangen Water PH handles the details you send with a presentation request.",
  alternates: { canonical: "/privacy" },
};

/** Describes what the site actually does, based on how delivery is configured. */
function deliveryText(): string {
  switch (bookingDelivery()) {
    case "resend":
      return "When you send the form, our server passes your details straight to the site operator's email inbox through Resend, an email-delivery service.";
    case "webhook":
      return "When you send the form, our server passes your details over an encrypted (HTTPS) connection straight to a receiving system the site operator controls, such as a spreadsheet and email inbox in their own account.";
    default:
      return "Online requests are not open at the moment, so the form cannot send or collect any details.";
  }
}

export default function PrivacyPage() {
  const sections: { title: string; body: string[] }[] = [
    {
      title: "Who we are",
      body: [
        "Kangen Water PH is an independent website about the Enagic LeveLuk K8. It is not operated by Enagic Co., Ltd. or Enagic Philippines, Inc.",
      ],
    },
    {
      title: "What we collect",
      body: [
        "Only what you type into the presentation request form: your full name, mobile number, email address, city, preferred date and time, and an optional message, together with your confirmation that we may contact you.",
        "Like any website, the hosting provider (Vercel) processes technical data such as IP addresses to deliver the site and protect it from abuse.",
      ],
    },
    {
      title: "Why we use it",
      body: [
        "To reply to your request and arrange a presentation of the LeveLuk K8. We don't use your details for anything else, and we don't sell them.",
      ],
    },
    {
      title: "How it's handled",
      body: [
        deliveryText(),
        "This website doesn't keep its own copy in a database, doesn't log the contents of the form, and doesn't use analytics, advertising or tracking cookies.",
        "How long the operator keeps your request in their inbox or system is not set by this website. You can ask about it, or ask for your details to be deleted, when they contact you.",
      ],
    },
    {
      title: "Your rights",
      body: [
        "Under the Philippine Data Privacy Act of 2012 you may ask to be informed about, access, correct, or have erased the personal data held about you, and you may object to its processing. To make a request, reply to the message you receive from us after sending the form.",
      ],
    },
  ];

  return (
    <>
      <Header homeHref="/" bookHref="/#book" />
      <main id="main" className="bg-paper pt-[var(--header-h)]">
        <div className="container-page max-w-[52rem] py-20 sm:py-28">
          <p className="eyebrow text-glacier">Privacy</p>
          <h1 className="type-display-md mt-5 text-ink">
            Privacy
            <span className="type-light text-ink-soft">notice.</span>
          </h1>
          <p className="mt-6 text-sm text-mute">Last updated September 2026.</p>
          <div className="mt-14 border-t border-ink">
            {sections.map((section) => (
              <section key={section.title} className="grid gap-4 border-b border-line py-8 sm:grid-cols-[12rem_1fr] sm:gap-10">
                <h2 className="text-base font-semibold text-ink">{section.title}</h2>
                <div className="space-y-4 text-[0.9875rem] leading-relaxed text-ink-soft">
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer homeHref="/" />
    </>
  );
}
