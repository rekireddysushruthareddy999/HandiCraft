import jwt from 'jsonwebtoken';

export const createTokenPair = async (user) => {
    const accessToken = jwt.sign({ id: user._id, role: user.role, type: 'access' }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES || '15m',
    });
    const refreshToken = jwt.sign(
        { id: user._id, role: user.role, type: 'refresh' },
        process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRES || '7d' }
    );
    return { accessToken, refreshToken };
};
