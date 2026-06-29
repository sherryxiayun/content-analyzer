import React, { useState } from 'react';
import './AnalysisResult.css';

function AnalysisResult({ data }) {
  const [expandedSections, setExpandedSections] = useState({
    topic: true,
    structure: true,
    characters: true,
    scenes: true,
    insights: true,
    metadata: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleExport = (format) => {
    let content = '';
    let filename = '';

    if (format === 'json') {
      content = JSON.stringify(data, null, 2);
      filename = 'analysis.json';
    } else if (format === 'markdown') {
      content = generateMarkdown(data);
      filename = 'analysis.md';
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const generateMarkdown = (data) => {
    let md = '# 内容分析报告\n\n';
    md += `生成时间: ${new Date().toLocaleString()}\n\n`;

    // 主题
    if (data.analysis?.topic) {
      md += '## 📌 核心主题\n\n';
      md += `**主题**: ${data.analysis.topic.main}\n\n`;
      if (data.analysis.topic.keywords?.length > 0) {
        md += `**关键词**: ${data.analysis.topic.keywords.join(', ')}\n\n`;
      }
    }

    // 结构
    if (data.analysis?.structure) {
      md += '## 🏗️ 内容结构\n\n';
      md += `**开头**: ${data.analysis.structure.opening.text}\n\n`;
      md += `**中间**: ${data.analysis.structure.middle.text}\n\n`;
      md += `**结尾**: ${data.analysis.structure.closing.text}\n\n`;
    }

    // 角色
    if (data.analysis?.characters?.length > 0) {
      md += '## 👥 主要角色\n\n';
      data.analysis.characters.forEach(char => {
        md += `- **${char.name}** (${char.role}): ${char.traits}\n`;
      });
      md += '\n';
    }

    // 场景
    if (data.analysis?.scenes?.length > 0) {
      md += '## 🎬 场景设置\n\n';
      data.analysis.scenes.forEach(scene => {
        md += `- **${scene.name}**: ${scene.description}\n`;
      });
      md += '\n';
    }

    // 洞察
    if (data.analysis?.insights?.length > 0) {
      md += '## 💡 关键洞察\n\n';
      data.analysis.insights.forEach(insight => {
        md += `- ${insight}\n`;
      });
      md += '\n';
    }

    return md;
  };

  const { analysis } = data;

  return (
    <div className="analysis-result">
      {/* 导出按钮 */}
      <div className="export-buttons">
        <button onClick={() => handleExport('json')} className="export-btn">
          📥 导出 JSON
        </button>
        <button onClick={() => handleExport('markdown')} className="export-btn">
          📥 导出 Markdown
        </button>
      </div>

      {/* 主题 */}
      {analysis?.topic && (
        <div className="result-section">
          <button
            className="section-header"
            onClick={() => toggleSection('topic')}
          >
            <span className="section-icon">📌</span>
            <span className="section-title">核心主题</span>
            <span className={`toggle-icon ${expandedSections.topic ? 'expanded' : ''}`}>▼</span>
          </button>
          {expandedSections.topic && (
            <div className="section-content">
              <p className="topic-main">{analysis.topic.main}</p>
              {analysis.topic.keywords?.length > 0 && (
                <div className="keywords">
                  {analysis.topic.keywords.map((kw, idx) => (
                    <span key={idx} className="keyword-tag">{kw}</span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 结构 */}
      {analysis?.structure && (
        <div className="result-section">
          <button
            className="section-header"
            onClick={() => toggleSection('structure')}
          >
            <span className="section-icon">🏗️</span>
            <span className="section-title">内容结构</span>
            <span className={`toggle-icon ${expandedSections.structure ? 'expanded' : ''}`}>▼</span>
          </button>
          {expandedSections.structure && (
            <div className="section-content">
              <div className="structure-part">
                <h4>📖 开头</h4>
                <p>{analysis.structure.opening.text}</p>
              </div>
              <div className="structure-part">
                <h4>📘 中间</h4>
                <p>{analysis.structure.middle.text}</p>
              </div>
              <div className="structure-part">
                <h4>📕 结尾</h4>
                <p>{analysis.structure.closing.text}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 角色 */}
      {analysis?.characters && analysis.characters.length > 0 && (
        <div className="result-section">
          <button
            className="section-header"
            onClick={() => toggleSection('characters')}
          >
            <span className="section-icon">👥</span>
            <span className="section-title">主要角色 ({analysis.characters.length})</span>
            <span className={`toggle-icon ${expandedSections.characters ? 'expanded' : ''}`}>▼</span>
          </button>
          {expandedSections.characters && (
            <div className="section-content">
              {analysis.characters.map((char, idx) => (
                <div key={idx} className="character-card">
                  <h4>{char.name}</h4>
                  <p className="role-badge">{char.role}</p>
                  <p className="traits">{char.traits}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 场景 */}
      {analysis?.scenes && analysis.scenes.length > 0 && (
        <div className="result-section">
          <button
            className="section-header"
            onClick={() => toggleSection('scenes')}
          >
            <span className="section-icon">🎬</span>
            <span className="section-title">场景设置 ({analysis.scenes.length})</span>
            <span className={`toggle-icon ${expandedSections.scenes ? 'expanded' : ''}`}>▼</span>
          </button>
          {expandedSections.scenes && (
            <div className="section-content">
              {analysis.scenes.map((scene, idx) => (
                <div key={idx} className="scene-card">
                  <h4>{scene.name}</h4>
                  <p className="scene-type">{scene.type}</p>
                  <p className="description">{scene.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 洞察 */}
      {analysis?.insights && analysis.insights.length > 0 && (
        <div className="result-section">
          <button
            className="section-header"
            onClick={() => toggleSection('insights')}
          >
            <span className="section-icon">💡</span>
            <span className="section-title">关键洞察</span>
            <span className={`toggle-icon ${expandedSections.insights ? 'expanded' : ''}`}>▼</span>
          </button>
          {expandedSections.insights && (
            <div className="section-content">
              <ul className="insights-list">
                {analysis.insights.map((insight, idx) => (
                  <li key={idx}>{insight}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* 元数据 */}
      {analysis?.metadata && (
        <div className="result-section">
          <button
            className="section-header"
            onClick={() => toggleSection('metadata')}
          >
            <span className="section-icon">📊</span>
            <span className="section-title">分析元数据</span>
            <span className={`toggle-icon ${expandedSections.metadata ? 'expanded' : ''}`}>▼</span>
          </button>
          {expandedSections.metadata && (
            <div className="section-content">
              <div className="metadata-grid">
                <div className="metadata-item">
                  <span className="label">字数:</span>
                  <span className="value">{analysis.metadata.wordCount}</span>
                </div>
                <div className="metadata-item">
                  <span className="label">段落:</span>
                  <span className="value">{analysis.metadata.paragraphCount}</span>
                </div>
                <div className="metadata-item">
                  <span className="label">类型:</span>
                  <span className="value">{analysis.metadata.contentType?.join(', ')}</span>
                </div>
                <div className="metadata-item">
                  <span className="label">情感:</span>
                  <span className="value">{analysis.metadata.sentiment?.overall}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AnalysisResult;
