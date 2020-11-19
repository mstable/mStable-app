import path from 'path';
import fs from 'fs';

export interface JsonReport {
  dirName: string;
  fullOutputReportFileName: string;
  simpleOutputReportFileName: string;
  fullOutputReport: object;
  simpleOutputReport: object;
}

export const outputJsonReport = async ({
  dirName,
  fullOutputReportFileName,
  simpleOutputReportFileName,
  fullOutputReport,
  simpleOutputReport,
}: JsonReport): Promise<string[]> => {
  const fullOutputReportContent = JSON.stringify(fullOutputReport, null, 2);
  const simpleOutputReportContent = JSON.stringify(simpleOutputReport, null, 2);
  const dirPath = path.join('public', 'reports', dirName);
  await fs.promises.mkdir(dirPath, { recursive: true });

  const fullOutputReportPath = `${dirPath}/${fullOutputReportFileName}.json`;
  const simpleOutputReportPath = `${dirPath}/${simpleOutputReportFileName}.json`;
  await fs.promises.writeFile(fullOutputReportPath, fullOutputReportContent);
  await fs.promises.writeFile(
    simpleOutputReportPath,
    simpleOutputReportContent,
  );

  return [fullOutputReportPath, simpleOutputReportPath];
};
