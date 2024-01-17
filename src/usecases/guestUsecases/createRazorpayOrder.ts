import { Response } from 'express';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: 'rzp_test_0c2a2ihcOITdYH',
  key_secret: '61lJ6kU7mYYrkNECZ9s3P9p1',
});


export const createRazorpayOrder = async (amount: number, res: Response) => {
  const options = {
    amount: amount * 100,
    currency: 'INR',
  };

  try {
    const order = await razorpay.orders.create(options); 
    return order;
    
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ message: 'Failed to create Razorpay order' });
    throw error;
  }
};

