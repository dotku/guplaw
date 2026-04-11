import type { ReactNode } from 'react';

export interface PracticeAreaTopic {
  title: string;
  description: string;
}

export interface PracticeArea {
  slug: string;
  title: string;
  shortDescription: string;
  tagline: string;
  longDescription: string;
  color: string;
  bgColor: string;
  borderColor: string;
  accentText: string;
  icon: ReactNode;
  questions: string[];
  topics: PracticeAreaTopic[];
  metadata: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export const practiceAreas: PracticeArea[] = [
  {
    slug: 'family-law',
    title: 'Family Law',
    shortDescription:
      'Divorce, child custody, child support, alimony, adoption, and domestic violence protection',
    tagline: 'Navigate family matters with confidence',
    longDescription:
      'Family law touches the most personal parts of your life. Whether you are facing divorce, fighting for custody of your children, or trying to protect yourself from domestic violence, GPULaw combines 24/7 AI guidance with licensed family law attorneys who can step in when your situation requires a human expert.',
    color: 'from-pink-500 to-rose-500',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
    accentText: 'text-rose-700',
    icon: (
      <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
      </svg>
    ),
    questions: [
      'How do I file for divorce?',
      'What factors determine child custody?',
      'How is child support calculated?',
      'What are my rights in a domestic violence case?',
      'What documents do I need for adoption?',
    ],
    topics: [
      {
        title: 'Divorce & Separation',
        description:
          'Contested and uncontested divorce, property division, spousal support, and legal separation options.',
      },
      {
        title: 'Child Custody & Visitation',
        description:
          'Parenting plans, joint vs. sole custody, relocation disputes, and modification of existing orders.',
      },
      {
        title: 'Child & Spousal Support',
        description:
          'Calculating support obligations, enforcing orders, and requesting modifications when circumstances change.',
      },
      {
        title: 'Adoption',
        description:
          'Stepparent, relative, agency, and independent adoptions — from paperwork through finalization.',
      },
      {
        title: 'Domestic Violence Protection',
        description:
          'Restraining orders, emergency protective orders, and long-term safety planning.',
      },
      {
        title: 'Prenuptial & Postnuptial Agreements',
        description:
          'Drafting and reviewing agreements to protect assets and set clear expectations.',
      },
    ],
    metadata: {
      title: 'Family Law Help | AI + Attorney Guidance | GPULaw',
      description:
        'Get instant AI guidance and licensed attorney access for divorce, child custody, child support, adoption, and domestic violence matters. Family law help, 24/7.',
      keywords: [
        'family law',
        'divorce lawyer',
        'child custody',
        'child support',
        'alimony',
        'adoption lawyer',
        'domestic violence protection',
        'prenup',
        'GPULaw family law',
      ],
    },
  },
  {
    slug: 'consumer-debt',
    title: 'Consumer & Debt',
    shortDescription:
      'Credit card debt, car repossession, payday loans, bankruptcy, credit reporting errors, and identity theft',
    tagline: 'Take control of debt and protect your credit',
    longDescription:
      'Debt collectors, credit reporting errors, and unfair lending practices can upend your financial life. GPULaw helps you understand your rights under the FDCPA, FCRA, and bankruptcy code — with licensed consumer protection attorneys ready to step in when lawsuits, garnishment, or identity theft escalate.',
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    accentText: 'text-emerald-700',
    icon: (
      <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
        <path
          fillRule="evenodd"
          d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
          clipRule="evenodd"
        />
      </svg>
    ),
    questions: [
      'How can I dispute a credit card debt?',
      'What are my rights against debt collectors?',
      'How does bankruptcy work?',
      'Can I stop a car repossession?',
      'How do I fix credit reporting errors?',
    ],
    topics: [
      {
        title: 'Debt Collection Defense',
        description:
          'Fight illegal collection tactics under the FDCPA and respond to collector lawsuits before default judgment.',
      },
      {
        title: 'Bankruptcy',
        description:
          'Understand Chapter 7 vs. Chapter 13, the means test, and which debts can actually be discharged.',
      },
      {
        title: 'Credit Reporting Errors',
        description:
          'Dispute inaccurate items with credit bureaus and enforce your rights under the Fair Credit Reporting Act.',
      },
      {
        title: 'Car Repossession',
        description:
          'Options to stop repossession, redeem your vehicle, and challenge deficiency balances.',
      },
      {
        title: 'Payday & Predatory Loans',
        description:
          'Defenses against predatory interest rates, unlawful debt traps, and aggressive collection.',
      },
      {
        title: 'Identity Theft',
        description:
          'Freeze credit, dispute fraudulent accounts, and restore your financial identity.',
      },
    ],
    metadata: {
      title: 'Consumer & Debt Help | Debt Collection Defense | GPULaw',
      description:
        'Stop debt collectors, dispute credit errors, and explore bankruptcy with AI-powered legal guidance and licensed consumer protection attorneys. Get help 24/7.',
      keywords: [
        'consumer law',
        'debt collection defense',
        'FDCPA',
        'bankruptcy lawyer',
        'credit reporting errors',
        'identity theft lawyer',
        'car repossession',
        'payday loan',
        'GPULaw consumer debt',
      ],
    },
  },
  {
    slug: 'housing',
    title: 'Housing & Landlord-Tenant',
    shortDescription:
      'Evictions, rent increases, security deposit disputes, and unsafe housing conditions',
    tagline: 'Know your rights as a tenant or landlord',
    longDescription:
      'Housing disputes move fast — eviction notices can put your home at risk within days. GPULaw provides immediate AI guidance on notices, rent law, habitability, and security deposits, plus access to attorneys who can appear in court or negotiate with landlords on your behalf.',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    accentText: 'text-blue-700',
    icon: (
      <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
      </svg>
    ),
    questions: [
      'What are my rights as a tenant?',
      'How can I fight an eviction?',
      'Can my landlord raise my rent?',
      'How do I get my security deposit back?',
      'What can I do about unsafe housing?',
    ],
    topics: [
      {
        title: 'Eviction Defense',
        description:
          'Respond to pay-or-quit and cure-or-quit notices, answer unlawful detainer complaints, and prepare court filings.',
      },
      {
        title: 'Rent Increases & Rent Control',
        description:
          'Understand rent caps, just-cause rules, and how to challenge improper rent increases.',
      },
      {
        title: 'Security Deposit Disputes',
        description:
          'Recover wrongfully withheld deposits and enforce statutory penalties against landlords.',
      },
      {
        title: 'Habitability & Repairs',
        description:
          'Address mold, pests, lead, heat, and other habitability issues — including repair-and-deduct and rent withholding.',
      },
      {
        title: 'Lease Review',
        description:
          'Spot unenforceable clauses, waiver language, and hidden fees before you sign.',
      },
      {
        title: 'Discrimination & Retaliation',
        description:
          'Fair Housing Act claims and protections against landlord retaliation after tenant complaints.',
      },
    ],
    metadata: {
      title: 'Housing & Tenant Law | Eviction Defense | GPULaw',
      description:
        'Fight evictions, recover security deposits, and enforce tenant rights with AI guidance and licensed housing attorneys. Landlord-tenant help available 24/7.',
      keywords: [
        'tenant rights',
        'eviction defense',
        'landlord tenant lawyer',
        'security deposit',
        'rent control',
        'habitability',
        'fair housing',
        'GPULaw housing',
      ],
    },
  },
  {
    slug: 'wills-estates',
    title: 'Wills, Estates & Probate',
    shortDescription:
      'Writing wills, setting up trusts, power of attorney, and estate administration after death',
    tagline: 'Protect your family and plan for the future',
    longDescription:
      'Estate planning is not just for the wealthy. A clear will, healthcare directive, and power of attorney can save your family years of conflict and expense. GPULaw helps you understand your options, draft documents with AI assistance, and connect with estate attorneys for complex trusts or probate matters.',
    color: 'from-purple-500 to-indigo-500',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    accentText: 'text-indigo-700',
    icon: (
      <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
          clipRule="evenodd"
        />
      </svg>
    ),
    questions: [
      'What documents do I need for a will?',
      'How do I set up a trust?',
      'What is power of attorney?',
      'How does the probate process work?',
      'How do I become an executor of an estate?',
    ],
    topics: [
      {
        title: 'Wills',
        description:
          'Simple and complex wills, witnessing requirements, and keeping your estate plan current as life changes.',
      },
      {
        title: 'Revocable & Irrevocable Trusts',
        description:
          'When a living trust makes sense, how funding works, and tax considerations for irrevocable trusts.',
      },
      {
        title: 'Power of Attorney',
        description:
          'Financial and healthcare powers of attorney, including durable and springing variants.',
      },
      {
        title: 'Advance Healthcare Directives',
        description:
          'Living wills, HIPAA releases, and designating someone to make medical decisions for you.',
      },
      {
        title: 'Probate Administration',
        description:
          'Opening probate, noticing creditors, and distributing assets as executor or administrator.',
      },
      {
        title: 'Estate Disputes',
        description:
          'Will contests, undue influence claims, and resolving disputes among beneficiaries.',
      },
    ],
    metadata: {
      title: 'Wills, Estates & Probate | Estate Planning Help | GPULaw',
      description:
        'Draft wills, set up trusts, and navigate probate with AI guidance and licensed estate attorneys. Protect your family with a complete estate plan.',
      keywords: [
        'estate planning',
        'wills lawyer',
        'living trust',
        'probate attorney',
        'power of attorney',
        'advance healthcare directive',
        'executor',
        'GPULaw estate planning',
      ],
    },
  },
  {
    slug: 'immigration',
    title: 'Immigration',
    shortDescription:
      'Green card applications, asylum, citizenship, deportation defense, and work visas',
    tagline: 'Guidance for every step of your immigration journey',
    longDescription:
      'Immigration rules are complex, the stakes are high, and the paperwork is unforgiving. GPULaw provides step-by-step AI guidance for common immigration matters and connects you to licensed immigration attorneys for removal defense, complex waivers, and appeals.',
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    accentText: 'text-amber-700',
    icon: (
      <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
          clipRule="evenodd"
        />
        <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
      </svg>
    ),
    questions: [
      'How do I apply for a green card?',
      'What is the asylum process?',
      'How can I become a U.S. citizen?',
      'What can I do if facing deportation?',
      'How do I get a work visa?',
    ],
    topics: [
      {
        title: 'Green Cards & Family Petitions',
        description:
          'Marriage-based, family-based, and employment-based green cards, including adjustment of status and consular processing.',
      },
      {
        title: 'Citizenship & Naturalization',
        description:
          'N-400 eligibility, civics preparation, and resolving issues with good moral character.',
      },
      {
        title: 'Asylum & Refugee Protection',
        description:
          'One-year filing deadline, credible fear interviews, and affirmative vs. defensive asylum.',
      },
      {
        title: 'Work & Student Visas',
        description:
          'H-1B, L-1, O-1, F-1/OPT, and other non-immigrant visa categories.',
      },
      {
        title: 'Deportation & Removal Defense',
        description:
          'Cancellation of removal, voluntary departure, bond hearings, and appeals to the BIA.',
      },
      {
        title: 'Waivers',
        description:
          'Inadmissibility and unlawful presence waivers, including provisional waivers and extreme hardship showings.',
      },
    ],
    metadata: {
      title: 'Immigration Law Help | Green Card, Visa, Citizenship | GPULaw',
      description:
        'Get AI guidance and licensed immigration attorney access for green cards, asylum, citizenship, deportation defense, and work visas. Immigration help, 24/7.',
      keywords: [
        'immigration lawyer',
        'green card',
        'asylum',
        'citizenship',
        'naturalization',
        'deportation defense',
        'work visa',
        'H-1B',
        'GPULaw immigration',
      ],
    },
  },
  {
    slug: 'crypto-compliance',
    title: 'Crypto Compliance',
    shortDescription:
      'Exchange compliance, ICO legal opinions, AML/KYC requirements, token classification',
    tagline: 'Build your crypto business on solid legal ground',
    longDescription:
      'Crypto regulation spans the SEC, CFTC, FinCEN, state money transmitter laws, and evolving global rules. GPULaw helps founders, exchanges, and token projects understand their obligations with AI-powered research, then connects them to licensed attorneys for formal opinions and regulatory filings.',
    color: 'from-red-500 to-pink-500',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    accentText: 'text-red-700',
    icon: (
      <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
          clipRule="evenodd"
        />
      </svg>
    ),
    questions: [
      'What are the legal requirements for a crypto exchange?',
      'How do I ensure AML/KYC compliance?',
      'What regulations apply to my ICO or token sale?',
      'How should my cryptocurrency be classified?',
      'What licenses do I need to operate a crypto business?',
    ],
    topics: [
      {
        title: 'Token Classification',
        description:
          'Howey analysis, utility vs. security tokens, and structuring offerings to manage SEC risk.',
      },
      {
        title: 'Exchange & VASP Licensing',
        description:
          'Money transmitter licenses, BitLicense, FinCEN MSB registration, and international VASP rules.',
      },
      {
        title: 'AML / KYC Programs',
        description:
          'Customer identification programs, transaction monitoring, SAR filings, and sanctions screening.',
      },
      {
        title: 'ICO / Token Launch Legal Opinions',
        description:
          'Regulation D, Regulation S, Reg A+ paths, and formal legal opinion letters for token launches.',
      },
      {
        title: 'DAO & Smart Contract Structuring',
        description:
          'Legal wrappers for DAOs, liability exposure, and drafting clear on-chain/off-chain governance.',
      },
      {
        title: 'Enforcement & Investigations',
        description:
          'Responding to SEC, CFTC, FinCEN, and state inquiries, including document preservation and Wells notices.',
      },
    ],
    metadata: {
      title: 'Crypto Compliance & Blockchain Law | GPULaw',
      description:
        'AI-powered crypto compliance guidance plus licensed attorneys for token classification, AML/KYC, exchange licensing, and SEC enforcement matters.',
      keywords: [
        'crypto compliance',
        'blockchain lawyer',
        'token classification',
        'AML KYC',
        'crypto exchange license',
        'ICO legal opinion',
        'SEC enforcement',
        'FinCEN MSB',
        'GPULaw crypto',
      ],
    },
  },
];

export function getPracticeArea(slug: string): PracticeArea | undefined {
  return practiceAreas.find((area) => area.slug === slug);
}
