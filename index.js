const Request = require('axios')
const querystring = require('querystring')
const crypto = require('crypto')

const url = 'https://openapi.alipay.com/gateway.do'

const alipay_config = {
  privateKey:
    '-----BEGIN RSA PRIVATE KEY-----\n这里是私钥内容\n-----END RSA PRIVATE KEY-----\n',
  publicKey:
    ''
}

export default class {
  getFormData ({ biz_content, method, app_auth_token }) {
    const data = {
      app_id: alipay_config.app_id,
      method: method,
      format: 'JSON',
      charset: 'utf-8',
      sign_type: 'RSA2',
      timestamp: new Date().getTime(),
      version: '1.0',
      biz_content: JSON.stringify(biz_content)
    }

    if (app_auth_token) {
      data.app_auth_token = app_auth_token
    }

    return data
  }

  getSignature (data) {
    const sorted = {}

    Object.keys(data)
      .sort()
      .forEach(key => {
        if (data[key] != '' && data[key] != null) sorted[key] = data[key]
      })

    let title = querystring.stringify(sorted)
    title = decodeURIComponent(title)

    const signer = crypto.createSign('RSA-SHA256')
    const result = signer
      .update(new Buffer(title, 'utf-8'))
      .sign(alipay_config.privateKey, 'base64')

    return result
  }

  generateURIByForm (data) {
    var sorted = data

    sorted.sign = this.getSignature(data)

    return url + '?' + querystring.stringify(sorted)
  }

  generalGetRequest (data) {
    var sorted = data

    sorted.sign = this.getSignature(data)

    return Request.get(url + '?' + querystring.stringify(sorted))
  }
}

const form = 实例化类.getFormData({
  biz_content: {
    grant_type: 'authorization_code',
    code: this.get('app_auth_code')
  },
  method: 'alipay.open.auth.token.app'
})

const result = await 实例化类.generalGetRequest(form)