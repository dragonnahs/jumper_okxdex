// 创建一个 Canvas 元素来生成图标
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

// 设置尺寸为 128x128 (最大尺寸)
canvas.width = 128;
canvas.height = 128;

// 绘制圆形背景
ctx.beginPath();
ctx.arc(64, 64, 60, 0, Math.PI * 2);
ctx.fillStyle = '#2EBD85';
ctx.fill();

// 绘制 "OKX" 文本
ctx.fillStyle = 'white';
ctx.font = 'bold 48px Arial';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('OKX', 64, 64);

// 导出不同尺寸的图标
const sizes = [16, 48, 128];
sizes.forEach(size => {
    const smallCanvas = document.createElement('canvas');
    smallCanvas.width = size;
    smallCanvas.height = size;
    const smallCtx = smallCanvas.getContext('2d');
    smallCtx.drawImage(canvas, 0, 0, size, size);
    
    // 将图标保存为 PNG 文件
    const link = document.createElement('a');
    link.download = `icon${size}.png`;
    link.href = smallCanvas.toDataURL('image/png');
    link.click();
}); 