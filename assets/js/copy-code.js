/**
 * 为代码块和引用块添加复制按钮功能
 */
document.addEventListener('DOMContentLoaded', function() {
    // 等待Markdown内容渲染完成后执行
    setTimeout(function() {
        addCopyButtons();
    }, 500);
});

/**
 * 为代码块和引用块添加复制按钮
 */
function addCopyButtons() {
    // 为代码块添加复制按钮
    document.querySelectorAll('pre code').forEach(function(codeBlock) {
        // 创建复制按钮容器
        const copyContainer = document.createElement('div');
        copyContainer.className = 'copy-button-container';

        // 创建复制按钮
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.innerHTML = '<i class="fas fa-copy"></i>';
        copyButton.title = '复制代码';

        // 添加按钮到容器
        copyContainer.appendChild(copyButton);

        // 找到代码块的父元素pre并添加相对定位
        const preElement = codeBlock.parentElement;
        if (preElement && preElement.tagName === 'PRE') {
            preElement.style.position = 'relative';
            preElement.appendChild(copyContainer);

            // 添加点击事件
            copyButton.addEventListener('click', function() {
                copyTextToClipboard(codeBlock.textContent);
                
                // 显示复制成功提示
                copyButton.innerHTML = '<i class="fas fa-check"></i>';
                copyButton.classList.add('success');
                
                // 2秒后恢复原样
                setTimeout(function() {
                    copyButton.innerHTML = '<i class="fas fa-copy"></i>';
                    copyButton.classList.remove('success');
                }, 2000);
            });
        }
    });

    // 为引用块添加复制按钮
    document.querySelectorAll('blockquote').forEach(function(quoteBlock) {
        // 创建复制按钮容器
        const copyContainer = document.createElement('div');
        copyContainer.className = 'copy-button-container quote';

        // 创建复制按钮
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.innerHTML = '<i class="fas fa-copy"></i>';
        copyButton.title = '复制引用';

        // 添加按钮到容器
        copyContainer.appendChild(copyButton);

        // 为引用块添加相对定位并添加按钮
        quoteBlock.style.position = 'relative';
        quoteBlock.appendChild(copyContainer);

        // 添加点击事件
        copyButton.addEventListener('click', function() {
            copyTextToClipboard(quoteBlock.textContent);
            
            // 显示复制成功提示
            copyButton.innerHTML = '<i class="fas fa-check"></i>';
            copyButton.classList.add('success');
            
            // 2秒后恢复原样
            setTimeout(function() {
                copyButton.innerHTML = '<i class="fas fa-copy"></i>';
                copyButton.classList.remove('success');
            }, 2000);
        });
    });
}

/**
 * 将文本复制到剪贴板
 * @param {string} text - 要复制的文本
 */
function copyTextToClipboard(text) {
    // 创建临时textarea元素
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';  // 避免滚动到底部
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = '0';
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    document.body.appendChild(textArea);
    
    // 选中并复制文本
    textArea.select();
    try {
        document.execCommand('copy');
    } catch (err) {
        console.error('无法复制文本: ', err);
    }
    
    // 移除临时元素
    document.body.removeChild(textArea);
}
