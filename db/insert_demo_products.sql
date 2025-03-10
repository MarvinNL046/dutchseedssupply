-- Insert Demo Products for Dutch Seed Supply
-- This script adds realistic cannabis seed products with translations and variants

-- Clear existing demo data if needed (uncomment if you want to start fresh)
-- DELETE FROM product_variants;
-- DELETE FROM product_translations;
-- DELETE FROM product_categories;
-- DELETE FROM products WHERE sku LIKE 'DSS-%';

-- Make sure categories exist
INSERT INTO categories (name, slug)
VALUES 
  ('Indica', 'indica'),
  ('Sativa', 'sativa'),
  ('Hybrid', 'hybrid'),
  ('Autoflowering', 'autoflowering'),
  ('Feminized', 'feminized'),
  ('CBD', 'cbd')
ON CONFLICT (slug) DO NOTHING;

-- Function to get category IDs
CREATE OR REPLACE FUNCTION get_category_ids(category_slugs TEXT[])
RETURNS UUID[] AS $$
DECLARE
  result UUID[];
BEGIN
  SELECT ARRAY_AGG(id) INTO result
  FROM categories
  WHERE slug = ANY(category_slugs);
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Insert products
DO $$
DECLARE
  product_id UUID;
  category_ids UUID[];
BEGIN
  -- 1. Northern Lights (Indica)
  INSERT INTO products (
    sku, name, slug, price, sale_price, stock_quantity, stock_status, 
    featured, images, thc_content, cbd_content, flowering_time, height, yield
  ) VALUES (
    'DSS-NL-001', 
    'Northern Lights', 
    'northern-lights', 
    29.99, 
    NULL, 
    100, 
    'in_stock', 
    true, 
    '[{"url": "https://images.unsplash.com/photo-1603909223429-69bb7101f420", "alt": "Northern Lights cannabis plant"}]'::jsonb, 
    18.00, 
    0.10, 
    56, 
    '100-150cm', 
    '450-550g/m²'
  )
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    price = EXCLUDED.price,
    featured = EXCLUDED.featured,
    thc_content = EXCLUDED.thc_content,
    cbd_content = EXCLUDED.cbd_content,
    flowering_time = EXCLUDED.flowering_time,
    height = EXCLUDED.height,
    yield = EXCLUDED.yield
  RETURNING id INTO product_id;

  -- Add translations for Northern Lights
  INSERT INTO product_translations (product_id, language_code, description, meta_title, meta_description)
  VALUES
    (product_id, 'en', 'Northern Lights is a legendary indica strain known for its resinous buds, fast flowering, and resilient growth. This strain produces a sweet and spicy aroma, delivering a deeply relaxing body high that's perfect for evening use. Its compact growth pattern makes it ideal for discreet growing.', 'Northern Lights Cannabis Seeds | Dutch Seed Supply', 'Buy premium Northern Lights cannabis seeds. This legendary indica strain offers relaxing effects and is easy to grow with high yields.'),
    (product_id, 'nl', 'Northern Lights is een legendarische indica-soort die bekend staat om zijn harsrijke toppen, snelle bloei en veerkrachtige groei. Deze soort produceert een zoet en kruidig aroma, en zorgt voor een diep ontspannende lichamelijke high die perfect is voor gebruik in de avond. Het compacte groeipatroon maakt het ideaal voor discreet kweken.', 'Northern Lights Cannabis Zaden | Dutch Seed Supply', 'Koop premium Northern Lights cannabis zaden. Deze legendarische indica-soort biedt ontspannende effecten en is gemakkelijk te kweken met hoge opbrengsten.'),
    (product_id, 'de', 'Northern Lights ist eine legendäre Indica-Sorte, die für ihre harzigen Knospen, schnelle Blüte und widerstandsfähiges Wachstum bekannt ist. Diese Sorte produziert ein süßes und würziges Aroma und liefert ein tief entspannendes Körperhigh, das perfekt für die Abendnutzung ist. Ihr kompaktes Wachstumsmuster macht sie ideal für diskreten Anbau.', 'Northern Lights Cannabis Samen | Dutch Seed Supply', 'Kaufen Sie Premium Northern Lights Cannabis-Samen. Diese legendäre Indica-Sorte bietet entspannende Wirkungen und ist leicht anzubauen mit hohen Erträgen.'),
    (product_id, 'fr', 'Northern Lights est une souche indica légendaire connue pour ses bourgeons résineux, sa floraison rapide et sa croissance résiliente. Cette variété produit un arôme doux et épicé, offrant un high corporel profondément relaxant, parfait pour une utilisation en soirée. Son modèle de croissance compact la rend idéale pour la culture discrète.', 'Graines de Cannabis Northern Lights | Dutch Seed Supply', 'Achetez des graines de cannabis Northern Lights premium. Cette souche indica légendaire offre des effets relaxants et est facile à cultiver avec des rendements élevés.')
  ON CONFLICT (product_id, language_code) DO UPDATE SET
    description = EXCLUDED.description,
    meta_title = EXCLUDED.meta_title,
    meta_description = EXCLUDED.meta_description;

  -- Add variants for Northern Lights
  INSERT INTO product_variants (product_id, domain_id, price, sale_price, stock_quantity, stock_status)
  VALUES
    (product_id, 'nl', 29.99, NULL, 100, 'in_stock'),
    (product_id, 'com', 32.99, NULL, 75, 'in_stock'),
    (product_id, 'de', 31.99, NULL, 50, 'in_stock'),
    (product_id, 'fr', 33.99, NULL, 25, 'in_stock')
  ON CONFLICT (product_id, domain_id) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity;

  -- Add categories for Northern Lights
  category_ids := get_category_ids(ARRAY['indica', 'feminized']);
  FOREACH product_id IN ARRAY ARRAY[product_id]
  LOOP
    FOREACH category_id IN ARRAY category_ids
    LOOP
      INSERT INTO product_categories (product_id, category_id)
      VALUES (product_id, category_id)
      ON CONFLICT DO NOTHING;
    END LOOP;
  END LOOP;

  -- 2. OG Kush (Hybrid)
  INSERT INTO products (
    sku, name, slug, price, sale_price, stock_quantity, stock_status, 
    featured, images, thc_content, cbd_content, flowering_time, height, yield
  ) VALUES (
    'DSS-OGK-002', 
    'OG Kush', 
    'og-kush', 
    34.99, 
    31.99, 
    85, 
    'in_stock', 
    true, 
    '[{"url": "https://images.unsplash.com/photo-1603386329225-868f9b1ee6c9", "alt": "OG Kush cannabis plant"}]'::jsonb, 
    24.00, 
    0.30, 
    63, 
    '90-160cm', 
    '500-550g/m²'
  )
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    price = EXCLUDED.price,
    sale_price = EXCLUDED.sale_price,
    featured = EXCLUDED.featured,
    thc_content = EXCLUDED.thc_content,
    cbd_content = EXCLUDED.cbd_content,
    flowering_time = EXCLUDED.flowering_time,
    height = EXCLUDED.height,
    yield = EXCLUDED.yield
  RETURNING id INTO product_id;

  -- Add translations for OG Kush
  INSERT INTO product_translations (product_id, language_code, description, meta_title, meta_description)
  VALUES
    (product_id, 'en', 'OG Kush is a legendary hybrid strain with a complex aroma blending earthy pine and sour lemon. Its potent effects deliver a powerful cerebral high combined with strong physical relaxation. A favorite among cannabis connoisseurs, OG Kush offers an exceptional terpene profile and resin production.', 'OG Kush Cannabis Seeds | Dutch Seed Supply', 'Premium OG Kush cannabis seeds with high THC content. This legendary hybrid strain offers powerful effects and exceptional terpene profile.'),
    (product_id, 'nl', 'OG Kush is een legendarische hybride soort met een complex aroma dat aardse dennen en zure citroen combineert. De krachtige effecten zorgen voor een sterke cerebrale high in combinatie met sterke fysieke ontspanning. Een favoriet onder cannabis-kenners, OG Kush biedt een uitzonderlijk terpeenprofiel en harsproductie.', 'OG Kush Cannabis Zaden | Dutch Seed Supply', 'Premium OG Kush cannabis zaden met hoog THC-gehalte. Deze legendarische hybride soort biedt krachtige effecten en een uitzonderlijk terpeenprofiel.'),
    (product_id, 'de', 'OG Kush ist eine legendäre Hybridsorte mit einem komplexen Aroma, das erdige Kiefer und saure Zitrone verbindet. Ihre starken Effekte liefern ein kraftvolles zerebrales High kombiniert mit starker körperlicher Entspannung. Ein Favorit unter Cannabis-Kennern, OG Kush bietet ein außergewöhnliches Terpenprofil und Harzproduktion.', 'OG Kush Cannabis Samen | Dutch Seed Supply', 'Premium OG Kush Cannabis-Samen mit hohem THC-Gehalt. Diese legendäre Hybridsorte bietet starke Wirkungen und ein außergewöhnliches Terpenprofil.'),
    (product_id, 'fr', 'OG Kush est une souche hybride légendaire avec un arôme complexe mêlant pin terreux et citron acide. Ses effets puissants offrent un high cérébral puissant combiné à une forte relaxation physique. Favori des connaisseurs de cannabis, OG Kush offre un profil terpénique exceptionnel et une production de résine importante.', 'Graines de Cannabis OG Kush | Dutch Seed Supply', 'Graines de cannabis OG Kush premium à haute teneur en THC. Cette souche hybride légendaire offre des effets puissants et un profil terpénique exceptionnel.')
  ON CONFLICT (product_id, language_code) DO UPDATE SET
    description = EXCLUDED.description,
    meta_title = EXCLUDED.meta_title,
    meta_description = EXCLUDED.meta_description;

  -- Add variants for OG Kush
  INSERT INTO product_variants (product_id, domain_id, price, sale_price, stock_quantity, stock_status)
  VALUES
    (product_id, 'nl', 34.99, 31.99, 85, 'in_stock'),
    (product_id, 'com', 37.99, 34.99, 65, 'in_stock'),
    (product_id, 'de', 36.99, 33.99, 40, 'in_stock'),
    (product_id, 'fr', 38.99, 35.99, 30, 'in_stock')
  ON CONFLICT (product_id, domain_id) DO UPDATE SET
    price = EXCLUDED.price,
    sale_price = EXCLUDED.sale_price,
    stock_quantity = EXCLUDED.stock_quantity;

  -- Add categories for OG Kush
  category_ids := get_category_ids(ARRAY['hybrid', 'feminized']);
  FOREACH product_id IN ARRAY ARRAY[product_id]
  LOOP
    FOREACH category_id IN ARRAY category_ids
    LOOP
      INSERT INTO product_categories (product_id, category_id)
      VALUES (product_id, category_id)
      ON CONFLICT DO NOTHING;
    END LOOP;
  END LOOP;

  -- 3. Amnesia Haze (Sativa)
  INSERT INTO products (
    sku, name, slug, price, sale_price, stock_quantity, stock_status, 
    featured, images, thc_content, cbd_content, flowering_time, height, yield
  ) VALUES (
    'DSS-AMH-003', 
    'Amnesia Haze', 
    'amnesia-haze', 
    32.99, 
    NULL, 
    70, 
    'in_stock', 
    true, 
    '[{"url": "https://images.unsplash.com/photo-1603916072034-8a2f2a6307e3", "alt": "Amnesia Haze cannabis plant"}]'::jsonb, 
    22.00, 
    0.20, 
    70, 
    '120-180cm', 
    '600-650g/m²'
  )
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    price = EXCLUDED.price,
    featured = EXCLUDED.featured,
    thc_content = EXCLUDED.thc_content,
    cbd_content = EXCLUDED.cbd_content,
    flowering_time = EXCLUDED.flowering_time,
    height = EXCLUDED.height,
    yield = EXCLUDED.yield
  RETURNING id INTO product_id;

  -- Add translations for Amnesia Haze
  INSERT INTO product_translations (product_id, language_code, description, meta_title, meta_description)
  VALUES
    (product_id, 'en', 'Amnesia Haze is a multiple Cannabis Cup winner known for its energetic and uplifting effects. This sativa-dominant strain offers a complex flavor profile with notes of citrus, earth, and spice. Its potent cerebral high makes it perfect for creative activities and social situations.', 'Amnesia Haze Cannabis Seeds | Dutch Seed Supply', 'Premium Amnesia Haze cannabis seeds. This award-winning sativa strain delivers energetic effects and impressive yields.'),
    (product_id, 'nl', 'Amnesia Haze is een meervoudige Cannabis Cup-winnaar die bekend staat om zijn energieke en opbeurende effecten. Deze sativa-dominante soort biedt een complex smaakprofiel met tonen van citrus, aarde en kruiden. De krachtige cerebrale high maakt het perfect voor creatieve activiteiten en sociale situaties.', 'Amnesia Haze Cannabis Zaden | Dutch Seed Supply', 'Premium Amnesia Haze cannabis zaden. Deze bekroonde sativa-soort levert energieke effecten en indrukwekkende opbrengsten.'),
    (product_id, 'de', 'Amnesia Haze ist ein mehrfacher Cannabis Cup-Gewinner, bekannt für seine energetischen und erhebenden Wirkungen. Diese Sativa-dominante Sorte bietet ein komplexes Geschmacksprofil mit Noten von Zitrus, Erde und Gewürzen. Ihr starkes zerebrales High macht sie perfekt für kreative Aktivitäten und soziale Situationen.', 'Amnesia Haze Cannabis Samen | Dutch Seed Supply', 'Premium Amnesia Haze Cannabis-Samen. Diese preisgekrönte Sativa-Sorte liefert energetische Wirkungen und beeindruckende Erträge.'),
    (product_id, 'fr', 'Amnesia Haze est un gagnant multiple de la Cannabis Cup, connu pour ses effets énergiques et stimulants. Cette souche à dominance sativa offre un profil de saveur complexe avec des notes d\'agrumes, de terre et d\'épices. Son high cérébral puissant la rend parfaite pour les activités créatives et les situations sociales.', 'Graines de Cannabis Amnesia Haze | Dutch Seed Supply', 'Graines de cannabis Amnesia Haze premium. Cette souche sativa primée offre des effets énergiques et des rendements impressionnants.')
  ON CONFLICT (product_id, language_code) DO UPDATE SET
    description = EXCLUDED.description,
    meta_title = EXCLUDED.meta_title,
    meta_description = EXCLUDED.meta_description;

  -- Add variants for Amnesia Haze
  INSERT INTO product_variants (product_id, domain_id, price, sale_price, stock_quantity, stock_status)
  VALUES
    (product_id, 'nl', 32.99, NULL, 70, 'in_stock'),
    (product_id, 'com', 35.99, NULL, 55, 'in_stock'),
    (product_id, 'de', 34.99, NULL, 35, 'in_stock'),
    (product_id, 'fr', 36.99, NULL, 20, 'in_stock')
  ON CONFLICT (product_id, domain_id) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity;

  -- Add categories for Amnesia Haze
  category_ids := get_category_ids(ARRAY['sativa', 'feminized']);
  FOREACH product_id IN ARRAY ARRAY[product_id]
  LOOP
    FOREACH category_id IN ARRAY category_ids
    LOOP
      INSERT INTO product_categories (product_id, category_id)
      VALUES (product_id, category_id)
      ON CONFLICT DO NOTHING;
    END LOOP;
  END LOOP;

  -- 4. White Widow (Hybrid)
  INSERT INTO products (
    sku, name, slug, price, sale_price, stock_quantity, stock_status, 
    featured, images, thc_content, cbd_content, flowering_time, height, yield
  ) VALUES (
    'DSS-WW-004', 
    'White Widow', 
    'white-widow', 
    28.99, 
    25.99, 
    120, 
    'in_stock', 
    true, 
    '[{"url": "https://images.unsplash.com/photo-1603916113307-e89f5e295b5c", "alt": "White Widow cannabis plant"}]'::jsonb, 
    19.00, 
    0.20, 
    56, 
    '60-100cm', 
    '450-500g/m²'
  )
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    price = EXCLUDED.price,
    sale_price = EXCLUDED.sale_price,
    featured = EXCLUDED.featured,
    thc_content = EXCLUDED.thc_content,
    cbd_content = EXCLUDED.cbd_content,
    flowering_time = EXCLUDED.flowering_time,
    height = EXCLUDED.height,
    yield = EXCLUDED.yield
  RETURNING id INTO product_id;

  -- Add translations for White Widow
  INSERT INTO product_translations (product_id, language_code, description, meta_title, meta_description)
  VALUES
    (product_id, 'en', 'White Widow is a balanced hybrid strain famous for its white crystal resin coating. This classic Dutch strain delivers a powerful, balanced high that combines cerebral effects with body relaxation. Easy to grow and highly resistant to mold and pests, it\'s perfect for beginners.', 'White Widow Cannabis Seeds | Dutch Seed Supply', 'Premium White Widow cannabis seeds. This classic Dutch hybrid strain is easy to grow and delivers a powerful, balanced high.'),
    (product_id, 'nl', 'White Widow is een gebalanceerde hybride soort die bekend staat om zijn witte kristallen harslaag. Deze klassieke Nederlandse soort levert een krachtige, gebalanceerde high die cerebrale effecten combineert met lichamelijke ontspanning. Gemakkelijk te kweken en zeer resistent tegen schimmel en ongedierte, perfect voor beginners.', 'White Widow Cannabis Zaden | Dutch Seed Supply', 'Premium White Widow cannabis zaden. Deze klassieke Nederlandse hybride soort is gemakkelijk te kweken en levert een krachtige, gebalanceerde high.'),
    (product_id, 'de', 'White Widow ist eine ausgewogene Hybridsorte, die für ihre weiße Kristallharzbeschichtung bekannt ist. Diese klassische niederländische Sorte liefert ein kraftvolles, ausgewogenes High, das zerebrale Effekte mit Körperentspannung kombiniert. Leicht anzubauen und hochresistent gegen Schimmel und Schädlinge, ist sie perfekt für Anfänger.', 'White Widow Cannabis Samen | Dutch Seed Supply', 'Premium White Widow Cannabis-Samen. Diese klassische niederländische Hybridsorte ist leicht anzubauen und liefert ein kraftvolles, ausgewogenes High.'),
    (product_id, 'fr', 'White Widow est une souche hybride équilibrée célèbre pour son revêtement de résine cristalline blanche. Cette souche néerlandaise classique offre un high puissant et équilibré qui combine des effets cérébraux avec une relaxation corporelle. Facile à cultiver et hautement résistante aux moisissures et aux parasites, elle est parfaite pour les débutants.', 'Graines de Cannabis White Widow | Dutch Seed Supply', 'Graines de cannabis White Widow premium. Cette souche hybride néerlandaise classique est facile à cultiver et offre un high puissant et équilibré.')
  ON CONFLICT (product_id, language_code) DO UPDATE SET
    description = EXCLUDED.description,
    meta_title = EXCLUDED.meta_title,
    meta_description = EXCLUDED.meta_description;

  -- Add variants for White Widow
  INSERT INTO product_variants (product_id, domain_id, price, sale_price, stock_quantity, stock_status)
  VALUES
    (product_id, 'nl', 28.99, 25.99, 120, 'in_stock'),
    (product_id, 'com', 31.99, 28.99, 90, 'in_stock'),
    (product_id, 'de', 30.99, 27.99, 60, 'in_stock'),
    (product_id, 'fr', 32.99, 29.99, 45, 'in_stock')
  ON CONFLICT (product_id, domain_id) DO UPDATE SET
    price = EXCLUDED.price,
    sale_price = EXCLUDED.sale_price,
    stock_quantity = EXCLUDED.stock_quantity;

  -- Add categories for White Widow
  category_ids := get_category_ids(ARRAY['hybrid', 'feminized']);
  FOREACH product_id IN ARRAY ARRAY[product_id]
  LOOP
    FOREACH category_id IN ARRAY category_ids
    LOOP
      INSERT INTO product_categories (product_id, category_id)
      VALUES (product_id, category_id)
      ON CONFLICT DO NOTHING;
    END LOOP;
  END LOOP;

  -- 5. Girl Scout Cookies (Hybrid)
  INSERT INTO products (
    sku, name, slug, price, sale_price, stock_quantity, stock_status, 
    featured, images, thc_content, cbd_content, flowering_time, height, yield
  ) VALUES (
    'DSS-GSC-005', 
    'Girl Scout Cookies', 
    'girl-scout-cookies', 
    36.99, 
    NULL, 
    65, 
    'in_stock', 
    false, 
    '[{"url": "https://images.unsplash.com/photo-1603976245779-7b4170915461", "alt": "Girl Scout Cookies cannabis plant"}]'::jsonb, 
    25.00, 
    0.40, 
    63, 
    '80-110cm', 
    '400-450g/m²'
  )
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    price = EXCLUDED.price,
    featured = EXCLUDED.featured,
    thc_content = EXCLUDED.thc_content,
    cbd_content = EXCLUDED.cbd_content,
    flowering_time = EXCLUDED.flowering_time,
    height = EXCLUDED.height,
    yield = EXCLUDED.yield
  RETURNING id INTO product_id;

  -- Add translations for Girl Scout Cookies
  INSERT INTO product_translations (product_id, language_code, description, meta_title, meta_description)
  VALUES
    (product_id, 'en', 'Girl Scout Cookies (GSC) is an award-winning hybrid strain with a sweet and earthy aroma. This potent variety delivers euphoric effects combined with full-body relaxation. Known for its distinctive purple leaves and orange hairs, GSC produces dense, resin-coated buds with exceptional bag appeal.', 'Girl Scout Cookies Cannabis Seeds | Dutch Seed Supply', 'Premium Girl Scout Cookies cannabis seeds. This award-winning hybrid strain offers potent effects and exceptional flavor.'),
    (product_id, 'nl', 'Girl Scout Cookies (GSC) is een bekroonde hybride soort met een zoet en aards aroma. Deze krachtige variëteit levert euforische effecten gecombineerd met volledige lichaamsontspanning. Bekend om zijn kenmerkende paarse bladeren en oranje haren, produceert GSC dichte, met hars bedekte toppen met uitzonderlijke visuele aantrekkingskracht.', 'Girl Scout Cookies Cannabis Zaden | Dutch Seed Supply', 'Premium Girl Scout Cookies cannabis zaden. Deze bekroonde hybride soort biedt krachtige effecten en uitzonderlijke smaak.'),
    (product_id, 'de', 'Girl Scout Cookies (GSC) ist eine preisgekrönte Hybridsorte mit einem süßen und erdigen Aroma. Diese potente Sorte liefert euphorische Effekte kombiniert mit vollständiger Körperentspannung. Bekannt für ihre charakteristischen lila Blätter und orangefarbenen Haare, produziert GSC dichte, harzbedeckte Knospen mit außergewöhnlicher Optik.', 'Girl Scout Cookies Cannabis Samen | Dutch Seed Supply', 'Premium Girl Scout Cookies Cannabis-Samen. Diese preisgekrönte Hybridsorte bietet starke Wirkungen und außergewöhnlichen Geschmack.'),
    (product_id, 'fr', 'Girl Scout Cookies (GSC) est une souche hybride primée avec un arôme sucré et terreux. Cette variété puissante offre des effets euphoriques combinés à une relaxation corporelle complète. Connue pour ses feuilles violettes distinctives et ses pistils orange, GSC produit des bourgeons denses, recouverts de résine avec un attrait visuel exceptionnel.', 'Graines de Cannabis Girl Scout Cookies | Dutch Seed Supply', 'Graines de cannabis Girl Scout Cookies premium. Cette souche hybride primée offre des effets puissants et une saveur exceptionnelle.')
  ON CONFLICT (product_id, language_code) DO UPDATE SET
    description = EXCLUDED.description,
    meta_title = EXCLUDED.meta_title,
    meta_description = EXCLUDED.meta_description;

  -- Add variants for Girl Scout Cookies
  INSERT INTO product_variants (product_id, domain_id, price, sale_price, stock_quantity, stock_status)
  VALUES
    (product_id, 'nl', 36.99, NULL, 65, 'in_stock'),
    (product_id, 'com', 39.99, NULL, 50, 'in_stock'),
    (product_id, 'de', 38.99, NULL, 30, 'in_stock'),
    (product_id, 'fr', 40.99, NULL, 15, 'in_stock')
  ON CONFLICT (product_id, domain_id) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity;

  -- Add categories for Girl Scout Cookies
  category_ids := get_category_ids(ARRAY['hybrid', 'feminized']);
  FOREACH product_id IN ARRAY ARRAY[product_id]
  LOOP
    FOREACH category_id IN ARRAY category_ids
    LOOP
      INSERT INTO product_categories (product_id, category_id)
      VALUES (product_id, category_id)
      ON CONFLICT DO NOTHING;
    END LOOP;
  END LOOP;

  -- 6. Blue Dream (Hybrid)
  INSERT INTO products (
    sku, name, slug, price, sale_price, stock_quantity, stock_status, 
    featured, images, thc_content, cbd_content, flowering_time, height, yield
  ) VALUES (
    'DSS-BD-006', 
    'Blue Dream', 
    'blue-dream', 
    31.99, 
    NULL, 
    90, 
    'in_stock', 
    false, 
    '[{"url": "https://images.unsplash.com/photo-1603976245605-6ea4a0f9b6a3", "alt": "Blue Dream cannabis plant"}]'::jsonb, 
    20.00, 
    0.10, 
    65, 
    '150-200cm', 
    '550-600g/m²'
  )
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    price = EXCLUDED.price,
    featured = EXCLUDED.featured,
    thc_content = EXCLUDED.thc_content,
    cbd_content = EXCLUDED.cbd_content,
    flowering_time = EXCLUDED.flowering_time,
    height = EXCLUDED.height,
    yield = EXCLUDED.yield
  RETURNING id INTO product_id;

  -- Add translations for Blue Dream
  INSERT INTO product_translations (product_id, language_code, description, meta_title, meta_description)
  VALUES
    (product_id, 'en', 'Blue Dream is a sativa-dominant hybrid that balances full-body relaxation with gentle cerebral invigoration. This California favorite delivers swift symptom relief without heavy sedative effects, making it a popular daytime medicine. With a sweet berry aroma inherited from its Blueberry parent, Blue Dream is a pleasure to grow and consume.', 'Blue Dream Cannabis Seeds | Dutch Seed Supply', 'Premium Blue Dream cannabis seeds. This sativa-dominant hybrid offers balanced effects and impressive yields.'),
    (product_id, 'nl', 'Blue Dream is een sativa-dominante hybride die volledige lichaamsontspanning combineert met zachte cerebrale verfrissing. Deze Californische favoriet zorgt voor snelle symptoomverlichting zonder zware kalmerende effecten, waardoor het een populair medicijn voor overdag is. Met een zoet besaroma, geërfd van zijn Blueberry-ouder, is Blue Dream een genot om te kweken en te consumeren.', 'Blue Dream Cannabis Zaden | Dutch Seed Supply', 'Premium Blue Dream cannabis zaden. Deze sativa-dominante hybride biedt gebalanceerde effecten en indrukwekkende opbrengsten.'),
    (product_id, 'de', 'Blue Dream ist eine Sativa-dominante Hybride, die vollständige Körperentspannung mit sanfter zerebraler Belebung ausgleicht. Dieser kalifornische Favorit bietet schnelle Symptomlinderung ohne schwere sedierende Wirkungen, was ihn zu einer beliebten Tagesmedizin macht. Mit einem süßen Beerenaroma, das von seinem Blueberry-Elternteil geerbt wurde, ist Blue Dream eine Freude zum Anbauen und Konsumieren.', 'Blue Dream Cannabis Samen | Dutch Seed Supply', 'Premium Blue Dream Cannabis-Samen. Diese Sativa-dominante Hybride bietet ausgewogene Wirkungen und beeindruckende Erträge.'),
    (product_id, 'fr', 'Blue Dream est une hybride à dominance sativa qui équilibre la relaxation corporelle complète avec une douce stimulation cérébrale. Ce favori californien offre un soulagement rapide des symptômes sans effets sédatifs lourds, ce qui en fait un médicament populaire pour la journée. Avec un arôme sucré de baies hérité de son parent Blueberry, Blue Dream est un plaisir à cultiver et à consommer.', 'Graines de Cannabis Blue Dream | Dutch Seed Supply', 'Graines de cannabis Blue Dream premium. Cette hybride à dominance sativa offre des effets équilibrés et des rendements impressionnants.')
  ON CONFLICT (product_id, language_code) DO UPDATE SET
    description = EXCLUDED.description,
    meta_title = EXCLUDED.meta_title,
    meta_description = EXCLUDED.meta_description;

  -- Add variants for Blue Dream
  INSERT INTO product_variants (product_id, domain_id, price, sale_price, stock_quantity, stock_status)
  VALUES
    (product_id, 'nl', 31.99, NULL, 90, 'in_stock'),
    (product_id, 'com', 34.99, NULL, 70, 'in_stock'),
    (product_id, 'de', 33.99, NULL, 45, 'in_stock'),
    (product_id, 'fr', 35.99, NULL, 35, 'in_stock')
  ON CONFLICT (product_id, domain_id) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity;

  -- Add categories for Blue Dream
  category_ids := get_category_ids(ARRAY['hybrid', 'sativa', 'feminized']);
  FOREACH product_id IN ARRAY ARRAY[product_id]
  LOOP
    FOREACH category_id IN ARRAY category_ids
    LOOP
      INSERT INTO product_categories (product_id, category_id)
      VALUES (product_id, category_id)
      ON CONFLICT DO NOTHING;
    END LOOP;
  END LOOP;

  -- 7. AK-47 (Hybrid)
  INSERT INTO products (
    sku, name, slug, price, sale_price, stock_quantity, stock_status, 
    featured, images, thc_content, cbd_content, flowering_time, height, yield
  ) VALUES (
    'DSS-AK47-007', 
    'AK-47', 
    'ak-47', 
    33.99, 
    30.99, 
    75, 
    'in_stock', 
    false, 
    '[{"url": "https://images.unsplash.com/photo-1603976257212-539d97e9dfc1", "alt": "AK-47 cannabis plant"}]'::jsonb, 
    20.00, 
    0.30, 
    60, 
    '100-150cm', 
    '400-500g/m²'
  )
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    price = EXCLUDED.price,
    sale_price = EXCLUDED.sale_price,
    featured = EXCLUDED.featured,
    thc_content = EXCLUDED.thc_content,
    cbd_content = EXCLUDED.cbd_content,
    flowering_time = EXCLUDED.flowering_time,
    height = EXCLUDED.height,
    yield = EXCLUDED.yield
  RETURNING id INTO product_id;

  -- Add translations for AK-47
  INSERT INTO product_translations (product_id, language_code, description, meta_title, meta_description)
  VALUES
    (product_id, 'en', 'Despite its aggressive name, AK-47 is a surprisingly mellow and relaxing strain. This multiple Cannabis Cup winner delivers a steady, long-lasting cerebral buzz that keeps you mentally alert and engaged. AK-47 features a complex blend of Colombian, Mexican, Thai, and Afghan genetics, resulting in a spicy, earthy aroma with subtle sweet undertones.', 'AK-47 Cannabis Seeds | Dutch Seed Supply', 'Premium AK-47 cannabis seeds. This award-winning hybrid strain offers a long-lasting cerebral buzz and is easy to grow.'),
    (product_id, 'nl', 'Ondanks zijn agressieve naam is AK-47 een verrassend milde en ontspannende soort. Deze meervoudige Cannabis Cup-winnaar levert een stabiele, langdurige cerebrale buzz die je mentaal alert en betrokken houdt. AK-47 heeft een complexe mix van Colombiaanse, Mexicaanse, Thaise en Afghaanse genetica, wat resulteert in een pittig, aards aroma met subtiele zoete ondertonen.', 'AK-47 Cannabis Zaden | Dutch Seed Supply', 'Premium AK-47 cannabis zaden. Deze bekroonde hybride soort biedt een langdurige cerebrale buzz en is gemakkelijk te kweken.'),
    (product_id, 'de', 'Trotz ihres aggressiven Namens ist AK-47 eine überraschend milde und entspannende Sorte. Dieser mehrfache Cannabis Cup-Gewinner liefert einen stetigen, lang anhaltenden zerebralen Rausch, der Sie geistig wach und engagiert hält. AK-47 verfügt über eine komplexe Mischung aus kolumbianischen, mexikanischen, thailändischen und afghanischen Genetiken, was zu einem würzigen, erdigen Aroma mit subtilen süßen Untertönen führt.', 'AK-47 Cannabis Samen | Dutch Seed Supply', 'Premium AK-47 Cannabis-Samen. Diese preisgekrönte Hybridsorte bietet einen lang anhaltenden zerebralen Rausch und ist leicht anzubauen.'),
    (product_id, 'fr', 'Malgré son nom agressif, AK-47 est une souche étonnamment douce et relaxante. Ce gagnant multiple de la Cannabis Cup offre un buzz cérébral stable et durable qui vous maintient mentalement alerte et engagé. AK-47 présente un mélange complexe de génétiques colombiennes, mexicaines, thaïlandaises et afghanes, résultant en un arôme épicé et terreux avec de subtiles notes sucrées.', 'Graines de Cannabis AK-47 | Dutch Seed Supply', 'Graines de cannabis AK-47 premium. Cette souche hybride primée offre un buzz cérébral durable et est facile à cultiver.')
  ON CONFLICT (product_id, language_code) DO UPDATE SET
    description = EXCLUDED.description,
    meta_title = EXCLUDED.meta_title,
    meta_description = EXCLUDED.meta_description;

  -- Add variants for AK-47
  INSERT INTO product_variants (product_id, domain_id, price, sale_price, stock_quantity, stock_status)
  VALUES
    (product_id, 'nl', 33.99, 30.99, 75, 'in_stock'),
    (product_id, 'com', 36.99, 33.99, 60, 'in_stock'),
    (product_id, 'de', 35.99, 32.99, 40, 'in_stock'),
    (product_id, 'fr', 37.99, 34.99, 25, 'in_stock')
  ON CONFLICT (product_id, domain_id) DO UPDATE SET
    price = EXCLUDED.price,
    sale_price = EXCLUDED.sale_price,
    stock_quantity = EXCLUDED.stock_quantity;

  -- Add categories for AK-47
  category_ids := get_category_ids(ARRAY['hybrid', 'feminized']);
  FOREACH product_id IN ARRAY ARRAY[product_id]
  LOOP
    FOREACH category_id IN ARRAY category_ids
    LOOP
      INSERT INTO product_categories (product_id, category_id)
      VALUES (product_id, category_id)
      ON CONFLICT DO NOTHING;
    END LOOP;
  END LOOP;

  -- 8. Gorilla Glue (Hybrid)
  INSERT INTO products (
    sku, name, slug, price, sale_price, stock_quantity, stock_status, 
    featured, images, thc_content, cbd_content, flowering_time, height, yield
  ) VALUES (
    'DSS-GG-008', 
    'Gorilla Glue', 
    'gorilla-glue', 
    35.99, 
    NULL, 
    60, 
    'in_stock', 
    false, 
    '[{"url": "https://images.unsplash.com/photo-1603976257623-62a9a5c28f0a", "alt": "Gorilla Glue cannabis plant"}]'::jsonb, 
    26.00, 
    0.10, 
    58, 
    '80-140cm', 
    '500-600g/m²'
  )
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    price = EXCLUDED.price,
    featured = EXCLUDED.featured,
    thc_content = EXCLUDED.thc_content,
    cbd_content = EXCLUDED.cbd_content,
    flowering_time = EXCLUDED.flowering_time,
    height = EXCLUDED.height,
    yield = EXCLUDED.yield
  RETURNING id INTO product_id;

  -- Add translations for Gorilla Glue
  INSERT INTO product_translations (product_id, language_code, description, meta_title, meta_description)
  VALUES
    (product_id, 'en', 'Gorilla Glue, also known as GG4, is a potent hybrid strain that delivers heavy-handed euphoria and relaxation. Its name comes from the resin-rich buds that stick to scissors during trimming. With a pungent, earthy aroma and powerful effects, this multiple Cannabis Cup winner is not for novice consumers. Expect a strong, long-lasting high that glues you to the couch.', 'Gorilla Glue Cannabis Seeds | Dutch Seed Supply', 'Premium Gorilla Glue cannabis seeds. This potent hybrid strain offers powerful effects and exceptional resin production.'),
    (product_id, 'nl', 'Gorilla Glue, ook bekend als GG4, is een krachtige hybride soort die sterke euforie en ontspanning levert. De naam komt van de harsrijke toppen die aan scharen blijven plakken tijdens het trimmen. Met een scherp, aards aroma en krachtige effecten is deze meervoudige Cannabis Cup-winnaar niet voor beginnende gebruikers. Verwacht een sterke, langdurige high die je aan de bank lijmt.', 'Gorilla Glue Cannabis Zaden | Dutch Seed Supply', 'Premium Gorilla Glue cannabis zaden. Deze krachtige hybride soort biedt sterke effecten en uitzonderlijke harsproductie.'),
    (product_id, 'de', 'Gorilla Glue, auch bekannt als GG4, ist eine potente Hybridsorte, die starke Euphorie und Entspannung liefert. Ihr Name stammt von den harzreichen Knospen, die während des Trimmens an der Schere kleben bleiben. Mit einem durchdringenden, erdigen Aroma und starken Effekten ist dieser mehrfache Cannabis Cup-Gewinner nichts für Anfänger. Erwarten Sie ein starkes, lang anhaltendes High, das Sie an die Couch klebt.', 'Gorilla Glue Cannabis Samen | Dutch Seed Supply', 'Premium Gorilla Glue Cannabis-Samen. Diese potente Hybridsorte bietet starke Wirkungen und außergewöhnliche Harzproduktion.'),
    (product_id, 'fr', 'Gorilla Glue, également connu sous le nom de GG4, est une souche hybride puissante qui offre une euphorie et une relaxation intenses. Son nom vient des bourgeons riches en résine qui collent aux ciseaux pendant la taille. Avec un arôme piquant et terreux et des effets puissants, ce gagnant multiple de la Cannabis Cup n\'est pas pour les consommateurs novices. Attendez-vous à un high puissant et durable qui vous colle au canapé.', 'Graines de Cannabis Gorilla Glue | Dutch Seed Supply', 'Graines de cannabis Gorilla Glue premium. Cette souche hybride puissante offre des effets puissants et une production de résine exceptionnelle.')
  ON CONFLICT (product_id, language_code) DO UPDATE SET
    description = EXCLUDED.description,
    meta_title = EXCLUDED.meta_title,
    meta_description = EXCLUDED.meta_description;

  -- Add variants for Gorilla Glue
  INSERT INTO product_variants (product_id, domain_id, price, sale_price, stock_quantity, stock_status)
  VALUES
    (product_id, 'nl', 35.99, NULL, 60, 'in_stock'),
    (product_id, 'com', 38.99, NULL, 45, 'in_stock'),
    (product_id, 'de', 37.99, NULL, 30, 'in_stock'),
    (product_id, 'fr', 39.99, NULL, 20, 'in_stock')
  ON CONFLICT (product_id, domain_id) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity;

  -- Add categories for Gorilla Glue
  category_ids := get_category_ids(ARRAY['hybrid', 'feminized']);
  FOREACH product_id IN ARRAY ARRAY[product_id]
  LOOP
    FOREACH category_id IN ARRAY category_ids
    LOOP
      INSERT INTO product_categories (product_id, category_id)
      VALUES (product_id, category_id)
      ON CONFLICT DO NOTHING;
    END LOOP;
  END LOOP;

  -- 9. Sour Diesel (Sativa)
  INSERT INTO products (
    sku, name, slug, price, sale_price, stock_quantity, stock_status, 
    featured, images, thc_content, cbd_content, flowering_time, height, yield
  ) VALUES (
    'DSS-SD-009', 
    'Sour Diesel', 
    'sour-diesel', 
    34.99, 
    NULL, 
    55, 
    'in_stock', 
    false, 
    '[{"url": "https://images.unsplash.com/photo-1603976257656-8c2b3a9a0a0b", "alt": "Sour Diesel cannabis plant"}]'::jsonb, 
    22.00, 
    0.20, 
    70, 
    '120-160cm', 
    '450-550g/m²'
  )
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    price = EXCLUDED.price,
    featured = EXCLUDED.featured,
    thc_content = EXCLUDED.thc_content,
    cbd_content = EXCLUDED.cbd_content,
    flowering_time = EXCLUDED.flowering_time,
    height = EXCLUDED.height,
    yield = EXCLUDED.yield
  RETURNING id INTO product_id;

  -- Add translations for Sour Diesel
  INSERT INTO product_translations (product_id, language_code, description, meta_title, meta_description)
  VALUES
    (product_id, 'en', 'Sour Diesel is a fast-acting sativa strain delivering energizing, dreamy cerebral effects. This strain features a pungent fuel-like aroma with hints of citrus, making it instantly recognizable. Stress, pain, and depression fade away with even just a few hits of Sour Diesel, making it a perfect morning or afternoon strain for active users.', 'Sour Diesel Cannabis Seeds | Dutch Seed Supply', 'Premium Sour Diesel cannabis seeds. This energizing sativa strain offers fast-acting effects and a distinctive fuel-like aroma.'),
    (product_id, 'nl', 'Sour Diesel is een snelwerkende sativa-soort die energieke, dromerige cerebrale effecten levert. Deze soort heeft een scherp, brandstofachtig aroma met hints van citrus, waardoor het direct herkenbaar is. Stress, pijn en depressie verdwijnen met slechts een paar hits van Sour Diesel, waardoor het een perfecte ochtend- of middagsoort is voor actieve gebruikers.', 'Sour Diesel Cannabis Zaden | Dutch Seed Supply', 'Premium Sour Diesel cannabis zaden. Deze energieke sativa-soort biedt snelwerkende effecten en een kenmerkend brandstofachtig aroma.'),
    (product_id, 'de', 'Sour Diesel ist eine schnell wirkende Sativa-Sorte, die energetisierende, traumhafte zerebrale Effekte liefert. Diese Sorte zeichnet sich durch ein durchdringendes, kraftstoffähnliches Aroma mit Zitrusnoten aus, was sie sofort erkennbar macht. Stress, Schmerzen und Depressionen verschwinden schon nach wenigen Zügen von Sour Diesel, was sie zu einer perfekten Morgen- oder Nachmittagssorte für aktive Nutzer macht.', 'Sour Diesel Cannabis Samen | Dutch Seed Supply', 'Premium Sour Diesel Cannabis-Samen. Diese energetisierende Sativa-Sorte bietet schnell wirkende Effekte und ein charakteristisches kraftstoffähnliches Aroma.'),
    (product_id, 'fr', 'Sour Diesel est une souche sativa à action rapide offrant des effets cérébraux énergisants et rêveurs. Cette souche présente un arôme piquant semblable à du carburant avec des notes d\'agrumes, ce qui la rend instantanément reconnaissable. Le stress, la douleur et la dépression s\'estompent avec seulement quelques bouffées de Sour Diesel, ce qui en fait une souche parfaite pour le matin ou l\'après-midi pour les utilisateurs actifs.', 'Graines de Cannabis Sour Diesel | Dutch Seed Supply', 'Graines de cannabis Sour Diesel premium. Cette souche sativa énergisante offre des effets rapides et un arôme distinctif semblable à du carburant.')
  ON CONFLICT (product_id, language_code) DO UPDATE SET
    description = EXCLUDED.description,
    meta_title = EXCLUDED.meta_title,
    meta_description = EXCLUDED.meta_description;

  -- Add variants for Sour Diesel
  INSERT INTO product_variants (product_id, domain_id, price, sale_price, stock_quantity, stock_status)
  VALUES
    (product_id, 'nl', 34.99, NULL, 55, 'in_stock'),
    (product_id, 'com', 37.99, NULL, 40, 'in_stock'),
    (product_id, 'de', 36.99, NULL, 25, 'in_stock'),
    (product_id, 'fr', 38.99, NULL, 15, 'in_stock')
  ON CONFLICT (product_id, domain_id) DO UPDATE SET
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity;

  -- Add categories for Sour Diesel
  category_ids := get_category_ids(ARRAY['sativa', 'feminized']);
  FOREACH product_id IN ARRAY ARRAY[product_id]
  LOOP
    FOREACH category_id IN ARRAY category_ids
    LOOP
      INSERT INTO product_categories (product_id, category_id)
      VALUES (product_id, category_id)
      ON CONFLICT DO NOTHING;
    END LOOP;
  END LOOP;

  -- 10. CBD Critical Mass (CBD)
  INSERT INTO products (
    sku, name, slug, price, sale_price, stock_quantity, stock_status, 
    featured, images, thc_content, cbd_content, flowering_time, height, yield
  ) VALUES (
    'DSS-CBDCM-010', 
    'CBD Critical Mass', 
    'cbd-critical-mass', 
    32.99, 
    29.99, 
    80, 
    'in_stock', 
    true, 
    '[{"url": "https://images.unsplash.com/photo-1603976257764-6ac7ef8e3e80", "alt": "CBD Critical Mass cannabis plant"}]'::jsonb, 
    6.00, 
    8.00, 
    55, 
    '90-120cm', 
    '500-550g/m²'
  )
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    price = EXCLUDED.price,
    sale_price = EXCLUDED.sale_price,
    featured = EXCLUDED.featured,
    thc_content = EXCLUDED.thc_content,
    cbd_content = EXCLUDED.cbd_content,
    flowering_time = EXCLUDED.flowering_time,
    height = EXCLUDED.height,
    yield = EXCLUDED.yield
  RETURNING id INTO product_id;

  -- Add translations for CBD Critical Mass
  INSERT INTO product_translations (product_id, language_code, description, meta_title, meta_description)
  VALUES
    (product_id, 'en', 'CBD Critical Mass is a therapeutic strain with a balanced THC:CBD ratio, making it perfect for medicinal users. This indica-dominant variety delivers mild psychoactive effects alongside powerful pain relief and anti-inflammatory properties. With a sweet, earthy flavor and impressive yields, CBD Critical Mass is both enjoyable to consume and rewarding to grow.', 'CBD Critical Mass Cannabis Seeds | Dutch Seed Supply', 'Premium CBD Critical Mass cannabis seeds. This therapeutic strain offers balanced THC:CBD ratios and powerful medicinal benefits.'),
    (product_id, 'nl', 'CBD Critical Mass is een therapeutische soort met een gebalanceerde THC:CBD-verhouding, waardoor het perfect is voor medicinale gebruikers. Deze indica-dominante variëteit levert milde psychoactieve effecten naast krachtige pijnverlichting en ontstekingsremmende eigenschappen. Met een zoete, aardse smaak en indrukwekkende opbrengsten is CBD Critical Mass zowel aangenaam om te consumeren als lonend om te kweken.', 'CBD Critical Mass Cannabis Zaden | Dutch Seed Supply', 'Premium CBD Critical Mass cannabis zaden. Deze therapeutische soort biedt gebalanceerde THC:CBD-verhoudingen en krachtige medicinale voordelen.'),
    (product_id, 'de', 'CBD Critical Mass ist eine therapeutische Sorte mit einem ausgewogenen THC:CBD-Verhältnis, was sie perfekt für medizinische Anwender macht. Diese Indica-dominante Sorte liefert milde psychoaktive Effekte neben starker Schmerzlinderung und entzündungshemmenden Eigenschaften. Mit einem süßen, erdigen Geschmack und beeindruckenden Erträgen ist CBD Critical Mass sowohl angenehm zu konsumieren als auch lohnend anzubauen.', 'CBD Critical Mass Cannabis Samen | Dutch Seed Supply', 'Premium CBD Critical Mass Cannabis-Samen. Diese therapeutische Sorte bietet ausgewogene THC:CBD-Verhältnisse und starke medizinische Vorteile.'),
    (product_id, 'fr', 'CBD Critical Mass est une souche thérapeutique avec un ratio THC:CBD équilibré, ce qui la rend parfaite pour les utilisateurs médicinaux. Cette variété à dominance indica offre des effets psychoactifs légers ainsi que de puissantes propriétés analgésiques et anti-inflammatoires. Avec une saveur douce et terreuse et des rendements impressionnants, CBD Critical Mass est à la fois agréable à consommer et gratifiante à cultiver.', 'Graines de Cannabis CBD Critical Mass | Dutch Seed Supply', 'Graines de cannabis CBD Critical Mass premium. Cette souche thérapeutique offre des ratios THC:CBD équilibrés et de puissants avantages médicinaux.')
  ON CONFLICT (product_id, language_code) DO UPDATE SET
    description = EXCLUDED.description,
    meta_title = EXCLUDED.meta_title,
    meta_description = EXCLUDED.meta_description;

  -- Add variants for CBD Critical Mass
  INSERT INTO product_variants (product_id, domain_id, price, sale_price, stock_quantity, stock_status)
  VALUES
    (product_id, 'nl', 32.99, 29.99, 80, 'in_stock'),
    (product_id, 'com', 35.99, 32.99, 65, 'in_stock'),
    (product_id, 'de', 34.99, 31.99, 50, 'in_stock'),
    (product_id, 'fr', 36.99, 33.99, 40, 'in_stock')
  ON CONFLICT (product_id, domain_id) DO UPDATE SET
    price = EXCLUDED.price,
    sale_price = EXCLUDED.sale_price,
    stock_quantity = EXCLUDED.stock_quantity;

  -- Add categories for CBD Critical Mass
  category_ids := get_category_ids(ARRAY['indica', 'cbd', 'feminized']);
  FOREACH product_id IN ARRAY ARRAY[product_id]
  LOOP
    FOREACH category_id IN ARRAY category_ids
    LOOP
      INSERT INTO product_categories (product_id, category_id)
      VALUES (product_id, category_id)
      ON CONFLICT DO NOTHING;
    END LOOP;
  END LOOP;
END;
$$;

-- Drop the temporary function
DROP FUNCTION IF EXISTS get_category_ids(TEXT[]);

-- Output success message
DO $$
BEGIN
  RAISE NOTICE 'Demo products successfully inserted!';
END;
$$;
