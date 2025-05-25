const { z } = require('zod');

exports.registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6)
});

exports.productSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  priceInPoints: z.number().positive(),
  category: z.string().optional(),
  countInStock: z.number().int().nonnegative(),
  rating: z.number().optional(),
  numReviews: z.number().optional(),
  tags: z.array(z.string()).optional(),
  image: z.string().optional()
});


exports.reservationSchema = z.object({
  productId: z.string(),
  date: z.string().min(1) // ISO format expected
});