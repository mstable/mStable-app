import path from 'path';
import fs from 'fs';

export interface JsonReport {
  dirName: string;
  fileName: string;
  data: object;
}

export const outputJsonReport = async ({
  dirName,
  fileName,
  data,
}: JsonReport): Promise<string> => {
  const content = JSON.stringify(data, null, 2);

  const dirPath = path.join('public', 'reports', dirName);
  await fs.promises.mkdir(dirPath, { recursive: true });

  const fullPath = `${dirPath}/${fileName}.json`;
  await fs.promises.writeFile(fullPath, content);

  return fullPath;
};
