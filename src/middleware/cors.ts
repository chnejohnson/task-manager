import { Request, Response, NextFunction } from "express";

const url: any = process.env.CORS_DOMAIN;

export default function(req: Request, res: Response, next: NextFunction) {
  res.header("Access-Control-Allow-Origin", url);
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  next();
}
