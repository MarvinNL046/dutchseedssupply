// Lege middleware file om de "No fetch event listeners found" fout te voorkomen
// Deze file bevat geen fetch event listeners en zal geen 500 errors veroorzaken

export const config = {
  matcher: [], // Geen routes matchen, dus middleware wordt nooit uitgevoerd
};

// Geen middleware functie gedefinieerd
