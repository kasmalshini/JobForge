const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { ROLES, ALL_SKILLS } = require('../data/skillsList');
const { sendPasswordResetEmail } = require('../services/emailService');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword } = req.body;

    // Validate all required fields
    if (!fullName || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    // Validate password match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      fullName,
      email,
      password,
      // role is left as null, will be set during role setup
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role, // Will be null for new users
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    let message = 'Registration failed. Please try again.';
    if (error.code === 11000) {
      message = 'An account with this email already exists.';
    } else if (error.message) {
      message = error.message;
    }
    res.status(500).json({ message });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      // Handle backward compatibility - use fullName or name
      const displayName = user.fullName || user.name || 'User';
      res.json({
        _id: user._id,
        fullName: displayName,
        name: displayName, // Keep 'name' for backward compatibility
        email: user.email,
        role: user.role || 'Other',
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    const message = error.message || 'Login failed. Please try again.';
    res.status(500).json({ message });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    // Handle backward compatibility - use fullName or name
    const displayName = user.fullName || user.name || 'User';
    res.json({
      _id: user._id,
      fullName: displayName,
      name: displayName, // Keep 'name' for backward compatibility
      email: user.email,
      role: user.role || 'Other',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user role and skills
// @route   PUT /api/auth/role-skills
// @access  Private
const updateRoleAndSkills = async (req, res) => {
  try {
    const { role, skills } = req.body;

    // Validate that role is provided
    if (!role) {
      return res.status(400).json({ message: 'Role is required' });
    }

    // Validate role is in approved list
    if (!ROLES.includes(role)) {
      return res.status(400).json({ message: 'Invalid role selected' });
    }

    // Validate skills is an array
    if (!Array.isArray(skills)) {
      return res.status(400).json({ message: 'Skills must be an array' });
    }

    // Validate each skill is in approved list
    for (const skill of skills) {
      if (!ALL_SKILLS.includes(skill)) {
        return res.status(400).json({ message: `Invalid skill: ${skill}` });
      }
    }

    // Update user with role and skills
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        role,
        skills,
        skillsUpdatedAt: new Date(),
      },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Handle backward compatibility - use fullName or name
    const displayName = user.fullName || user.name || 'User';
    res.json({
      _id: user._id,
      fullName: displayName,
      name: displayName, // Keep 'name' for backward compatibility
      email: user.email,
      role: user.role,
      skills: user.skills,
      skillsUpdatedAt: user.skillsUpdatedAt,
    });
  } catch (error) {
    console.error('Update role and skills error:', error);
    const message = error.message || 'Failed to update role and skills';
    res.status(500).json({ message });
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Please provide an email' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal if user exists for security
      return res.json({ 
        success: true, 
        message: 'If that email exists, a password reset link has been sent.' 
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    const resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await User.findByIdAndUpdate(user._id, {
      resetPasswordToken,
      resetPasswordExpire,
    }, { runValidators: false });

    // Send email with reset link
    const resetLink = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;

    try {
      await sendPasswordResetEmail(user.email, resetToken, resetLink);

      res.json({
        success: true,
        message: 'Password reset link has been sent to your email. Check your inbox and spam folder.',
      });
    } catch (emailError) {
      console.error('Email service error:', emailError);
      // If email fails, still don't expose the token
      res.json({
        success: true,
        message: 'If that email exists, a password reset link has been sent.',
      });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    const message = (error && error.message) ? error.message : 'Error processing request. Please try again.';
    res.status(500).json({ message });
  }
};

// @desc    Reset password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword } = req.body;
    const resetToken = req.params.resettoken;

    if (!password || !confirmPassword) {
      return res.status(400).json({ message: 'Please provide password and confirm password' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Hash the token to compare with stored token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successful',
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Error resetting password' });
  }
};

// @desc    Delete user account
// @route   DELETE /api/auth/account
// @access  Private
const deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;

    // Validate password is provided
    if (!password) {
      return res.status(400).json({ message: 'Password is required to delete account' });
    }

    // Get user with password field
    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify password
    const isPasswordValid = await user.matchPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Delete user from database
    await User.findByIdAndDelete(req.user._id);

    res.json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ message: 'Failed to delete account' });
  }
};

module.exports = { register, login, getMe, updateRoleAndSkills, deleteAccount, forgotPassword, resetPassword };




 