interface loginRequest {
    code: string;
}

interface loginUserResponse {
    phone: string;
    email: string;
    userInfo: loginUserInfoResponse;
    lon: number;
    lat: number;
    address: string;
}

interface loginUserInfoResponse {
    id: string;
    nickname: string;
    avatarUrl: string;
}

interface loginResponse {
    type: string;
    accessToken: string;
    expireIn: number;
    user: loginUserResponse;
}

export type { loginRequest, loginResponse, loginUserResponse, loginUserInfoResponse };
