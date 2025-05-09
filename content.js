/*
 * @Author: shanlonglong danlonglong@weimiao.cn
 * @Date: 2025-03-11 11:31:27
 * @LastEditors: shanlonglong danlonglong@weimiao.cn
 * @LastEditTime: 2025-05-09 10:29:46
 * @FilePath: \jumper_okxdex\content.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

async function getTokenInfo(tokenAddress) {
  try {
    const response = await fetch(`http://47.94.226.174:8081/api/token?address=${tokenAddress}`);
    const data = await response.json();
    console.log('response222', data);
    
    if (data.success) {
      return data.data;
    }
    console.error('Token info error:', data.error);
    return null;
  } catch (error) {
    console.error('Error fetching token info:', error);
    return null;
  }
}

async function addOKXButton() {
  // 从URL中获取token地址
  let tokenAddress = window.location.pathname.split('/').pop();
  // 如果tokenaddress 有_ 则去掉_
  if (tokenAddress.includes('_')) {
    tokenAddress = tokenAddress.split('_')[1];
  }
  console.log('Token address:', tokenAddress);
  if (!tokenAddress) return;

  // // 获取token信息
  // const tokenInfo = await getTokenInfo(tokenAddress);
  // if (!tokenInfo) {
  //   console.log('Token info not found');
  //   return;
  // }

  // Create button container
  const buttonContainer = document.createElement('div');
  buttonContainer.style.cssText = `
    margin: 10px 0;
    display: inline-block;
  `;

  // Create button with dynamic OKX URL using chainId from API
  const okxButton = document.createElement('a');
  okxButton.href = `https://web3.okx.com/zh-hans/token/solana/${tokenAddress}`;
  okxButton.target = '_blank';
  okxButton.style.cssText = `
    display: inline-flex;
    align-items: center;
    padding: 8px 16px;
    background-color: #2EBD85;
    color: white;
    border-radius: 4px;
    text-decoration: none;
    font-weight: bold;
    cursor: pointer;
  `;

  // Add OKX logo
  // const logo = document.createElement('img');
  // logo.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTEyIDJDNi40NzcgMiAyIDYuNDc3IDIgMTJzNC40NzcgMTAgMTAgMTAgMTAtNC40NzcgMTAtMTBTMTcuNTIzIDIgMTIgMnptNC45MTcgMTQuMjE3YTEgMSAwIDAxLTEuNDE3IDBsLTMuNS0zLjUtMy41IDMuNWExIDEgMCAwMS0xLjQxNy0xLjQxN2wzLjUtMy41LTMuNS0zLjVhMSAxIDAgMDExLjQxNy0xLjQxN2wzLjUgMy41IDMuNS0zLjVhMSAxIDAgMTExLjQxNyAxLjQxN2wtMy41IDMuNSAzLjUgMy41YTEgMSAwIDAxMCAxLjQxN3oiLz48L3N2Zz4=';
  // logo.style.cssText = `
  //   width: 20px;
  //   height: 20px;
  //   margin-right: 8px;
  // `;

  // okxButton.appendChild(logo);
  okxButton.appendChild(document.createTextNode('View on OKX'));
  buttonContainer.appendChild(okxButton);

  // Find a suitable location to insert the button
  const links = document.querySelectorAll('.css-ekmcyu a');
  links.forEach(link => {
    // 2. 找到其中包含 span 且内容是“关于GMGN”的 a 标签
    const span = link.querySelector('span');
    if (span && span.textContent.trim() === '关于GMGN') {
      // 4. 替换整个 a 元素
      link.replaceWith(okxButton);
    }
  });
}

// Run when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded');
  addOKXButton();
});

// Also run after a short delay to ensure dynamic content is loaded
setTimeout(addOKXButton, 1000); 