/**
 * Business: OAuth авторизация через Google и Яндекс
 * Args: event с httpMethod, queryStringParameters; context с requestId
 * Returns: HTTP response с redirect или JWT token
 */

exports.handler = async (event, context) => {
  const { httpMethod, queryStringParameters } = event;

  if (httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token',
        'Access-Control-Max-Age': '86400',
      },
      body: '',
      isBase64Encoded: false,
    };
  }

  const provider = queryStringParameters?.provider;
  const code = queryStringParameters?.code;

  if (httpMethod === 'GET' && provider && !code) {
    if (provider === 'google') {
      const clientId = process.env.GOOGLE_CLIENT_ID;
      const redirectUri = `${process.env.APP_URL || 'https://your-app.com'}/api/auth/callback`;
      const scope = 'openid email profile';
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&response_type=code&scope=${encodeURIComponent(scope)}&state=google`;

      return {
        statusCode: 302,
        headers: {
          Location: authUrl,
          'Access-Control-Allow-Origin': '*',
        },
        body: '',
        isBase64Encoded: false,
      };
    }

    if (provider === 'yandex') {
      const clientId = process.env.YANDEX_CLIENT_ID;
      const redirectUri = `${process.env.APP_URL || 'https://your-app.com'}/api/auth/callback`;
      const authUrl = `https://oauth.yandex.ru/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&state=yandex`;

      return {
        statusCode: 302,
        headers: {
          Location: authUrl,
          'Access-Control-Allow-Origin': '*',
        },
        body: '',
        isBase64Encoded: false,
      };
    }
  }

  if (httpMethod === 'GET' && code) {
    const state = queryStringParameters?.state;

    try {
      let userInfo;

      if (state === 'google') {
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            code,
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: `${process.env.APP_URL || 'https://your-app.com'}/api/auth/callback`,
            grant_type: 'authorization_code',
          }).toString(),
        });

        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;

        const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        userInfo = await userResponse.json();
      } else if (state === 'yandex') {
        const tokenResponse = await fetch('https://oauth.yandex.ru/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            code,
            client_id: process.env.YANDEX_CLIENT_ID,
            client_secret: process.env.YANDEX_CLIENT_SECRET,
            grant_type: 'authorization_code',
          }).toString(),
        });

        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;

        const userResponse = await fetch('https://login.yandex.ru/info', {
          headers: { Authorization: `OAuth ${accessToken}` },
        });

        userInfo = await userResponse.json();
      }

      const redirectUrl = `${process.env.APP_URL || 'https://your-app.com'}?auth=success&user=${encodeURIComponent(
        JSON.stringify(userInfo)
      )}`;

      return {
        statusCode: 302,
        headers: {
          Location: redirectUrl,
          'Access-Control-Allow-Origin': '*',
        },
        body: '',
        isBase64Encoded: false,
      };
    } catch (error) {
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Ошибка авторизации', details: error.message }),
        isBase64Encoded: false,
      };
    }
  }

  return {
    statusCode: 400,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({ error: 'Неверные параметры' }),
    isBase64Encoded: false,
  };
};
