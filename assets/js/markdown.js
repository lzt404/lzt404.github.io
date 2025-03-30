// Markdown handling functions
async function loadMarkdown(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`加载失败: ${response.status}`);
        const markdown = await response.text();
        
        marked.setOptions({
            highlight: (code, lang) => {
                if (lang && hljs.getLanguage(lang)) {
                    return hljs.highlight(code, { language: lang }).value;
                }
                return code;
            },
            breaks: true,
            gfm: true
        });
        
        const content = document.getElementById('content');
        content.innerHTML = marked.parse(markdown);
        
        generateTOC();
    } catch (error) {
        console.error('加载Markdown出错:', error);
        document.getElementById('content').innerHTML = `
            <div class="error">
                <p>加载失败: ${error.message}</p>
                <p>请检查文件路径是否正确</p>
            </div>
        `;
    }
}

function generateTOC() {
    const headings = document.querySelectorAll('.markdown-body h1, .markdown-body h2, .markdown-body h3');
    const toc = document.getElementById('toc');
    const tocItems = [];
    
    headings.forEach((heading, index) => {
        const id = `heading-${index}`;
        heading.id = id;
        
        const level = parseInt(heading.tagName[1]);
        const item = document.createElement('li');
        const link = document.createElement('a');
        
        link.href = `#${id}`;
        link.textContent = heading.textContent;
        link.style.paddingLeft = `${(level - 1) * 20}px`;
        
        item.appendChild(link);
        tocItems.push(item);
    });
    
    toc.innerHTML = '';
    toc.append(...tocItems);
}

// Initialize markdown loading
document.addEventListener('DOMContentLoaded', () => {
    loadMarkdown('tmp.md');
});
