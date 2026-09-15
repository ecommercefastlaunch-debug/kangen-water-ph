import { booking } from "@/lib/content";
import { isBookingConfigured } from "@/lib/booking";
import { BookingForm } from "./BookingForm";

export function BookingSection() {
  const available = isBookingConfigured();

  return (
    <section
      id="book"
      aria-labelledby="book-title"
      className="bg-[linear-gradient(180deg,var(--color-ice-soft)_0%,var(--color-ice)_100%)]"
    >
      <div className="container-page section-y grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <p className="eyebrow text-glacier">{booking.eyebrow}</p>
          <h2 id="book-title" className="type-display-md mt-5 text-ink">
            {booking.headline[0]}
            <span className="type-light text-ink-soft">{booking.headline[1]}</span>
          </h2>
          <p className="lede mt-8 max-w-[28rem] text-ink-soft">{booking.body}</p>
          <ul className="mt-10 max-w-[28rem] border-t border-ink/15">
            {booking.expectations.map((line) => (
              <li key={line} className="border-b border-ink/15 py-4 text-[0.9375rem] leading-relaxed text-ink-soft">
                {line}
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <BookingForm available={available} />
        </div>
      </div>
    </section>
  );
}
