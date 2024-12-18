import axios from 'axios';

const AUTH0_DOMAIN = 'https://dev-w7n20tpugdh8sijf.us.auth0.com';
const CLIENT_ID = 'gajlUfHfYYRc8xBf1yhORYUDnBRKCfoq';
const CLIENT_SECRET =
  'o7qfXUsufCWkf56m6tu2j4YiPnXU1h2edgHda_ri7AlIgzo8p_C_i8-0Jvrt7uty';
const AUDIENCE = 'https://dev-w7n20tpugdh8sijf.us.auth0.com/api/v2/';
const GRANT_TYPE = 'client_credentials';

interface Auth0TokenResponse {
  access_token: string;
  expires_in: number;
}

const getToken = async (): Promise<string> => {
  // Check if a valid token is already stored in local storage
  const storedToken = localStorage.getItem('auth0AccessToken');
  const storedTokenExpiry = localStorage.getItem('auth0AccessTokenExpiry');

  if (
    storedToken &&
    storedTokenExpiry &&
    Date.now() < parseInt(storedTokenExpiry, 10)
  ) {
    return storedToken;
  }

  // If the stored token is expired or doesn't exist, obtain a new one
  const tokenEndpoint = `${AUTH0_DOMAIN}/oauth/token`;

  try {
    const response = await axios.post<Auth0TokenResponse>(tokenEndpoint, {
      grant_type: GRANT_TYPE,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      audience: AUDIENCE,
    });

    const accessToken = response.data.access_token;
    const expiresIn = response.data.expires_in;

    // Store the new token and its expiry in local storage
    localStorage.setItem('auth0AccessToken', accessToken);
    localStorage.setItem(
      'auth0AccessTokenExpiry',
      (Date.now() + expiresIn * 1000).toString(),
    );

    return accessToken;
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.error('Error getting access token:', error.message);
    throw error;
  }
};

export const deleteUserRole = async (userId: string, roleId: string) => {
  const token = await getToken();
  const apiUrl = `${AUTH0_DOMAIN}/api/v2/users/${userId}/roles`;

  try {
    // Make the DELETE request to remove the role
    const response = await axios.delete(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: {
        roles: [roleId],
      },
    });

    // eslint-disable-next-line no-console
    return response.status;
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.error('Error deleting role:', error);
    throw error;
  }
};

export const updateUserRole = async (userId: string, roleId: string) => {
  const token = await getToken();
  const apiUrl = `${AUTH0_DOMAIN}/api/v2/users/${userId}/roles`;

  try {
    // Make the PUT request to update the roles
    const response = await axios.post(
      apiUrl,
      {
        roles: [roleId],
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    // eslint-disable-next-line no-console
    return response.status;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error updating role:', error);
    throw error;
  }
};

export const getUserRoles = async () => {
  const token = await getToken();
  const apiUrl = `${AUTH0_DOMAIN}/api/v2/roles`;

  try {
    // Make the get request to get the roles
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    // eslint-disable-next-line no-console
    return response.data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error:', error);
    throw error;
  }
};

export const createUser = async (email: string, password: string) => {
  const token = await getToken();
  const apiUrl = `${AUTH0_DOMAIN}/api/v2/users`;
  const payload = {
    email: email,
    password: password,
    connection: 'Username-Password-Authentication',
  };
  try {
    // Make the get request to get the roles
    const response = await axios.post(apiUrl, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error:', error);
    throw error;
  }
};

export const deleteUser = async (userId: string) => {
  const token = await getToken();
  const apiUrl = `${AUTH0_DOMAIN}/api/v2/users/${userId}`;
  try {
    // Make the get request to get the roles
    const response = await axios.delete(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    // eslint-disable-next-line no-console
    return response;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error:', error);
    throw error;
  }
};

export const generateRandomPassword = () => {
  const symbols = '!@#$%^&*()-_=+[]{}|;:,.<>?';
  const numbers = '0123456789';
  const uppercaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  // Create an array with the possible characters
  const allCharacters = symbols + numbers + uppercaseLetters;

  // Function to get a random character from a string
  const getRandomChar = (string) =>
    string[Math.floor(Math.random() * string.length)];

  // Initialize the password with one random symbol, one random number, and one random uppercase letter
  let password =
    getRandomChar(symbols) +
    getRandomChar(numbers) +
    getRandomChar(uppercaseLetters);

  // Fill the remaining characters with random characters from the combined set
  for (let i = 3; i < 8; i++) {
    password += getRandomChar(allCharacters);
  }

  // Shuffle the password to randomize the order of characters
  password = password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');

  return password;
};
