/**
 * 内容解析服务
 * 对原始内容进行解析、分段、清理等处理
 */
const parsingService = {
  /**
   * 解析内容
   */
  parseContent: (content) => {
    // 限制内容长度
    const MAX_LENGTH = 10000;
    if (content.length > MAX_LENGTH) {
      content = content.substring(0, MAX_LENGTH) + '...(内容已截断)';
    }

    return {
      // 原始内容
      raw: content,
      
      // 分段（按段落）
      paragraphs: parsingService.splitParagraphs(content),
      
      // 分句（按句子）
      sentences: parsingService.splitSentences(content),
      
      // 关键词提取
      keywords: parsingService.extractKeywords(content),
      
      // 字数统计
      wordCount: content.length,
      
      // 段落数
      paragraphCount: parsingService.splitParagraphs(content).length
    };
  },

  /**
   * 按段落分割
   */
  splitParagraphs: (content) => {
    return content
      .split(/\n+/)
      .map(p => p.trim())
      .filter(p => p.length > 0);
  },

  /**
   * 按句子分割
   */
  splitSentences: (content) => {
    return content
      .split(/[。！？\n]+/)
      .map(s => s.trim())
      .filter(s => s.length > 0)
      .slice(0, 20); // 最多 20 句
  },

  /**
   * 提取关键词（简单实现）
   */
  extractKeywords: (content) => {
    // 提取常见的词汇（3-5 个字的词）
    const regex = /[\u4e00-\u9fa5]{3,5}/g;
    const words = content.match(regex) || [];
    
    // 统计词频
    const wordFreq = {};
    words.forEach(word => {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    });

    // 排序并返回前 10 个
    return Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word);
  },

  /**
   * 估计内容类型
   */
  estimateContentType: (content) => {
    const contentLower = content.toLowerCase();
    
    if (contentLower.includes('title') || contentLower.includes('文章')) {
      return 'article';
    }
    if (contentLower.includes('video') || contentLower.includes('视频')) {
      return 'video';
    }
    if (contentLower.includes('image') || contentLower.includes('图片')) {
      return 'image';
    }
    
    return 'mixed';
  }
};

module.exports = parsingService;
