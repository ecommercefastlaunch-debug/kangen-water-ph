/** The drinking designation, always in words — never colour alone. */
export function DrinkLabel({ drinkable }: { drinkable: boolean }) {
  return drinkable ? (
    <span className="inline-flex items-center gap-2 rounded-full border border-glacier/35 bg-white px-3 py-1.5 text-[0.8125rem] font-semibold text-glacier">
      <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
        <circle cx="6" cy="6" r="5" fill="currentColor" />
      </svg>
      For drinking
    </span>
  ) : (
    <span className="inline-flex items-center gap-2 rounded-full border border-warn/35 bg-white px-3 py-1.5 text-[0.8125rem] font-semibold text-warn">
      <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
        <circle cx="6" cy="6" r="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M2.6 9.4 9.4 2.6" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      Not for drinking
    </span>
  );
}
