export interface Logo {
  name: string;
  src: string;
  url: string;
  /** Intrinsic size, used to reserve space and avoid layout shift */
  width: number;
  height: number;
}

export const logos = {
  cloudflare: {
    name: 'Cloudflare',
    src: '/images/logos/cloudflare.svg',
    url: 'https://www.cloudflare.com',
    width: 101,
    height: 34,
  },
  tripadvisor: {
    name: 'Tripadvisor',
    src: '/images/logos/tripadvisor.svg',
    url: 'https://www.tripadvisor.com',
    width: 131,
    height: 20,
  },
  edp: {
    name: 'EDP',
    src: '/images/logos/edp.webp',
    url: 'https://www.edp.com',
    width: 240,
    height: 88,
  },
  nttData: {
    name: 'NTT DATA',
    src: '/images/logos/ntt-data.svg',
    url: 'https://www.nttdata.com',
    width: 340,
    height: 70,
  },
  novaSbe: {
    name: 'NOVA SBE',
    src: '/images/logos/nova-sbe.svg',
    url: 'https://www.novasbe.unl.pt',
    width: 432,
    height: 153,
  },
  universityOfLjubljana: {
    name: 'University of Ljubljana',
    src: '/images/logos/university-of-ljubljana.svg',
    url: 'https://www.ef.uni-lj.si/',
    width: 143,
    height: 54,
  },
  xamiLab: {
    name: 'XAMI Lab',
    src: '/images/logos/xami-lab.webp',
    url: 'https://www.xami-lab.org/',
    width: 120,
    height: 117,
  },
  tecnicoLisboa: {
    name: 'Técnico Lisboa',
    src: '/images/logos/tecnico-lisboa.svg',
    url: 'https://tecnico.ulisboa.pt',
    width: 200,
    height: 46,
  },
  novaIms: {
    name: 'NOVA IMS',
    src: '/images/logos/nova-ims.svg',
    url: 'https://www.novaims.unl.pt',
    width: 119,
    height: 123,
  },
} as const satisfies Record<string, Logo>;

export type LogoKey = keyof typeof logos;

/** Logos shown in the home page carousel, in display order */
export const carouselLogos: LogoKey[] = [
  'cloudflare',
  'tripadvisor',
  'tecnicoLisboa',
  'novaIms',
  'edp',
];
