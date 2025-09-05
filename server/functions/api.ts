import serverless from 'serverless-http';
import { app as apiRoutes, connectToDatabase } from '../src/index';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import express from 'express';

const app = express();
app.use('/api', apiRoutes);


export const handler = async (event: APIGatewayProxyEvent, context: Context) => {
  await connectToDatabase(); 
  return serverless(app)(event, context);
};