export type SystemFile = {
  desc: string;
  url: string;
  available: boolean;
};

export const localFiles: Record<string, SystemFile> = {};
