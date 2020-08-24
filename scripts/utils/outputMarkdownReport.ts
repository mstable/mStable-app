import path from 'path';
import fs from 'fs';

interface Column {
  title?: string;
  width: number;
}

interface Table {
  columns: Column[];
  rows: (string | number)[][];
}

interface CodeBlock {
  code: string;
}

type MdReportItem = string | Table | CodeBlock;

interface MdReport {
  dirName: string;
  fileName: string;
  items: MdReportItem[];
}

const padRow = (row: string): string => `| ${row} |`;

const renderHeader = (columns: Column[]) => {
  const row = columns
    .map(({ title = '', width }) => title.padEnd(width, ' '))
    .join(' | ');
  return padRow(row);
};

const renderRow = (columns: Column[], values: (string | number)[]) => {
  const row = values
    .map((value, index) => value.toString().padEnd(columns[index].width))
    .join(' | ');
  return padRow(row);
};

const renderSeparator = (columns: Column[]): string => {
  const separator = columns.map(({ width }) => '-'.repeat(width)).join(' | ');
  return padRow(separator);
};

const renderTable = ({ columns, rows: _rows }: Table): string => {
  const header = renderHeader(columns);
  const separator = renderSeparator(columns);
  const rows = _rows.map(row => renderRow(columns, row)).join(`\n`);
  return [header, separator, rows].join('\n');
};

const renderItem = (item: MdReportItem): string => {
  if (typeof item === 'string') {
    return item;
  }

  if ((item as CodeBlock).code) {
    return `\`\`\`\n${(item as CodeBlock).code}\n\`\`\``;
  }

  return renderTable(item as Table);
};

export const outputMarkdownReport = async ({
  dirName,
  fileName,
  items,
}: MdReport): Promise<string> => {
  const content = items.map(renderItem).join('\n\n');

  const dirPath = path.join('public', 'reports', dirName);
  await fs.promises.mkdir(dirPath, { recursive: true });

  const fullPath = `${dirPath}/${fileName}.md`;
  await fs.promises.writeFile(fullPath, content);

  return fullPath;
};
