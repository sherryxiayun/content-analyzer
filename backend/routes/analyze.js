const express = require('express');
const router = express.Router();
const analysisController = require('../controllers/analysisController');

/**
 * POST /api/analyze
 * 分析内容端点
 * 
 * 请求体:
 * {
 *   "content": "网页链接或文本内容",
 *   "type": "url" | "text"
 * }
 */
router.post('/analyze', analysisController.analyzeContent);

/**
 * POST /api/analyze/batch
 * 批量分析端点
 */
router.post('/analyze/batch', analysisController.analyzeBatch);

/**
 * GET /api/health
 * 健康检查
 */
router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

module.exports = router;
