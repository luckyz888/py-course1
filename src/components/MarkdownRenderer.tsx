interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const html = renderMarkdown(content);
  return (
    <div
      className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function renderMarkdown(md: string): string {
  let html = md;

  // 代码块 (```lang ... ```)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_match, _lang, code) => {
    const escaped = escapeHtml(code.trim());
    return `<pre class="bg-gray-900 text-green-300 rounded-lg p-4 my-4 overflow-x-auto text-sm font-mono leading-relaxed"><code>${escaped}</code></pre>`;
  });

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 text-[#1e1b4b] px-1.5 py-0.5 rounded text-sm font-mono">$1</code>');

  // Headers
  html = html.replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold text-[#1e1b4b] mt-6 mb-3">$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-[#1e1b4b] mt-8 mb-4">$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold text-[#1e1b4b] mt-8 mb-4">$1</h1>');

  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-[#1e1b4b]">$1</strong>');

  // Italic
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Tables
  html = html.replace(/^\|(.+)\|$/gm, (match) => {
    return match;
  });
  html = html.replace(/^\|(.+)\|$/gm, (_match) => {
    return '';
  });
  html = html.replace(/^\|(.+)\|$/gm, (match) => {
    const cells = match.split('|').filter((c) => c.trim() !== '');
    const tds = cells.map((c) => `<td class="border border-gray-200 px-3 py-2 text-sm">${c.trim()}</td>`).join('');
    return `<tr>${tds}</tr>`;
  });
  // Wrap consecutive <tr> in <table>
  html = html.replace(/((?:<tr>.*<\/tr>\n?)+)/g, (match) => {
    return `<table class="border-collapse w-full my-4"><tbody>${match}</tbody></table>`;
  });

  // Unordered lists
  html = html.replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>');
  html = html.replace(/((?:<li class="ml-4 list-disc">.*<\/li>\n?)+)/g, '<ul class="my-2 space-y-1">$1</ul>');

  // Ordered lists
  html = html.replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal">$1</li>');
  html = html.replace(/((?:<li class="ml-4 list-decimal">.*<\/li>\n?)+)/g, '<ol class="my-2 space-y-1">$1</ol>');

  // Paragraphs — wrap lines that aren't already wrapped in tags
  html = html.replace(/^(?!<[hupotbd]|<li|<pre|<ul|<ol|<table|<tbody|<tr|<strong|<em|<code)(.+)$/gm, '<p class="my-2">$1</p>');

  // Clean up extra newlines
  html = html.replace(/\n{2,}/g, '\n');

  return html;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
