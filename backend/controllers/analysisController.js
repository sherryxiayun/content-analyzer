const webService = require('../services/webService');
const aiService = require('../services/aiService');
const parsingService = require('../services/parsingService');

/**
 * 分析内容的主控制器
 */
const analysisController = {
  /**
   * 分析单个内容
   */
  analyzeContent: async (req, res, next) => {
    try {
      const { content, type = 'text' } = req.body;

      // 参数验证
      if (!content) {
        return res.status(400).json({
          success: false,
          error: '内容不能为空'
        });
      }

      if (!['url', 'text'].includes(type)) {
        return res.status(400).json({
          success: false,
          error: '类型必须是 url 或 text'
        });
      }

      console.log(`[分析] 类型: ${type}, 内容长度: ${content.length}`);

      // 第一步：获取原始内容
      let rawContent = content;
      if (type === 'url') {
        console.log(`[爬虫] 正在提取 URL: ${content}`);
        rawContent = await webService.fetchContent(content);
        console.log(`[爬虫] 成功提取内容，长度: ${rawContent.length}`);
      }

      // 第二步：解析内容（清理、分段等）
      const parsedContent = parsingService.parseContent(rawContent);

      // 第三步：AI 分析
      console.log('[AI] 正在分析内容结构...');
      const analysis = await aiService.analyzeContent(parsedContent);

      // 返回结果
      res.json({
        success: true,
        data: {
          rawContent: rawContent.substring(0, 500) + (rawContent.length > 500 ? '...' : ''),
          analysis: analysis
        }
      });

    } catch (error) {
      console.error('[错误] 分析失败:', error.message);
      next(error);
    }
  },

  /**
   * 批量分析内容
   */
  analyzeBatch: async (req, res, next) => {
    try {
      const { contents } = req.body;

      if (!Array.isArray(contents) || contents.length === 0) {
        return res.status(400).json({
          success: false,
          error: '请提供内容数组'
        });
      }

      console.log(`[批量分析] 开始分析 ${contents.length} 个内容`);

      const results = [];
      for (let i = 0; i < contents.length; i++) {
        try {
          const item = contents[i];
          console.log(`[批量分析] 处理 ${i + 1}/${contents.length}`);

          let rawContent = item.content;
          if (item.type === 'url') {
            rawContent = await webService.fetchContent(item.content);
          }

          const parsedContent = parsingService.parseContent(rawContent);
          const analysis = await aiService.analyzeContent(parsedContent);

          results.push({
            success: true,
            input: item.content,
            analysis: analysis
          });
        } catch (error) {
          results.push({
            success: false,
            input: contents[i].content,
            error: error.message
          });
        }
      }

      res.json({
        success: true,
        data: {
          total: contents.length,
          results: results
        }
      });

    } catch (error) {
      console.error('[错误] 批量分析失败:', error.message);
      next(error);
    }
  }
};

module.exports = analysisController;
