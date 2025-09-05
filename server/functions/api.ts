import serverless from 'serverless-http';
import { app, connectToDatabase } from '../src/index';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';


export const handler = async (event: APIGatewayProxyEvent, context: Context) => {
  await connectToDatabase(); 
  return serverless(app)(event, context);
};