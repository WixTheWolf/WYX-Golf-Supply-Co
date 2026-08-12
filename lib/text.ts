const replacements: Array<[RegExp, string]> = [
  [/[\u2013\u2014]/g, '-'],
  [/[\u2018\u2019]/g, "'"],
  [/[\u201c\u201d]/g, '"'],
  [/\u2022/g, '-'],
  [/\u2705/g, ''],
  [/\u2714\ufe0f?/g, 'Check:'],
  [/\u26f3/g, ''],
  [/\u2122/g, 'TM'],
  [/\u00a0/g, ' '],
  [/\s+/g, ' ']
];

const clearerProductNames: Record<string, string> = {
  'Volcanic Ash': 'Volcanic Ash Golf Belt',
  'Sahara Sunset': 'Sahara Sunset Golf Belt',
  'Black Birdie': 'Black Birdie Golf Belt',
  'Twister Grey': 'Twister Grey Golf Belt',
  'Crimson Dune': 'Crimson Dune Golf Belt',
  'Mossy Condor': 'Mossy Condor Golf Belt',
  'Bone Dry': 'Bone Dry Golf Belt',
  'Sea Swell Blue': 'Sea Swell Blue Golf Belt',
  'Gray Eyed Gator': 'Gray Eyed Gator Golf Belt',
  'Charcoal Mirage': 'Charcoal Mirage Golf Belt',
  'Bayou Brown Gator': 'Bayou Brown Gator Golf Belt',
  'Looper': 'Looper Golf Tee',
  'Legalize Mulligans': 'Legalize Mulligans Tee',
  'Pimento Waffle': 'Pimento Waffle Golf Layer'
};

function repairUtf8Mojibake(value: string) {
  return value.replace(/[\u00c2-\u00f4][\u0080-\u00bf]+/g, (match) => {
    try {
      return new TextDecoder('utf-8', { fatal: false }).decode(Uint8Array.from([...match].map((char) => char.charCodeAt(0))));
    } catch {
      return match;
    }
  });
}

export function cleanText(value: string | null | undefined) {
  const repaired = repairUtf8Mojibake(repairUtf8Mojibake(String(value || '')));
  const cleaned = replacements.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), repaired).trim();
  return clearerProductNames[cleaned] || cleaned;
}
