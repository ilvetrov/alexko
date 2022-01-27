const http = require('http');
const { getUserLanguage } = require('./user-language');

let demoSignHtmls = {};

function getDemoSign(req) {
  const uniqueData = {
    lang: getUserLanguage(req).code_name,
    shown: req.cookies.demo_pop_up_shown ? 'true' : ''
  };
  const uniqueDataKey = JSON.stringify(uniqueData);

  if (demoSignHtmls.hasOwnProperty(uniqueDataKey)) return demoSignHtmls[uniqueDataKey];

  updateDemoSign(uniqueData);
  return '';
}

function updateDemoSign(uniqueData) {
  const uniqueDataKey = JSON.stringify(uniqueData);
  fetchDemoSign(uniqueData).then(html => {
    if (demoSignHtmls.hasOwnProperty(uniqueDataKey)) return;
    demoSignHtmls[uniqueDataKey] = html;
  }).catch(console.error);
}

function fetchDemoSign(uniqueData) {
  return new Promise((resolve, reject) => {
    const data = prepareDataForFormUrlEncoded({
      link: 'https://alexko.ltd',
      ...uniqueData
    });
  
    const demoSignReq = http.request({
      hostname: 'demo-ilve.local',
      port: 80,
      path: '/pop-up',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': data.length
      }
    }, resp => {
      let data = '';
  
      resp.on('data', chunk => {
        data += chunk;
      });
  
      resp.on('end', () => {
        resolve(data);
      });
  
    });

    demoSignReq.on('error', err => {
      reject(err)
    });

    demoSignReq.write(data);

    demoSignReq.end();
  });
}

let demoSignHtmlHead = '';
let demoSignHtmlFooter = '';

function getDemoSignHead() {
  return demoSignHtmlHead;
}

function getDemoSignFooter() {
  return demoSignHtmlFooter;
}

fetchDemoSignHelper('/head').then(html => demoSignHtmlHead = html)
.catch(console.error);

fetchDemoSignHelper('/footer').then(html => demoSignHtmlFooter = html)
.catch(console.error);

function fetchDemoSignHelper(path) {
  return new Promise((resolve, reject) => {
    const demoSignReq = http.request({
      hostname: 'demo-ilve.local',
      port: 80,
      path: path,
      method: 'POST'
    }, resp => {
      let data = '';
  
      resp.on('data', chunk => {
        data += chunk;
      });
  
      resp.on('end', () => {
        resolve(data);
      });
  
    });

    demoSignReq.on('error', err => {
      reject(err)
    });

    demoSignReq.end();
  });
}

function prepareDataForFormUrlEncoded(data) {
  const formBody = [];
  for (let property in data) {
    let encodedKey = encodeURIComponent(property);
    let encodedValue = encodeURIComponent(data[property]);
    formBody.push(encodedKey + '=' + encodedValue);
  }
  return formBody.join('&');
}

module.exports = {
  getDemoSign,
  getDemoSignHead,
  getDemoSignFooter,
}