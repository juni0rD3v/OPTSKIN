import { ServiceInfo, ServiceCategory } from '../types';

export const servicesData: ServiceInfo[] = [
  // --- Skin Rejuvenation (Facials, Peels, Lasers, Drips) ---
  {
    id: 'zo-facial',
    category: ServiceCategory.SKIN_REJUVENATION,
    title: 'ZO Facial',
    description: 'A medical-grade facial designed to brighten skin and improve texture using ZO Skin Health protocols.',
    detailedDescription: 'The ZO Facial uses a specific sequence of medical-grade cleansers, exfoliants, and serums from ZO Skin Health to target dullness and dehydration. It restores the skin’s natural barrier and leaves you with a healthy, radiant glow.',
    benefits: ['Deep cleansing', 'Brightens complexion', 'Hydrates skin', 'No downtime'],
    priceRange: '₱3,500 - ₱5,000',
    image: 'https://picsum.photos/400/500?random=101'
  },
  {
    id: 'facial-diamond-peel',
    category: ServiceCategory.SKIN_REJUVENATION,
    title: 'Facial with Diamond Peel',
    description: 'Deep cleaning facial combined with microdermabrasion to remove dead skin cells.',
    detailedDescription: 'This treatment combines a classic cleansing facial with a Diamond Peel microdermabrasion. The diamond-tipped wand gently exfoliates the top layer of skin, vacuuming away dead cells and impurities to reveal smoother, fresher skin underneath.',
    benefits: ['Exfoliates dead skin', 'Unclogs pores', 'Smoother texture', 'Instant glow'],
    priceRange: '₱2,500 - ₱4,000',
    image: 'https://picsum.photos/400/500?random=102'
  },
  {
    id: 'signature-facial',
    category: ServiceCategory.SKIN_REJUVENATION,
    title: 'Signature Facial',
    description: 'Our clinic’s customized facial treatment tailored to your specific skin needs.',
    detailedDescription: 'The Signature Facial is a bespoke treatment where our therapists analyze your skin condition on the spot and select the appropriate serums, masks, and massage techniques to address your unique concerns, be it hydration, anti-aging, or acne.',
    benefits: ['Customized care', 'Relaxing massage', 'Targeted solutions', 'Stress relief'],
    priceRange: '₱3,000 - ₱5,000',
    image: 'https://picsum.photos/400/500?random=103'
  },
  {
    id: 'glass-facial',
    category: ServiceCategory.SKIN_REJUVENATION,
    title: 'Glass Facial',
    description: 'Achieve that translucent, luminous "glass skin" look with intense hydration.',
    detailedDescription: 'Popularized by K-Beauty, the Glass Facial focuses on deep hydration and pore refinement to create a smooth, reflective surface on the skin. It often involves oxygen therapy or specialized serums to plump the skin instantly.',
    benefits: ['Intense hydration', 'Dewy finish', 'Refines pores', 'Plumping effect'],
    priceRange: '₱4,000 - ₱6,000',
    image: 'https://picsum.photos/400/500?random=104'
  },
  {
    id: 'jet-peel-facial',
    category: ServiceCategory.SKIN_REJUVENATION,
    title: 'Jet Peel Facial',
    description: 'Non-invasive procedure using pressurized air to penetrate serums deep into the skin.',
    detailedDescription: 'The Jet Peel uses high-velocity jet technology to exfoliate the skin and simultaneously infuse saline and vitamins deep into the dermis without needles. It is cooling, soothing, and highly effective for hydration and lymphatic drainage.',
    benefits: ['Needle-free infusion', 'Cooling and soothing', 'Lymphatic drainage', 'Deep hydration'],
    priceRange: '₱4,500 - ₱7,000',
    image: 'https://picsum.photos/400/500?random=105'
  },
  {
    id: 'optimum-hyaluronic-infusion',
    category: ServiceCategory.SKIN_REJUVENATION,
    title: 'Optimum Hyaluronic Infusion',
    description: 'Deep delivery of hyaluronic acid for maximum moisture retention.',
    detailedDescription: 'This treatment utilizes advanced delivery systems (such as ultrasound or electroporation) to push high-molecular-weight hyaluronic acid into the deeper layers of the skin, providing long-lasting hydration that topical creams cannot achieve.',
    benefits: ['Restores moisture balance', 'Reduces fine lines', 'Plumps skin', 'Improves elasticity'],
    priceRange: '₱5,000 - ₱8,000',
    image: 'https://picsum.photos/400/500?random=106'
  },
  {
    id: 'macropeel',
    category: ServiceCategory.SKIN_REJUVENATION,
    title: 'Macropeel',
    description: 'A stronger exfoliation treatment for rough texture and pigmentation.',
    detailedDescription: 'Macropeel is a step up from microdermabrasion, suitable for thicker or more textured skin. It helps to smooth out rough patches, reduce the appearance of acne scars, and even out skin tone through mechanical exfoliation.',
    benefits: ['Smoothes rough skin', 'Reduces scarring', 'Evens skin tone', 'Promotes cell turnover'],
    priceRange: '₱3,500 - ₱5,500',
    image: 'https://picsum.photos/400/500?random=107'
  },
  {
    id: 'micropeels',
    category: ServiceCategory.SKIN_REJUVENATION,
    title: 'Micropeels',
    description: 'Gentle chemical peels to refresh the skin with minimal peeling.',
    detailedDescription: 'Micropeels use mild acids (like lactic or glycolic) to gently loosen dead skin cells. They are excellent for maintenance, offering a "lunchtime glow" with little to no visible downtime or redness.',
    benefits: ['Gentle exfoliation', 'No downtime', 'Refreshes complexion', 'Maintenance treatment'],
    priceRange: '₱2,500 - ₱4,000',
    image: 'https://picsum.photos/400/500?random=108'
  },
  {
    id: 'smaxel-fractional-laser',
    category: ServiceCategory.SKIN_REJUVENATION,
    title: 'Smaxel Fractional Laser',
    description: 'CO2 fractional laser for skin resurfacing, scars, and pore reduction.',
    detailedDescription: 'Smaxel is a Fractional CO2 laser that creates microscopic channels in the skin to trigger powerful collagen remodeling. It is the gold standard for treating deep acne scars, reducing pore size, and improving overall skin texture.',
    benefits: ['Treats acne scars', 'Reduces pore size', 'Skin resurfacing', 'Collagen stimulation'],
    priceRange: '₱8,000 - ₱15,000',
    image: 'https://picsum.photos/400/500?random=109'
  },
  {
    id: 'almaq-laser',
    category: ServiceCategory.SKIN_REJUVENATION,
    title: 'AlmaQ Laser',
    description: 'Q-Switched laser for pigmentation, tattoo removal, and skin toning.',
    detailedDescription: 'The AlmaQ laser uses high-power acoustic energy to break down pigments in the skin. It is highly effective for removing sun spots, melasma, and tattoos, as well as providing a general brightening and toning effect.',
    benefits: ['Removes pigmentation', 'Tattoo removal', 'Skin brightening', 'Safe for most skin types'],
    priceRange: '₱6,000 - ₱12,000',
    image: 'https://picsum.photos/400/500?random=110'
  },
  {
    id: 'vivace',
    category: ServiceCategory.SKIN_REJUVENATION,
    title: 'Vivace',
    description: 'Microneedling with Radio Frequency (RF) for tightening and contouring.',
    detailedDescription: 'Vivace combines microneedling with RF energy. The needles create micro-channels while the RF heat tightens the skin and stimulates collagen. It’s excellent for treating wrinkles, fine lines, and acne scars with minimal pain.',
    benefits: ['Skin tightening', 'Reduces wrinkles', 'Minimizes scars', 'Minimal downtime'],
    priceRange: '₱15,000 - ₱25,000',
    image: 'https://picsum.photos/400/500?random=111'
  },
  {
    id: 'radiance-drip',
    category: ServiceCategory.SKIN_REJUVENATION,
    title: 'Radiance Drip with Glutathione',
    description: 'IV infusion for systemic skin brightening and detoxification.',
    detailedDescription: 'This IV drip delivers a potent dose of Glutathione and Vitamin C directly into the bloodstream. It helps neutralize free radicals, detoxify the liver, and brighten the skin from within for a full-body glow.',
    benefits: ['Systemic brightening', 'Detoxification', 'Immune boost', 'Antioxidant protection'],
    priceRange: '₱3,000 - ₱5,000',
    image: 'https://picsum.photos/400/500?random=112'
  },
  {
    id: '360-drip',
    category: ServiceCategory.SKIN_REJUVENATION,
    title: '360 Drip',
    description: 'Comprehensive IV therapy for overall wellness and skin health.',
    detailedDescription: 'The 360 Drip is our all-in-one cocktail containing vitamins, minerals, and antioxidants. It supports energy levels, hydration, and skin health, providing comprehensive rejuvenation from the inside out.',
    benefits: ['Total wellness', 'Hydration', 'Energy boost', 'Nutrient replenishment'],
    priceRange: '₱4,000 - ₱6,000',
    image: 'https://picsum.photos/400/500?random=113'
  },
  {
    id: 'myers-drip',
    category: ServiceCategory.SKIN_REJUVENATION,
    title: 'Myers’s Drip',
    description: 'The classic vitamin cocktail for fatigue and immune system support.',
    detailedDescription: 'Named after Dr. John Myers, this classic IV formula contains magnesium, calcium, B-vitamins, and Vitamin C. It is perfect for combating fatigue, migraines, and boosting the immune system.',
    benefits: ['Combats fatigue', 'Immune support', 'Relieves stress', 'Replenishes vitamins'],
    priceRange: '₱3,500 - ₱5,000',
    image: 'https://picsum.photos/400/500?random=114'
  },

  // --- Facial Enhancements (Injectables, Threads) ---
  {
    id: 'botulinum-toxins',
    category: ServiceCategory.FACIAL_ENHANCEMENTS,
    title: 'Botulinum Toxins',
    description: 'Relaxes muscles to smooth out dynamic wrinkles and fine lines.',
    detailedDescription: 'Commonly known as Botox or Dysport, this treatment temporarily relaxes the facial muscles responsible for causing lines (like crow’s feet and frown lines), resulting in smoother, younger-looking skin.',
    benefits: ['Smooths wrinkles', 'Prevents new lines', 'Quick procedure', 'No downtime'],
    priceRange: '₱350 per unit',
    image: 'https://picsum.photos/400/500?random=115'
  },
  {
    id: 'microbotox',
    category: ServiceCategory.FACIAL_ENHANCEMENTS,
    title: 'Microbotox',
    description: 'Diluted toxins injected superficially to reduce pores and oiliness.',
    detailedDescription: 'Microbotox involves injecting multiple tiny doses of diluted toxin into the skin layer rather than the muscle. It targets pores and oil glands, resulting in a matte, poreless finish and a subtle lifting effect.',
    benefits: ['Reduces pore size', 'Controls oil', 'Subtle lift', 'Smooths skin texture'],
    priceRange: '₱8,000 - ₱15,000',
    image: 'https://picsum.photos/400/500?random=116'
  },
  {
    id: 'fillers',
    category: ServiceCategory.FACIAL_ENHANCEMENTS,
    title: 'Fillers',
    description: 'Restores lost volume to cheeks, lips, and chin.',
    detailedDescription: 'Hyaluronic acid dermal fillers are used to plump up areas that have lost volume due to aging. They can contour the cheeks, define the chin, plump the lips, and smooth out deep folds like nasolabial lines.',
    benefits: ['Restores volume', 'Contours face', 'Immediate results', 'Hydrating'],
    priceRange: '₱15,000 - ₱30,000 per syringe',
    image: 'https://picsum.photos/400/500?random=117'
  },
  {
    id: 'nose-threadlift',
    category: ServiceCategory.FACIAL_ENHANCEMENTS,
    title: 'Nose Threadlift',
    description: 'Non-surgical nose augmentation using dissolvable threads.',
    detailedDescription: 'Also known as the "Hiko" nose lift, this procedure uses threads to lift the bridge and tip of the nose. It provides definition and height without the risks and downtime of surgical rhinoplasty.',
    benefits: ['Higher nose bridge', 'Defined tip', 'Non-surgical', 'Immediate results'],
    priceRange: '₱20,000 - ₱35,000',
    image: 'https://picsum.photos/400/500?random=118'
  },
  {
    id: 'cog-threadlift',
    category: ServiceCategory.FACIAL_ENHANCEMENTS,
    title: 'COG Threadlift',
    description: 'Barbed threads for stronger lifting of sagging cheeks and jowls.',
    detailedDescription: 'COG threads have barbs that hook into the skin tissue to provide a stronger mechanical lift. They are highly effective for lifting sagging jowls, cheeks, and defining the jawline.',
    benefits: ['Strong lifting effect', 'Defines jawline', 'Lifts jowls', 'Stimulates collagen'],
    priceRange: '₱4,000 - ₱6,000 per thread',
    image: 'https://picsum.photos/400/500?random=119'
  },
  {
    id: 'threadlift',
    category: ServiceCategory.FACIAL_ENHANCEMENTS,
    title: 'Threadlift',
    description: 'General thread lifting for collagen stimulation and mild lifting.',
    detailedDescription: 'Using PDO (Polydioxanone) threads, this treatment creates a mesh under the skin to stimulate collagen production. It provides mild lifting and improves overall skin firmness over time.',
    benefits: ['Collagen stimulation', 'Skin tightening', 'Natural results', 'Improves elasticity'],
    priceRange: '₱1,000 - ₱3,000 per thread',
    image: 'https://picsum.photos/400/500?random=120'
  },
  {
    id: 'prp',
    category: ServiceCategory.FACIAL_ENHANCEMENTS,
    title: 'PRP',
    description: 'Platelet-Rich Plasma therapy for natural rejuvenation.',
    detailedDescription: 'PRP uses your own blood’s platelets, which are rich in growth factors. When injected or applied to the skin (often with microneedling), it accelerates healing and tissue regeneration, often called the "Vampire Facial".',
    benefits: ['Natural rejuvenation', 'Accelerates healing', 'Improves texture', 'Uses own blood'],
    priceRange: '₱8,000 - ₱12,000',
    image: 'https://picsum.photos/400/500?random=121'
  },

  // --- Body Sculpting ---
  {
    id: 'emsculpt',
    category: ServiceCategory.BODY_SCULPTING,
    title: 'Emsculpt: Reshape with HIFEM Technology',
    description: 'Builds muscle and burns fat using high-intensity electromagnetic energy.',
    detailedDescription: 'Emsculpt is a revolutionary body contouring device that uses High-Intensity Focused Electromagnetic (HIFEM) technology. It induces supramaximal muscle contractions not achievable through voluntary exercise, effectively building muscle and burning fat simultaneously.',
    benefits: ['Builds muscle', 'Burns fat', 'Non-invasive', 'No sweat workout'],
    priceRange: '₱10,000 - ₱20,000 per session',
    image: 'https://picsum.photos/400/500?random=122'
  },
  {
    id: 'exilis',
    category: ServiceCategory.BODY_SCULPTING,
    title: 'Exilis',
    description: 'Radiofrequency and ultrasound for skin tightening and fat reduction.',
    detailedDescription: 'Exilis Elite combines monopolar radiofrequency and ultrasound to deliver controlled heat to deep tissue. This stimulates collagen production for skin tightening and targets fat cells for body contouring.',
    benefits: ['Skin tightening', 'Fat reduction', 'Safe for face and body', 'Comfortable treatment'],
    priceRange: '₱5,000 - ₱15,000',
    image: 'https://picsum.photos/400/500?random=123'
  },
  {
    id: 'ultherapy',
    category: ServiceCategory.BODY_SCULPTING,
    title: 'Ultherapy',
    description: 'Non-surgical lifting using focused ultrasound technology.',
    detailedDescription: 'Ultherapy is the only FDA-cleared, non-invasive procedure that lifts the neck, chin, and brow, and improves lines and wrinkles on the upper chest. It uses time-tested ultrasound energy to lift and tighten the skin naturally.',
    benefits: ['Non-surgical lift', 'Deep collagen stimulation', 'Long-lasting results', 'FDA-cleared'],
    priceRange: '₱40,000 - ₱100,000',
    image: 'https://picsum.photos/400/500?random=124'
  },

  // --- Other Services ---
  {
    id: 'asce-exosomes-hair',
    category: ServiceCategory.OTHER,
    title: 'ASCE+ Exosomes for Hair',
    description: 'Regenerative therapy to stimulate hair growth and scalp health.',
    detailedDescription: 'This treatment uses ASCE+ Exosomes specifically formulated for the scalp. It rejuvenates dormant hair follicles, reduces inflammation, and creates a healthy environment for thicker, stronger hair growth.',
    benefits: ['Stimulates hair growth', 'Thickens hair', 'Improves scalp health', 'Non-surgical'],
    priceRange: '₱15,000 - ₱25,000',
    image: 'https://picsum.photos/400/500?random=125'
  },
  {
    id: 'mediostar-hair-removal',
    category: ServiceCategory.OTHER,
    title: 'Mediostar Hair Removal',
    description: 'Pain-free diode laser for permanent hair reduction.',
    detailedDescription: 'The Mediostar Diode Laser provides fast, effective, and virtually pain-free hair removal. It is safe for all skin types and can treat larger areas quickly, resulting in permanently smooth skin.',
    benefits: ['Pain-free', 'Permanent reduction', 'Fast treatment', 'Safe for all skin types'],
    priceRange: '₱1,500 - ₱8,000',
    image: 'https://picsum.photos/400/500?random=126'
  },
  {
    id: 'sclerotherapy',
    category: ServiceCategory.OTHER,
    title: 'Sclerotherapy',
    description: 'Treatment for spider veins and small varicose veins.',
    detailedDescription: 'Sclerotherapy involves injecting a solution directly into the vein. The solution irritates the lining of the blood vessel, causing it to collapse and stick together and the blood to clot. Over time, the vessel turns into scar tissue that fades from view.',
    benefits: ['Removes spider veins', 'Improves leg appearance', 'Minimally invasive', 'Quick procedure'],
    priceRange: '₱5,000 - ₱10,000',
    image: 'https://picsum.photos/400/500?random=127'
  }
];