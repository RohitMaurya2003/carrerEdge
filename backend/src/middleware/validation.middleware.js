import Joi from "joi";

// Validation middleware factory
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => detail.message);
      console.log("Validation failed:", errors);
      console.log("Request body:", req.body);
      return res.status(400).json({ 
        message: errors.join(", "),
        error: "Validation failed", 
        details: errors 
      });
    }
    next();
  };
};

// Auth validation schemas
export const signupSchema = Joi.object({
  fullName: Joi.string().min(2).max(100).required().trim(),
  email: Joi.string().email().required().lowercase().trim(),
  password: Joi.string().min(6).max(100).required(),
  role: Joi.string().valid("mentor", "mentee").required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().lowercase().trim(),
  password: Joi.string().required(),
});

export const updateProfileSchema = Joi.object({
  fullName: Joi.string().min(2).max(100).trim(),
  profilePic: Joi.string().uri(),
}).min(1); // At least one field required

// Payment validation schemas
export const createOrderSchema = Joi.object({
  amount: Joi.number().integer().min(1).max(1000000).required(),
});

export const verifyPaymentSchema = Joi.object({
  razorpay_payment_id: Joi.string().required(),
  razorpay_order_id: Joi.string().required(),
  razorpay_signature: Joi.string().required(),
});

// Message validation schemas
export const sendMessageSchema = Joi.object({
  text: Joi.string().max(5000).allow(""),
  image: Joi.string().uri().allow(""),
}).or("text", "image"); // At least one of text or image required

// Gemini validation schemas
export const generateContentSchema = Joi.object({
  text: Joi.string().min(1).max(10000).required(),
  model: Joi.string().valid("gemini-2.5-flash", "gemini-pro").optional(),
  role: Joi.string().max(200).optional(),
  maxOutputTokens: Joi.number().integer().min(8).max(2000).optional(),
});

export const resumeReviewSchema = Joi.object({
  text: Joi.string().min(10).max(50000).required(),
  model: Joi.string().valid("gemini-2.5-flash", "gemini-pro").optional(),
  role: Joi.string().max(200).optional(),
});

// Perplexity validation schemas
export const summarizeTopicSchema = Joi.object({
  topic: Joi.string().min(1).max(500).required().trim(),
});

// Export validation middleware
export const validateSignup = validate(signupSchema);
export const validateLogin = validate(loginSchema);
export const validateUpdateProfile = validate(updateProfileSchema);
export const validateCreateOrder = validate(createOrderSchema);
export const validateVerifyPayment = validate(verifyPaymentSchema);
export const validateSendMessage = validate(sendMessageSchema);
export const validateGenerateContent = validate(generateContentSchema);
export const validateResumeReview = validate(resumeReviewSchema);
export const validateSummarizeTopic = validate(summarizeTopicSchema);
