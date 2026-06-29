/**
 * AI 分析服务
 * 使用本地 AI 逻辑（不依赖外部 API）进行内容分析
 */
const aiService = {
  /**
   * 分析内容
   */
  analyzeContent: async (parsedContent) => {
    try {
      const content = parsedContent.raw;
      
      console.log('[AI] 开始分析内容...');

      return {
        // 📌 主题提取
        topic: aiService.extractTopic(content, parsedContent),
        
        // 🏗️ 结构分析
        structure: aiService.analyzeStructure(content, parsedContent),
        
        // 👥 角色识别
        characters: aiService.extractCharacters(content, parsedContent),
        
        // 🎬 场景提取
        scenes: aiService.extractScenes(content, parsedContent),
        
        // 💡 关键洞察
        insights: aiService.generateInsights(content, parsedContent),
        
        // 📊 内容分析元数据
        metadata: {
          wordCount: parsedContent.wordCount,
          paragraphCount: parsedContent.paragraphCount,
          keywords: parsedContent.keywords,
          contentType: aiService.estimateContentType(content),
          sentiment: aiService.analyzeSentiment(content)
        }
      };

    } catch (error) {
      console.error('[AI] 分析错误:', error);
      throw error;
    }
  },

  /**
   * 提取主题
   */
  extractTopic: (content, parsedContent) => {
    const keywords = parsedContent.keywords;
    const sentences = parsedContent.sentences;
    
    // 获取第一句作为初步主题
    let mainTopic = sentences[0] || content.substring(0, 100);
    
    // 如果有关键词，将其融合进主题
    if (keywords.length > 0) {
      const topKeywords = keywords.slice(0, 3).join('、');
      mainTopic = `${topKeywords} - ${mainTopic}`;
    }
    
    return {
      main: mainTopic.substring(0, 200),
      keywords: keywords,
      relatedTopics: keywords.slice(3, 6)
    };
  },

  /**
   * 分析内容结构
   */
  analyzeStructure: (content, parsedContent) => {
    const paragraphs = parsedContent.paragraphs;
    const totalParagraphs = paragraphs.length;
    
    let opening = '';
    let middle = '';
    let closing = '';
    
    if (totalParagraphs === 0) {
      opening = content.substring(0, 200);
      middle = content.substring(200, 400);
      closing = content.substring(400, 600);
    } else {
      // 开头：第一段
      opening = paragraphs[0] || '';
      
      // 中间：中间的段落
      const middleIndex = Math.floor(totalParagraphs / 2);
      middle = paragraphs[middleIndex] || '';
      
      // 结尾：最后一段
      closing = paragraphs[totalParagraphs - 1] || '';
    }
    
    return {
      opening: {
        text: opening.substring(0, 300),
        analysis: '开篇引入，交代背景和主要信息'
      },
      middle: {
        text: middle.substring(0, 300),
        analysis: '核心论述，展开主要观点和论据'
      },
      closing: {
        text: closing.substring(0, 300),
        analysis: '总结收尾，强化主要信息'
      },
      paragraphCount: totalParagraphs
    };
  },

  /**
   * 提取角色
   */
  extractCharacters: (content, parsedContent) => {
    // 寻找常见的角色指示词
    const roleIndicators = [
      { pattern: /主角|主人公|男主|女主/, role: '主角' },
      { pattern: /配角|次要人物/, role: '配角' },
      { pattern: /反派|对手|敌人/, role: '反派' },
      { pattern: /导师|长者|权威/, role: '导师' },
      { pattern: /群众|旁观者|见证者/, role: '旁观者' }
    ];
    
    const characters = [];
    const sentences = parsedContent.sentences;
    
    // 从句子中提取可能的人物
    sentences.forEach((sentence, index) => {
      roleIndicators.forEach(indicator => {
        if (indicator.pattern.test(sentence)) {
          // 提取可能的人物名字
          const nameMatch = sentence.match(/[\u4e00-\u9fa5]{2,4}(?=的?[是叫名字])/);
          const name = nameMatch ? nameMatch[0] : `角色${index}`;
          
          // 避免重复
          if (!characters.find(c => c.name === name)) {
            characters.push({
              name: name,
              role: indicator.role,
              traits: sentence.substring(0, 100),
              appearance: index
            });
          }
        }
      });
    });
    
    // 如果没有找到明确的角色，从关键词生成
    if (characters.length === 0) {
      const keywords = parsedContent.keywords.slice(0, 3);
      keywords.forEach((keyword, index) => {
        characters.push({
          name: keyword,
          role: ['主角', '配角', '反派'][index % 3],
          traits: '从关键词自动识别',
          appearance: index
        });
      });
    }
    
    return characters.slice(0, 5);
  },

  /**
   * 提取场景
   */
  extractScenes: (content, parsedContent) => {
    // 场景指示词
    const sceneIndicators = [
      { pattern: /在.*?地|地点|位置|场景|现场/, type: 'location', name: '主要地点' },
      { pattern: /早上|中午|晚上|夜晚|白天|时间/, type: 'time', name: '时间段' },
      { pattern: /下雨|晴天|天气|氛围|气氛|环境/, type: 'mood', name: '氛围' }
    ];
    
    const scenes = [];
    const sentences = parsedContent.sentences;
    
    sceneIndicators.forEach(indicator => {
      sentences.forEach(sentence => {
        if (indicator.pattern.test(sentence)) {
          if (!scenes.find(s => s.name === indicator.name)) {
            scenes.push({
              name: indicator.name,
              type: indicator.type,
              description: sentence.substring(0, 150),
              mood: indicator.type === 'mood' ? '紧张/舒适/神秘' : '中立'
            });
          }
        }
      });
    });
    
    // 默认场景
    if (scenes.length === 0) {
      scenes.push(
        {
          name: '主要场景',
          type: 'location',
          description: content.substring(0, 150),
          mood: '专业'
        },
        {
          name: '叙述背景',
          type: 'time',
          description: '现代背景',
          mood: '中立'
        }
      );
    }
    
    return scenes.slice(0, 5);
  },

  /**
   * 生成关键洞察
   */
  generateInsights: (content, parsedContent) => {
    const insights = [];
    
    // 基于长度的洞察
    if (parsedContent.wordCount > 1000) {
      insights.push('📈 内容篇幅较长，信息量丰富');
    } else if (parsedContent.wordCount > 500) {
      insights.push('📊 内容篇幅适中，结构清晰');
    } else {
      insights.push('✍️ 内容简明扼要，易于传播');
    }
    
    // 基于关键词的洞察
    if (parsedContent.keywords.length > 0) {
      insights.push(`🎯 核心关键词: ${parsedContent.keywords.slice(0, 3).join('、')}`);
    }
    
    // 基于段落数的洞察
    if (parsedContent.paragraphCount > 10) {
      insights.push('🏗️ 多层次论述结构');
    }
    
    // 内容特征洞察
    if (content.includes('?') || content.includes('？')) {
      insights.push('💭 采用提问式表述，引发思考');
    }
    
    if (content.includes('!') || content.includes('！')) {
      insights.push('⚡ 语气有力，表达强烈');
    }
    
    // 建议
    insights.push('💡 建议：明确核心观点，强化视觉化呈现');
    insights.push('📢 传播建议：结合热点话题，增加互动性');
    
    return insights.slice(0, 8);
  },

  /**
   * 分析情感
   */
  analyzeSentiment: (content) => {
    const positiveWords = ['好', '棒', '很', '喜欢', '爱', '优秀', '完美'];
    const negativeWords = ['坏', '差', '不', '讨厌', '烦', '糟糕', '失败'];
    
    let positiveCount = 0;
    let negativeCount = 0;
    
    positiveWords.forEach(word => {
      const regex = new RegExp(word, 'g');
      positiveCount += (content.match(regex) || []).length;
    });
    
    negativeWords.forEach(word => {
      const regex = new RegExp(word, 'g');
      negativeCount += (content.match(regex) || []).length;
    });
    
    const total = positiveCount + negativeCount || 1;
    const positiveRatio = positiveCount / total;
    
    let sentiment = '中立';
    if (positiveRatio > 0.6) {
      sentiment = '积极';
    } else if (positiveRatio < 0.4) {
      sentiment = '消极';
    }
    
    return {
      overall: sentiment,
      positiveRatio: (positiveRatio * 100).toFixed(1),
      analysis: `内容情感倾向${sentiment}，正面表述占比${(positiveRatio * 100).toFixed(1)}%`
    };
  },

  /**
   * 估计内容类型
   */
  estimateContentType: (content) => {
    const types = [];
    
    if (content.includes('视频') || content.includes('播放')) types.push('视频');
    if (content.includes('图片') || content.includes('图')) types.push('图片');
    if (content.includes('音频') || content.includes('播客')) types.push('音频');
    if (content.includes('教程') || content.includes('指南')) types.push('教程');
    if (content.includes('新闻') || content.includes('资讯')) types.push('新闻');
    if (content.includes('评论') || content.includes('分享')) types.push('评论');
    
    return types.length > 0 ? types : ['综合内容'];
  }
};

module.exports = aiService;
