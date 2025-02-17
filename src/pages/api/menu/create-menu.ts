import Cors from "cors";
import type { NextApiRequest, NextApiResponse } from "next";

// Initialize the cors middleware
const cors = Cors({
  origin: "http://localhost:5000", // Allow requests from this origin
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
});

// Helper method to wait for a middleware to execute before continuing
function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: Function
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Run the middleware
  await runMiddleware(req, res, cors);

  if (req.method === "POST") {
    // Handle the POST request
    // ...existing code for handling the request...
    res.status(200).json({ message: "Menu created successfully" });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
