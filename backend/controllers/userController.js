import User from '../models/User.js';

// PROFILE
export const getMe = async (req, res) => {
    const user = await User.findById(req.user.id)
        .populate('wishlist');

    res.json({ success: true, data: { user } });
};

export const updateProfile = async (req, res) => {
    const user = await User.findById(req.user.id);

    user.name = req.body.name || user.name;
    user.avatar = req.body.avatar || user.avatar;

    await user.save();

    res.json({ success: true, data: { user } });
};

// ADDRESS
export const addAddress = async (req, res) => {
    const user = await User.findById(req.user.id);

    user.addresses.push(req.body);
    await user.save();

    res.json({ success: true, data: { addresses: user.addresses } });
};

export const deleteAddress = async (req, res) => {
    const user = await User.findById(req.user.id);

    user.addresses = user.addresses.filter(
        (a) => a._id.toString() !== req.params.id
    );

    await user.save();

    res.json({ success: true });
};

// WISHLIST
export const toggleWishlist = async (req, res) => {
    const user = await User.findById(req.user.id);
    const productId = req.params.productId;

    const exists = user.wishlist.includes(productId);

    if (exists) {
        user.wishlist = user.wishlist.filter(
            (id) => id.toString() !== productId
        );
    } else {
        user.wishlist.push(productId);
    }

    await user.save();

    res.json({ success: true, data: { wishlist: user.wishlist } });
};