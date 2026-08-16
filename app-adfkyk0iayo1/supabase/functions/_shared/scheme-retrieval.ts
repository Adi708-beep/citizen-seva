export type SchemeLike = {
  id: string;
  name: string;
  description: string;
  category: string;
  eligibility_criteria: Record<string, any> | null;
  benefits: string;
  required_documents: string[] | null;
  application_url: string | null;
  state: string | null;
  department: string | null;
  age_min: number | null;
  age_max: number | null;
  income_max: number | null;
  gender_specific: string | null;
  education_required: string | null;
  embedding?: number[] | null;
};

export type ProfileLike = {
  name?: string | null;
  age?: number | null;
  state?: string | null;
  city?: string | null;
  profession?: string | null;
  income?: number | null;
  category?: string | null;
  education?: string | null;
  gender?: string | null;
};

export type RankedScheme = SchemeLike & {
  eligibility_score: number;
  matched_criteria: string[];
  missing_criteria: string[];
  relevance_reasons: string[];
  relevance_score: number;
};

type SchemeSet = SchemeLike[];

const STOP_WORDS = new Set([
  'the',
  'and',
  'for',
  'with',
  'that',
  'this',
  'from',
  'your',
  'you',
  'are',
  'can',
  'about',
  'scheme',
  'schemes',
  'help',
  'please',
  'need',
  'want',
  'apply',
  'get',
  'suggest',
  'suggestion',
  'recommend',
  'recommendation',
]);

