# Dutch Seed Supply - Multi-Domain

Een Next.js applicatie met ondersteuning voor meerdere domeinen en talen, gebaseerd op Supabase, Tailwind CSS en Shadcn/UI.

## Vercel Deployment

### Belangrijk: Root Directory Configuratie

Bij het deployen van dit project op Vercel, moet je de "Root Directory" instelling aanpassen:

1. Ga naar je Vercel dashboard
2. Selecteer dit project
3. Ga naar "Settings" > "General"
4. Scroll naar beneden naar "Build & Development Settings"
5. Wijzig "Root Directory" naar `dutchseedsupply`
6. Klik op "Save"

Dit is nodig omdat de bestanden in de GitHub repository in een subdirectory staan.

## Functionaliteiten

- **Multi-domein ondersteuning**: Automatische taaldetectie op basis van domein (.com, .nl, .de, .fr)
- **Internationalisatie (i18n)**: Meertalige ondersteuning met eenvoudige vertaalsysteem
- **Server-side authenticatie**: Beveiligde routes met Supabase SSR
- **Admin dashboard**: Beveiligde admin-omgeving met rolgebaseerde toegangscontrole

## Technische Implementatie

### Middleware voor Domein-gebaseerde Locale Detectie

De applicatie gebruikt Next.js middleware om automatisch de juiste taal te detecteren op basis van het domein:

- example.com → Engels
- example.nl → Nederlands
- example.de → Duits
- example.fr → Frans

De middleware (in `middleware.ts`) detecteert het domein en stelt een cookie in met de juiste locale. Deze cookie wordt vervolgens gebruikt door de applicatie om de juiste vertalingen te laden.

```typescript
// Voorbeeld van domein-detectie in middleware.ts
export async function middleware(req: NextRequest) {
  const host = req.headers.get('host');
  if (!host) return NextResponse.next();
  
  // Extraheer het domein-deel (com, nl, de, fr)
  let domainPart = host.split('.').pop();
  
  // Bepaal de locale op basis van het domein
  const locale = domainToLocale[domainPart as keyof typeof domainToLocale] || 'en';
  
  // Stel een cookie in voor de locale
  const response = NextResponse.next();
  response.cookies.set('NEXT_LOCALE', locale, { 
    path: '/', 
    maxAge: 60 * 60 * 24,
    sameSite: 'strict'
  });
  
  return response;
}
```

### Internationalisatie (i18n)

De applicatie gebruikt een eenvoudig vertaalsysteem gebaseerd op Next.js en cookies:

1. **Vertalingen definiëren** in `locale/translations.ts`
2. **Server-side vertalingen** met de `getTranslations` functie in `lib/i18n.ts`
3. **Client-side vertalingen** met de `useClientTranslations` hook in `lib/i18n.ts`

```typescript
// Voorbeeld van server-side vertalingen in een pagina
import { getTranslations } from "@/lib/i18n";
import translations from "@/locale/translations";

export default async function Page() {
  const { t } = await getTranslations(translations);
  
  return (
    <div>
      <h1>{t('welcome')}</h1>
      <p>{t('description')}</p>
    </div>
  );
}
```

### Authenticatie met Supabase SSR

De applicatie gebruikt Supabase voor server-side authenticatie:

```typescript
// Voorbeeld van authenticatie in middleware.ts
if (req.nextUrl.pathname.startsWith('/admin')) {
  const supabase = createServerClient(/* ... */);
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  
  // Controleer admin-rol
  const { data: user } = await supabase
    .from('users')
    .select('role')
    .eq('id', session.user.id)
    .single();
    
  if (user?.role !== 'admin') {
    return NextResponse.redirect(new URL('/', req.url));
  }
}
```

## Ontwikkeling

### Lokale ontwikkeling

```bash
# Installeer dependencies
npm install

# Start de ontwikkelserver
npm run dev
```

### Testen van verschillende talen

Voor lokale ontwikkeling kun je de taal wijzigen met de taalwisselaar op de homepage, of door de NEXT_LOCALE cookie handmatig in te stellen.

### Nieuwe vertalingen toevoegen

1. Voeg nieuwe vertaalsleutels toe aan `locale/translations.ts`
2. Gebruik de vertaalsleutels in je componenten met de `t` functie

## Deployment

De applicatie is geconfigureerd voor deployment op Vercel, met ondersteuning voor meerdere domeinen.

```bash
# Bouw de applicatie
npm run build

# Start de productieserver
npm start
```

## Projectstructuur

- `app/` - Next.js App Router pagina's
- `components/` - React componenten
- `db/` - SQL scripts voor database setup
- `docs/` - Documentatie
  - `docs/admin-account.md` - Documentatie over admin account en RLS policies
  - `docs/homepage.md` - Documentatie over de homepage
  - `docs/payment-integration.md` - Documentatie over betalingsintegratie
- `lib/` - Hulpfuncties en utilities
  - `lib/supabase.js` - Supabase client configuratie
  - `lib/i18n.ts` - Internationalisatie utilities
- `locale/` - Vertalingen
- `middleware.ts` - Next.js middleware voor domein-detectie en authenticatie
- `next-i18next.config.js` - i18n configuratie
- `scripts/` - Hulpscripts voor ontwikkeling en beheer
  - `scripts/check_admin_user.mjs` - Script om admin gebruiker te controleren
  - `scripts/create_admin_user.js` - Script om admin gebruiker aan te maken
  - `scripts/setup_admin.js` - Script om admin setup te voltooien

## Gebruikersbeheer

### Admin Account

De applicatie heeft een admin dashboard dat alleen toegankelijk is voor gebruikers met de admin rol. Zie `docs/admin-account.md` voor gedetailleerde documentatie over:

- Admin account setup
- Authenticatie flow
- Row Level Security (RLS) policies
- Troubleshooting

### Gebruikersregistratie

De applicatie biedt functionaliteit voor gebruikersregistratie. Zie `docs/user-registration.md` voor gedetailleerde documentatie over:

- Registratie flow
- Database trigger voor automatische gebruikerstoevoeging
- Email bevestiging
- Row Level Security (RLS) policies

### Bekende problemen

Als je een "infinite recursion detected in policy for relation 'users'" fout tegenkomt, gebruik dan het SQL script in `db/fix_rls_policy.sql` om dit op te lossen.
