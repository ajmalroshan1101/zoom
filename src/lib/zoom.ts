import axios from 'axios';

const ZOOM_AUTH_URL = 'https://zoom.us/oauth/authorize';
const ZOOM_TOKEN_URL = 'https://zoom.us/oauth/token';
const ZOOM_API_URL = 'https://api.zoom.us/v2';

export const getZoomAuthUrl = () => {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.ZOOM_CLIENT_ID!,
    redirect_uri: process.env.ZOOM_REDIRECT_URI!,
  });

  return `${ZOOM_AUTH_URL}?${params.toString()}`;
};

export const getZoomTokens = async (code: string) => {
  const credentials = Buffer.from(
    `${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`
  ).toString('base64');

  const response = await axios.post(
    ZOOM_TOKEN_URL,
    new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: process.env.ZOOM_REDIRECT_URI!,
    }),
    {
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  return response.data;
};

export const refreshZoomTokens = async (refreshToken: string) => {
  const credentials = Buffer.from(
    `${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`
  ).toString('base64');

  const response = await axios.post(
    ZOOM_TOKEN_URL,
    new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
    {
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  return response.data;
};

export const getZoomUser = async (accessToken: string) => {
  const response = await axios.get(`${ZOOM_API_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data;
};

export const getZoomMeetings = async (accessToken: string) => {
  const response = await axios.get(`${ZOOM_API_URL}/users/me/meetings`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data;
};