function normalizeText(value: string | null | undefined): string {
  return (value || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(value: string | null | undefined): string[] {
  return normalizeText(value)
    .split(' ')
    .map((token) => token.trim())
    .filter((token) => token.length > 2 && !STOP_WORDS.has(token));
}

function uniqueTokens(tokens: string[]): string[] {
  return [...new Set(tokens)];
}

function collectProfileTokens(profile: ProfileLike | null | undefined): string[] {
  if (!profile) return [];

  return uniqueTokens(
    [
      profile.name,
      profile.state,
      profile.city,
      profile.profession,
      profile.category,
      profile.education,
      profile.gender,
    ]
      .flatMap((value) => tokenize(value || ''))
      .filter(Boolean),
  );
}

function buildSchemeText(scheme: SchemeLike): string {
  const documents = Array.isArray(scheme.required_documents) ? scheme.required_documents.join(' ') : '';
  const criteria = scheme.eligibility_criteria ? JSON.stringify(scheme.eligibility_criteria) : '';

  return [
    scheme.name,
    scheme.description,
    scheme.category,
    scheme.benefits,
    scheme.state,
    scheme.department,
    scheme.education_required,
    documents,
    criteria,
  ]
    .filter(Boolean)
    .join(' ');
}

function calculateEligibility(profile: ProfileLike | null | undefined, scheme: SchemeLike): {
  score: number;
  matchedCriteria: string[];
  missingCriteria: string[];
} {
  let score = 0;
  const matchedCriteria: string[] = [];
  const missingCriteria: string[] = [];

  const age = profile?.age ?? null;
  const income = profile?.income ?? null;
  const gender = normalizeText(profile?.gender);
  const state = normalizeText(profile?.state);
  const profession = normalizeText(profile?.profession);
  const education = normalizeText(profile?.education);

  if (scheme.age_min !== null || scheme.age_max !== null) {
    if (age !== null) {
      const matchesMin = scheme.age_min === null || age >= scheme.age_min;
      const matchesMax = scheme.age_max === null || age <= scheme.age_max;
      if (matchesMin && matchesMax) {
        score += 20;
        matchedCriteria.push('Age requirement met');
      } else {
        const range = [scheme.age_min ?? 'any', scheme.age_max ?? 'any'].join(' to ');
        missingCriteria.push(`Age must be between ${range}`);
      }
    } else {
      missingCriteria.push('Age is required to verify eligibility');
    }
  } else {
    score += 20;
  }

  if (scheme.income_max !== null) {
    if (income !== null && income <= scheme.income_max) {
      score += 20;
      matchedCriteria.push('Income requirement met');
    } else {
      missingCriteria.push(`Income must be at or below ${scheme.income_max}`);
    }
  } else {
    score += 20;
  }

  if (scheme.gender_specific) {
    if (gender && gender === normalizeText(scheme.gender_specific)) {
      score += 20;
      matchedCriteria.push('Gender requirement met');
    } else {
      missingCriteria.push(`Scheme is for ${scheme.gender_specific} applicants`);
    }
  } else {
    score += 20;
  }

  if (scheme.state) {
    if (state && state === normalizeText(scheme.state)) {
      score += 20;
      matchedCriteria.push('State requirement met');
    } else {
      missingCriteria.push(`Must be a resident of ${scheme.state}`);
    }
  } else {
    score += 20;
  }

  if (scheme.education_required) {
    if (education) {
      score += 20;
      matchedCriteria.push('Education requirement met');
    } else {
      missingCriteria.push(`Education requirement: ${scheme.education_required}`);
    }
  } else {
    score += 20;
  }

  if (scheme.eligibility_criteria?.professions && Array.isArray(scheme.eligibility_criteria.professions)) {
    const allowedProfessions = scheme.eligibility_criteria.professions.map((value: string) => normalizeText(value));
    if (profession && allowedProfessions.some((allowed: string) => allowed === profession || profession.includes(allowed) || allowed.includes(profession))) {
      matchedCriteria.push('Profession matches scheme category');
      score = Math.min(100, score + 10);
    } else {
      missingCriteria.push('Profession does not match this scheme');
    }
  }

  return { score: Math.min(100, score), matchedCriteria, missingCriteria };
}

function calculateRelevance(profile: ProfileLike | null | undefined, scheme: SchemeLike, queryTokens: string[]): {
  score: number;
  reasons: string[];
} {
  const reasons: string[] = [];
  let score = 0;

  const schemeTokens = uniqueTokens(tokenize(buildSchemeText(scheme)));
  const schemeTokenSet = new Set(schemeTokens);

  const matchedQueryTokens = queryTokens.filter((token) => schemeTokenSet.has(token));
  if (matchedQueryTokens.length > 0) {
    score += Math.min(35, matchedQueryTokens.length * 7);
    reasons.push(`Matches query terms: ${matchedQueryTokens.slice(0, 4).join(', ')}`);
  }

  const profileTokens = collectProfileTokens(profile);
  const matchedProfileTokens = profileTokens.filter((token) => schemeTokenSet.has(token));
  if (matchedProfileTokens.length > 0) {
    score += Math.min(25, matchedProfileTokens.length * 5);
    reasons.push(`Matches profile context: ${matchedProfileTokens.slice(0, 4).join(', ')}`);
  }

  if (profile?.state && scheme.state && normalizeText(profile.state) === normalizeText(scheme.state)) {
    score += 30;
    reasons.push(`State match: ${scheme.state}`);
  }

  if (profile?.profession && scheme.eligibility_criteria?.professions && Array.isArray(scheme.eligibility_criteria.professions)) {
    const profession = normalizeText(profile.profession);
    const allowedProfessions = scheme.eligibility_criteria.professions.map((value: string) => normalizeText(value));
    if (allowedProfessions.some((allowed: string) => profession === allowed || profession.includes(allowed) || allowed.includes(profession))) {
      score += 20;
      reasons.push(`Profession alignment: ${profile.profession}`);
    }
  }

  if (scheme.category) {
    const categoryTokens = tokenize(scheme.category);
    if (categoryTokens.some((token) => queryTokens.includes(token))) {
      score += 10;
      reasons.push(`Category relevance: ${scheme.category}`);
    }
  }

  // Boost national/central schemes so users see central programs too
  if (!scheme.state || normalizeText(scheme.state) === 'national' || normalizeText(scheme.state) === 'central') {
    score += 15;
    reasons.push('National/Central scheme');
  }

  return { score: Math.min(100, score), reasons };
}

export function rankSchemes(options: {
  schemes: SchemeSet;
  profile?: ProfileLike | null;
  query?: string;
  limit?: number;
}): RankedScheme[] {
  const { schemes, profile = null, query = '', limit = 6 } = options;
  const queryTokens = uniqueTokens(tokenize(query));

  const computed = schemes
    .map((scheme) => {
      const eligibility = calculateEligibility(profile, scheme);
      const relevance = calculateRelevance(profile, scheme, queryTokens);

      return {
        ...scheme,
        eligibility_score: eligibility.score,
        matched_criteria: eligibility.matchedCriteria,
        missing_criteria: eligibility.missingCriteria,
        relevance_reasons: relevance.reasons,
        relevance_score: relevance.score,
      };
    })
    .sort((left, right) => {
      const leftScore = left.relevance_score + left.eligibility_score;
      const rightScore = right.relevance_score + right.eligibility_score;

      if (rightScore !== leftScore) {
        return rightScore - leftScore;
      }

      return right.eligibility_score - left.eligibility_score;
    });

  // If user has a state, prefer local schemes first, then national, then others
  if (profile && profile.state) {
    const stateNorm = normalizeText(profile.state);
    const local: RankedScheme[] = [];
    const national: RankedScheme[] = [];
    const others: RankedScheme[] = [];

    for (const s of computed) {
      if (!s.state || normalizeText(s.state) === 'national' || normalizeText(s.state) === 'central') {
        national.push(s);
      } else if (normalizeText(s.state) === stateNorm) {
        local.push(s);
      } else {
        others.push(s);
      }
    }

    return [...local, ...national, ...others].slice(0, Math.max(1, Math.min(limit, 20)));
  }

  return computed.slice(0, Math.max(1, Math.min(limit, 20)));
}

export function mergeUniqueSchemes(primary: SchemeSet, secondary: SchemeSet): SchemeSet {
  const seen = new Set<string>();
  const merged: SchemeSet = [];

  for (const scheme of [...primary, ...secondary]) {
    if (seen.has(scheme.id)) continue;
    seen.add(scheme.id);
    merged.push(scheme);
  }

  return merged;
}