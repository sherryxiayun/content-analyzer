import React, { useState } from 'react';
import './LinkInput.css';

function LinkInput({ onAnalyze, isLoading }) {
  const [content, setContent] = useState('');
  const [type, setType] = useState('text');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      alert('请输入内容');
      return;
    }

    // 检测是否是 URL
    let detectedType = type;
    if (type === 'auto') {
      detectedType = isUrl(content) ? 'url' : 'text';
    }

    onAnalyze(content.trim(), detectedType);
  };

  const isUrl = (str) => {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  };

  const handlePaste = (e) => {
    const pastedText = e.target.value;
    if (isUrl(pastedText) && type === 'text') {
      setType('url');
    }
  };

  return (
    <div className="link-input">
      <form onSubmit={handleSubmit}>
        {/* 类型选择 */}
        <div className="input-group">
          <label className="input-label">内容类型</label>
          <div className="type-selector">
            <button
              type="button"
              className={`type-btn ${type === 'text' ? 'active' : ''}`}
              onClick={() => setType('text')}
            >
              📝 文本
            </button>
            <button
              type="button"
              className={`type-btn ${type === 'url' ? 'active' : ''}`}
              onClick={() => setType('url')}
            >
              🔗 链接
            </button>
          </div>
        </div>

        {/* 内容输入 */}
        <div className="input-group">
          <label className="input-label">
            {type === 'url' ? '粘贴网页链接' : '输入或粘贴内容'}
          </label>
          <textarea
            className="content-input"
            placeholder={
              type === 'url'
                ? '示例: https://example.com\nhttps://v.douyin.com/...'
                : '粘贴你要分析的内容...'
            }
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              handlePaste(e);
            }}
            disabled={isLoading}
            rows={6}
          />
          <div className="input-hint">
            {content.length > 0 && (
              <span className="char-count">
                {content.length} 个字符
              </span>
            )}
          </div>
        </div>

        {/* 提示信息 */}
        <div className="tips">
          <p><strong>💡 提示：</strong></p>
          <ul>
            <li>支持任何公开网页链接（YouTube、小红书、抖音、博客等）</li>
            <li>直接粘贴网页 URL 或文本内容</li>
            <li>系统会自动拆解内容结构和关键要素</li>
          </ul>
        </div>

        {/* 提交按钮 */}
        <button
          type="submit"
          className="submit-btn"
          disabled={isLoading || !content.trim()}
        >
          {isLoading ? (
            <>
              <span className="spinner-small"></span> 分析中...
            </>
          ) : (
            <>✨ 开始分析</>
          )}
        </button>
      </form>
    </div>
  );
}

export default LinkInput;
