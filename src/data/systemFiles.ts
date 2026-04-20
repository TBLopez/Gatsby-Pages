export type SystemFile = {
  desc: string;
  url: string;
  available: boolean;
};

export const localFiles: Record<string, SystemFile> = {
  'capstone.pdf': {
    desc: 'IT Capstone Report',
    url: '/tonylopezcapstone.pdf',
    available: false,
  },
  'executive_pres.pdf': {
    desc: 'Executive Overview',
    url: '/IT_101_Executive_Presentation.pdf',
    available: false,
  },
  'apt28.pdf': {
    desc: 'Threat Actor 28 Profile',
    url: '/APT_28.pdf',
    available: false,
  },
  'apt41.pdf': {
    desc: 'Threat Actor 41 Profile',
    url: '/APT41_Case_Study.pdf',
    available: false,
  },
};
