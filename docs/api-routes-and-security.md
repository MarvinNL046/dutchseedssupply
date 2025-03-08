# API Routes en Beveiliging

Dit document beschrijft de implementatie van API routes en beveiligingsmaatregelen in de Dutch Seed Supply webshop.

## Overzicht

Om de website stabiel te houden en tegelijkertijd de beveiliging te waarborgen, hebben we een hybride aanpak geïmplementeerd:

1. **API Routes**: Server-side logica is verplaatst naar API routes
2. **Client-side Authenticatie**: Admin pagina's worden beveiligd met client-side authenticatie die API routes gebruikt
3. **Middleware**: Minimale middleware configuratie om 500-fouten te voorkomen

## API Routes

### Admin Authenticatie

De `/api/auth/check-admin` route controleert of een gebruiker admin rechten heeft:

- Controleert eerst of er een geldige sessie is
- Controleert vervolgens of de gebruiker de admin rol heeft in de database
- Heeft een fallback voor bekende admin e-mailadressen (marvinsmit1988@gmail.com)
- Retourneert een JSON response met `isAdmin: true/false`

### Product Data

De volgende routes zijn geïmplementeerd voor product data:

- `/api/products`: Haalt alle producten op voor de huidige domein
- `/api/products/[id]`: Haalt details van een specifiek product op, inclusief variant en gerelateerde producten

## Beveiliging

### Admin Pagina's

Admin pagina's worden beveiligd met de `AdminAuthCheck` component:

1. Component laadt bij het renderen van admin pagina's
2. Maakt een fetch request naar `/api/auth/check-admin`
3. Als de gebruiker geen admin is, wordt deze doorgestuurd naar de homepage
4. Alleen als de gebruiker een admin is, wordt de inhoud van de admin pagina getoond

Deze aanpak biedt meerdere beveiligingslagen:

- Server-side authenticatie via de API route
- Client-side redirects voor niet-geautoriseerde gebruikers
- Fallback voor bekende admin e-mailadressen

## Voordelen van deze Aanpak

1. **Stabiliteit**: Door server-side logica te verplaatsen naar API routes, voorkomen we 500-fouten
2. **Beveiliging**: Admin pagina's zijn alleen toegankelijk voor geautoriseerde gebruikers
3. **Flexibiliteit**: API routes kunnen worden uitgebreid zonder de hoofdapplicatie te beïnvloeden
4. **Foutafhandeling**: Betere foutafhandeling en logging

## Toekomstige Verbeteringen

1. **Rate Limiting**: Implementeren van rate limiting voor API routes
2. **JWT Tokens**: Overschakelen naar JWT tokens voor betere authenticatie
3. **Caching**: Implementeren van caching voor product data
4. **Middleware Uitbreiden**: Geleidelijk middleware functionaliteit herstellen voor taaldetectie en routering

## Conclusie

Deze hybride aanpak biedt een goede balans tussen stabiliteit en beveiliging. De website is nu toegankelijk en functioneel, terwijl admin pagina's goed beveiligd zijn. De API routes bieden een flexibele manier om server-side logica te implementeren zonder de hoofdapplicatie te beïnvloeden.
