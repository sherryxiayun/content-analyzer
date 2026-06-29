import React, { useState } from 'react';
import LinkInput from './components/LinkInput';
import AnalysisResult from './components/AnalysisResult';
import './App.css';

function App() {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async (content, type) => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const response = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content,
          type: type
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setAnalysisResult(data.data);
      } else {
        setError(data.error || '分析失败');
      }
    } catch (err) {
      console.error('分析错误:', err);
      setError(err.message || '无法连接到服务器，请确保后端正在运行');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="app-container">
        {/* 头部 */}
        <header className="app-header">
          <div className="header-content">
            <h1 className="app-title">📌 内容选题智能分析</h1>
            <p className="app-subtitle">输入链接或文本，自动拆解内容结构、主题、角色、场景</p>
          </div>
        </header>

        {/* 主要内容 */}
        <main className="app-main">
          {/* 左侧：输入区域 */}
          <section className="input-section">
            <LinkInput onAnalyze={handleAnalyze} isLoading={isLoading} />
            
            {/* 错误提示 */}
            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                <p>{error}</p>
              </div>
            )}
          </section>

          {/* 右侧：结果区域 */}
          <section className="result-section">
            {isLoading ? (
              <div className="loading-container">
                <div className="spinner"></div>
                <p>正在分析您的内容...</p>
              </div>
            ) : analysisResult ? (
              <AnalysisResult data={analysisResult} />
            ) : (
              <div className="empty-state">
                <p className="empty-icon">✨</p>
                <p className="empty-text">输入内容后，分析结果将在这里显示</p>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
