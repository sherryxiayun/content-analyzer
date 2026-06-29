const axios = require('axios');
const cheerio = require('cheerio');

const REQUEST_TIMEOUT = parseInt(process.env.REQUEST_TIMEOUT || '10000');
const MAX_CONTENT_LENGTH = parseInt(process.env.MAX_CONTENT_LENGTH || '5242880');

/**
 * 网页爬虫服务
 * 提取网页内容
 */
const webService = {
  /**
   * 从 URL 提取内容
   */
  fetchContent: async (url) => {
    try {
      // URL 验证
      if (!webService.isValidUrl(url)) {
        throw new Error('无效的 URL 格式');
      }

      console.log(`[网页爬虫] 获取内容: ${url}`);

      // 添加超时和请求头
      const response = await axios.get(url, {
        timeout: REQUEST_TIMEOUT,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        maxContentLength: MAX_CONTENT_LENGTH
      });

      if (response.status !== 200) {
        throw new Error(`HTTP 错误: ${response.status}`);
      }

      // 使用 cheerio 解析 HTML
      const $ = cheerio.load(response.data);

      // 删除不需要的元素
      $('script, style, meta, link, noscript').remove();

      // 提取文本内容
      let content = $('body').text() || $('html').text() || '';

      // 清理文本
      content = webService.cleanText(content);

      if (content.length === 0) {
        throw new Error('无法从页面提取内容');
      }

      console.log(`[网页爬虫] 成功提取 ${content.length} 个字符`);

      return content;

    } catch (error) {
      if (error.code === 'ENOTFOUND') {
        throw new Error('域名无法解析，请检查 URL 是否正确');
      }
      if (error.code === 'ECONNREFUSED') {
        throw new Error('连接被拒绝，网站可能无法访问');
      }
      if (error.message.includes('timeout')) {
        throw new Error('请求超时，网站响应过慢');
      }
      throw new Error(`网页爬虫错误: ${error.message}`);
    }
  },

  /**
   * 验证 URL 格式
   */
  isValidUrl: (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * 清理文本
   */
  cleanText: (text) => {
    return text
      .replace(/\s+/g, ' ')        // 多个空格合并为一个
      .replace(/[\r\n]+/g, '\n')   // 多个换行合并为一个
      .trim();
  }
};

module.exports = webService;
