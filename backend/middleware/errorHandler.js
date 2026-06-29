/**
 * 全局错误处理中间件
 */
const errorHandler = (err, req, res, next) => {
  console.error('[错误处理] 捕获错误:', err);

  const statusCode = err.status || 500;
  const message = err.message || '服务器内部错误';

  res.status(statusCode).json({
    success: false,
    error: message,
    status: statusCode,
    timestamp: new Date().toISOString()
  });
};

module.exports = errorHandler;
